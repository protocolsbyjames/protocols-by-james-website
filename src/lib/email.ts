import { Resend } from "resend";
import { AGREEMENT_VERSION } from "@/lib/agreement";

/**
 * Email delivery for transactional PBJ messages.
 *
 * Sender policy:
 *   We send from `hello@protocolsbyjames.com`. The protocolsbyjames.com
 *   domain is verified in the Resend dashboard (DKIM/SPF set up via
 *   Vercel DNS). Resend stopped accepting @gmail.com senders on free tier
 *   in April 2026 with `validation_error: The gmail.com domain is not
 *   verified` — hence this switch.
 *
 *   `JAMES_EMAIL` below is James's actual Gmail inbox and is used only as
 *   the Reply-To on client-facing emails, so client replies still route
 *   to his Gmail without needing a mailbox on protocolsbyjames.com.
 */

const JAMES_EMAIL = "protocolsbyjames@gmail.com";
const FROM_EMAIL = "Protocols by James <hello@protocolsbyjames.com>";

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
  /**
   * When the signed agreement is for a peptalk booking (not coaching
   * onboarding), pass this so the coach email becomes the single
   * notification for the booking — carries time, topic, phone, Meet
   * link, AND the PDF in one message. This replaces the separate
   * `sendPeptalkBookedNotification` email we used to send.
   */
  peptalk?: {
    clientPhone: string;
    topic: string;
    /** UTC start of the booking. */
    startUtc: Date;
    /** IANA tz the client booked from. */
    clientTimeZone: string;
    meetLink: string | null;
  };
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
  // NOTE: Resend's SDK returns { data, error } and does NOT throw on API
  // errors. We must inspect `error` ourselves and throw — otherwise
  // rejected sends get swallowed and the caller thinks everything was fine.
  const signerRes = await client.emails.send({
    from: FROM_EMAIL,
    to: params.clientEmail,
    subject: "Your signed Protocols by James coaching agreement",
    replyTo: JAMES_EMAIL,
    html: clientHtml(params),
    attachments: [attachment],
  });
  if (signerRes.error) {
    console.error("[resend] signed-agreement -> signer failed", signerRes.error);
    throw new Error(
      `Resend rejected signer email: ${signerRes.error.name} - ${signerRes.error.message}`,
    );
  }
  console.log("[resend] signed-agreement -> signer sent", {
    id: signerRes.data?.id,
    to: params.clientEmail,
  });

  // ---- Email to James (notification + file-keeping copy) ----
  // For peptalk bookings this email IS the booking notification — no
  // separate heads-up email. Subject and body adapt based on whether
  // peptalk context was supplied.
  const coachSubject = params.peptalk
    ? coachPeptalkSubject(params)
    : `Signed agreement: ${params.clientName}`;
  const coachRes = await client.emails.send({
    from: FROM_EMAIL,
    to: JAMES_NOTIFY_EMAIL,
    subject: coachSubject,
    replyTo: params.clientEmail,
    html: coachHtml(params),
    attachments: [attachment],
  });
  if (coachRes.error) {
    console.error("[resend] signed-agreement -> coach failed", coachRes.error);
    throw new Error(
      `Resend rejected coach email: ${coachRes.error.name} - ${coachRes.error.message}`,
    );
  }
  console.log("[resend] signed-agreement -> coach sent", {
    id: coachRes.data?.id,
    to: JAMES_NOTIFY_EMAIL,
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
  // Peptalk flavor: this email carries booking + signed-agreement info
  // in one, so James doesn't get a separate "new booking" email.
  if (p.peptalk) {
    const coachTz = process.env.COACH_TIMEZONE || "America/Chicago";
    const coachWhen = formatWhen(p.peptalk.startUtc, coachTz);
    const clientWhen = formatWhen(p.peptalk.startUtc, p.peptalk.clientTimeZone);
    const sameTz = p.peptalk.clientTimeZone === coachTz;

    return `
      <div style="font-family: -apple-system, Segoe UI, sans-serif; color: #111; max-width: 560px;">
        <p><strong>${escapeHtml(p.clientName)}</strong> just booked a Pep-Talk and signed the agreement.</p>
        <ul>
          <li><strong>Your time:</strong> ${escapeHtml(coachWhen.day)} at ${escapeHtml(coachWhen.time)}</li>
          ${sameTz ? "" : `<li><strong>Their time:</strong> ${escapeHtml(clientWhen.day)} at ${escapeHtml(clientWhen.time)} (${escapeHtml(p.peptalk.clientTimeZone)})</li>`}
          <li><strong>Email:</strong> ${escapeHtml(p.clientEmail)}</li>
          <li><strong>Phone:</strong> ${escapeHtml(p.peptalk.clientPhone)}</li>
          ${p.peptalk.meetLink ? `<li><strong>Meet:</strong> <a href="${escapeHtml(p.peptalk.meetLink)}">${escapeHtml(p.peptalk.meetLink)}</a></li>` : ""}
        </ul>
        <p><strong>Topic:</strong></p>
        <blockquote style="border-left: 3px solid #f59e0b; padding-left: 12px; color: #333;">
          ${escapeHtml(p.peptalk.topic).replace(/\n/g, "<br />")}
        </blockquote>
        <p style="font-size: 12px; color: #666;">
          Signed copy attached · Agreement version ${AGREEMENT_VERSION} · Signed at ${escapeHtml(p.signedAt)}
        </p>
      </div>
    `;
  }

  // Default (coaching onboarding) flavor.
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

function coachPeptalkSubject(p: SignedAgreementEmailParams): string {
  if (!p.peptalk) return `Signed agreement: ${p.clientName}`;
  const coachTz = process.env.COACH_TIMEZONE || "America/Chicago";
  const when = formatWhen(p.peptalk.startUtc, coachTz);
  return `New Pep-Talk: ${p.clientName} — ${when.day} ${when.time}`;
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

  const res = await client.emails.send({
    from: FROM_EMAIL,
    to: params.clientEmail,
    subject,
    replyTo: JAMES_EMAIL,
    html: reminderHtml(params),
  });
  if (res.error) {
    console.error("[resend] peptalk-reminder failed", res.error);
    throw new Error(
      `Resend rejected reminder email: ${res.error.name} - ${res.error.message}`,
    );
  }
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

// NOTE: `sendPeptalkBookedNotification` + `PeptalkBookedNotificationParams`
// were removed 2026-04-15. James asked to consolidate — the coach copy of
// the signed-agreement email now carries the booking details (time, topic,
// phone, Meet link) AND the PDF, so the separate heads-up email was just
// inbox noise. See `coachHtml`'s peptalk branch above.

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
