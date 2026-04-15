import { listAvailablePeptalkSlots, DEFAULT_TIMEZONE } from "@/lib/peptalk-slots";
import BookingFlow from "./BookingFlow";
import { submitPeptalkBooking } from "./actions";

/**
 * /peptalk/book — the real booking page.
 *
 * Server component: fetches live availability from Google Calendar on each
 * request, then hands the grouped slots to the <BookingFlow> client
 * component. The submit path is a server action passed down as a prop,
 * which the form calls after the user picks a slot, fills out the details,
 * and signs the agreement inline.
 */

export const metadata = {
  title: "Book your free Pep-Talk · Protocols by James",
  description:
    "Pick a time, sign a quick waiver, jump on a 20-minute Google Meet with James. Free, no pitch.",
};

export const dynamic = "force-dynamic";

export default async function BookPeptalkPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const error = sp.error ? decodeURIComponent(sp.error) : null;

  // Live availability. If Google Calendar isn't configured yet the server
  // action will throw — we catch it here so the page still renders with a
  // friendly "we'll be back soon" state instead of a 500.
  let groupedSlots: Awaited<ReturnType<typeof listAvailablePeptalkSlots>> = [];
  let configError: string | null = null;
  try {
    groupedSlots = await listAvailablePeptalkSlots();
  } catch (e) {
    configError =
      e instanceof Error && e.message.includes("Google Calendar is not configured")
        ? "Booking is temporarily unavailable while I finish setting up my calendar. Email hello@protocolsbyjames.com and I'll find you a time manually."
        : "Something went wrong loading available times. Please try again in a minute.";
    console.error("Failed to load peptalk slots:", e);
  }

  return (
    <main className="min-h-screen bg-[#0b1227] text-white">
      <section className="pt-28 pb-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-amber-400 font-semibold tracking-wider uppercase text-xs">
              20 min · Google Meet · Free
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Book your <span className="text-amber-400">Pep-Talk</span>.
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Pick a time, sign a quick waiver, and I&apos;ll see you on Meet.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-red-300 text-sm">
              {error}
            </div>
          )}

          {configError ? (
            <div className="bg-[#0d1628] border border-white/10 rounded-2xl p-10 text-center">
              <p className="text-zinc-300">{configError}</p>
            </div>
          ) : groupedSlots.length === 0 ? (
            <div className="bg-[#0d1628] border border-white/10 rounded-2xl p-10 text-center">
              <p className="text-zinc-300">
                No openings in the next two weeks —{" "}
                <a
                  href="/contact"
                  className="text-amber-400 hover:underline"
                >
                  reach out
                </a>{" "}
                and I&apos;ll carve something out.
              </p>
            </div>
          ) : (
            <BookingFlow
              groupedSlots={groupedSlots}
              timezone={DEFAULT_TIMEZONE}
              submitAction={submitPeptalkBooking}
            />
          )}
        </div>
      </section>
    </main>
  );
}
