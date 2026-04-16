"use client";

import { useState, useMemo } from "react";
import { Calculator, AlertTriangle } from "lucide-react";

const SYRINGE_OPTIONS = [
  { label: "0.3 mL / 30 units", value: 0.3, units: 30 },
  { label: "0.5 mL / 50 units", value: 0.5, units: 50 },
  { label: "1.0 mL / 100 units", value: 1.0, units: 100 },
];

const VIAL_OPTIONS = [
  { label: "5 mg", value: 5 },
  { label: "10 mg", value: 10 },
  { label: "15 mg", value: 15 },
  { label: "20 mg", value: 20 },
  { label: "30 mg", value: 30 },
  { label: "50 mg", value: 50 },
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

/* ── Horizontal Insulin Syringe SVG ── */
function SyringeVisual({
  fillPercent,
  units,
  maxUnits,
}: {
  fillPercent: number;
  units: number;
  maxUnits: number;
}) {
  // Horizontal layout: needle on left, plunger on right
  const barrelLeft = 70;
  const barrelRight = 480;
  const barrelWidth = barrelRight - barrelLeft;
  const barrelTop = 28;
  const barrelBottom = 62;
  const barrelHeight = barrelBottom - barrelTop;
  const centerY = (barrelTop + barrelBottom) / 2;

  const clampedPercent = Math.min(Math.max(fillPercent, 0), 100);
  const fillWidth = (clampedPercent / 100) * barrelWidth;

  // Tick marks along the top
  const tickCount = maxUnits / 10;
  const ticks = [];
  for (let i = 0; i <= tickCount; i++) {
    const unitVal = i * 10;
    const x = barrelLeft + (i / tickCount) * barrelWidth;
    const isMajor = unitVal % (maxUnits <= 30 ? 10 : 20) === 0;
    ticks.push({ x, unitVal, isMajor });
  }

  // Fill line x position
  const fillLineX = barrelLeft + fillWidth;

  return (
    <svg
      viewBox="0 0 560 100"
      className="w-full h-auto"
      role="img"
      aria-label={`Syringe filled to ${units} units`}
    >
      {/* ── Needle ── */}
      <line
        x1={2}
        y1={centerY}
        x2={30}
        y2={centerY}
        stroke="#999"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* Needle hub (cone shape) */}
      <polygon
        points={`30,${centerY - 3} 42,${centerY - 8} 42,${centerY + 8} 30,${centerY + 3}`}
        fill="#777"
      />
      {/* Hub-to-barrel connector */}
      <rect x={42} y={centerY - 9} width={barrelLeft - 42} height={18} rx={2} fill="#666" />

      {/* ── Barrel ── */}
      {/* Barrel body with rounded ends */}
      <rect
        x={barrelLeft}
        y={barrelTop}
        width={barrelWidth}
        height={barrelHeight}
        rx={5}
        fill="rgba(255,255,255,0.04)"
        stroke="#555"
        strokeWidth={1.5}
      />

      {/* Finger flanges */}
      <rect x={barrelRight} y={barrelTop - 8} width={4} height={barrelHeight + 16} rx={2} fill="#666" />

      {/* ── Fill liquid (from left) ── */}
      {clampedPercent > 0 && (
        <rect
          x={barrelLeft + 1}
          y={barrelTop + 1.5}
          width={Math.min(fillWidth, barrelWidth - 2)}
          height={barrelHeight - 3}
          rx={4}
          fill="url(#hLiquidGradient)"
          className="transition-all duration-500 ease-out"
        />
      )}

      {/* ── Plunger ── */}
      {/* Plunger gasket (inside barrel, at fill line or at right end when empty) */}
      {clampedPercent > 0 ? (
        <rect
          x={fillLineX - 2}
          y={barrelTop + 1}
          width={4}
          height={barrelHeight - 2}
          rx={1}
          fill="#888"
        />
      ) : (
        <rect
          x={barrelRight - 4}
          y={barrelTop + 1}
          width={4}
          height={barrelHeight - 2}
          rx={1}
          fill="#888"
        />
      )}
      {/* Plunger rod */}
      <rect
        x={barrelRight + 4}
        y={centerY - 2.5}
        width={50}
        height={5}
        rx={2}
        fill="#666"
      />
      {/* Plunger thumb pad */}
      <rect
        x={barrelRight + 52}
        y={centerY - 10}
        width={6}
        height={20}
        rx={3}
        fill="#777"
      />

      {/* ── Tick marks along bottom ── */}
      {ticks.map(({ x, unitVal, isMajor }) => (
        <g key={unitVal}>
          <line
            x1={x}
            y1={barrelBottom}
            x2={x}
            y2={barrelBottom + (isMajor ? 10 : 5)}
            stroke={isMajor ? "#888" : "#555"}
            strokeWidth={isMajor ? 1.2 : 0.8}
          />
          {isMajor && (
            <text
              x={x}
              y={barrelBottom + 20}
              textAnchor="middle"
              fill="#999"
              fontSize={8}
              fontFamily="monospace"
            >
              {unitVal}
            </text>
          )}
        </g>
      ))}

      {/* ── Fill indicator arrow (points down from top) ── */}
      {clampedPercent > 0 && clampedPercent <= 100 && (
        <g>
          <line
            x1={fillLineX}
            y1={barrelTop - 14}
            x2={fillLineX}
            y2={barrelTop - 4}
            stroke="#fbbf24"
            strokeWidth={1.5}
          />
          <polygon
            points={`${fillLineX},${barrelTop - 2} ${fillLineX - 4},${barrelTop - 8} ${fillLineX + 4},${barrelTop - 8}`}
            fill="#fbbf24"
          />
          <text
            x={fillLineX}
            y={barrelTop - 18}
            textAnchor="middle"
            fill="#fbbf24"
            fontSize={10}
            fontWeight="bold"
            fontFamily="monospace"
          >
            {units}u
          </text>
        </g>
      )}

      {/* Gradients */}
      <defs>
        <linearGradient id="hLiquidGradient" x1="0" y1="0" x2="0" y2="1">
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

      {/* Result with horizontal syringe underneath */}
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
              <div>
                {/* Text result */}
                <div className="text-center mb-6">
                  <p className="text-zinc-400 text-sm mb-2">
                    To have a dose of{" "}
                    <span className="text-white font-semibold">
                      {effectiveDoseMcg} mcg ({(effectiveDoseMcg! / 1000).toFixed(2)} mg)
                    </span>
                    , pull the syringe to:
                  </p>
                  <p className="text-amber-400 text-5xl font-bold mb-1">
                    {result.syringeUnits} units
                  </p>
                  <p className="text-zinc-500 text-sm">
                    {result.doseMl} mL &middot; Concentration:{" "}
                    {result.concentrationMgPerMl} mg/mL
                  </p>
                </div>

                {/* Horizontal syringe underneath */}
                <div className="mt-4">
                  <SyringeVisual
                    fillPercent={result.fillPercent}
                    units={result.syringeUnits}
                    maxUnits={result.syringeMax}
                  />
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
