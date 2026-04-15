"use client";
import {
  ArrowRight,
  MessageCircle,
  Target,
  Zap,
  RefreshCw,
  Check,
  X,
  Users,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: MessageCircle,
    step: "01",
    title: "Apply",
    desc: "Fill out a detailed questionnaire so I understand your goals, training history, and lifestyle.",
  },
  {
    icon: Target,
    step: "02",
    title: "Strategy",
    desc: "We map out your plan and make sure we're the right fit.",
  },
  {
    icon: Zap,
    step: "03",
    title: "Your Protocol",
    desc: "You receive a fully custom training, nutrition, and lifestyle plan built around you.",
  },
  {
    icon: RefreshCw,
    step: "04",
    title: "Optimize & Evolve",
    desc: "Weekly check-ins, adjustments, and ongoing coaching to keep you progressing.",
  },
];

const coachingIncludes = [
  "Fully personalized training program",
  "Custom macro-based nutrition plan",
  "Weekly check-ins (Performance) or unlimited (Elite)",
  "Real-time program adjustments",
  "Supplement education and optimization",
  "Direct access to James",
];

const idealFor = [
  "You want to transform your physique and stop guessing",
  "You're ready to commit to a structured system",
  "You want expert guidance on training, nutrition, and protocols",
  "You've tried doing it alone and want faster, real results",
  "You want accountability and a coach who actually cares",
];

const programs = [
  {
    name: "Shortcut to Size",
    tagline: "Muscle gain, self-guided.",
    perfectFor:
      "Building size, strength, and overall mass without coaching",
    features: [
      "Structured muscle-building workout program",
      "Muscle-gain training split",
      "Basic nutrition guidance",
      "App access & progress tracking",
      "Select partner discounts",
      "No check-ins — fully self-guided",
    ],
  },
  {
    name: "Shortcut to Shred",
    tagline: "Fat loss, self-guided.",
    perfectFor:
      "Cutting, fat loss, and getting lean without coaching",
    features: [
      "Structured fat-loss workout program",
      "Training + cardio guidance",
      "Basic nutrition guidance",
      "App access & progress tracking",
      "Select partner discounts",
      "No check-ins — fully self-guided",
    ],
  },
];

const coaching = [
  {
    name: "Performance Coaching",
    priceMonthly: "69.99",
    tagline: "1:1 coaching for serious progress.",
    perfectFor: "Staying accountable and optimizing results",
    features: [
      "Custom workout plan built for you",
      "Macro-based nutrition plan",
      "Weekly check-ins (progress tracking + adjustments)",
      "Supplement education",
      "Expanded partner discounts + early access to new deals",
    ],
  },
  {
    name: "Elite Coaching",
    priceMonthly: "129.99",
    tagline: "Maximum access, fastest results.",
    perfectFor:
      "Full optimization, fastest results, and highest level support",
    featured: true,
    features: [
      "Custom workout plan",
      "Custom meal plan + macro tracking",
      "Unlimited check-ins (priority support)",
      "Supplement education & optimization",
      "VIP community access included",
      "All promo codes, partnerships, and highest-level discounts",
    ],
  },
];

const comparisonRows: {
  label: string;
  performance: string | boolean;
  elite: string | boolean;
}[] = [
  { label: "Custom workout plan", performance: true, elite: true },
  {
    label: "Nutrition guidance",
    performance: "Macro-based plan",
    elite: "Custom meal plan",
  },
  { label: "Check-in cadence", performance: "Weekly", elite: "Unlimited" },
  { label: "Priority response", performance: false, elite: true },
  {
    label: "Supplement guidance",
    performance: "Education",
    elite: "Education + optimization",
  },
  { label: "VIP community access", performance: false, elite: true },
  {
    label: "Partner discounts",
    performance: "Expanded",
    elite: "Highest-level",
  },
];

const faqs = [
  {
    q: "What's the difference between the self-guided programs and 1:1 coaching?",
    a: "The self-guided programs (Shortcut to Size, Shortcut to Shred) give you a structured program you follow on your own through the app — no coach touching your plan. 1:1 coaching (Performance or Elite) means I build a custom plan specifically for you, adjust it weekly based on your check-ins, and you have direct access to message me.",
  },
  {
    q: "How does the $39.99 + $14.99/mo program pricing work?",
    a: "$39.99 is a one-time purchase to unlock the program. The $14.99/mo subscription keeps your app access active — that's where you get workouts, tracking, and partner discounts. Cancel the monthly anytime; you'll lose app access but keep your program purchase.",
  },
  {
    q: "Can I add the VIP community to any plan?",
    a: "Yes. VIP community is $19.99/mo on top of any plan. Elite Coaching includes it at no extra charge.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. All subscriptions are month-to-month. Cancel from your account and you'll keep access through the end of the billing period you already paid for.",
  },
  {
    q: "What if I'm a total beginner?",
    a: "For 1:1 coaching, it's actually the ideal time to start so you don't build bad habits — your plan is scaled to wherever you are today. The self-guided programs include beginner-friendly modifications if you're newer to the gym.",
  },
  {
    q: "What equipment do I need?",
    a: "For 1:1 coaching, we build your program around whatever equipment you have — full gym, home setup, or bodyweight. The self-guided programs assume standard gym access with free weights and machines.",
  },
  {
    q: "How soon will I see results?",
    a: "Strength and energy shifts usually show up in 2–3 weeks. Visible physique changes around 6–8 weeks with consistent adherence. Real transformation is a 12+ week process, which is why we obsess over sustainable habits over quick fixes.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes — full details on the Refund Policy page. Short version: 7 days from first purchase if the service isn't what you expected, case-by-case after that.",
  },
];

export default function CoachingPage() {
  return (
    <main className="min-h-screen bg-[#0b1227] text-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm">
            Work With Me
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6">
            Protocols by James
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Whether you want a structured program to follow on your own or
            full 1:1 coaching — every plan is built around you and your
            goals. No cookie-cutter.
          </p>
        </div>
      </section>

      {/* SELF-GUIDED PROGRAMS */}
      <section id="programs" className="py-20 px-6 bg-[#0d1628]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm">
              Programs
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
              Self-Guided Programs
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Structured, proven programs you follow on your own through the
              app. No coaching, no check-ins — just the system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {programs.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl border border-zinc-800 bg-[#0b1227] p-8 flex flex-col"
              >
                <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
                <p className="text-zinc-400 text-sm mb-6">{p.tagline}</p>

                <div className="mb-2">
                  <span className="text-5xl font-bold">$39.99</span>
                  <span className="text-zinc-400 ml-2 text-sm">
                    one-time program
                  </span>
                </div>
                <div className="mb-6 text-zinc-400 text-sm">
                  + <span className="text-white font-semibold">$14.99</span>
                  /mo app access
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-zinc-300">{f}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-zinc-500 mb-4">
                  <span className="font-semibold text-zinc-400">
                    Perfect for:
                  </span>{" "}
                  {p.perfectFor}
                </p>

                <a
                  href={`https://app.protocolsbyjames.com/signup`}
                  className="w-full text-center py-3 rounded-full font-bold bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  Get {p.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW 1:1 WORKS */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm">
              1:1 Coaching Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              How It Works
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              A proven process to get you from where you are to where you
              want to be.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-400/20 transition-colors">
                  <s.icon className="w-7 h-7 text-amber-400" />
                </div>
                <span className="text-amber-400 font-bold text-sm">
                  STEP {s.step}
                </span>
                <h3 className="text-xl font-bold mt-2 mb-2">{s.title}</h3>
                <p className="text-zinc-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED / FOR YOU IF */}
      <section className="py-20 px-6 bg-[#0d1628]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              What&apos;s Included in 1:1
            </h2>
            <div className="space-y-4">
              {coachingIncludes.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              This Is For You If...
            </h2>
            <div className="space-y-4">
              {idealFor.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 1:1 COACHING PRICING */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm">
              1:1 Coaching
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
              Choose Your Coaching Tier
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Every plan is custom-built from a detailed questionnaire —
              goals, lifestyle, training experience, preferences. No
              cookie-cutter plans. Ever.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {coaching.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 flex flex-col ${
                  plan.featured
                    ? "border-amber-400 bg-amber-400/5"
                    : "border-zinc-800 bg-[#0d1628]"
                }`}
              >
                {plan.featured && (
                  <span className="self-start mb-4 text-xs font-bold text-black bg-amber-400 px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-zinc-400 text-sm mb-6">{plan.tagline}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold">
                    ${plan.priceMonthly}
                  </span>
                  <span className="text-zinc-400 ml-1">/ month</span>
                </div>
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-zinc-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-zinc-500 mb-4">
                  <span className="font-semibold text-zinc-400">
                    Perfect for:
                  </span>{" "}
                  {plan.perfectFor}
                </p>
                <Link
                  href={`/apply?plan=${encodeURIComponent(plan.name)}`}
                  className={`w-full text-center py-3 rounded-full font-bold transition-colors block ${
                    plan.featured
                      ? "bg-amber-400 text-black hover:bg-amber-300"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Start {plan.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Comparison table — Performance vs Elite */}
          <div className="hidden md:block mt-16 overflow-hidden rounded-2xl border border-zinc-800 bg-[#0d1628] max-w-4xl mx-auto">
            <div className="px-6 py-4 border-b border-zinc-800">
              <h3 className="text-lg font-bold">
                Performance vs. Elite — side by side
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="text-left font-medium px-6 py-3">
                    Feature
                  </th>
                  <th className="text-center font-medium px-4 py-3">
                    Performance
                  </th>
                  <th className="text-center font-medium px-4 py-3 text-amber-400">
                    Elite
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-zinc-900 last:border-b-0"
                  >
                    <td className="px-6 py-3 text-zinc-300">{row.label}</td>
                    {(["performance", "elite"] as const).map((tier) => {
                      const val = row[tier];
                      return (
                        <td
                          key={tier}
                          className="text-center px-4 py-3"
                        >
                          {typeof val === "boolean" ? (
                            val ? (
                              <Check className="w-4 h-4 text-amber-400 inline" />
                            ) : (
                              <X className="w-4 h-4 text-zinc-600 inline" />
                            )
                          ) : (
                            <span className="text-zinc-300">{val}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* VIP COMMUNITY ADD-ON */}
          <div className="mt-16 max-w-3xl mx-auto rounded-2xl border border-zinc-800 bg-[#0d1628] p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">
                  VIP Community
                  <span className="ml-3 text-sm font-normal text-amber-400">
                    $19.99/mo add-on
                  </span>
                </h3>
                <p className="text-zinc-400 text-sm">
                  A private community of like-minded people on the same
                  journey — network, share progress, access exclusive
                  content and Q&amp;As.{" "}
                  <span className="text-white font-semibold">
                    Included free with Elite Coaching.
                  </span>{" "}
                  Add it to any other plan for $19.99/mo.
                </p>
              </div>
            </div>
          </div>

          {/* COACH MENTORSHIP */}
          <div className="mt-8 max-w-3xl mx-auto text-center rounded-2xl border border-zinc-800 bg-[#0d1628] px-6 py-8">
            <h3 className="text-xl font-bold mb-2">Coach mentorship</h3>
            <p className="text-zinc-400 text-sm">
              For aspiring fitness coaches who want 1-on-1 mentorship.
              Custom scope and pricing based on your goals (typically
              $500–$5,000).{" "}
              <Link
                href="/contact"
                className="text-amber-400 hover:underline"
              >
                Apply to learn more
              </Link>
              .
            </p>
          </div>

          <p className="mt-10 text-center text-xs text-zinc-500 max-w-xl mx-auto">
            Cancel anytime. By subscribing you agree to our{" "}
            <Link
              href="/terms"
              className="underline hover:text-zinc-300"
            >
              Terms of Service
            </Link>
            ,{" "}
            <Link
              href="/privacy"
              className="underline hover:text-zinc-300"
            >
              Privacy Policy
            </Link>
            , and{" "}
            <Link
              href="/refund-policy"
              className="underline hover:text-zinc-300"
            >
              Refund Policy
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-[#0d1628]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm">
              FAQ
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4">
              Common questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-zinc-800 bg-[#0b1227] px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between text-left font-semibold text-white">
                  {item.q}
                  <span className="ml-4 text-amber-400 transition-transform group-open:rotate-45 text-2xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-zinc-400 text-sm leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Start?
          </h2>
          <p className="text-xl text-zinc-400 mb-10">
            Every plan is built around you. No cookie-cutter programs.
            Applications are open.
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 bg-amber-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-300 transition-colors"
          >
            Apply Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
