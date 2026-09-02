import React from "react";

export const RiskGauge = ({ score, size = 160, label = "AI RISK SCORE" }) => {
  const normalized = Math.min(Math.max(score, 0), 100);
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalized / 100) * (circumference * 0.75);

  let colorClass = "#1e7e48"; // green
  let statusText = "LOW RISK";

  if (normalized > 70) {
    colorClass = "#b3261e"; // red
    statusText = "HIGH RISK";
  } else if (normalized > 30) {
    colorClass = "#b4690e"; // amber
    statusText = "SUSPICIOUS";
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-[135deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e4ebf5"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorClass}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-serif font-bold text-[#0B1F51]">{normalized}</span>
        <span className="text-[10px] uppercase font-mono font-semibold tracking-widest text-[#627d98]">/ 100</span>
        <span
          className="mt-1 text-[11px] font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded"
          style={{ color: colorClass, backgroundColor: `${colorClass}15` }}
        >
          {statusText}
        </span>
      </div>

      <div className="mt-3 text-center">
        <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#627d98]">{label}</span>
      </div>
    </div>
  );
};