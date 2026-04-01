"use client";
import { useState } from "react";
import { BookOpen, Clock } from "lucide-react";

const categories = ["All", "Fat Loss", "Training", "Bloodwork", "Peptides", "Lifestyle"];

const posts = [
  { title: "The Truth About Fat Loss No One Tells You", category: "Fat Loss", readTime: "5 min", excerpt: "Why most people fail at fat loss and the simple framework that actually works." },
  { title: "How to Build Muscle After 30", category: "Training", readTime: "7 min", excerpt: "Age is not the limiting factor you think it is. Here is what actually matters." },
  { title: "Bloodwork 101: What to Test and Why", category: "Bloodwork", readTime: "8 min", excerpt: "The essential markers every man should be tracking for optimal health." },
  { title: "Peptides Explained: A Beginner\u2019s Guide", category: "Peptides", readTime: "6 min", excerpt: "What peptides are, how they work, and whether they are right for you." },
  { title: "Morning Routine for Peak Performance", category: "Lifestyle", readTime: "4 min", excerpt: "The non-negotiable habits that set the tone for a productive day." },
  { title: "Progressive Overload: The Only Rule", category: "Training", readTime: "5 min", excerpt: "If you are not progressing, you are not growing. Here is how to fix that." },
];

export default function ContentPage() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? posts : posts.filter((p) => p.category === active);
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm">Learn</span>
          <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6">Content & Resources</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Deep dives into training, nutrition, protocols, and everything self-optimization.</p>
        </div>
      </section>
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActive(cat)} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${active === cat ? "bg-amber-400 text-black" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <article key={post.title} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-amber-400/30 transition-colors group cursor-pointer">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">{post.category}</span>
                  <span className="text-xs text-zinc-500 flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors">{post.title}</h3>
                <p className="text-zinc-400 text-sm mb-4">{post.excerpt}</p>
                <span className="text-amber-400 text-sm font-medium flex items-center gap-1"><BookOpen className="w-4 h-4" />Coming Soon</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}