import Link from "next/link";
import { Phone, Check, MessageCircle, Clock, Calendar, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Free Pep-Talk · Protocols by James",
  description:
    "Book a free 20-minute Pep-Talk with James. No pressure, no pitch — just a real conversation about your goals and what it would take to hit them.",
};

const BOOKING_URL = "/peptalk/book";

export default function PeptalkPage() {
  return (
    <main className="min-h-screen bg-[#0b1227] text-white">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-amber-400 font-semibold tracking-wider uppercase text-xs">
              100% Free · No Pitch
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Book a <span className="text-amber-400">free Pep-Talk</span>.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto">
            20 minutes. Me and you. No slides, no sales script. Just a real conversation about
            where you&apos;re stuck and what it would actually take to break through.
          </p>
        </div>
      </section>

      {/* What is a peptalk */}
      <section className="py-16 px-6 bg-[#0d1628]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm">
              What&apos;s a Pep-Talk?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">A real talk, not a sales call.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#0b1227] border border-zinc-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">You bring</h3>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex gap-3">
                  <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span>One thing you&apos;re stuck on — fat loss, energy, confidence, training plateau, whatever it is.</span>
                </li>
                <li className="flex gap-3">
                  <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Honesty about what you&apos;ve already tried.</span>
                </li>
                <li className="flex gap-3">
                  <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Any questions you&apos;ve been sitting on.</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#0b1227] border border-zinc-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">I bring</h3>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex gap-3">
                  <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span>8+ years in the trenches and 50+ transformations of context.</span>
                </li>
                <li className="flex gap-3">
                  <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Straight answers — no hedging, no upsell.</span>
                </li>
                <li className="flex gap-3">
                  <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span>A clear read on whether what you&apos;re doing is actually working.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm">
              How it works
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">Three steps. That&apos;s it.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Step
              n="01"
              icon={<Calendar className="w-6 h-6" />}
              title="Pick a time"
              body="Grab any 20-minute slot on my calendar that works for you."
            />
            <Step
              n="02"
              icon={<Phone className="w-6 h-6" />}
              title="Jump on the call"
              body="Video or phone, your choice. I&apos;ll send a link the morning of."
            />
            <Step
              n="03"
              icon={<MessageCircle className="w-6 h-6" />}
              title="Walk away with clarity"
              body="You leave with real feedback on your situation — no strings."
            />
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#0b1227] via-[#0d1628] to-[#0b1227]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#0d1628] border border-amber-400/30 rounded-3xl p-10 md:p-12 text-center">
            <div className="inline-flex items-center gap-2 text-amber-400 mb-4">
              <Clock className="w-5 h-5" />
              <span className="font-semibold tracking-wider uppercase text-sm">
                20 min · free · honest
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to <span className="text-amber-400">talk</span>?
            </h2>
            <p className="text-lg text-zinc-400 mb-8 max-w-xl mx-auto">
              Book your Pep-Talk below. If nothing on the calendar works, reach out directly
              and we&apos;ll find a time.
            </p>
            <Link
              href={BOOKING_URL}
              className="inline-flex items-center gap-2 bg-amber-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-300 transition-colors"
            >
              Book your free Pep-Talk
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-zinc-500 text-sm mt-6">
              Prefer to write first?{" "}
              <Link href="/contact" className="text-amber-400 hover:underline">
                Send me a message
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm">
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">Straight answers.</h2>
          </div>
          <div className="space-y-4">
            <Faq q="Is this really free?">
              Yes. No credit card, no trial, no hidden upsell. I do a handful of these a week
              because I&apos;d rather meet you first than sell to a stranger.
            </Faq>
            <Faq q="Do I have to sign up for coaching after?">
              No. If we&apos;re a fit and you want to work together, I&apos;ll tell you.
              If not, I&apos;ll point you to what might help instead. Either way the 20 minutes
              are yours.
            </Faq>
            <Faq q="What if I just have questions about supplements or peptides?">
              Totally fair. Those questions live in the Pep-Talk, and for deeper protocol
              discussion I run a community with weekly breakdowns. Ask me on the call.
            </Faq>
            <Faq q="Can I bring a specific workout, blood panel, or protocol to review?">
              Yes — come prepared with anything you want a second set of eyes on. The more
              concrete, the better the call.
            </Faq>
            <Faq q="What won't you do on this call?">
              I won&apos;t diagnose, prescribe, or tell you to stop taking anything your doctor
              put you on. Pep-Talks are educational. For medical decisions, your physician runs
              point.
            </Faq>
          </div>
        </div>
      </section>
    </main>
  );
}

function Step({
  n,
  icon,
  title,
  body,
}: {
  n: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-[#0d1628] border border-zinc-800 rounded-2xl p-8 relative overflow-hidden">
      <span className="absolute top-6 right-6 text-5xl font-black text-zinc-900 select-none">
        {n}
      </span>
      <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-zinc-400">{body}</p>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group bg-[#0d1628] border border-zinc-800 rounded-2xl p-6 open:border-amber-400/40 transition-colors">
      <summary className="flex items-center justify-between cursor-pointer font-semibold text-lg list-none">
        {q}
        <span className="text-amber-400 text-2xl leading-none transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="mt-4 text-zinc-400 leading-relaxed">{children}</p>
    </details>
  );
}
