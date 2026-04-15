import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import {
  AGREEMENT_TITLE,
  AGREEMENT_PREAMBLE,
  AGREEMENT_SECTIONS,
  AGREEMENT_VERSION,
} from "@/lib/agreement";

/**
 * Generates a signed-PDF Buffer of the consulting agreement.
 *
 * Design notes:
 *   - pdf-lib over puppeteer/react-pdf: no headless Chromium on Vercel, no
 *     extra runtime, and we don't need rich styling for a legal doc.
 *   - Text is wrapped by hand because pdf-lib doesn't ship a layout engine.
 *     We track (x, y, pageWidth, pageHeight, lineHeight) and spill to a new
 *     page when y drops below the bottom margin.
 *   - Fonts stay in Helvetica + Helvetica-Bold so we don't have to embed
 *     custom font files (those would balloon the bundle and make the edge
 *     runtime cranky).
 *   - Signature block mirrors the DOCX: typed name, date, and James's
 *     countersignature pre-filled since he's the Consultant on every copy.
 */

export type SignAgreementMeta = {
  /** Full legal name the client typed into the signing form. */
  clientPrintedName: string;
  /** Exact value of the signature input — usually same as printed name. */
  typedSignature: string;
  /** ISO timestamp when the row was written. */
  signedAt: string;
  /** IP we captured for audit. Optional in test mode. */
  ipAddress?: string | null;
  /** User agent for audit. Optional. */
  userAgent?: string | null;
  /** Supabase user id if available — we stamp it on the PDF footer. */
  userId?: string | null;
  /** Agreement version used to render. */
  version?: string;
};

const PAGE_WIDTH = 612; // US Letter points (8.5" * 72)
const PAGE_HEIGHT = 792;
const MARGIN_X = 54; // ~0.75"
const MARGIN_TOP = 56;
const MARGIN_BOTTOM = 64;
const BODY_SIZE = 10;
const BODY_LEADING = 13.5;
const HEADING_SIZE = 11;
const TITLE_SIZE = 14;

export async function renderSignedAgreementPdf(
  meta: SignAgreementMeta,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const maxLineWidth = PAGE_WIDTH - MARGIN_X * 2;

  // Running cursor state — mutated as we draw.
  const cursor = {
    page: pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]),
    y: PAGE_HEIGHT - MARGIN_TOP,
  };

  const newPageIfNeeded = (spaceNeeded: number) => {
    if (cursor.y - spaceNeeded < MARGIN_BOTTOM) {
      cursor.page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      cursor.y = PAGE_HEIGHT - MARGIN_TOP;
    }
  };

  const drawWrapped = (
    text: string,
    opts: { size: number; font: PDFFont; leading: number; after?: number },
  ) => {
    const words = text.split(/\s+/);
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      const width = opts.font.widthOfTextAtSize(candidate, opts.size);
      if (width > maxLineWidth && line) {
        newPageIfNeeded(opts.leading);
        cursor.page.drawText(line, {
          x: MARGIN_X,
          y: cursor.y,
          size: opts.size,
          font: opts.font,
          color: rgb(0, 0, 0),
        });
        cursor.y -= opts.leading;
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) {
      newPageIfNeeded(opts.leading);
      cursor.page.drawText(line, {
        x: MARGIN_X,
        y: cursor.y,
        size: opts.size,
        font: opts.font,
        color: rgb(0, 0, 0),
      });
      cursor.y -= opts.leading;
    }
    if (opts.after) cursor.y -= opts.after;
  };

  // ---------- Title + version ----------
  drawWrapped(AGREEMENT_TITLE, {
    size: TITLE_SIZE,
    font: bold,
    leading: 18,
    after: 6,
  });
  drawWrapped(`Version: ${meta.version ?? AGREEMENT_VERSION}`, {
    size: 9,
    font,
    leading: 12,
    after: 10,
  });

  // ---------- Preamble ----------
  for (const p of AGREEMENT_PREAMBLE) {
    drawWrapped(p, { size: BODY_SIZE, font, leading: BODY_LEADING, after: 6 });
  }

  // ---------- Sections ----------
  for (const section of AGREEMENT_SECTIONS) {
    // Guarantee a heading doesn't orphan at the bottom of a page.
    newPageIfNeeded(BODY_LEADING * 3);
    cursor.y -= 4;
    drawWrapped(section.heading, {
      size: HEADING_SIZE,
      font: bold,
      leading: 14,
      after: 3,
    });
    for (const paragraph of section.body) {
      drawWrapped(paragraph, {
        size: BODY_SIZE,
        font,
        leading: BODY_LEADING,
        after: 5,
      });
    }
  }

  // ---------- Signature block ----------
  newPageIfNeeded(140);
  cursor.y -= 8;
  drawWrapped("CLIENT SIGNATURE", {
    size: HEADING_SIZE,
    font: bold,
    leading: 14,
    after: 6,
  });
  drawWrapped(`Signed by (typed): ${meta.typedSignature}`, {
    size: BODY_SIZE,
    font,
    leading: BODY_LEADING,
  });
  drawWrapped(`Printed name: ${meta.clientPrintedName}`, {
    size: BODY_SIZE,
    font,
    leading: BODY_LEADING,
  });
  drawWrapped(`Date: ${meta.signedAt}`, {
    size: BODY_SIZE,
    font,
    leading: BODY_LEADING,
    after: 10,
  });

  drawWrapped("CONSULTANT", {
    size: HEADING_SIZE,
    font: bold,
    leading: 14,
    after: 6,
  });
  drawWrapped("PACIFIC VENTURES LLC", {
    size: BODY_SIZE,
    font: bold,
    leading: BODY_LEADING,
  });
  drawWrapped("By: James E. Quilter III, Managing Member", {
    size: BODY_SIZE,
    font,
    leading: BODY_LEADING,
  });
  drawWrapped(`Date: ${meta.signedAt}`, {
    size: BODY_SIZE,
    font,
    leading: BODY_LEADING,
    after: 10,
  });

  // ---------- Audit footer (small print) ----------
  drawWrapped("— Electronic execution record —", {
    size: 8,
    font: bold,
    leading: 10,
    after: 2,
  });
  const auditLines = [
    `Signed at (server time): ${meta.signedAt}`,
    meta.ipAddress ? `IP address: ${meta.ipAddress}` : null,
    meta.userAgent ? `User agent: ${meta.userAgent}` : null,
    meta.userId ? `Account id: ${meta.userId}` : null,
    `Document version: ${meta.version ?? AGREEMENT_VERSION}`,
  ].filter((l): l is string => !!l);
  for (const line of auditLines) {
    drawWrapped(line, { size: 8, font, leading: 10 });
  }

  return pdf.save();
}

/** Suggested download filename for the signed copy. */
export function signedAgreementFilename(meta: SignAgreementMeta): string {
  const slug = meta.clientPrintedName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const date = meta.signedAt.slice(0, 10);
  return `consulting-agreement-${slug}-${date}.pdf`;
}
