"use client";
import { ArrowRight, Shield, Flame, Brain, Dumbbell, Heart, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const values = [
  {
    icon: Shield,
    title: "Discipline Over Motivation",
    desc: "Motivation fades. Systems and discipline are what create lasting transformation. I build frameworks you can rely on when motivation disappears.",
  },
  {
    icon: Flame,
    title: "Optimize Everything",
    desc: "Training, nutrition, recovery, mindset. Every variable matters when you are building your best self. Nothing gets left to chance.",
  },
  {
    icon: Brain,
    title: "Knowledge Is Power",
    desc: "I believe in educating my clients, not just telling them what to do. Understanding the why behind every decision changes everything.",
  },
];

const timeline = [
  {
    icon: Dumbbell,
    year: "The Beginning",
    title: "Where it started",
    desc: "At 230+ pounds, unhappy with what I saw in the mirror every morning. Training hard but eating whatever, following random programs, going nowhere.",
  },
  {
    icon: TrendingUp,
    year: "The Shift",
    title: "Building real systems",
    desc: "Stopped looking for shortcuts and started treating transformation like a science. Dove into training methodology, nutrition science, bloodwork, and recovery protocols.",
  },
  {
    icon: Heart,
    year: "The Results",
    title: "More than physical",
    desc: "The physique changed, but so did everything else. More confidence, more energy, more clarity. That is when I realized this was about building a better life.",
  },
  {
    icon: Shield,
    year: "The Mission",
    title: "Protocols by James",
    desc: "Started coaching friends, then clients. Saw the same patterns everywhere: smart, motivated people held back by bad information and no real system. So I built one.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0b1227] text-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm">
            About
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6">
            The Story Behind the Protocols
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            How a personal transformation turned into a mission to help others
            build their best selves.
          </p>
        </div>
      </section>

      {/* Photo + Intro */}
      <section className="py-20 px-6 bg-[#0d1628]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden">
            <Image
              src="/testimonials/james-transformation.JPG"
              alt="James Quilter before and after transformation"
              width={900}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              I did not start with the answers.
            </h2>
            <div className="space-y-4 text-zinc-400 leading-relaxed">
              <p>
                Like most people, I spent years spinning my wheels. Following
                generic programs, falling for supplement hype, and wondering
                why nothing seemed to stick. At 230+ I felt like complete
                crap and was not happy with what I was waking up to in the
                mirror every day.
              </p>
              <p>
                The turning point came when I stopped looking for shortcuts
                and started treating self-optimization like a science. I dove
                deep into training methodology, nutrition science, bloodwork
                analysis, and recovery protocols. I experimented on myself,
                tracked everything, and slowly built a system that actually
                worked.
              </p>
              <p>
                The results spoke for themselves. Not just physically, but
                mentally. More confidence. More energy. More clarity. That is
                when everything changed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            The Journey
          </h2>
          <div className="space-y-12">
            {timeline.map((item, i) => (
              <div key={item.title} className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-amber-400/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="w-px h-12 bg-zinc-800 mx-auto mt-3" />
                  )}
                </div>
                <div>
                  <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
                    {item.year}
                  </span>
                  <h3 className="text-xl font-bold mt-1 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 px-6 bg-[#0d1628]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            My Philosophy
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Sets Me Apart */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Makes This Different
          </h2>
          <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
            <p>
              Most coaches hand you a template and call it personalized. I
              build every protocol from scratch based on a detailed
              questionnaire about your goals, training history, lifestyle,
              and preferences. No two clients get the same plan.
            </p>
            <p>
              I also do not just hand you a plan and disappear. Weekly
              check-ins, real-time adjustments, and direct access to me
              means your program evolves as you do. What works in week 1
              is not what you need in week 8.
            </p>
            <p>
              Everything I coach comes from real experience. I have been
              where my clients are. I know what it feels like to be stuck,
              frustrated, and ready for a change. That perspective is
              something you cannot get from a textbook.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#0d1628]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Want to Work Together?
          </h2>
          <p className="text-xl text-zinc-400 mb-10">
            If you are serious about transforming your physique and optimizing
            your life, I would love to help. Start with a free Pep-Talk or
            check out the coaching options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/coaching"
              className="inline-flex items-center gap-2 bg-amber-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-300 transition-colors"
            >
              View Coaching <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/peptalk/book"
              className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-colors"
            >
              Free Pep-Talk <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
