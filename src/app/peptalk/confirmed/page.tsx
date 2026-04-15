import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, Check, Mail, Video } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { DEFAULT_TIMEZONE } from "@/lib/peptalk-slots";

export const metadata = {
  title: "Peptalk booked · Protocols by James",
  description: "Your peptalk is locked in. Check your email for the details.",
};

export const dynamic = "force-dynamic";

/**
 * /peptalk/confirmed — the post-booking success page.
 *
 * We look the booking up by id (passed through the redirect from the
 * submit action) so we can show the real time + Meet link without
 * trusting query-string params. If the lookup fails we fall back to a
 * generic "you're booked" screen instead of throwing — a booking did
 * happen, we just can't surface the details.
 */

type BookingRow = {
  id: string;
  full_name: string;
  email: string;
  scheduled_at: string;
  duration_minutes: number;
  timezone: string;
  meet_link: string | null;
};

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; email?: string }>;
}) {
  const sp = await searchParams;
  if (!sp.id) redirect("/peptalk");

  const admin = supabaseAdmin();
  const { data: booking } = await admin
    .from("peptalk_bookings")
    .select("id, full_name, email, scheduled_at, duration_minutes, timezone, meet_link")
    .eq("id", sp.id)
    .maybeSingle<BookingRow>();

  const emailFailed = sp.email === "failed";

  const niceWhen = booking
    ? formatWhen(booking.scheduled_at, booking.timezone || DEFAULT_TIMEZONE)
    : null;
  const firstName = booking ? booking.full_name.split(/\s+/)[0] : null;

  return (
    <main className="min-h-screen bg-[#0b1227] text-white">
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/40 mb-6">
            <Check className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {firstName ? `You're booked, ${firstName}.` : "You're booked."}
          </h1>
          <p className="text-lg text-zinc-400 max-w-lg mx-auto mb-10">
            I&apos;m looking forward to it. Here&apos;s everything you need.
          </p>

          <div className="bg-[#0d1628] border border-white/10 rounded-2xl p-6 md:p-8 text-left space-y-5">
            {niceWhen && (
              <Row icon={<Calendar className="w-5 h-5" />} label="When">
                <span className="text-white font-semibold">{niceWhen.day}</span>
                <span className="text-zinc-400"> · {niceWhen.time}</span>
                <div className="text-zinc-500 text-xs mt-1">
                  {booking?.duration_minutes ?? 20} minutes
                </div>
              </Row>
            )}

            {booking?.meet_link ? (
              <Row icon={<Video className="w-5 h-5" />} label="Google Meet">
                <a
                  href={booking.meet_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline break-all"
                >
                  {booking.meet_link}
                </a>
                <div className="text-zinc-500 text-xs mt-1">
                  Save this link — it&apos;s also in your calendar invite.
                </div>
              </Row>
            ) : (
              <Row icon={<Video className="w-5 h-5" />} label="Google Meet">
                <span className="text-zinc-400">
                  The Meet link is in your Google Calendar invite.
                </span>
              </Row>
            )}

            <Row icon={<Mail className="w-5 h-5" />} label="Confirmation">
              {emailFailed ? (
                <span className="text-zinc-400">
                  Your booking is locked in, but our confirmation email
                  didn&apos;t send. Reach out at{" "}
                  <Link href="/contact" className="text-amber-400 hover:underline">
                    hello@protocolsbyjames.com
                  </Link>{" "}
                  if you need a copy of the signed waiver.
                </span>
              ) : (
                <span className="text-zinc-400">
                  Check {booking?.email ?? "your inbox"} — a Google Calendar
                  invite and your signed waiver PDF are waiting for you.
                </span>
              )}
            </Row>
          </div>

          <div className="mt-10 space-y-4 text-zinc-400 text-sm">
            <p>
              Need to reschedule? Just reply to the calendar invite or email
              me directly.
            </p>
            <p>
              <Link
                href="/"
                className="text-amber-400 hover:underline font-medium"
              >
                ← Back to the homepage
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-zinc-500 text-xs tracking-widest uppercase mb-1">
          {label}
        </div>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
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
