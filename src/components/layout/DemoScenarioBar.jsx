import React from "react";
import { useScreening } from "../../context/ScreeningContext";
import { DEMO_SCENARIOS } from "../../data/demoScenarios";
import { ShieldCheck, AlertTriangle, UserX, Sparkles } from "lucide-react";

export const DemoScenarioBar = () => {
  const { selectedScenarioId, setScenario, startNewScreening } = useScreening();

  const scenarios = [
    {
      id: "scenarioA",
      title: "Scenario A — Verified Citizen",
      subtitle: "Rahul Sharma • Passport • 98% Face Match • Hash OK",
      riskBadge: "LOW RISK (08/100)",
      color: "emerald",
      icon: ShieldCheck,
      borderActive: "border-emerald-500 bg-emerald-950/40 text-emerald-300",
    },
    {
      id: "scenarioB",
      title: "Scenario B — Tampered Document",
      subtitle: "Arjun Mehta • Passport • DOB Alteration (1995 vs 2002)",
      riskBadge: "SUSPICIOUS (67/100)",
      color: "amber",
      icon: AlertTriangle,
      borderActive: "border-amber-500 bg-amber-950/40 text-amber-300",
    },
    {
      id: "scenarioC",
      title: "Scenario C — Identity Impersonation",
      subtitle: "Aman Verma • Visa • Face Match 28% • Alias Mismatch",
      riskBadge: "CRITICAL HIGH RISK (91/100)",
      color: "rose",
      icon: UserX,
      borderActive: "border-rose-500 bg-rose-950/40 text-rose-300",
    }
  ];

  return (
    <div className="bg-[#0b1220] border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
        <div className="p-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <span className="font-mono uppercase tracking-wider text-cyan-400 font-bold">SIH Jury Presets:</span>
        <span className="hidden md:inline text-slate-400 text-xs">Select a synthetic test case to evaluate detection pipeline:</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {scenarios.map((sc) => {
          const isSelected = selectedScenarioId === sc.id;
          const Icon = sc.icon;
          return (
            <button
              key={sc.id}
              onClick={() => {
                setScenario(sc.id);
                startNewScreening(sc.id);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isSelected
                  ? `${sc.borderActive} shadow-[0_0_12px_rgba(56,189,248,0.2)] font-semibold`
                  : "border-slate-800 bg-[#080d18] text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-[#0d1527]"
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="font-mono">{sc.title}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  sc.color === "emerald"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : sc.color === "amber"
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-rose-500/20 text-rose-300"
                }`}
              >
                {sc.riskBadge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
