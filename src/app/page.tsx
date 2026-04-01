import Link from "next/link";
import { ArrowRight, Dumbbell, Flame, Brain, TrendingUp, CheckCircle } from "lucide-react";

const services = [
  { icon: Flame, title: "Fat Loss", desc: "Strategic protocols to drop body fat while preserving muscle and energy." },
  { icon: Dumbbell, title: "Muscle Building", desc: "Progressive training systems designed for maximum hypertrophy." },
  { icon: Brain, title: "Looks & Confidence", desc: "Optimize your appearance, mindset, and self-perception." },
  { icon: TrendingUp, title: "Performance", desc: "Enhance energy, focus, and physical output across every area of life." },
];

const testimonials = [
  { name: "Client A", result: "Lost 30lbs in 16 weeks", quote: "James completely changed how I approach fitness. The accountability and structure made all the difference." },
  { name: "Client B", result: "Gained 15lbs of muscle", quote: "The programming is next level. Every detail is dialed in — training, nutrition, everything." },
  { name: "Client C", result: "Best shape at 35", quote: "I thought my best days were behind me. James proved me wrong. I look and feel better than my 20s." },
];

const protocolIncludes = [
  "Personalized training program",
  "Custom nutrition plan",
  "Weekly check-ins & adjustments",
  "Protocol guidance & optimization",
  "Lifestyle & habit coaching",
  "Direct access to James",
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-6">
            Physique & Self-Optimization
          </p>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Build your best self — <br />
            <span className="gradient-text">physique, confidence, and performance.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Personalized coaching through training, nutrition, and protocols 
            designed to transform how you look, feel, and perform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/coaching"
              className="bg-white text-black px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-2"
            >
              Apply for Coaching <ArrowRight size={20} />
            </Link>
            <Link
              href="/coaching#programs"
              className="border border-white/20 text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-white/5 transition-colors inline-flex items-center justify-center"
            >
              View Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Authority */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-4">Why Work With Me</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Not another cookie-cutter coach.
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-16">
            I&apos;ve spent years refining my approach to physique development and self-optimization. 
            Every protocol is built from real experience, real results, and real science — 
            not recycled templates.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 card-hover">
              <div className="text-4xl font-bold mb-2">100+</div>
              <p className="text-gray-400">Clients transformed</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 card-hover">
              <div className="text-4xl font-bold mb-2">5+ Years</div>
              <p className="text-gray-400">Coaching experience</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 card-hover">
              <div className="text-4xl font-bold mb-2">1-on-1</div>
              <p className="text-gray-400">Personalized approach</p>
            </div>
          </div>
        </div>
      </section>

      {/* What I Help With */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-4">What I Help With</p>
            <h2 className="text-3xl md:text-5xl font-bold">
              Four pillars of transformation.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white/5 border border-white/10 rounded-xl p-8 card-hover"
              >
                <service.icon className="text-white mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-400">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocols by James */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-4">The System</p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Protocols by James
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Not a generic program — a complete coaching system built around you.
                Every training plan, nutrition protocol, and lifestyle adjustment is 
                personalized to your goals, your body, and your life.
              </p>
              <Link
                href="/coaching"
                className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
              >
                Learn More <ArrowRight size={18} />
              </Link>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="text-lg font-semibold mb-6">What&apos;s Included</h3>
              <div className="space-y-4">
                {protocolIncludes.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-400 shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-4">Results</p>
            <h2 className="text-3xl md:text-5xl font-bold">
              Real people. Real results.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white/5 border border-white/10 rounded-xl p-8 card-hover"
              >
                <div className="text-sm font-semibold text-green-400 mb-2">{t.result}</div>
                <p className="text-gray-300 mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-sm text-gray-500 font-medium">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to build your best self?
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Stop guessing. Get a proven system, real accountability, and a coach 
            who&apos;s been in your shoes. Applications are open.
          </p>
          <Link
            href="/coaching"
            className="bg-white text-black px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-2"
          >
            Apply for Coaching <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
