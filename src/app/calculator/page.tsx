import type { Metadata } from "next";
import PeptideCalculator from "@/components/PeptideCalculator";

export const metadata: Metadata = {
  title: "Peptide Calculator | Protocols by James",
  description:
    "Free peptide reconstitution calculator. Calculate your exact syringe draw based on vial size, water volume, and desired dose.",
};

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-[#0b1227] text-white">
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Peptide Calculator
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Calculate your exact syringe draw for accurate peptide dosing. Select your syringe, vial size, water volume, and desired dose.
          </p>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <PeptideCalculator />
        </div>
      </section>

      <section className="pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-4">How It Works</h2>
            <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
              <p>
                This calculator determines how far to pull your insulin syringe based on the concentration of your reconstituted peptide. Your peptide amount (mg) divided by the water volume (mL) gives you the concentration, and your desired dose is converted to the matching syringe units.
              </p>
              <p>
                Insulin syringes are marked in &ldquo;units&rdquo; where 100 units equals 1 mL. A 0.3 mL syringe goes up to 30 units, a 0.5 mL syringe goes to 50 units, and a 1.0 mL syringe goes to 100 units.
              </p>
              <p>
                For best results, always use bacteriostatic water for reconstitution, store reconstituted peptides in the refrigerator, and follow sterile technique when drawing doses.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6">Quick Unit Reference</h2>

            <div className="space-y-8">
              {/* Weight Conversions */}
              <div>
                <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">Weight (mcg to mg)</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    ["1,000 mcg", "1 mg"],
                    ["500 mcg", "0.5 mg"],
                    ["250 mcg", "0.25 mg"],
                    ["100 mcg", "0.1 mg"],
                  ].map(([mcg, mg]) => (
                    <div key={mcg} className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-white font-bold text-sm">{mcg}</p>
                      <p className="text-zinc-500 text-xs my-1">=</p>
                      <p className="text-zinc-300 text-sm">{mg}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Volume Conversions */}
              <div>
                <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">Volume (mL and cc)</p>
                <p className="text-zinc-400 text-sm mb-3">
                  1 mL and 1 cc are the exact same measurement. They are always interchangeable.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    ["1 mL", "1 cc"],
                    ["0.5 mL", "0.5 cc"],
                    ["0.3 mL", "0.3 cc"],
                    ["0.1 mL", "0.1 cc"],
                  ].map(([ml, cc]) => (
                    <div key={ml} className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-white font-bold text-sm">{ml}</p>
                      <p className="text-zinc-500 text-xs my-1">=</p>
                      <p className="text-zinc-300 text-sm">{cc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Syringe Units */}
              <div>
                <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">Syringe Units (units to mL)</p>
                <p className="text-zinc-400 text-sm mb-3">
                  Insulin syringes measure in &ldquo;units.&rdquo; 100 units always equals 1 mL regardless of syringe size.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    ["100 units", "1 mL"],
                    ["50 units", "0.5 mL"],
                    ["30 units", "0.3 mL"],
                    ["10 units", "0.1 mL"],
                  ].map(([units, ml]) => (
                    <div key={units} className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-white font-bold text-sm">{units}</p>
                      <p className="text-zinc-500 text-xs my-1">=</p>
                      <p className="text-zinc-300 text-sm">{ml}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
