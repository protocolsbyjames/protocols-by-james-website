"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  AGREEMENT_VERSION,
  agreementPlainText,
} from "@/lib/agreement";
import {
  renderSignedAgreementPdf,
  signedAgreementFilename,
} from "@/lib/agreement-pdf";
import {
  sendSignedAgreementEmail,
  sendPeptalkBookedNotification,
} from "@/lib/email";
import {
  createBookingEvent,
  cancelBookingEvent,
} from "@/lib/google-calendar";
import {
  slotIsStillFree,
  DEFAULT_TIMEZONE,
  PEPTALK_DURATION_MIN,
} from "@/lib/peptalk-slots";

/**
 * POST handler (as a Next.js server action) for /peptalk/book.
 *
 * Flow in order — each stage rolls back any previous stage on failure to
 * avoid orphan rows or phantom calendar events:
 *
 *   1. Validate the form payload (zod).
 *   2. Re-check the slot against gcal busy windows. This is our guard
 *      against two bookers picking the same time simultaneously — the UI
 *      data is cached for a few seconds and gcal is source of truth.
 *   3. Insert a peptalk_bookings row (status=pending). This is the audit
 *      record even if later stages fail.
 *   4. Insert a client_agreements row pointing at the booking. Agreement
 *      snapshot is stored so we can reproduce exactly what was signed.
 *   5. Create the Google Calendar event w/ Meet link. On failure we roll
 *      the DB rows back to status=canceled so James can retry manually.
 *   6. Generate the signed PDF and email it to both parties. Email
 *      failures are logged but non-fatal — the booking still lives and
 *      James can re-send from the coach portal.
 *   7. Update the booking row with gcal_event_id/meet_link and
 *      status=confirmed, then redirect to /peptalk/confirmed with the
 *      booking id.
 */

const BookingSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().min(7).max(40),
  topic: z.string().trim().min(5).max(2000),
  typedSignature: z.string().trim().min(2).max(120),
  confirm: z.literal("on"),
  startUtc: z.string().datetime(),
  endUtc: z.string().datetime(),
  timezone: z.string().min(1).default(DEFAULT_TIMEZONE),
});

function errorRedirect(msg: string): never {
  redirect("/peptalk/book?error=" + encodeURIComponent(msg));
}

export async function submitPeptalkBooking(formData: FormData) {
  // ---------- 1. Validate ----------
  const parsed = BookingSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    topic: formData.get("topic"),
    typedSignature: formData.get("typedSignature"),
    confirm: formData.get("confirm"),
    startUtc: formData.get("startUtc"),
    endUtc: formData.get("endUtc"),
    timezone: formData.get("timezone") || DEFAULT_TIMEZONE,
  });

  if (!parsed.success) {
    errorRedirect(
      "Some fields are missing or invalid. Double-check the form and try again.",
    );
  }

  const input = parsed.data;
  const start = new Date(input.startUtc);
  const end = new Date(input.endUtc);

  // Sanity: slot must be 20 min, in the future.
  const durationMin = Math.round((end.getTime() - start.getTime()) / 60000);
  if (durationMin !== PEPTALK_DURATION_MIN) {
    errorRedirect("That time slot looks off. Please pick another one.");
  }
  if (start.getTime() < Date.now()) {
    errorRedirect("That slot is in the past. Please pick another one.");
  }

  // ---------- 2. Re-check availability ----------
  const stillFree = await slotIsStillFree({
    startUtc: input.startUtc,
    endUtc: input.endUtc,
    timeZone: input.timezone,
  });
  if (!stillFree) {
    errorRedirect(
      "Someone just grabbed that slot. Pick another time and you're good.",
    );
  }

  const admin = supabaseAdmin();

  // Request metadata for audit trail.
  const h = await headers();
  const userAgent = h.get("user-agent");
  const ipAddress =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    null;
  const signedAtIso = new Date().toISOString();

  // ---------- 3. Insert booking row (pending) ----------
  const { data: bookingRow, error: bookingErr } = await admin
    .from("peptalk_bookings")
    .insert({
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      topic: input.topic,
      scheduled_at: input.startUtc,
      duration_minutes: PEPTALK_DURATION_MIN,
      timezone: input.timezone,
      status: "pending",
    })
    .select("id")
    .single<{ id: string }>();

  if (bookingErr || !bookingRow) {
    console.error("Failed to insert peptalk_bookings:", bookingErr);
    errorRedirect(
      "Couldn't save your booking. Please try again in a moment.",
    );
  }

  const bookingId = bookingRow!.id;

  // ---------- 4. Insert agreement row ----------
  const { error: agreementErr } = await admin
    .from("client_agreements")
    .insert({
      peptalk_booking_id: bookingId,
      agreement_version: AGREEMENT_VERSION,
      agreement_text_snapshot: agreementPlainText(),
      typed_name: input.typedSignature,
      signed_at: signedAtIso,
      ip_address: ipAddress,
      user_agent: userAgent,
    });

  if (agreementErr) {
    console.error("Failed to insert client_agreements for peptalk:", agreementErr);
    // Roll the booking back so nothing orphans.
    await admin
      .from("peptalk_bookings")
      .update({ status: "canceled" })
      .eq("id", bookingId);
    errorRedirect("Couldn't save your signature. Please try again.");
  }

  // ---------- 5. Create Google Calendar event ----------
  let gcalEventId: string | null = null;
  let meetLink: string | null = null;
  try {
    const created = await createBookingEvent({
      clientName: input.fullName,
      clientEmail: input.email,
      clientPhone: input.phone,
      topic: input.topic,
      startUtc: start,
      endUtc: end,
      timeZone: input.timezone,
    });
    gcalEventId = created.eventId;
    meetLink = created.meetLink;
  } catch (e) {
    console.error("Failed to create gcal event for peptalk:", e);
    await admin
      .from("peptalk_bookings")
      .update({ status: "canceled" })
      .eq("id", bookingId);
    errorRedirect(
      "Couldn't add your booking to the calendar. Please try again or reach out at hello@protocolsbyjames.com.",
    );
  }

  // ---------- 6. Sign PDF + email ----------
  let emailFailed = false;
  try {
    const pdf = await renderSignedAgreementPdf({
      clientPrintedName: input.fullName,
      typedSignature: input.typedSignature,
      signedAt: signedAtIso,
      ipAddress,
      userAgent,
    });
    const filename = signedAgreementFilename({
      clientPrintedName: input.fullName,
      typedSignature: input.typedSignature,
      signedAt: signedAtIso,
    });
    await sendSignedAgreementEmail({
      clientName: input.fullName,
      clientEmail: input.email,
      pdf,
      filename,
      signedAt: signedAtIso,
    });
  } catch (e) {
    console.error("Signed-agreement email failed (non-fatal):", e);
    emailFailed = true;
    // We don't roll back the booking — the call is still booked. James
    // can manually re-send the signed copy from the coach portal.
  }

  // Short heads-up to James's inbox. Non-fatal: if it fails, the signed
  // agreement email (above) already carries the booking details.
  try {
    const when = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: input.timezone,
    }).format(start);
    const whenTime = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
      timeZone: input.timezone,
    }).format(start);
    await sendPeptalkBookedNotification({
      clientName: input.fullName,
      clientEmail: input.email,
      clientPhone: input.phone,
      topic: input.topic,
      whenDay: when,
      whenTime,
      meetLink,
    });
  } catch (e) {
    console.error("Peptalk booked notification failed (non-fatal):", e);
  }

  // ---------- 7. Confirm the booking row ----------
  const { error: confirmErr } = await admin
    .from("peptalk_bookings")
    .update({
      status: "confirmed",
      gcal_event_id: gcalEventId,
      meet_link: meetLink,
    })
    .eq("id", bookingId);

  if (confirmErr) {
    console.error("Failed to mark booking confirmed:", confirmErr);
    // The gcal event and (likely) the email went out; leaving the row in
    // its pre-confirmed state is recoverable by James. But the user saw a
    // green path — don't redirect them to the error page, just log.
  }

  // Rollback the gcal event only if we hit catastrophic DB state AND the
  // caller needs to see an error. That's not this code path, so we skip.
  void cancelBookingEvent; // keep import for future rollback wiring

  // ---------- 8. Redirect to the confirmation page ----------
  const params = new URLSearchParams({ id: bookingId });
  if (emailFailed) params.set("email", "failed");
  redirect(`/peptalk/confirmed?${params.toString()}`);
}
