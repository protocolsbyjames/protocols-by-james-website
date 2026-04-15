import { google, calendar_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";

/**
 * Google Calendar client for peptalk bookings.
 *
 * Why direct API (not an MCP): this lib runs inside Next.js server actions on
 * Vercel, so it needs stateless OAuth — specifically the refresh-token flow:
 *
 *   1. James runs the one-off `scripts/bootstrap-google-oauth.ts` on his Mac
 *      once (see docs/PEPTALK_GOOGLE_SETUP.md). That flow mints a long-lived
 *      refresh token against his personal Google account and grants
 *      `https://www.googleapis.com/auth/calendar` + `.events` scopes.
 *   2. The refresh token goes into env var GOOGLE_OAUTH_REFRESH_TOKEN.
 *      GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET come from the
 *      same GCP OAuth client.
 *   3. Every server-action request here swaps the refresh token for a short
 *      access token, does its work, and throws the access token away.
 *
 * Calendar target:
 *   - GOOGLE_CALENDAR_ID defaults to "primary" (James's main calendar).
 *   - If he wants a separate "Peptalks" calendar later, he creates one in
 *     Google Calendar and drops the calendar id into the env var. No code
 *     changes needed.
 *
 * Reminders:
 *   - Events are created with override reminders at 15 and 10 minutes before
 *     start (per James's spec), both via "popup". Email reminders aren't
 *     added because we already email the booking confirmation separately.
 *
 * Conferencing:
 *   - Google Meet is requested via conferenceData.createRequest so the API
 *     provisions a Meet link and returns it on the event. That link is what
 *     we surface to the booker on /peptalk/confirmed.
 */

function oauthClient(): OAuth2Client {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Google Calendar is not configured. Missing one of " +
        "GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET / " +
        "GOOGLE_OAUTH_REFRESH_TOKEN. See docs/PEPTALK_GOOGLE_SETUP.md.",
    );
  }

  const client = new google.auth.OAuth2({ clientId, clientSecret });
  client.setCredentials({ refresh_token: refreshToken });
  return client;
}

function calendarClient() {
  return google.calendar({ version: "v3", auth: oauthClient() });
}

export function peptalkCalendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID ?? "primary";
}

export type BusyWindow = { start: Date; end: Date };

/**
 * Returns James's busy windows in the given time range. Uses the freebusy
 * API so we don't have to iterate individual events and it respects
 * recurring events, all-day blocks, and visibility correctly.
 */
export async function listBusyWindows(params: {
  timeMin: Date;
  timeMax: Date;
  timeZone: string;
}): Promise<BusyWindow[]> {
  const cal = calendarClient();
  const res = await cal.freebusy.query({
    requestBody: {
      timeMin: params.timeMin.toISOString(),
      timeMax: params.timeMax.toISOString(),
      timeZone: params.timeZone,
      items: [{ id: peptalkCalendarId() }],
    },
  });
  const busy =
    res.data.calendars?.[peptalkCalendarId()]?.busy?.map((b) => ({
      start: new Date(b.start ?? ""),
      end: new Date(b.end ?? ""),
    })) ?? [];
  return busy.filter(
    (b) => !Number.isNaN(b.start.getTime()) && !Number.isNaN(b.end.getTime()),
  );
}

export type CreateBookingEventParams = {
  /** Booker's display name, goes into the event title. */
  clientName: string;
  /** Booker's email — will be invited and receive the gcal invite. */
  clientEmail: string;
  /** Booker's phone, surfaced in the description so James has it handy. */
  clientPhone: string;
  /** Topic / reason for call they submitted. */
  topic: string;
  /** Slot start time, as a Date in UTC. */
  startUtc: Date;
  /** Slot end time, as a Date in UTC. */
  endUtc: Date;
  /** IANA timezone the booker selected (e.g. "America/Los_Angeles"). */
  timeZone: string;
};

export type CreatedBookingEvent = {
  eventId: string;
  meetLink: string | null;
  htmlLink: string | null;
};

/**
 * Creates the peptalk gcal event. Returns the Meet link so the caller can
 * put it in the confirmation email + DB row.
 *
 * Note: we don't pass sendUpdates: "all" — we want to control the confirm
 * email via our Resend pipeline (signed PDF attached), not let gcal double
 * up on it. The booker still gets the calendar invite because they're in
 * the attendees list.
 */
export async function createBookingEvent(
  params: CreateBookingEventParams,
): Promise<CreatedBookingEvent> {
  const cal = calendarClient();
  const requestId = `peptalk-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const event: calendar_v3.Schema$Event = {
    summary: `Pep-Talk — ${params.clientName}`,
    description:
      `Free Pep-Talk booked via protocolsbyjames.com\n\n` +
      `Name: ${params.clientName}\n` +
      `Email: ${params.clientEmail}\n` +
      `Phone: ${params.clientPhone}\n\n` +
      `Topic: ${params.topic}`,
    start: {
      dateTime: params.startUtc.toISOString(),
      timeZone: params.timeZone,
    },
    end: {
      dateTime: params.endUtc.toISOString(),
      timeZone: params.timeZone,
    },
    attendees: [{ email: params.clientEmail, displayName: params.clientName }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "popup", minutes: 15 },
        { method: "popup", minutes: 10 },
      ],
    },
    conferenceData: {
      createRequest: {
        requestId,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  const res = await cal.events.insert({
    calendarId: peptalkCalendarId(),
    requestBody: event,
    conferenceDataVersion: 1,
    sendUpdates: "all",
  });

  const meetLink =
    res.data.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")
      ?.uri ?? res.data.hangoutLink ?? null;

  return {
    eventId: res.data.id ?? "",
    meetLink,
    htmlLink: res.data.htmlLink ?? null,
  };
}

/**
 * Cancels an existing peptalk event. Used when a booking is canceled later
 * from the coach portal. Silently tolerates 404/410 so re-cancels don't
 * blow up.
 */
export async function cancelBookingEvent(eventId: string): Promise<void> {
  const cal = calendarClient();
  try {
    await cal.events.delete({
      calendarId: peptalkCalendarId(),
      eventId,
      sendUpdates: "all",
    });
  } catch (err: unknown) {
    const e = err as { code?: number; response?: { status?: number } };
    const status = e.code ?? e.response?.status;
    if (status === 404 || status === 410) return;
    throw err;
  }
}
