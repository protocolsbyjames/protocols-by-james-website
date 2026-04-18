"use client";
import { useState } from "react";
import { BookOpen, Clock, PlayCircle, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

const categories = [
  "All",
  "Fat Loss",
  "Training",
  "Bloodwork",
  "Peptides",
  "Lifestyle",
  "Nutrition",
];

const articles: {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  type: "article" | "video" | "guide";
}[] = [
  {
    slug: "truth-about-fat-loss",
    title: "The Truth About Fat Loss No One Tells You",
    category: "Fat Loss",
    readTime: "5 min",
    excerpt:
      "Why most people fail at fat loss and the simple framework that actually works. Covers calorie math, adherence, and the psychology behind sustainable cuts.",
    type: "article",
  },
  {
    slug: "build-muscle-after-30",
    title: "How to Build Muscle After 30",
    category: "Training",
    readTime: "7 min",
    excerpt:
      "Age is not the limiting factor you think it is. Recovery changes, volume tolerance shifts, but muscle growth is still very much on the table if you train smart.",
    type: "article",
  },
  {
    slug: "bloodwork-101",
    title: "Bloodwork 101: What to Test and Why",
    category: "Bloodwork",
    readTime: "8 min",
    excerpt:
      "The essential markers every man should be tracking for optimal health. Testosterone, thyroid, metabolic panels, and what the numbers actually mean.",
    type: "guide",
  },
  {
    slug: "peptides-beginners-guide",
    title: "Peptides Explained: A Beginner's Guide",
    category: "Peptides",
    readTime: "6 min",
    excerpt:
      "What peptides are, how they work, and how to evaluate whether they fit your goals. Covers BPC-157, GHK-Cu, Ipamorelin, and more.",
    type: "guide",
  },
  {
    slug: "morning-routine",
    title: "Morning Routine for Peak Performance",
    category: "Lifestyle",
    readTime: "4 min",
    excerpt:
      "The non-negotiable habits that set the tone for a productive day. Covers sleep quality, morning movement, nutrition timing, and mindset.",
    type: "article",
  },
  {
    slug: "progressive-overload",
    title: "Progressive Overload: The Only Rule That Matters",
    category: "Training",
    readTime: "5 min",
    excerpt:
      "If you are not progressing, you are not growing. How to structure your training so you are consistently adding stimulus over time.",
    type: "article",
  },
  {
    slug: "reconstitution-guide",
    title: "How to Reconstitute Peptides (Step by Step)",
    category: "Peptides",
    readTime: "6 min",
    excerpt:
      "A clear walkthrough of the reconstitution process. Covers bacteriostatic water, sterile technique, storage, and common mistakes to avoid.",
    type: "guide",
  },
  {
    slug: "macro-tracking-basics",
    title: "Macro Tracking Without Losing Your Mind",
    category: "Nutrition",
    readTime: "5 min",
    excerpt:
      "How to track macros in a way that is sustainable long-term. Covers protein targets, flexible dieting, and when to stop weighing everything.",
    type: "article",
  },
  {
    slug: "cutting-vs-bulking",
    title: "Cutting vs. Bulking: When to Do What",
    category: "Fat Loss",
    readTime: "6 min",
    excerpt:
      "How to decide whether you should be in a surplus or a deficit based on your current body composition, goals, and training experience.",
    type: "article",
  },
  {
    slug: "supplement-stack",
    title: "The Only Supplements Worth Taking",
    category: "Lifestyle",
    readTime: "5 min",
    excerpt:
      "Most supplements are a waste of money. Here are the few that actually move the needle backed by research and real-world results.",
    type: "article",
  },
  {
    slug: "training-splits",
    title: "Choosing the Right Training Split",
    category: "Training",
    readTime: "7 min",
    excerpt:
      "PPL, Upper/Lower, Bro Split, Full Body. Which one is best for your experience level, schedule, and goals. Spoiler: it depends.",
    type: "guide",
  },
  {
    slug: "peptide-calculator-guide",
    title: "How to Use a Peptide Calculator",
    category: "Peptides",
    readTime: "4 min",
    excerpt:
      "Understanding units, mg, mcg, and mL conversions so you can dose accurately every time. Pairs with our free Peptide Calculator tool.",
    type: "guide",
  },
];

function TypeIcon({ type }: { type: string }) {
  if (type === "video")
    return <PlayCircle className="w-3.5 h-3.5 text-amber-400" />;
  if (type === "guide")
    return <FileText className="w-3.5 h-3.5 text-amber-400" />;
  return <BookOpen className="w-3.5 h-3.5 text-amber-400" />;
}

export default function ContentPage() {
  const [active, setActive] = useState("All");
  const filtered =
    active === "All" ? articles : articles.filter((p) => p.category === active);

  return (
    <main className="min-h-screen bg-[#0b1227] text-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm">
            Learn
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6">
            Content & Resources
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Deep dives into training, nutrition, peptides, bloodwork, and
            everything self-optimization. Real information, no fluff.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  active === cat
                    ? "bg-amber-400 text-black"
                    : "bg-white/5 text-zinc-400 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <Link
                href={`/content/${post.slug}`}
                key={post.slug}
                className="bg-[#0d1628] border border-zinc-800 rounded-2xl p-6 hover:border-amber-400/30 transition-colors group block"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                  <span className="text-xs text-zinc-600 flex items-center gap-1 ml-auto">
                    <TypeIcon type={post.type} />
                    {post.type === "guide"
                      ? "Guide"
                      : post.type === "video"
                      ? "Video"
                      : "Article"}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-zinc-400 text-sm mb-4">{post.excerpt}</p>
                <span className="text-amber-400 text-sm font-medium flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  Read Now
                </span>
              </Link>
            ))}
          </div>

          {/* Tools Callout */}
          <div className="mt-16 rounded-2xl border border-zinc-800 bg-[#0d1628] p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  Free Tools
                </h3>
                <p className="text-zinc-400 text-sm">
                  Use our free Peptide Calculator to figure out exact syringe
                  draws based on your vial size, water volume, and desired
                  dose. No sign-up required.
                </p>
              </div>
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 bg-amber-400 text-black px-6 py-3 rounded-md font-semibold hover:bg-amber-500 transition-colors flex-shrink-0"
              >
                Peptide Calculator <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Academy Callout */}
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-[#0d1628] p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  Peptide Academy
                </h3>
                <p className="text-zinc-400 text-sm">
                  Video tutorials covering how to fill cartridges, reconstitute
                  peptides, swap out old cartridges, and convert units. Access
                  with a code from our socials.
                </p>
              </div>
              <Link
                href="/academy"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-md font-semibold hover:bg-white/20 transition-colors flex-shrink-0"
              >
                Enter Academy <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
