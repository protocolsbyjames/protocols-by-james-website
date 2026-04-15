"use client";

import { useState } from "react";
import { ArrowRight, Calendar, Clock, Lock, Shield } from "lucide-react";
import {
  AGREEMENT_TITLE,
  AGREEMENT_VERSION,
  AGREEMENT_PREAMBLE,
  AGREEMENT_SECTIONS,
} from "@/lib/agreement";
import type { DayGroup } from "@/lib/peptalk-slots";

/**
 * Client component for the /peptalk/book interactive flow.
 *
 * State model:
 *   - selectedDay: dateKey from DayGroup, or null before a day is picked
 *   - selectedSlot: full Slot object (we need startUtc + endUtc on submit)
 *   - The form below the slot picker is always rendered but disabled until
 *     a slot is selected, so the user sees what's coming without jumping
 *     between screens.
 *
 * The submit action (passed as a prop from the server component) receives
 * a FormData with the hidden startUtc/endUtc fields plus the rest of the
 * form. Server-side we revalidate the slot against gcal before committing
 * (see actions.ts).
 */
export default function BookingFlow({
  groupedSlots,
  timezone,
  submitAction,
}: {
  groupedSlots: DayGroup[];
  timezone: string;
  submitAction: (formData: FormData) => Promise<void>;
}) {
  const [selectedDay, setSelectedDay] = useState<string>(
    groupedSlots[0]?.dateKey ?? "",
  );
  const [selectedSlot, setSelectedSlot] = useState<{
    startUtc: string;
    endUtc: string;
    label: string;
    dayLabel: string;
  } | null>(null);

  const activeDay = groupedSlots.find((g) => g.dateKey === selectedDay);

  return (
    <div className="space-y-8">
      {/* --------- Step 1: Pick a day --------- */}
      <div className="bg-[#0d1628] border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-2 text-amber-400 mb-4">
          <Calendar className="w-4 h-4" />
          <span className="font-semibold text-sm tracking-widest uppercase">
            Step 1 · Pick a day
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
          {groupedSlots.map((day) => {
            const isActive = day.dateKey === selectedDay;
            return (
              <button
                key={day.dateKey}
                type="button"
                onClick={() => {
                  setSelectedDay(day.dateKey);
                  setSelectedSlot(null);
                }}
                className={`flex-shrink-0 snap-start px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-amber-400 text-black border-amber-400"
                    : "bg-[#0b1227] text-zinc-300 border-zinc-800 hover:border-amber-400/50"
                }`}
              >
                {day.label}
                <div
                  className={`text-xs mt-0.5 ${
                    isActive ? "text-black/70" : "text-zinc-500"
                  }`}
                >
                  {day.slots.length} open
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* --------- Step 2: Pick a time --------- */}
      <div className="bg-[#0d1628] border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-2 text-amber-400 mb-4">
          <Clock className="w-4 h-4" />
          <span className="font-semibold text-sm tracking-widest uppercase">
            Step 2 · Pick a time
          </span>
        </div>
        {activeDay ? (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {activeDay.slots.map((slot) => {
                const isActive = selectedSlot?.startUtc === slot.startUtc;
                return (
                  <button
                    key={slot.startUtc}
                    type="button"
                    onClick={() =>
                      setSelectedSlot({
                        startUtc: slot.startUtc,
                        endUtc: slot.endUtc,
                        label: slot.label,
                        dayLabel: activeDay.label,
                      })
                    }
                    className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-amber-400 text-black border-amber-400"
                        : "bg-[#0b1227] text-zinc-300 border-zinc-800 hover:border-amber-400/50"
                    }`}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-zinc-500 mt-4">
              Times shown in {friendlyTimezone(timezone)}
            </p>
          </>
        ) : (
          <p className="text-zinc-500 text-sm">
            Pick a day above to see available times.
          </p>
        )}
      </div>

      {/* --------- Step 3: Your details + agreement --------- */}
      <form
        action={submitAction}
        className={`bg-[#0d1628] border rounded-2xl p-6 md:p-8 transition-opacity ${
          selectedSlot
            ? "border-white/10 opacity-100"
            : "border-white/5 opacity-60 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2 text-amber-400 mb-4">
          <Shield className="w-4 h-4" />
          <span className="font-semibold text-sm tracking-widest uppercase">
            Step 3 · Your details
          </span>
        </div>

        {selectedSlot && (
          <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl px-5 py-3 mb-6 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="text-sm">
              <div className="text-amber-400 font-semibold">
                {selectedSlot.dayLabel} at {selectedSlot.label}
              </div>
              <div className="text-zinc-400 text-xs">
                20 minutes · Google Meet
              </div>
            </div>
          </div>
        )}

        {/* Hidden slot fields — populated from state when the user submits. */}
        <input
          type="hidden"
          name="startUtc"
          value={selectedSlot?.startUtc ?? ""}
        />
        <input
          type="hidden"
          name="endUtc"
          value={selectedSlot?.endUtc ?? ""}
        />
        <input type="hidden" name="timezone" value={timezone} />

        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Full name" name="fullName" required placeholder="Jane Doe" />
          <Field
            label="Email"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Field
            label="Phone"
            name="phone"
            type="tel"
            required
            placeholder="(555) 555-5555"
          />
          <div />
        </div>

        <div className="mt-6">
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-zinc-300 mb-2"
          >
            What&apos;s this call about?
          </label>
          <textarea
            id="topic"
            name="topic"
            required
            rows={3}
            placeholder="A few sentences on what you're working on, what's not clicking, or what you'd love to walk away with. Helps me come in prepared."
            className="w-full bg-[#0b1227] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors resize-none"
          />
        </div>

        {/* ------------ Agreement read-and-sign ------------ */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-3">
            Quick waiver — required before booking
          </h3>
          <p className="text-zinc-400 text-sm mb-4">
            Standard consulting disclaimer. Give it a read, then type your
            name below to sign.
          </p>

          <article
            className="bg-[#0b1227] border border-white/10 rounded-xl p-5 max-h-[40vh] overflow-y-auto space-y-4 text-zinc-300 text-[14px] leading-relaxed"
            aria-label="Consulting Agreement"
          >
            <header className="border-b border-white/10 pb-3 mb-2">
              <h4 className="text-base font-bold text-white">
                {AGREEMENT_TITLE}
              </h4>
              <p className="text-[11px] text-zinc-500 mt-1 tracking-widest uppercase">
                Version {AGREEMENT_VERSION}
              </p>
            </header>
            {AGREEMENT_PREAMBLE.map((p, i) => (
              <p key={`pre-${i}`}>{p}</p>
            ))}
            {AGREEMENT_SECTIONS.map((section) => (
              <div key={section.heading}>
                <h5 className="text-white font-semibold mb-2 text-sm">
                  {section.heading}
                </h5>
                {section.body.map((p, idx) => (
                  <p
                    key={`${section.heading}-${idx}`}
                    className="mb-2 last:mb-0"
                  >
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </article>

          <div className="mt-6">
            <label
              htmlFor="typedSignature"
              className="block text-sm font-medium text-zinc-300 mb-2"
            >
              Signature (type your name)
            </label>
            <input
              id="typedSignature"
              name="typedSignature"
              required
              placeholder="Your full legal name"
              className="w-full bg-[#0b1227] border border-zinc-800 rounded-xl px-4 py-3 text-white italic text-lg focus:outline-none focus:border-amber-400 transition-colors"
              style={{ fontFamily: '"Brush Script MT", cursive' }}
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-zinc-300 cursor-pointer mt-4">
            <input
              type="checkbox"
              name="confirm"
              required
              className="mt-1 w-5 h-5 rounded border-zinc-700 bg-[#0b1227] accent-amber-400 flex-shrink-0"
            />
            <span>
              I&apos;ve read the Consulting &amp; Coaching Agreement above, I
              understand I&apos;m assuming the risks described, and I&apos;m
              signing it voluntarily.
            </span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-6 mt-6 border-t border-white/10">
          <div className="text-xs text-zinc-500 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Your signed copy lands in your inbox after booking</span>
          </div>
          <button
            type="submit"
            disabled={!selectedSlot}
            className="w-full sm:w-auto bg-amber-400 text-black px-8 py-3.5 rounded-full font-bold hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Book peptalk
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-zinc-300 mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-[#0b1227] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors"
      />
    </div>
  );
}

function friendlyTimezone(tz: string): string {
  // Best-effort short display; if Intl doesn't produce anything we fall back
  // to the raw IANA id.
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "long",
    }).formatToParts(new Date());
    const label = parts.find((p) => p.type === "timeZoneName")?.value;
    return label ?? tz;
  } catch {
    return tz;
  }
}
