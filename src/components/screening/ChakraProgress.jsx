import React from "react";
import { useScreening } from "../../context/ScreeningContext";
import { Lock } from "lucide-react";

export const ChakraProgress = () => {
  const { screeningStep, goToStep, isStep1Completed } = useScreening();

  const steps = [
    { num: 1, label: "01 Document upload" },
    { num: 2, label: "02 OCR extraction" },
    { num: 3, label: "03 Tamper analysis" },
    { num: 4, label: "04 Biometric face match" },
    { num: 5, label: "05 AI risk scoring" },
    { num: 6, label: "06 Final clearance dossier" },
  ];

  // Circle circumference is 2 * PI * 27 = 169.6
  const circumference = 169.6;
  const progressPercent = (screeningStep / 6);
  const strokeDashoffset = circumference - progressPercent * circumference;

  return (
    <div className="bg-white border border-[#d9e2ec] rounded-xl p-4 shadow-[0_2px_8px_rgba(11,31,81,0.04)] mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Chakra Circular Progress Indicator */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <svg className="w-14 h-14 flex-shrink-0" viewBox="0 0 64 64" aria-hidden="true">
          {/* Background Track */}
          <circle
            cx="32"
            cy="32"
            r="27"
            fill="none"
            stroke="#e4ebf5"
            strokeWidth="4"
          />
          {/* Progress Fill */}
          <circle
            cx="32"
            cy="32"
            r="27"
            fill="none"
            stroke="#0B1F51"
            strokeWidth="4"
            strokeDasharray="169.6"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 32 32)"
            className="transition-all duration-700 ease-out"
          />
          {/* Spokes */}
          <g stroke="#0B1F51" strokeWidth="1" opacity="0.6">
            <line x1="32" y1="10" x2="32" y2="54"/>
            <line x1="10" y1="32" x2="54" y2="32"/>
            <line x1="16" y1="16" x2="48" y2="48"/>
            <line x1="16" y1="48" x2="48" y2="16"/>
          </g>
          {/* Hub */}
          <circle cx="32" cy="32" r="4" fill="#0B1F51"/>
        </svg>

        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#627d98] font-bold">
            Screening Pipeline
          </p>
          <p className="font-serif text-base font-bold text-[#0B1F51]">
            Step {screeningStep} of 6: <span className="font-sans font-normal text-sm text-[#486581]">{steps[screeningStep - 1]?.label.substring(3)}</span>
          </p>
        </div>
      </div>

      {/* Step List Horizontal Strip */}
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center md:justify-end flex-1">
        {steps.map((s) => {
          const isCurrent = screeningStep === s.num;
          const isDone = screeningStep > s.num;
          const isLocked = !isStep1Completed && s.num > 1;

          return (
            <button
              key={s.num}
              type="button"
              disabled={isLocked}
              onClick={() => !isLocked && goToStep(s.num)}
              title={isLocked ? "Complete Step 1 (Upload & Screening) to unlock" : s.label}
              className={`px-2.5 py-1.5 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 ${
                isCurrent
                  ? "bg-[#0B1F51] text-white font-bold shadow-sm"
                  : isDone
                  ? "bg-[#eef7f2] border border-[#1e7e48]/30 text-[#1e7e48] font-semibold cursor-pointer"
                  : isLocked
                  ? "bg-[#f4f7fb] border border-[#d9e2ec] text-[#9fb3c8] cursor-not-allowed opacity-60"
                  : "bg-[#f4f7fb] border border-[#d9e2ec] text-[#627d98] hover:text-[#102a43] cursor-pointer"
              }`}
            >
              {isDone ? (
                <span>✓</span>
              ) : isLocked ? (
                <Lock className="w-3 h-3 text-[#9fb3c8]" />
              ) : (
                <span>{s.num}</span>
              )}
              <span className="hidden sm:inline">{s.label.substring(3)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};