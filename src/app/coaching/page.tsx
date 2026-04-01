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
      <section className="py-20 px-6 bg-zinc-950">
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