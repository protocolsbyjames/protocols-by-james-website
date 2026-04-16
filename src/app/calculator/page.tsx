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

      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-4">How It Works</h2>
            <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
              <p>
                This calculator determines how far to pull your insulin syringe based on the concentration of your reconstituted peptide. The math is straightforward: your peptide amount (mg) divided by the water volume (mL) gives you the concentration, then your desired dose is converted to the matching syringe units.
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
    </main>
  );
}
