"use client";
import { validateAccessCode } from "./actions";
import { useState } from "react";
import { Search } from "lucide-react";

export default function AcademyPage() {
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("code", codeInput);

    const result = await validateAccessCode(formData);
    if (result?.error) {
      setError(result.error);
    }
  };

  const videoTopics = [
    {
      title: "How to Fill a Cartridge",
      description: "Learn the proper technique for filling a peptide cartridge safely and accurately.",
      icon: "Syringe",
    },
    {
      title: "How to Reconstitute",
      description: "Step-by-step guide to reconstituting your peptide powder correctly.",
      icon: "FlaskConical",
    },
    {
      title: "How to Swap Out Old Cartridge",
      description: "Master the process of replacing a used cartridge with a fresh one.",
      icon: "RefreshCw",
    },
    {
      title: "How to Convert Units to mg/cc/mL",
      description: "Understand conversions and calculations for accurate dosing.",
      icon: "Calculator",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0b1227] text-white">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm">
            Educational Content
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6">
            Peptide Academy
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Master the fundamentals of peptide protocols with video tutorials covering everything from reconstitution to dosing conversions.
          </p>
        </div>
      </section>

      <section className="pb-20 px-6 bg-[#0d1628]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What's Included
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Four comprehensive video tutorials covering essential peptide knowledge.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {videoTopics.map((topic) => (
              <div
                key={topic.title}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-amber-400/30 transition-colors"
              >
                <h3 className="text-xl font-bold mb-2">{topic.title}</h3>
                <p className="text-zinc-400 text-sm">{topic.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-12">
            <p className="text-zinc-400 text-sm mb-2">Coming Soon</p>
            <p className="text-amber-400 font-semibold">
              $9.99 + $5.99/mo
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enter Your Access Code
            </h2>
            <p className="text-zinc-400">
              Already have access? Enter your code to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                placeholder="Enter your access code"
                className="w-full px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-300 transition-colors"
                aria-label="Submit"
              >
                <Search size={20} />
              </button>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-amber-400 text-black font-bold hover:bg-amber-300 transition-colors"
            >
              Access Academy
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500 mt-8">
            Don't have an access code?{" "}
            <a href="/contact" className="text-amber-400 hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
