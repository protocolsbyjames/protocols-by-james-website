"use client";
import { ArrowRight, MessageCircle, Target, Zap, RefreshCw, Check } from "lucide-react";
import Link from "next/link";

const steps = [
  { icon: MessageCircle, step: "01", title: "Apply", desc: "Fill out a short application so I can understand your goals, history, and lifestyle." },
  { icon: Target, step: "02", title: "Strategy Call", desc: "We hop on a call to map out your plan and make sure we're the right fit." },
  { icon: Zap, step: "03", title: "Your Protocol", desc: "You receive your fully custom training, nutrition, and lifestyle protocol." },
  { icon: RefreshCw, step: "04", title: "Optimize & Evolve", desc: "Weekly check-ins, adjustments, and ongoing coaching to keep you progressing." },
];

const includes = [
  "Fully personalized training program",
  "Custom macro-based nutrition plan",
  "Weekly check-ins with photo & metric reviews",
  "Real-time program adjustments",
  "Protocol guidance (supplements, recovery, lifestyle)",
  "Direct messaging access to James",
  "Lifestyle & habit optimization strategies",
];

const idealFor = [
  "You want to transform your physique and stop guessing",
  "You’re ready to commit to a structured system",
  "You want expert guidance on training, nutrition, and protocols",
  "You’ve tried doing it alone and want faster, real results",
  "You want accountability and a coach who actually cares",
];

const plans = [
  {
    name: "Starter",
    price: "45.99",
    tagline: "Get into the system and start moving.",
    features: [
      "Personalized training program",
      "Custom nutrition plan",
      "Monthly check-ins",
      "App access & tracking",
    ],
  },
  {
    name: "Pro",
    price: "69.99",
    tagline: "The most popular option for serious progress.",
    featured: true,
    features: [
      "Everything in Starter",
      "Weekly check-ins with photo & metric reviews",
      "Real-time program adjustments",
      "Direct messaging access to James",
    ],
  },
  {
    name: "Elite",
    price: "129.99",
    tagline: "Maximum access, fastest results.",
    features: [
      "Everything in Pro",
      "Priority messaging & response",
      "Advanced protocol guidance (supplements, recovery, lifestyle)",
      "Lifestyle & habit optimization coaching",
    ],
  },
];

export default function CoachingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm">Work With Me</span>
          <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6">Protocols by James</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">A fully personalized coaching system designed to optimize your physique, performance, and lifestyle — from the inside out.</p>
        </div>
      </section>
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-zinc-400 text-center mb-16 max-w-xl mx-auto">A simple, proven process to get you from where you are to where you want to be.</p>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-400/20 transition-colors">
                  <s.icon className="w-7 h-7 text-amber-400" />
                </div>
                <span className="text-amber-400 font-bold text-sm">STEP {s.step}</span>
                <h3 className="text-xl font-bold mt-2 mb-2">{s.title}</h3>
                <p className="text-zinc-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">What&apos;s Included</h2>
            <div className="space-y-4">
              {includes.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">This Is For You If...</h2>
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
      <section id="pricing" className="py-20 px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm">Pricing</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">Choose Your Plan</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">Monthly subscription. Cancel anytime from your account. All plans billed in USD.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 flex flex-col ${
                  plan.featured
                    ? "border-amber-400 bg-amber-400/5"
                    : "border-zinc-800 bg-black"
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
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-zinc-400 ml-1">/ month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-zinc-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`https://app.protocolsbyjames.com/signup`}
                  className={`w-full text-center py-3 rounded-full font-bold transition-colors ${
                    plan.featured
                      ? "bg-amber-400 text-black hover:bg-amber-300"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Start {plan.name}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-3xl mx-auto text-center rounded-2xl border border-zinc-800 bg-black px-6 py-8">
            <h3 className="text-xl font-bold mb-2">Coach mentorship</h3>
            <p className="text-zinc-400 text-sm">
              For aspiring fitness coaches who want 1-on-1 mentorship. Custom
              scope and pricing based on your goals (typically $500–$5,000).{" "}
              <Link href="/contact" className="text-amber-400 hover:underline">
                Apply to learn more
              </Link>
              .
            </p>
          </div>

          <p className="mt-10 text-center text-xs text-zinc-500 max-w-xl mx-auto">
            Cancel anytime. By subscribing you agree to our{" "}
            <Link href="/terms" className="underline hover:text-zinc-300">Terms of Service</Link>,{" "}
            <Link href="/privacy" className="underline hover:text-zinc-300">Privacy Policy</Link>, and{" "}
            <Link href="/refund-policy" className="underline hover:text-zinc-300">Refund Policy</Link>.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Start?</h2>
          <p className="text-xl text-zinc-400 mb-10">Applications are open. Take the first step toward building your best self.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-amber-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-300 transition-colors">
            Apply Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}