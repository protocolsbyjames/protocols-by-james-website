import { listBusyWindows, type BusyWindow } from "@/lib/google-calendar";

/**
 * Slot computation for /peptalk/book.
 *
 * Business rules (tweak these without touching the UI):
 *   - Peptalks are 20 minutes long.
 *   - James takes peptalks 7 days a week, 09:00–17:00 in PEPTALK_TIMEZONE
 *     (defaults to America/Los_Angeles). Weekends included — any personal
 *     time blocks sit on James's own calendar and get picked up as busy
 *     windows below.
 *   - We show the next 7 days of availability, starting at least 1 hour
 *     from now. Same-day bookings allowed; the 1h buffer just keeps someone
 *     from clicking a slot that's already starting.
 *   - Slots that overlap any Google Calendar busy window are dropped.
 *
 * Output is grouped by day in the booker's selected timezone so the UI can
 * render "Monday Apr 20" → [9:00, 9:20, 9:40, ...] without re-doing any
 * timezone math in React.
 *
 * Implementation notes:
 *   - We generate slot boundaries in the target timezone by converting a
 *     local {y,m,d,h,m} back to a UTC Date. `new Date("YYYY-MM-DDTHH:mm:ss")`
 *     isn't timezone-aware, so we use Intl.DateTimeFormat to go the other
 *     way (UTC → wall-clock) and a tiny `localToUtc` helper for the reverse.
 *   - No DST gotchas in the forward direction because we build each slot
 *     from wall-clock {date, hour, minute} rather than adding 20min to the
 *     previous slot — if DST jumps 9am→10am, we still emit 9:20 and 9:40
 *     correctly.
 */

export const PEPTALK_DURATION_MIN = 20;
export const DEFAULT_WORK_HOUR_START = 9; // 09:00 local
export const DEFAULT_WORK_HOUR_END = 17; // 17:00 local (last slot starts 16:40)
export const DEFAULT_TIMEZONE =
  process.env.PEPTALK_TIMEZONE ?? "America/Los_Angeles";
export const LEAD_TIME_HOURS = 1;
export const LOOKAHEAD_DAYS = 7;

export type Slot = {
  /** ISO timestamp at UTC — what gets persisted / passed to gcal. */
  startUtc: string;
  /** ISO timestamp at UTC for slot end. */
  endUtc: string;
  /** Pre-formatted wall-clock display, e.g. "9:00 AM". */
  label: string;
};

export type DayGroup = {
  /** YYYY-MM-DD in the target timezone, stable identifier for the UI. */
  dateKey: string;
  /** Pretty day name, e.g. "Monday, Apr 20". */
  label: string;
  slots: Slot[];
};

/**
 * Converts wall-clock components in a given IANA timezone to a UTC Date.
 *
 * We shoot a candidate Date at `Date.UTC(...)`, format it back in the
 * target tz, and measure the difference. One correction iteration is
 * enough even around DST boundaries as long as the wall-clock we're
 * converting isn't a non-existent "spring forward" time — which our
 * working-hours slots never are.
 */
function localToUtc(
  year: number,
  month: number, // 1-12
  day: number,
  hour: number,
  minute: number,
  tz: string,
): Date {
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(guess).map((p) => [p.type, p.value]),
  );
  const formattedUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) === 24 ? 0 : Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  const offsetMs = formattedUtc - guess.getTime();
  return new Date(guess.getTime() - offsetMs);
}

/** "YYYY-MM-DD" in the given IANA timezone. */
function dateKeyIn(date: Date, tz: string): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(date);
}

function prettyDayLabel(dateKey: string): string {
  // dateKey is "YYYY-MM-DD" in target tz; formatting it as UTC gives us the
  // same calendar day back without timezone drift.
  const [y, m, d] = dateKey.split("-").map(Number);
  const asUtc = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(asUtc);
}

function prettyTimeLabel(utc: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(utc);
}

function overlapsBusy(
  startUtc: Date,
  endUtc: Date,
  busy: BusyWindow[],
): boolean {
  for (const b of busy) {
    if (startUtc < b.end && endUtc > b.start) return true;
  }
  return false;
}

/**
 * Top-level: returns the grouped slots ready to render. Defaults to
 * PEPTALK_TIMEZONE but the booker can pass their own tz if we ever add a
 * picker to the UI.
 */
export async function listAvailablePeptalkSlots(opts?: {
  timezone?: string;
}): Promise<DayGroup[]> {
  const tz = opts?.timezone ?? DEFAULT_TIMEZONE;
  const now = new Date();
  const earliest = new Date(now.getTime() + LEAD_TIME_HOURS * 60 * 60 * 1000);
  const latest = new Date(
    now.getTime() + LOOKAHEAD_DAYS * 24 * 60 * 60 * 1000,
  );

  // Fetch the busy windows once for the whole range — one API hit total.
  const busy = await listBusyWindows({
    timeMin: earliest,
    timeMax: latest,
    timeZone: tz,
  });

  const groups: DayGroup[] = [];

  // Walk day-by-day in the target timezone. We advance by adding 24h to a
  // UTC timestamp; in tz's that observe DST that can land us +23 or +25h
  // into the "next day" on transition days, which is fine because we rebuild
  // the wall-clock slot list from the date key and not by offsetting.
  for (let i = 0; i < LOOKAHEAD_DAYS; i++) {
    const probe = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const dateKey = dateKeyIn(probe, tz);
    // dedupe in case DST boundary caused two probes to map to same day
    if (groups.some((g) => g.dateKey === dateKey)) continue;

    const [y, m, d] = dateKey.split("-").map(Number);
    const daySlots: Slot[] = [];

    for (
      let totalMin = DEFAULT_WORK_HOUR_START * 60;
      totalMin + PEPTALK_DURATION_MIN <= DEFAULT_WORK_HOUR_END * 60;
      totalMin += PEPTALK_DURATION_MIN
    ) {
      const h = Math.floor(totalMin / 60);
      const min = totalMin % 60;
      const startUtc = localToUtc(y, m, d, h, min, tz);
      if (startUtc < earliest) continue;
      const endUtc = new Date(
        startUtc.getTime() + PEPTALK_DURATION_MIN * 60 * 1000,
      );
      if (overlapsBusy(startUtc, endUtc, busy)) continue;

      daySlots.push({
        startUtc: startUtc.toISOString(),
        endUtc: endUtc.toISOString(),
        label: prettyTimeLabel(startUtc, tz),
      });
    }

    if (daySlots.length === 0) continue;
    groups.push({
      dateKey,
      label: prettyDayLabel(dateKey),
      slots: daySlots,
    });
  }

  return groups;
}

/**
 * Revalidates a specific slot before creating the booking. Called from the
 * submit action to defend against race conditions where two people pick the
 * same slot simultaneously — we re-query gcal and make sure the window is
 * still free before we write anything.
 */
export async function slotIsStillFree(opts: {
  startUtc: string;
  endUtc: string;
  timeZone?: string;
}): Promise<boolean> {
  const tz = opts.timeZone ?? DEFAULT_TIMEZONE;
  const start = new Date(opts.startUtc);
  const end = new Date(opts.endUtc);
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end <= start
  ) {
    return false;
  }
  const busy = await listBusyWindows({
    timeMin: start,
    timeMax: end,
    timeZone: tz,
  });
  return !overlapsBusy(start, end, busy);
}
