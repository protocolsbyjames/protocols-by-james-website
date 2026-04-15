import { ArrowRight, Check, Clock, Shield } from "lucide-react";
import { submitApplication } from "./actions";

export const metadata = {
  title: "Apply · Protocols by James",
  description:
    "Start your coaching journey with James. Quick application, then on to plan selection and checkout.",
};

export default function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; plan?: string }>;
}) {
  return <ApplyPageInner searchParams={searchParams} />;
}

async function ApplyPageInner({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; plan?: string }>;
}) {
  const sp = await searchParams;
  const error = sp.error;
  const preselectedPlan = sp.plan;

  return (
    <main className="min-h-screen bg-[#0b1227] text-white">
      <section className="pt-32 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm">
            Application
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6 leading-tight">
            Let&apos;s <span className="text-amber-400">get started</span>.
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto">
            A few questions so I can understand who you are and what you&apos;re
            after. Takes about 2 minutes.
          </p>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-red-300 text-sm">
              {decodeURIComponent(error)}
            </div>
          )}

          <form
            action={submitApplication}
            className="bg-[#0d1628] border border-white/10 rounded-2xl p-8 md:p-10 space-y-6"
          >
            {preselectedPlan && (
              <input type="hidden" name="plan" value={preselectedPlan} />
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Full legal name" name="fullName" required placeholder="Jane Doe" />
              <Field
                label="Preferred name (optional)"
                name="preferredName"
                placeholder="What should I call you?"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Field
                label="Email"
                name="email"
                type="email"
                required
                placeholder="you@email.com"
              />
              <Field
                label="Phone"
                name="phone"
                type="tel"
                required
                placeholder="(555) 555-5555"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Field
                label="Age"
                name="age"
                type="number"
                required
                min={13}
                max={120}
                placeholder="28"
              />
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Sex
                </label>
                <select
                  name="sex"
                  required
                  defaultValue=""
                  className="w-full bg-[#0b1227] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors"
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                What&apos;s your main goal?
              </label>
              <textarea
                name="goal"
                required
                rows={4}
                className="w-full bg-[#0b1227] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors resize-none"
                placeholder="Lose 25 lbs before my wedding, feel confident again, finally break through my bench press plateau — whatever it is, be specific."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-400 text-black py-4 rounded-full font-bold text-lg hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
            >
              Continue to plans
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-center text-zinc-500 text-xs">
              By continuing you&apos;ll be taken to the app to pick your plan.
              You&apos;ll sign the coaching agreement after payment, then
              finish your intake inside the app.
            </p>
          </form>

          <div className="mt-10 grid md:grid-cols-3 gap-4">
            <Reassurance
              icon={<Clock className="w-5 h-5" />}
              title="2 minutes"
              body="Application is quick. The real intake is inside the app after we&apos;re signed up."
            />
            <Reassurance
              icon={<Check className="w-5 h-5" />}
              title="Cancel any time"
              body="Monthly plans — no long-term lock-in."
            />
            <Reassurance
              icon={<Shield className="w-5 h-5" />}
              title="Your info stays private"
              body="Never shared, never sold. Stored encrypted."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  min,
  max,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full bg-[#0b1227] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors"
      />
    </div>
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
