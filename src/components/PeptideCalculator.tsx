"use client";

import { useState, useMemo } from "react";
import { Calculator, AlertTriangle } from "lucide-react";

const SYRINGE_OPTIONS = [
  { label: "0.3 mL", value: 0.3, units: 30 },
  { label: "0.5 mL", value: 0.5, units: 50 },
  { label: "1.0 mL", value: 1.0, units: 100 },
];

const VIAL_OPTIONS = [
  { label: "5 mg", value: 5 },
  { label: "10 mg", value: 10 },
  { label: "15 mg", value: 15 },
];

const WATER_OPTIONS = [
  { label: "1 mL", value: 1 },
  { label: "2 mL", value: 2 },
  { label: "3 mL", value: 3 },
  { label: "5 mL", value: 5 },
];

const DOSE_OPTIONS = [
  { label: "50 mcg", value: 50 },
  { label: "100 mcg", value: 100 },
  { label: "250 mcg", value: 250 },
  { label: "500 mcg", value: 500 },
];

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
        selected
          ? "bg-amber-400 text-[#0b1227] shadow-lg shadow-amber-400/20"
          : "bg-white/5 text-zinc-300 border border-white/10 hover:border-amber-400/40 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

export default function PeptideCalculator() {
  const [syringeVolume, setSyringeVolume] = useState<number | null>(null);
  const [vialMg, setVialMg] = useState<number | null>(null);
  const [vialCustom, setVialCustom] = useState("");
  const [showVialCustom, setShowVialCustom] = useState(false);
  const [waterMl, setWaterMl] = useState<number | null>(null);
  const [waterCustom, setWaterCustom] = useState("");
  const [showWaterCustom, setShowWaterCustom] = useState(false);
  const [doseMcg, setDoseMcg] = useState<number | null>(null);
  const [doseCustom, setDoseCustom] = useState("");
  const [showDoseCustom, setShowDoseCustom] = useState(false);

  const effectiveVial = showVialCustom ? parseFloat(vialCustom) || null : vialMg;
  const effectiveWater = showWaterCustom
    ? parseFloat(waterCustom) || null
    : waterMl;
  const effectiveDose = showDoseCustom
    ? parseFloat(doseCustom) || null
    : doseMcg;

  const result = useMemo(() => {
    if (!syringeVolume || !effectiveVial || !effectiveWater || !effectiveDose) {
      return null;
    }

    const concentrationMgPerMl = effectiveVial / effectiveWater;
    const doseMg = effectiveDose / 1000;
    const doseMl = doseMg / concentrationMgPerMl;
    const syringeUnits = doseMl * 100; // 1 mL = 100 units on insulin syringe
    const syringeMax =
      SYRINGE_OPTIONS.find((s) => s.value === syringeVolume)?.units ?? 100;

    return {
      doseMl: doseMl.toFixed(3),
      syringeUnits: Math.round(syringeUnits * 10) / 10,
      syringeMax,
      overCapacity: syringeUnits > syringeMax,
      concentrationMgPerMl: concentrationMgPerMl.toFixed(2),
    };
  }, [syringeVolume, effectiveVial, effectiveWater, effectiveDose]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Peptide Calculator</h2>
          <p className="text-zinc-400 text-sm">
            Calculate your exact syringe draw for accurate dosing.
          </p>
        </div>
      </div>

      {/* Step 1: Syringe Volume */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-zinc-300 mb-3">
          1. What is the total volume of your syringe?
        </label>
        <div className="flex flex-wrap gap-3">
          {SYRINGE_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              selected={syringeVolume === opt.value}
              onClick={() => setSyringeVolume(opt.value)}
            />
          ))}
        </div>
      </div>

      {/* Step 2: Vial Quantity */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-zinc-300 mb-3">
          2. Select peptide vial quantity
        </label>
        <div className="flex flex-wrap gap-3">
          {VIAL_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              selected={!showVialCustom && vialMg === opt.value}
              onClick={() => {
                setVialMg(opt.value);
                setShowVialCustom(false);
                setVialCustom("");
              }}
            />
          ))}
          <OptionButton
            label="Other"
            selected={showVialCustom}
            onClick={() => {
              setShowVialCustom(true);
              setVialMg(null);
            }}
          />
        </div>
        {showVialCustom && (
          <div className="mt-3">
            <input
              type="number"
              placeholder="Enter vial quantity (mg)"
              value={vialCustom}
              onChange={(e) => setVialCustom(e.target.value)}
              className="w-full max-w-xs bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50"
            />
          </div>
        )}
      </div>

      {/* Step 3: Bacteriostatic Water */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-zinc-300 mb-3">
          3. How much bacteriostatic water are you adding?
        </label>
        <div className="flex flex-wrap gap-3">
          {WATER_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              selected={!showWaterCustom && waterMl === opt.value}
              onClick={() => {
                setWaterMl(opt.value);
                setShowWaterCustom(false);
                setWaterCustom("");
              }}
            />
          ))}
          <OptionButton
            label="Other"
            selected={showWaterCustom}
            onClick={() => {
              setShowWaterCustom(true);
              setWaterMl(null);
            }}
          />
        </div>
        {showWaterCustom && (
          <div className="mt-3">
            <input
              type="number"
              placeholder="Enter water amount (mL)"
              value={waterCustom}
              onChange={(e) => setWaterCustom(e.target.value)}
              className="w-full max-w-xs bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50"
            />
          </div>
        )}
      </div>

      {/* Step 4: Dose */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-zinc-300 mb-3">
          4. How much peptide do you want in each dose?
        </label>
        <div className="flex flex-wrap gap-3">
          {DOSE_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              selected={!showDoseCustom && doseMcg === opt.value}
              onClick={() => {
                setDoseMcg(opt.value);
                setShowDoseCustom(false);
                setDoseCustom("");
              }}
            />
          ))}
          <OptionButton
            label="Other"
            selected={showDoseCustom}
            onClick={() => {
              setShowDoseCustom(true);
              setDoseMcg(null);
            }}
          />
        </div>
        {showDoseCustom && (
          <div className="mt-3">
            <input
              type="number"
              placeholder="Enter dose (mcg)"
              value={doseCustom}
              onChange={(e) => setDoseCustom(e.target.value)}
              className="w-full max-w-xs bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50"
            />
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div
          className={`rounded-xl p-6 ${
            result.overCapacity
              ? "bg-red-500/10 border border-red-500/30"
              : "bg-amber-400/10 border border-amber-400/30"
          }`}
        >
          {result.overCapacity ? (
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-bold text-lg mb-1">
                  Syringe volume is not sufficient
                </p>
                <p className="text-zinc-400 text-sm">
                  Your dose of {effectiveDose} mcg requires{" "}
                  {result.syringeUnits} units ({result.doseMl} mL), which
                  exceeds your {syringeVolume} mL syringe capacity of{" "}
                  {result.syringeMax} units. Try a larger syringe, more
                  bacteriostatic water, or a smaller dose.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-zinc-400 text-sm mb-2">
                To have a dose of{" "}
                <span className="text-white font-semibold">
                  {effectiveDose} mcg
                </span>
                , pull the syringe to:
              </p>
              <p className="text-amber-400 text-4xl font-bold mb-1">
                {result.syringeUnits} units
              </p>
              <p className="text-zinc-500 text-sm">
                ({result.doseMl} mL &middot; Concentration:{" "}
                {result.concentrationMgPerMl} mg/mL)
              </p>
            </div>
          )}
        </div>
      )}

      {!result && (
        <div className="rounded-xl p-6 bg-white/[0.02] border border-white/5 text-center">
          <p className="text-zinc-500 text-sm">
            Select all four values above to see your result.
          </p>
        </div>
      )}
    </div>
  );
}
