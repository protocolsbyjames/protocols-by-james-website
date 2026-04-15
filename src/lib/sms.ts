/**
 * Twilio SMS helper for coach-side push notifications.
 *
 * Why Twilio (vs. an npm dep): we hit the Twilio REST API directly with
 * fetch so we don't pull a ~2MB SDK into every Vercel lambda just to send
 * a 200-char text. The endpoint is stable and the auth is just basic-auth
 * over the AccountSid:AuthToken pair.
 *
 * Env vars required:
 *   TWILIO_ACCOUNT_SID      — from console.twilio.com dashboard
 *   TWILIO_AUTH_TOKEN       — same page, "Auth Token"
 *   TWILIO_FROM_NUMBER      — a Twilio-provisioned number, E.164 (+15555551234)
 *   COACH_SMS_NUMBER        — James's cell, E.164
 *
 * If any of these are missing we silently no-op. That way dev/preview
 * deploys don't blow up just because the secrets aren't set, and the
 * email notification still fires as a fallback.
 */

export async function sendCoachSms(body: string): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = process.env.COACH_SMS_NUMBER;

  if (!sid || !token || !from || !to) {
    console.log("[sms] skipping — Twilio env vars not configured");
    return;
  }

  // Twilio's SMS segment limit is 1600 chars; we keep bodies well under
  // that but truncate defensively so a weird topic can't blow the request.
  const safeBody = body.length > 1500 ? body.slice(0, 1497) + "..." : body;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const form = new URLSearchParams({ To: to, From: from, Body: safeBody });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Twilio send failed ${res.status}: ${text}`);
  }
}

/**
 * Formats the "new pep-talk booked" notification body. Kept short so it
 * fits in a single SMS segment on most carriers.
 */
export function formatPeptalkBookedSms(p: {
  clientName: string;
  whenLabel: string;
  clientPhone: string;
  topic: string;
}): string {
  const topic = p.topic.length > 140 ? p.topic.slice(0, 137) + "..." : p.topic;
  return (
    `New Pep-Talk: ${p.clientName}\n` +
    `${p.whenLabel}\n` +
    `${p.clientPhone}\n` +
    `Topic: ${topic}`
  );
}
