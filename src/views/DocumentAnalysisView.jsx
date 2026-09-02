import React from "react";
import { Step3TamperAnalysis } from "../components/screening/Step3TamperAnalysis";
import { Step4FaceVerification } from "../components/screening/Step3TamperAnalysis";
import { Step5RiskAssessment } from "../components/screening/Step5RiskAssessment";

export const DocumentAnalysisView = () => {
  return (
    <div className="bg-[#080d1a] border border-slate-800/90 rounded-2xl p-6 shadow-xl">
      <Step3TamperAnalysis />
    </div>
  );
};

export const FaceVerificationView = () => {
  return (
    <div className="bg-[#080d1a] border border-slate-800/90 rounded-2xl p-6 shadow-xl">
      <Step4FaceVerification />
    </div>
  );
};

export const RiskAssessmentView = () => {
  return (
    <div className="bg-[#080d1a] border border-slate-800/90 rounded-2xl p-6 shadow-xl">
      <Step5RiskAssessment />
    </div>
  );
};
