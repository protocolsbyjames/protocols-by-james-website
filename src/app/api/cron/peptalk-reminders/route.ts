import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendPeptalkReminderEmail } from "@/lib/email";
import { DEFAULT_TIMEZONE } from "@/lib/peptalk-slots";

/**
 * /api/cron/peptalk-reminders — runs on a Vercel Cron every 10 minutes.
 *
 * Responsibilities:
 *   - Find confirmed peptalk_bookings whose scheduled_at is in a reminder
 *     window and whose reminder hasn't been sent yet.
 *   - Send exactly one 24-hour reminder and one 1-hour reminder per
 *     booking. The DB columns `reminder_24h_sent_at` and
 *     `reminder_1h_sent_at` are the idempotency guard — we update them
 *     the moment a send succeeds.
 *
 * Auth:
 *   Vercel Cron attaches an `Authorization: Bearer <CRON_SECRET>` header.
 *   Any other caller gets a 401. The secret is set via the `CRON_SECRET`
 *   env var in Vercel (generate with `openssl rand -hex 32`).
 *
 * Windowing:
 *   We use generous windows (55-80 minutes for 1h; 23-25 hours for 24h)
 *   so a single missed cron tick doesn't drop a reminder. Since the
 *   timestamp columns are set immediately on success, re-firing within
 *   the window just no-ops.
 *
 * This route is safe to call manually during testing — just hit it with
 * the right bearer token and it'll process whatever's eligible right now.
 */

export const dynamic = "force-dynamic";
// Cron routes must run in Node (not Edge) because the Resend SDK and our
// Supabase admin client both rely on node: modules.
export const runtime = "nodejs";

type BookingRow = {
  id: string;
  full_name: string;
  email: string;
  scheduled_at: string;
  timezone: string | null;
  meet_link: string | null;
  reminder_24h_sent_at: string | null;
  reminder_1h_sent_at: string | null;
};

export async function GET(req: Request) {
  // ---- Auth ----
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Fail loud in logs, but don't 500 — Vercel will retry and we'd
    // rather James see the error in logs than an alert storm.
    console.error("CRON_SECRET is not set — refusing to run reminders.");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }
  const authHeader = req.headers.get("authorization") || "";
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const admin = supabaseAdmin();
  const now = Date.now();

  // ---- 24h window ----
  // Pick bookings whose start is between now+23h and now+25h and whose
  // 24h reminder hasn't been sent.
  const t24Min = new Date(now + 23 * 60 * 60 * 1000).toISOString();
  const t24Max = new Date(now + 25 * 60 * 60 * 1000).toISOString();

  const { data: due24, error: err24 } = await admin
    .from("peptalk_bookings")
    .select(
      "id, full_name, email, scheduled_at, timezone, meet_link, reminder_24h_sent_at, reminder_1h_sent_at",
    )
    .eq("status", "confirmed")
    .is("reminder_24h_sent_at", null)
    .gte("scheduled_at", t24Min)
    .lte("scheduled_at", t24Max)
    .returns<BookingRow[]>();

  if (err24) {
    console.error("Reminder cron: failed to query 24h window:", err24);
  }

  // ---- 1h window ----
  // Pick bookings whose start is between now+55m and now+80m. Wider than
  // 60min so a missed tick still catches them; the sent-at column
  // prevents double-sends.
  const t1Min = new Date(now + 55 * 60 * 1000).toISOString();
  const t1Max = new Date(now + 80 * 60 * 1000).toISOString();

  const { data: due1, error: err1 } = await admin
    .from("peptalk_bookings")
    .select(
      "id, full_name, email, scheduled_at, timezone, meet_link, reminder_24h_sent_at, reminder_1h_sent_at",
    )
    .eq("status", "confirmed")
    .is("reminder_1h_sent_at", null)
    .gte("scheduled_at", t1Min)
    .lte("scheduled_at", t1Max)
    .returns<BookingRow[]>();

  if (err1) {
    console.error("Reminder cron: failed to query 1h window:", err1);
  }

  // ---- Send 24h reminders ----
  const results: Array<{ id: string; kind: "24h" | "1h"; ok: boolean; error?: string }> = [];

  for (const row of due24 ?? []) {
    const when = formatWhen(row.scheduled_at, row.timezone || DEFAULT_TIMEZONE);
    try {
      await sendPeptalkReminderEmail({
        clientName: row.full_name,
        clientEmail: row.email,
        whenDay: when.day,
        whenTime: when.time,
        meetLink: row.meet_link,
        kind: "24h",
      });
      const { error: upErr } = await admin
        .from("peptalk_bookings")
        .update({ reminder_24h_sent_at: new Date().toISOString() })
        .eq("id", row.id);
      if (upErr) throw upErr;
      results.push({ id: row.id, kind: "24h", ok: true });
    } catch (e) {
      console.error(`Reminder cron: 24h send failed for ${row.id}:`, e);
      results.push({ id: row.id, kind: "24h", ok: false, error: String(e) });
    }
  }

  // ---- Send 1h reminders ----
  for (const row of due1 ?? []) {
    const when = formatWhen(row.scheduled_at, row.timezone || DEFAULT_TIMEZONE);
    try {
      await sendPeptalkReminderEmail({
        clientName: row.full_name,
        clientEmail: row.email,
        whenDay: when.day,
        whenTime: when.time,
        meetLink: row.meet_link,
        kind: "1h",
      });
      const { error: upErr } = await admin
        .from("peptalk_bookings")
        .update({ reminder_1h_sent_at: new Date().toISOString() })
        .eq("id", row.id);
      if (upErr) throw upErr;
      results.push({ id: row.id, kind: "1h", ok: true });
    } catch (e) {
      console.error(`Reminder cron: 1h send failed for ${row.id}:`, e);
      results.push({ id: row.id, kind: "1h", ok: false, error: String(e) });
    }
  }

  return NextResponse.json({
    ok: true,
    processed: results.length,
    results,
  });
}

function formatWhen(iso: string, timezone: string): { day: string; time: string } {
  const d = new Date(iso);
  return {
    day: new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: timezone,
    }).format(d),
    time: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
      timeZone: timezone,
    }).format(d),
  };
}
