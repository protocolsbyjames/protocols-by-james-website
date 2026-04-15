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

/**
 * Gmail aggressively filters messages where `from` and `to` are the same
 * address — the message routes silently to Sent/hidden instead of Inbox.
 * Plus-addressing (`+bookings`) *sometimes* bypasses this but Gmail strips
 * the suffix before the self-send check, so delivery is flaky.
 *
 * The reliable fix is to send notifications to a completely different
 * address. Set COACH_NOTIFY_EMAIL in env (e.g. a personal gmail, or any
 * inbox James actually checks) and that takes precedence. Falls back to
 * the plus-addressed gmail for dev.
 */
const JAMES_NOTIFY_EMAIL =
  process.env.COACH_NOTIFY_EMAIL || "protocolsbyjames+bookings@gmail.com";

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
    to: JAMES_NOTIFY_EMAIL,
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

/**
 * Reminder emails for upcoming peptalks.
 *
 * Two cadences: a 24-hour "tomorrow" nudge and a 1-hour "starting soon"
 * heads-up. Both go to the booker only (James has his own Google
 * Calendar notifications — we don't want to double-ping him). The cron
 * route at /api/cron/peptalk-reminders drives this; it calls into here
 * once per booking and persists the sent timestamps so we never re-send
 * the same reminder twice.
 */
export type PeptalkReminderKind = "24h" | "1h";

export type PeptalkReminderEmailParams = {
  clientName: string;
  clientEmail: string;
  /** Human-readable day label — e.g. "Wednesday, April 16". */
  whenDay: string;
  /** Human-readable time label — e.g. "10:20 AM PDT". */
  whenTime: string;
  meetLink: string | null;
  kind: PeptalkReminderKind;
};

export async function sendPeptalkReminderEmail(
  params: PeptalkReminderEmailParams,
): Promise<void> {
  const client = resend();
  const subject =
    params.kind === "24h"
      ? `Your Pep-Talk with James is tomorrow — ${params.whenTime}`
      : `Your Pep-Talk with James starts in 1 hour`;

  await client.emails.send({
    from: FROM_EMAIL,
    to: params.clientEmail,
    subject,
    replyTo: JAMES_EMAIL,
    html: reminderHtml(params),
  });
}

function reminderHtml(p: PeptalkReminderEmailParams): string {
  const hey = escapeHtml(firstName(p.clientName));
  const day = escapeHtml(p.whenDay);
  const time = escapeHtml(p.whenTime);
  const intro =
    p.kind === "24h"
      ? `Quick heads up — our Pep-Talk is <strong>tomorrow, ${day} at ${time}</strong>.`
      : `Quick ping — our Pep-Talk kicks off in about an hour (<strong>${time}</strong>).`;

  const meetBlock = p.meetLink
    ? `
      <p>
        <a href="${escapeHtml(p.meetLink)}"
           style="display: inline-block; background: #f59e0b; color: #000;
                  padding: 12px 24px; border-radius: 999px; text-decoration: none;
                  font-weight: 600;">
          Join Google Meet →
        </a>
      </p>
      <p style="font-size: 12px; color: #666; word-break: break-all;">
        Or copy this link: ${escapeHtml(p.meetLink)}
      </p>
    `
    : `<p style="color: #666;">The Meet link is in the calendar invite I sent after you booked.</p>`;

  return `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; color: #111; max-width: 560px;">
      <p>Hey ${hey},</p>
      <p>${intro}</p>
      <p>Bring whatever you're stuck on — the more concrete, the better the call.</p>
      ${meetBlock}
      <p>See you soon.</p>
      <p>— James</p>
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
      <p style="font-size: 12px; color: #666;">
        Can't make it? Just reply to this email and we'll reschedule.
      </p>
    </div>
  `;
}

/**
 * Notifies James whenever a new peptalk is booked. The signed-agreement
 * email already hits his inbox as a paper trail, but this is a shorter
 * heads-up with topic + booker context so he can scan it quickly.
 */
export type PeptalkBookedNotificationParams = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  topic: string;
  /** UTC start of the booking — we re-format in both tz's below. */
  startUtc: Date;
  /** IANA tz the client booked from (e.g., "America/Chicago"). */
  clientTimeZone: string;
  meetLink: string | null;
};

export async function sendPeptalkBookedNotification(
  p: PeptalkBookedNotificationParams,
): Promise<void> {
  const client = resend();

  // Build two parallel displays: client's local time (so James knows what
  // they saw when they booked) and James's local time (so he doesn't have
  // to do mental tz math). James's tz is configurable via COACH_TIMEZONE
  // but defaults to America/Chicago since James is based in Dallas.
  const coachTz = process.env.COACH_TIMEZONE || "America/Chicago";
  const clientWhen = formatWhen(p.startUtc, p.clientTimeZone);
  const coachWhen = formatWhen(p.startUtc, coachTz);
  const sameTz = p.clientTimeZone === coachTz;

  const subject = `New Pep-Talk booked: ${p.clientName} — ${coachWhen.day} ${coachWhen.time}`;

  await client.emails.send({
    from: FROM_EMAIL,
    to: JAMES_NOTIFY_EMAIL,
    subject,
    replyTo: p.clientEmail,
    html: `
      <div style="font-family: -apple-system, Segoe UI, sans-serif; color: #111; max-width: 560px;">
        <p><strong>${escapeHtml(p.clientName)}</strong> just booked a Pep-Talk.</p>
        <ul>
          <li><strong>Your time:</strong> ${escapeHtml(coachWhen.day)} at ${escapeHtml(coachWhen.time)}</li>
          ${sameTz ? "" : `<li><strong>Their time:</strong> ${escapeHtml(clientWhen.day)} at ${escapeHtml(clientWhen.time)} (${escapeHtml(p.clientTimeZone)})</li>`}
          <li><strong>Email:</strong> ${escapeHtml(p.clientEmail)}</li>
          <li><strong>Phone:</strong> ${escapeHtml(p.clientPhone)}</li>
          ${p.meetLink ? `<li><strong>Meet:</strong> <a href="${escapeHtml(p.meetLink)}">${escapeHtml(p.meetLink)}</a></li>` : ""}
        </ul>
        <p><strong>Topic:</strong></p>
        <blockquote style="border-left: 3px solid #f59e0b; padding-left: 12px; color: #333;">
          ${escapeHtml(p.topic).replace(/\n/g, "<br />")}
        </blockquote>
        <p style="font-size: 12px; color: #666;">
          The signed agreement PDF is in the companion email.
        </p>
      </div>
    `,
  });
}

function formatWhen(utc: Date, tz: string): { day: string; time: string } {
  const day = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: tz,
  }).format(utc);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
    timeZone: tz,
  }).format(utc);
  return { day, time };
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
