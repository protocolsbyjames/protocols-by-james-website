"use client";

import { useState } from "react";
import { Send, Mail, AtSign, Globe } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    interest: "General Inquiry",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email me directly.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-amber-400/10 flex items-center justify-center mx-auto mb-6">
            <Send className="w-9 h-9 text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Message Sent!</h1>
          <p className="text-zinc-400 text-lg">Thanks for reaching out. I&apos;ll get back to you as soon as possible.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm">Contact</span>
          <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6">Get In Touch</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Have a question or ready to start? Drop me a message below.</p>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Interest</label>
              <select
                value={form.interest}
                onChange={(e) => setForm({...form, interest: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors"
              >
                <option>General Inquiry</option>
                <option>Coaching Application</option>
                <option>Collaboration</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors resize-none"
                placeholder="Tell me about your goals..."
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 text-black py-4 rounded-full font-bold text-lg hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}
              {!loading && <Send className="w-5 h-5" />}
            </button>
          </form>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Direct Contact</h3>
              <a href="mailto:protocolsbyjames@gmail.com" className="flex items-center gap-3 text-zinc-400 hover:text-amber-400 transition-colors">
                <Mail className="w-5 h-5" /> protocolsbyjames@gmail.com
              </a>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Along</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-3 text-zinc-400 hover:text-amber-400 transition-colors"><AtSign className="w-5 h-5" /> Instagram</a>
                <a href="#" className="flex items-center gap-3 text-zinc-400 hover:text-amber-400 transition-colors"><Globe className="w-5 h-5" /> Twitter / X</a>
              </div>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Ready for coaching?</h3>
              <p className="text-zinc-400 text-sm mb-4">Skip the form and go straight to the coaching page to learn more about Protocols by James.</p>
              <a href="/coaching" className="text-amber-400 font-medium text-sm hover:underline">View Coaching →</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
