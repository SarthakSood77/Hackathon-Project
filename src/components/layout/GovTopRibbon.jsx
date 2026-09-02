import React, { useState } from "react";
import { Shield, Lock, Globe, Eye, Volume2, HelpCircle } from "lucide-react";

export const GovTopRibbon = () => {
  const [lang, setLang] = useState("EN");

  return (
    <div className="w-full bg-[#070e1a] text-slate-300 border-b border-slate-800 text-[11px] font-sans select-none z-30 relative">
      {/* Tricolor Subtle Accent Line */}
      <div className="h-[3px] w-full flex">
        <div className="flex-1 bg-[#ff9933]"></div>
        <div className="flex-1 bg-[#ffffff]"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Official Government of India & Ministry Bilingual Header */}
        <div className="flex items-center gap-3">
          {/* Emblem representation */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold text-[10px]">
              🏛️
            </div>
            <div className="leading-tight">
              <span className="font-semibold text-slate-100 text-xs tracking-wide">
                भारत सरकार | Government of India
              </span>
              <span className="hidden md:inline text-slate-400 text-[10px] ml-2">
                गृह मंत्रालय | Ministry of Home Affairs • Bureau of Immigration
              </span>
            </div>
          </div>
        </div>

        {/* Right: Accessibility Controls & Classification */}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/80 text-rose-300 border border-red-500/40 font-bold">
            <Lock className="w-2.5 h-2.5" />
            RESTRICTED // LAW ENFORCEMENT & IMMIGRATION OPERATIONAL PORTAL (TIER-3)
          </span>

          <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            <Globe className="w-3 h-3 text-cyan-400" />
            <button
              onClick={() => setLang("EN")}
              className={`px-1 rounded ${lang === "EN" ? "text-cyan-300 font-bold bg-cyan-950" : "text-slate-400"}`}
            >
              English
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setLang("HI")}
              className={`px-1 rounded ${lang === "HI" ? "text-cyan-300 font-bold bg-cyan-950" : "text-slate-400"}`}
            >
              हिंदी
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <span className="px-1 hover:text-white cursor-pointer" title="Standard Text">A-</span>
            <span className="px-1 hover:text-white cursor-pointer font-bold" title="Medium Text">A</span>
            <span className="px-1 hover:text-white cursor-pointer" title="Large Text">A+</span>
          </div>
        </div>
      </div>
    </div>
  );
};