import type { ReactNode } from "react";

export default function LegalPage({
  kicker,
  title,
  lastUpdated,
  children,
}: {
  kicker: string;
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#0b1227] text-white">
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm">
            {kicker}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-4">{title}</h1>
          <p className="text-sm text-zinc-500">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="pb-32 px-6">
        <article className="max-w-3xl mx-auto space-y-8 text-zinc-300 leading-relaxed [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-4 [&_a]:text-amber-400 [&_a]:underline hover:[&_a]:text-amber-300">
          {children}
        </article>
      </section>
    </main>
  );
}
