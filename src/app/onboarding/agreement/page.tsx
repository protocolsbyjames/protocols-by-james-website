import { redirect } from "next/navigation";
import { ArrowRight, Check, Lock, Shield } from "lucide-react";
import {
  AGREEMENT_TITLE,
  AGREEMENT_VERSION,
  AGREEMENT_PREAMBLE,
  AGREEMENT_SECTIONS,
} from "@/lib/agreement";
import {
  resolveOnboardingContext,
  submitSignedAgreement,
} from "./actions";

/**
 * Post-payment Consulting & Coaching Agreement signing page.
 *
 * How we land here:
 *   LemonSqueezy checkout's `success_url` in pbj-fitness-app/src/app/api/checkout
 *   points to `${marketingUrl}/onboarding/agreement?checkout_id={checkout_id}`.
 *   The page calls `resolveOnboardingContext` which looks up the user via the
 *   subscription/order created by the webhook, mints a signed onboarding
 *   cookie, and hands us the user's name/email to pre-fill.
 *
 *   If someone hits this page cold (no checkout id, no cookie) we bounce them
 *   back to /apply.
 */

export const metadata = {
  title: "Sign your coaching agreement · Protocols by James",
  description:
    "Last step before your intake — read and sign the Consulting & Coaching Agreement.",
};

// Agreement contains legal boilerplate that can't be cached/statically rendered.
export const dynamic = "force-dynamic";

export default async function AgreementPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout_id?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const ctx = await resolveOnboardingContext(sp.checkout_id);

  if (!ctx) {
    redirect(
      "/apply?error=" +
        encodeURIComponent(
          "We couldn't find your payment. Start a new application and I'll get you sorted.",
        ),
    );
  }

  if (ctx.alreadySigned) {
    // They already signed this exact version — send them straight to the app.
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "https://app.protocolsbyjames.com";
    redirect(`${appUrl}/onboarding/questionnaire?signed=1`);
  }

  const error = sp.error ? decodeURIComponent(sp.error) : null;

  return (
    <main className="min-h-screen bg-[#0b1227] text-white">
      <section className="pt-28 pb-4 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4">
            <Check className="w-4 h-4" />
            <span>Payment received</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 leading-tight">
            One last step — <span className="text-amber-400">sign your agreement</span>.
          </h1>
          <p className="text-lg text-zinc-400 text-center max-w-2xl mx-auto">
            Standard coaching paperwork. Give it a read, type your name at the
            bottom, and I&apos;ll hand you off to the intake questionnaire
            inside the app.
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

          {/* ------------------ Agreement scroll area ------------------ */}
          <article
            className="bg-[#0d1628] border border-white/10 rounded-2xl p-6 md:p-10 max-h-[60vh] overflow-y-auto space-y-6 text-zinc-300 text-[15px] leading-relaxed"
            aria-label="Consulting and Coaching Agreement"
          >
            <header className="border-b border-white/10 pb-4 mb-2">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {AGREEMENT_TITLE}
              </h2>
              <p className="text-xs text-zinc-500 mt-2 tracking-widest uppercase">
                Version {AGREEMENT_VERSION}
              </p>
            </header>

            {AGREEMENT_PREAMBLE.map((p, i) => (
              <p key={`pre-${i}`}>{p}</p>
            ))}

            {AGREEMENT_SECTIONS.map((section) => (
              <div key={section.heading}>
                <h3 className="text-white font-semibold mb-2">
                  {section.heading}
                </h3>
                {section.body.map((p, idx) => (
                  <p key={`${section.heading}-${idx}`} className="mb-3 last:mb-0">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </article>

          {/* ------------------ Signature form ------------------ */}
          <form
            action={submitSignedAgreement}
            className="mt-8 bg-[#0d1628] border border-white/10 rounded-2xl p-6 md:p-10 space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">Sign the agreement</h2>
              <p className="text-zinc-400 text-sm">
                By typing your name below you&apos;re placing an electronic
                signature that has the same legal effect as a handwritten one.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="printedName"
                  className="block text-sm font-medium text-zinc-300 mb-2"
                >
                  Printed name
                </label>
                <input
                  id="printedName"
                  name="printedName"
                  required
                  defaultValue={ctx.fullName}
                  className="w-full bg-[#0b1227] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
              <div>
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
                  className="w-full bg-[#0b1227] border border-zinc-800 rounded-xl px-4 py-3 text-white italic font-serif text-lg focus:outline-none focus:border-amber-400 transition-colors"
                  style={{ fontFamily: '"Brush Script MT", cursive' }}
                />
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm text-zinc-300 cursor-pointer">
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

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-2">
              <div className="text-xs text-zinc-500 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                <span>
                  We&apos;ll email a signed PDF copy to {ctx.email}
                </span>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-amber-400 text-black px-8 py-3.5 rounded-full font-bold hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
              >
                Sign &amp; continue to intake
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          <div className="mt-10 grid md:grid-cols-3 gap-4">
            <Reassurance
              icon={<Shield className="w-5 h-5" />}
              title="Legally binding"
              body="Typed signatures are recognized under the U.S. ESIGN Act and California UETA."
            />
            <Reassurance
              icon={<Check className="w-5 h-5" />}
              title="You keep a copy"
              body="A signed PDF lands in your inbox right after you submit."
            />
            <Reassurance
              icon={<Lock className="w-5 h-5" />}
              title="Your data is secure"
              body="Signature, timestamp, and document version stored with full audit trail."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Reassurance({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-[#0d1628] border border-white/10 rounded-xl p-5">
      <div className="flex items-center gap-2 text-amber-400 mb-1.5">
        {icon}
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <p className="text-zinc-400 text-sm">{body}</p>
    </div>
  );
}
