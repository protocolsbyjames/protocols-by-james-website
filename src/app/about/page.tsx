"use client";
import { ArrowRight, Shield, Flame, Brain } from "lucide-react";
import Link from "next/link";

const values = [
  { icon: Shield, title: "Discipline Over Motivation", desc: "Motivation fades. Systems and discipline are what create lasting transformation." },
  { icon: Flame, title: "Optimize Everything", desc: "Training, nutrition, recovery, mindset — every variable matters when you’re building your best self." },
  { icon: Brain, title: "Knowledge Is Power", desc: "I believe in educating my clients, not just telling them what to do. Understanding the why changes everything." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm">About</span>
          <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6">The Story Behind the Protocols</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">How a personal transformation turned into a mission to help others build their best selves.</p>
        </div>
      </section>
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-3xl mx-auto space-y-6 text-zinc-300 text-lg leading-relaxed">
          <p>I didn’t start out with all the answers. Like most people, I spent years spinning my wheels — following generic programs, falling for supplement hype, and wondering why nothing seemed to stick.</p>
          <p>The turning point came when I stopped looking for shortcuts and started treating self-optimization like a science. I dove deep into training methodology, nutrition science, bloodwork analysis, and recovery protocols. I experimented on myself, tracked everything, and slowly built a system that actually worked.</p>
          <p>The results spoke for themselves — not just physically, but mentally. More confidence. More energy. More clarity. I realized this wasn’t just about building a better physique. It was about building a better life.</p>
          <p>That’s when I started coaching. What began as helping a few friends quickly grew into something bigger. I saw the same patterns everywhere: smart, motivated people held back by bad information and no real system. So I built one.</p>
          <p className="text-white font-semibold text-xl">Protocols by James is the result of everything I’ve learned, tested, and refined — packaged into a coaching system that gets real results.</p>
        </div>
      </section>
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">My Philosophy</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">{v.title}</h3>
                <p className="text-zinc-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Want to Work Together?</h2>
          <p className="text-xl text-zinc-400 mb-10">If you’re serious about transforming your physique and optimizing your life, I’d love to help.</p>
          <Link href="/coaching" className="inline-flex items-center gap-2 bg-amber-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-300 transition-colors">
            View Coaching <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}