"use client";

import { useState, useMemo } from "react";
import { Calculator, AlertTriangle } from "lucide-react";

const SYRINGE_OPTIONS = [
  {
    label: "0.3 mL / 30 units",
    value: 0.3,
    units: 30,
    description: "BD Insulin Syringe — smallest, most precise for low-volume doses",
  },
  {
    label: "0.5 mL / 50 units",
    value: 0.5,
    units: 50,
    description: "BD Insulin Syringe — most common for peptide dosing",
  },
  {
    label: "1.0 mL / 100 units",
    value: 1.0,
    units: 100,
    description: "BD Insulin Syringe — for higher volume draws",
  },
  {
    label: "Peptide Pen / 300 units",
    value: 3.0,
    units: 300,
    description: "Pre-filled peptide pen — dial your dose, no syringe needed",
  },
];

/* ── Inline SVG Illustrations for Syringe Selector ── */
function SyringeIllustration({ syringeValue }: { syringeValue: number }) {
  if (syringeValue === 3.0) {
    // Peptide Pen — horizontal
    return (
      <svg viewBox="0 0 200 50" className="w-full h-auto">
        {/* Pen body */}
        <rect x={10} y={16} width={140} height={18} rx={9} fill="#8a8a8a" />
        {/* Metallic sheen */}
        <rect x={10} y={16} width={140} height={7} rx={4} fill="rgba(255,255,255,0.15)" />
        {/* Dose window */}
        <rect x={95} y={19} width={22} height={12} rx={2} fill="#1a1a2e" stroke="#666" strokeWidth={0.5} />
        <text x={106} y={29} textAnchor="middle" fill="#fbbf24" fontSize={7} fontFamily="monospace" fontWeight="bold">0</text>
        {/* Dial knob */}
        <rect x={150} y={18} width={24} height={14} rx={3} fill="#6b6b6b" />
        <line x1={155} y1={21} x2={155} y2={29} stroke="#555" strokeWidth={0.6} />
        <line x1={159} y1={21} x2={159} y2={29} stroke="#555" strokeWidth={0.6} />
        <line x1={163} y1={21} x2={163} y2={29} stroke="#555" strokeWidth={0.6} />
        <line x1={167} y1={21} x2={167} y2={29} stroke="#555" strokeWidth={0.6} />
        {/* Injection button */}
        <rect x={174} y={20} width={16} height={10} rx={5} fill="#777" />
        {/* Needle cap */}
        <polygon points="10,25 2,22 2,28" fill="#666" />
        {/* Cap cover */}
        <rect x={2} y={19} width={10} height={12} rx={2} fill="#555" />
      </svg>
    );
  }

  // BD Insulin Syringes — scale barrel length by volume
  const barrelLength = syringeValue === 0.3 ? 100 : syringeValue === 0.5 ? 120 : 145;
  const maxUnit = syringeValue === 0.3 ? 30 : syringeValue === 0.5 ? 50 : 100;
  const tickInterval = maxUnit <= 30 ? 5 : 10;
  const labelInterval = maxUnit <= 30 ? 10 : 20;
  const barrelX = 38;
  const barrelEndX = barrelX + barrelLength;

  return (
    <svg viewBox={`0 0 ${barrelEndX + 55} 52`} className="w-full h-auto">
      {/* Needle */}
      <line x1={2} y1={25} x2={16} y2={25} stroke="#bbb" strokeWidth={1} strokeLinecap="round" />
      {/* Needle hub */}
      <polygon points={`16,23 24,19 24,31 16,27`} fill="#e97518" />
      <rect x={24} y={19} width={14} height={12} rx={1} fill="#e97518" />
      {/* Barrel */}
      <rect x={barrelX} y={14} width={barrelLength} height={22} rx={3} fill="rgba(255,255,255,0.06)" stroke="#666" strokeWidth={1} />
      {/* Tick marks */}
      {Array.from({ length: maxUnit / tickInterval + 1 }, (_, i) => {
        const unit = i * tickInterval;
        const x = barrelX + (unit / maxUnit) * barrelLength;
        const isLabel = unit % labelInterval === 0;
        return (
          <g key={unit}>
            <line x1={x} y1={36} x2={x} y2={isLabel ? 44 : 40} stroke={isLabel ? "#999" : "#666"} strokeWidth={isLabel ? 0.8 : 0.5} />
            {isLabel && (
              <text x={x} y={50} textAnchor="middle" fill="#888" fontSize={5.5} fontFamily="monospace">{unit}</text>
            )}
          </g>
        );
      })}
      {/* Finger flanges */}
      <rect x={barrelEndX} y={10} width={3} height={30} rx={1.5} fill="#666" />
      {/* Plunger rod */}
      <rect x={barrelEndX + 3} y={23} width={35} height={4} rx={2} fill="#888" />
      {/* Plunger cap */}
      <rect x={barrelEndX + 36} y={18} width={6} height={14} rx={2} fill="#e97518" />
    </svg>
  );
}

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
  const tickInterval = maxUnits <= 50 ? 10 : maxUnits <= 100 ? 10 : 50;
  const majorInterval = maxUnits <= 30 ? 10 : maxUnits <= 100 ? 20 : 100;
  const tickCount = maxUnits / tickInterval;
  const ticks = [];
  for (let i = 0; i <= tickCount; i++) {
    const unitVal = i * tickInterval;
    const x = barrelLeft + (i / tickCount) * barrelWidth;
    const isMajor = unitVal % majorInterval === 0;
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

/* ── Horizontal Peptide Pen SVG (result view) ── */
function PenVisual({ units }: { units: number }) {
  const displayUnits = Math.round(units * 10) / 10;
  const unitText = Number.isInteger(displayUnits) ? displayUnits.toString() : displayUnits.toFixed(1);

  return (
    <svg viewBox="0 0 560 90" className="w-full h-auto" role="img" aria-label={`Peptide pen dialed to ${displayUnits} units`}>
      {/* Cap */}
      <rect x={2} y={30} width={40} height={30} rx={6} fill="#555" />
      <rect x={2} y={30} width={40} height={12} rx={4} fill="rgba(255,255,255,0.08)" />

      {/* Pen body */}
      <rect x={42} y={24} width={340} height={42} rx={14} fill="#8a8a8a" />
      {/* Metallic sheen */}
      <rect x={42} y={24} width={340} height={16} rx={8} fill="rgba(255,255,255,0.12)" />

      {/* Dose window */}
      <rect x={240} y={32} width={60} height={26} rx={4} fill="#0b1227" stroke="#666" strokeWidth={1} />
      <text x={270} y={52} textAnchor="middle" fill="#fbbf24" fontSize={16} fontFamily="monospace" fontWeight="bold">
        {unitText}
      </text>

      {/* Label above window */}
      <text x={270} y={20} textAnchor="middle" fill="#fbbf24" fontSize={10} fontFamily="sans-serif" fontWeight="bold">
        DIAL TO
      </text>

      {/* Dial knob */}
      <rect x={382} y={28} width={60} height={34} rx={6} fill="#6b6b6b" />
      {/* Grip lines */}
      {[392, 400, 408, 416, 424, 432].map((x) => (
        <line key={x} x1={x} y1={34} x2={x} y2={56} stroke="#555" strokeWidth={1} />
      ))}

      {/* Injection button */}
      <rect x={442} y={32} width={40} height={26} rx={13} fill="#777" />
      <rect x={442} y={32} width={40} height={10} rx={5} fill="rgba(255,255,255,0.08)" />
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SYRINGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSyringeVolume(opt.value)}
                className={`flex flex-col items-center rounded-xl p-4 text-center transition-all ${
                  syringeVolume === opt.value
                    ? "bg-amber-400/10 border-2 border-amber-400 shadow-lg shadow-amber-400/10"
                    : "bg-white/5 border border-white/10 hover:border-amber-400/40"
                }`}
              >
                {/* Syringe illustration */}
                <div className="w-full h-16 flex items-center justify-center mb-3 px-1">
                  <SyringeIllustration syringeValue={opt.value} />
                </div>
                <span
                  className={`text-sm font-semibold ${
                    syringeVolume === opt.value
                      ? "text-amber-400"
                      : "text-zinc-300"
                  }`}
                >
                  {opt.label}
                </span>
                <span className="text-[10px] text-zinc-500 mt-1 leading-tight">
                  {opt.description}
                </span>
              </button>
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
                    , {syringeVolume === 3.0 ? "dial the pen to" : "pull the syringe to"}:
                  </p>
                  <p className="text-amber-400 text-5xl font-bold mb-1">
                    {result.syringeUnits} units
                  </p>
                  <p className="text-zinc-500 text-sm">
                    {result.doseMl} mL &middot; Concentration:{" "}
                    {result.concentrationMgPerMl} mg/mL
                  </p>
                </div>

                {/* Visual: pen or syringe */}
                <div className="mt-4">
                  {syringeVolume === 3.0 ? (
                    <PenVisual units={result.syringeUnits} />
                  ) : (
                    <SyringeVisual
                      fillPercent={result.fillPercent}
                      units={result.syringeUnits}
                      maxUnits={result.syringeMax}
                    />
                  )}
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
