import React from "react";
import { useScreening } from "../../context/ScreeningContext";
import { Shield, FileCheck, UserCheck, AlertTriangle, ArrowRight, Lock, CheckCircle2, ScanLine, Sparkles } from "lucide-react";

export const GovLandingHero = () => {
  const { startNewScreening, setScenario, selectedScenarioId, setActiveTab } = useScreening();

  return (
    <section className="space-y-8 mb-8">
      {/* Hero Container */}
      <div className="bg-gradient-to-br from-[#0B1F51] via-[#102a6b] to-[#07163d] rounded-2xl text-white p-8 md:p-12 shadow-xl relative overflow-hidden">
        {/* Subtle Decorative Chakra Watermark */}
        <svg className="absolute -right-16 -bottom-16 w-80 h-80 opacity-5 pointer-events-none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="none" stroke="#FFFFFF" strokeWidth="2"/>
          <circle cx="20" cy="20" r="3" fill="#FFFFFF"/>
          <g stroke="#FFFFFF" strokeWidth="1">
            <line x1="20" y1="2" x2="20" y2="38"/>
            <line x1="2" y1="20" x2="38" y2="20"/>
            <line x1="6.2" y1="6.2" x2="33.8" y2="33.8"/>
            <line x1="6.2" y1="33.8" x2="33.8" y2="6.2"/>
          </g>
        </svg>

        <div className="max-w-3xl relative z-10 space-y-4">
          <p className="text-xs font-mono font-bold tracking-widest text-[#C59B27] uppercase flex items-center gap-2">
            <span className="w-6 h-[2px] bg-[#C59B27]"></span>
            AI-Assisted · Biometric-Verified · Tamper-Evident Ledger
          </p>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Screen identities and travel documents with<br />
            <span className="text-[#e2b744] italic">confidence and precision.</span>
          </h2>

          <p className="text-sm md:text-base text-[#d9e2ec] font-sans leading-relaxed max-w-2xl">
            A demonstration of an AI-assisted border security screening portal — ICAO Doc 9303 compliant,
            neural OCR parsed, biometric face-matched, and cryptographic hash attested. Built to assist
            immigration officers in detecting forged credentials and identity impersonations.
          </p>

          {/* Hero Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => startNewScreening()}
              className="px-6 py-3 rounded-lg bg-[#C59B27] hover:bg-[#d8ab2e] text-[#0B1F51] font-sans font-bold text-sm transition-all shadow-md flex items-center gap-2"
            >
              <span>Proceed to screening portal →</span>
            </button>

            <button
              onClick={() => setActiveTab("dashboard")}
              className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/30 text-white font-sans font-semibold text-sm transition-all"
            >
              Operations Dashboard
            </button>
          </div>

          {/* Hero Trust Badges */}
          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-sans text-[#bcccdc] border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#C59B27]" />
              Secured by SHA-256 Ledger & FIPS 140-3 HSM (mock)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#48bb78]" />
              ICAO Doc 9303 & ISO/IEC 19794-5 Compliant
            </span>
          </div>
        </div>
      </div>

      {/* SIH Jury Scenario Quick Switcher Bar */}
      <div className="bg-white border border-[#d9e2ec] rounded-xl p-4 shadow-[0_2px_8px_rgba(11,31,81,0.04)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e4ebf5] pb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C59B27]" />
            <span className="font-serif font-bold text-sm text-[#0B1F51]">SIH Jury Demonstration Presets</span>
          </div>
          <span className="text-xs font-sans text-[#627d98]">
            Select a synthetic test scenario to evaluate the detection pipeline:
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => {
              setScenario("scenarioA");
              startNewScreening("scenarioA");
            }}
            className={`p-3.5 rounded-lg border text-left transition-all ${
              selectedScenarioId === "scenarioA"
                ? "bg-[#eef7f2] border-[#1e7e48] text-[#1e7e48] shadow-sm"
                : "bg-[#f8fafc] border-[#d9e2ec] hover:border-[#0B1F51] text-[#102a43]"
            }`}
          >
            <div className="flex items-center justify-between font-mono text-xs font-bold">
              <span>Scenario A: Verified Citizen</span>
              <span className="px-2 py-0.5 rounded bg-[#1e7e48]/10 text-[#1e7e48]">08 / 100 Risk</span>
            </div>
            <p className="text-xs font-sans text-[#486581] mt-1">
              Rahul Sharma • Passport • 98% Face Match • SHA-256 Hash Matched
            </p>
          </button>

          <button
            onClick={() => {
              setScenario("scenarioB");
              startNewScreening("scenarioB");
            }}
            className={`p-3.5 rounded-lg border text-left transition-all ${
              selectedScenarioId === "scenarioB"
                ? "bg-[#fdf8eb] border-[#b4690e] text-[#b4690e] shadow-sm"
                : "bg-[#f8fafc] border-[#d9e2ec] hover:border-[#0B1F51] text-[#102a43]"
            }`}
          >
            <div className="flex items-center justify-between font-mono text-xs font-bold">
              <span>Scenario B: Tampered DOB</span>
              <span className="px-2 py-0.5 rounded bg-[#b4690e]/10 text-[#b4690e]">67 / 100 Risk</span>
            </div>
            <p className="text-xs font-sans text-[#486581] mt-1">
              Arjun Mehta • Passport • Scanned DOB 1995 vs Master 2002 Alteration
            </p>
          </button>

          <button
            onClick={() => {
              setScenario("scenarioC");
              startNewScreening("scenarioC");
            }}
            className={`p-3.5 rounded-lg border text-left transition-all ${
              selectedScenarioId === "scenarioC"
                ? "bg-[#fdf0ee] border-[#b3261e] text-[#b3261e] shadow-sm"
                : "bg-[#f8fafc] border-[#d9e2ec] hover:border-[#0B1F51] text-[#102a43]"
            }`}
          >
            <div className="flex items-center justify-between font-mono text-xs font-bold">
              <span>Scenario C: Impersonation</span>
              <span className="px-2 py-0.5 rounded bg-[#b3261e]/10 text-[#b3261e]">91 / 100 Risk</span>
            </div>
            <p className="text-xs font-sans text-[#486581] mt-1">
              Aman Verma • Visa • 27% Face Match • Linked Alias Rahul Singh
            </p>
          </button>
        </div>
      </div>

      {/* The 4 Process Cards */}
      <div className="space-y-4">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#627d98] font-bold">
            The Screening Process
          </p>
          <h3 className="font-serif text-2xl font-bold text-[#0B1F51]">
            Four core verifications. One definitive clearance.
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#d9e2ec] rounded-xl p-5 shadow-[0_2px_8px_rgba(11,31,81,0.04)] space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#edf4fb] text-[#0B1F51] flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-mono uppercase font-bold text-[#0B1F51]">Step 1</p>
            <h4 className="font-serif font-bold text-base text-[#0B1F51]">Document OCR</h4>
            <p className="text-xs text-[#486581] leading-relaxed">
              Extract Visual Inspection Zone (VIZ) & MRZ-TD3 lines with neural confidence metrics.
            </p>
          </div>

          <div className="bg-white border border-[#d9e2ec] rounded-xl p-5 shadow-[0_2px_8px_rgba(11,31,81,0.04)] space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#fdf8eb] text-[#b4690e] flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-mono uppercase font-bold text-[#b4690e]">Step 2</p>
            <h4 className="font-serif font-bold text-base text-[#0B1F51]">Tamper Analysis</h4>
            <p className="text-xs text-[#486581] leading-relaxed">
              Detect physical & digital alteration artifacts, date inconsistencies, and font noise.
            </p>
          </div>

          <div className="bg-white border border-[#d9e2ec] rounded-xl p-5 shadow-[0_2px_8px_rgba(11,31,81,0.04)] space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#edf4fb] text-[#0B1F51] flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-mono uppercase font-bold text-[#0B1F51]">Step 3</p>
            <h4 className="font-serif font-bold text-base text-[#0B1F51]">Face Biometrics</h4>
            <p className="text-xs text-[#486581] leading-relaxed">
              Compare document portrait against live camera stream with 68 facial landmarks and liveness.
            </p>
          </div>

          <div className="bg-white border border-[#d9e2ec] rounded-xl p-5 shadow-[0_2px_8px_rgba(11,31,81,0.04)] space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#eef7f2] text-[#1e7e48] flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-mono uppercase font-bold text-[#1e7e48]">Step 4</p>
            <h4 className="font-serif font-bold text-base text-[#0B1F51]">Ledger & Risk</h4>
            <p className="text-xs text-[#486581] leading-relaxed">
              Verify cryptographic SHA-256 hash on distributed ledger and compute composite AI threat score.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};