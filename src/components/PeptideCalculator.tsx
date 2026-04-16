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

/* ── SVG Syringe ── */
function SyringeVisual({
  fillPercent,
  units,
  maxUnits,
}: {
  fillPercent: number;
  units: number;
  maxUnits: number;
}) {
  const bodyTop = 40;
  const bodyBottom = 260;
  const bodyHeight = bodyBottom - bodyTop;
  const bodyLeft = 55;
  const bodyRight = 105;
  const bodyWidth = bodyRight - bodyLeft;
  const centerX = (bodyLeft + bodyRight) / 2;

  const clampedPercent = Math.min(Math.max(fillPercent, 0), 100);
  const fillHeight = (clampedPercent / 100) * bodyHeight;
  const fillTop = bodyBottom - fillHeight;

  const tickCount = maxUnits / 10;
  const ticks = [];
  for (let i = 0; i <= tickCount; i++) {
    const unitVal = i * 10;
    const y = bodyBottom - (i / tickCount) * bodyHeight;
    const isMajor = unitVal % (maxUnits <= 30 ? 10 : 20) === 0;
    ticks.push({ y, unitVal, isMajor });
  }

  const fillLineY = fillTop;

  return (
    <svg
      viewBox="0 0 160 310"
      className="w-full max-w-[160px] h-auto"
      role="img"
      aria-label={`Syringe filled to ${units} units`}
    >
      {/* Plunger rod */}
      <rect x={centerX - 3} y={2} width={6} height={bodyTop - 2} rx={2} fill="#555" />
      {/* Plunger handle */}
      <rect x={centerX - 18} y={0} width={36} height={8} rx={3} fill="#777" />

      {/* Barrel outer */}
      <rect
        x={bodyLeft - 2}
        y={bodyTop - 2}
        width={bodyWidth + 4}
        height={bodyHeight + 4}
        rx={4}
        fill="none"
        stroke="#555"
        strokeWidth={1.5}
      />
      {/* Barrel inner */}
      <rect
        x={bodyLeft}
        y={bodyTop}
        width={bodyWidth}
        height={bodyHeight}
        rx={3}
        fill="rgba(255,255,255,0.03)"
      />

      {/* Fill liquid */}
      {clampedPercent > 0 && (
        <rect
          x={bodyLeft + 1}
          y={fillTop}
          width={bodyWidth - 2}
          height={fillHeight}
          rx={2}
          fill="url(#liquidGradient)"
          className="transition-all duration-500 ease-out"
        />
      )}

      {/* Tick marks + labels */}
      {ticks.map(({ y, unitVal, isMajor }) => (
        <g key={unitVal}>
          <line
            x1={bodyLeft - (isMajor ? 10 : 5)}
            y1={y}
            x2={bodyLeft}
            y2={y}
            stroke={isMajor ? "#888" : "#555"}
            strokeWidth={isMajor ? 1.2 : 0.8}
          />
          {isMajor && (
            <text
              x={bodyLeft - 14}
              y={y + 3.5}
              textAnchor="end"
              fill="#999"
              fontSize={9}
              fontFamily="monospace"
            >
              {unitVal}
            </text>
          )}
        </g>
      ))}

      {/* Fill line indicator arrow */}
      {clampedPercent > 0 && clampedPercent <= 100 && (
        <g>
          <line
            x1={bodyRight + 4}
            y1={fillLineY}
            x2={bodyRight + 20}
            y2={fillLineY}
            stroke="#fbbf24"
            strokeWidth={1.5}
          />
          <polygon
            points={`${bodyRight + 4},${fillLineY} ${bodyRight + 10},${fillLineY - 3} ${bodyRight + 10},${fillLineY + 3}`}
            fill="#fbbf24"
          />
          <text
            x={bodyRight + 24}
            y={fillLineY + 4}
            fill="#fbbf24"
            fontSize={11}
            fontWeight="bold"
            fontFamily="monospace"
          >
            {units}u
          </text>
        </g>
      )}

      {/* Needle hub */}
      <rect
        x={centerX - 8}
        y={bodyBottom + 2}
        width={16}
        height={14}
        rx={2}
        fill="#666"
      />
      {/* Needle */}
      <line
        x1={centerX}
        y1={bodyBottom + 16}
        x2={centerX}
        y2={bodyBottom + 46}
        stroke="#999"
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      <defs>
        <linearGradient id="liquidGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(251, 191, 36, 0.35)" />
          <stop offset="50%" stopColor="rgba(251, 191, 36, 0.5)" />
          <stop offset="100%" stopColor="rgba(251, 191, 36, 0.35)" />
        </linearGradient>
      </defs>
    </svg>
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
  const [doseMcgInput, setDoseMcgInput] = useState("");
  const [doseMgInput, setDoseMgInput] = useState("");
  const [lastDoseSource, setLastDoseSource] = useState<"mcg" | "mg" | null>(
    null
  );

  const effectiveVial = showVialCustom
    ? parseFloat(vialCustom) || null
    : vialMg;
  const effectiveWater = showWaterCustom
    ? parseFloat(waterCustom) || null
    : waterMl;

  // Dose: mcg and mg stay in sync
  const effectiveDoseMcg = useMemo(() => {
    if (lastDoseSource === "mg") {
      const mg = parseFloat(doseMgInput);
      return mg ? mg * 1000 : null;
    }
    const mcg = parseFloat(doseMcgInput);
    return mcg || null;
  }, [doseMcgInput, doseMgInput, lastDoseSource]);

  function handleMcgChange(val: string) {
    setDoseMcgInput(val);
    setLastDoseSource("mcg");
    const num = parseFloat(val);
    if (num) {
      setDoseMgInput((num / 1000).toString());
    } else {
      setDoseMgInput("");
    }
  }

  function handleMgChange(val: string) {
    setDoseMgInput(val);
    setLastDoseSource("mg");
    const num = parseFloat(val);
    if (num) {
      setDoseMcgInput((num * 1000).toString());
    } else {
      setDoseMcgInput("");
    }
  }

  const result = useMemo(() => {
    if (
      !syringeVolume ||
      !effectiveVial ||
      !effectiveWater ||
      !effectiveDoseMcg
    ) {
      return null;
    }

    const concentrationMgPerMl = effectiveVial / effectiveWater;
    const doseMg = effectiveDoseMcg / 1000;
    const doseMl = doseMg / concentrationMgPerMl;
    const syringeUnits = doseMl * 100;
    const syringeMax =
      SYRINGE_OPTIONS.find((s) => s.value === syringeVolume)?.units ?? 100;

    return {
      doseMl: doseMl.toFixed(3),
      syringeUnits: Math.round(syringeUnits * 10) / 10,
      syringeMax,
      overCapacity: syringeUnits > syringeMax,
      concentrationMgPerMl: concentrationMgPerMl.toFixed(2),
      fillPercent: (syringeUnits / syringeMax) * 100,
    };
  }, [syringeVolume, effectiveVial, effectiveWater, effectiveDoseMcg]);

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50 text-sm";

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
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

      <div className="space-y-8">
        {/* Section 1: Syringe Volume */}
        <div className="border-b border-white/5 pb-8">
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

        {/* Section 2: Vial Quantity */}
        <div className="border-b border-white/5 pb-8">
          <label className="block text-sm font-semibold text-zinc-300 mb-3">
            2. Peptide vial quantity
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
                className={`${inputClass} max-w-xs`}
              />
            </div>
          )}
        </div>

        {/* Section 3: Bacteriostatic Water */}
        <div className="border-b border-white/5 pb-8">
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
                className={`${inputClass} max-w-xs`}
              />
            </div>
          )}
        </div>

        {/* Section 4: Dose in mcg */}
        <div className="border-b border-white/5 pb-8">
          <label className="block text-sm font-semibold text-zinc-300 mb-3">
            4. Desired dose in micrograms (mcg)
          </label>
          <input
            type="number"
            placeholder="e.g. 250"
            value={doseMcgInput}
            onChange={(e) => handleMcgChange(e.target.value)}
            className={`${inputClass} max-w-xs`}
          />
          <p className="text-zinc-500 text-xs mt-2">
            Type here or use the mg field below. They stay in sync.
          </p>
        </div>

        {/* Section 5: Dose in mg */}
        <div className="pb-2">
          <label className="block text-sm font-semibold text-zinc-300 mb-3">
            5. Desired dose in milligrams (mg)
          </label>
          <input
            type="number"
            placeholder="e.g. 0.25"
            value={doseMgInput}
            onChange={(e) => handleMgChange(e.target.value)}
            className={`${inputClass} max-w-xs`}
          />
          <p className="text-zinc-500 text-xs mt-2">
            1 mg = 1,000 mcg. Editing either field updates the other.
          </p>
        </div>
      </div>

      {/* Result with Syringe Visual */}
      <div className="mt-10">
        {result ? (
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
                    Your dose of {effectiveDoseMcg} mcg requires{" "}
                    {result.syringeUnits} units ({result.doseMl} mL), which
                    exceeds your {syringeVolume} mL syringe capacity of{" "}
                    {result.syringeMax} units. Try a larger syringe, more
                    bacteriostatic water, or a smaller dose.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Syringe graphic */}
                <div className="flex-shrink-0">
                  <SyringeVisual
                    fillPercent={result.fillPercent}
                    units={result.syringeUnits}
                    maxUnits={result.syringeMax}
                  />
                </div>

                {/* Text result */}
                <div className="text-center md:text-left">
                  <p className="text-zinc-400 text-sm mb-2">
                    To have a dose of{" "}
                    <span className="text-white font-semibold">
                      {effectiveDoseMcg} mcg ({(effectiveDoseMcg! / 1000).toFixed(
                        2
                      )}{" "}
                      mg)
                    </span>
                    , pull the syringe to:
                  </p>
                  <p className="text-amber-400 text-5xl font-bold mb-2">
                    {result.syringeUnits} units
                  </p>
                  <p className="text-zinc-500 text-sm">
                    {result.doseMl} mL &middot; Concentration:{" "}
                    {result.concentrationMgPerMl} mg/mL
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl p-6 bg-white/[0.02] border border-white/5 text-center">
            <p className="text-zinc-500 text-sm">
              Fill in all fields above to see your result.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
