import { Resend } from "resend";
import { AGREEMENT_VERSION } from "@/lib/agreement";

/**
 * Email delivery for transactional PBJ messages.
 *
 * Sender policy (see /sessions/.auto-memory/project_pbj_email_sender.md):
 *   For launch we send everything from `protocolsbyjames@gmail.com`. That
 *   address is Gmail-verified in the Resend dashboard so we can skip the
 *   full DNS/DKIM setup until James upgrades to a custom domain.
 *
 * If you flip to a pro domain later, change `FROM_EMAIL` below and add
 * MX/SPF/DKIM records at the registrar, verify in Resend, and redeploy.
 */

const JAMES_EMAIL = "protocolsbyjames@gmail.com";
const FROM_EMAIL = "Protocols by James <protocolsbyjames@gmail.com>";

function resend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

export type SignedAgreementEmailParams = {
  clientName: string;
  clientEmail: string;
  /** Raw PDF bytes of the signed agreement. */
  pdf: Uint8Array;
  /** Filename to use for the attachment. */
  filename: string;
  /** ISO timestamp of signing, for email body. */
  signedAt: string;
};

/**
 * Emails a copy of the signed consulting agreement to BOTH James and the
 * signer. Keeps the same attachment on both emails so James has proof of
 * what the client received.
 *
 * Per James: every signed agreement (coaching onboarding AND peptalk)
 * should hit his inbox. This is that delivery.
 */
export async function sendSignedAgreementEmail(
  params: SignedAgreementEmailParams,
): Promise<void> {
  const client = resend();
  const attachment = {
    filename: params.filename,
    // Resend accepts Buffer/Uint8Array for `content`.
    content: Buffer.from(params.pdf),
  };

  // ---- Email to the signer (confirmation + their copy) ----
  await client.emails.send({
    from: FROM_EMAIL,
    to: params.clientEmail,
    subject: "Your signed Protocols by James coaching agreement",
    replyTo: JAMES_EMAIL,
    html: clientHtml(params),
    attachments: [attachment],
  });

  // ---- Email to James (notification + file-keeping copy) ----
  await client.emails.send({
    from: FROM_EMAIL,
    to: JAMES_EMAIL,
    subject: `Signed agreement: ${params.clientName}`,
    replyTo: params.clientEmail,
    html: coachHtml(params),
    attachments: [attachment],
  });
}

function clientHtml(p: SignedAgreementEmailParams): string {
  return `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; color: #111; max-width: 560px;">
      <p>Hey ${escapeHtml(firstName(p.clientName))},</p>
      <p>Thanks for signing the Consulting &amp; Coaching Agreement — your signed copy is attached to this email for your records.</p>
      <p>Next up: you'll finish the intake questionnaire inside the app, then I'll build out your custom plan and reach out directly to kick things off.</p>
      <p>Any questions, just reply to this email.</p>
      <p>— James</p>
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
      <p style="font-size: 12px; color: #666;">
        Signed on ${escapeHtml(p.signedAt)} · Agreement version ${AGREEMENT_VERSION}
      </p>
    </div>
  `;
}

function coachHtml(p: SignedAgreementEmailParams): string {
  return `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; color: #111; max-width: 560px;">
      <p><strong>${escapeHtml(p.clientName)}</strong> just signed the coaching agreement.</p>
      <ul>
        <li><strong>Email:</strong> ${escapeHtml(p.clientEmail)}</li>
        <li><strong>Signed at:</strong> ${escapeHtml(p.signedAt)}</li>
        <li><strong>Version:</strong> ${AGREEMENT_VERSION}</li>
      </ul>
      <p>Signed copy attached. Intake questionnaire comes next — you'll see it in the coach portal when they submit.</p>
    </div>
  `;
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || "there";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
