import React from "react";
import { useAuth } from "./context/AuthContext";
import { useScreening } from "./context/ScreeningContext";
import { Masthead } from "./components/layout/Masthead";
import { GovLandingHero } from "./components/layout/GovLandingHero";
import { LoginView, DashboardView } from "./views/LoginView";
import { NewScreeningView, IdentitySearchView } from "./views/NewScreeningView";
import { DocumentAnalysisView, FaceVerificationView, RiskAssessmentView } from "./views/DocumentAnalysisView";
import { BlockchainAuditView, AlertsView } from "./views/BlockchainAuditView";
import { HistoryView, AnalyticsView, SettingsView } from "./views/HistoryView";
import { ScreeningReportModal } from "./components/reports/ScreeningReportModal";
import { FlagCaseModal } from "./components/reports/FlagCaseModal";

export default function App() {
  const { user } = useAuth();
  const { activeTab } = useScreening();

  if (!user?.isAuthenticated) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <GovLandingHero />
            <DashboardView />
          </div>
        );
      case "new-screening":
        return <NewScreeningView />;
      case "document-analysis":
        return <DocumentAnalysisView />;
      case "face-verification":
        return <FaceVerificationView />;
      case "risk-assessment":
        return <RiskAssessmentView />;
      case "identity-search":
        return <IdentitySearchView />;
      case "alerts":
        return <AlertsView />;
      case "history":
        return <HistoryView />;
      case "blockchain":
        return <BlockchainAuditView />;
      case "analytics":
        return <AnalyticsView />;
      case "settings":
        return <SettingsView />;
      default:
        return (
          <div className="space-y-8">
            <GovLandingHero />
            <DashboardView />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#102a43] font-sans selection:bg-[#0B1F51] selection:text-white flex flex-col justify-between">
      {/* Official Government Masthead */}
      <Masthead />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
        {/* Global Notice Banner */}
        <div className="bg-[#edf4fb] border-l-4 border-[#1a56a4] text-[#0f3566] p-3.5 rounded-r-lg text-xs leading-relaxed font-sans mb-6">
          <strong>This is a non-official Smart India Hackathon (SIH) prototype.</strong> No real national databases, police records, or central passport issuance servers are contacted. All biometric comparisons, optical character extraction, and hash integrity checks below are simulated or run locally in your browser.
        </div>

        {renderActiveView()}
      </main>

      {/* Global Official Footer Note */}
      <footer className="bg-white border-t border-[#d9e2ec] py-6 px-4 text-center mt-12">
        <p className="text-xs text-[#627d98] font-sans max-w-4xl mx-auto leading-relaxed">
          Demo build — <strong>not affiliated with the Ministry of Home Affairs, Bureau of Immigration,</strong> or any government body.
          Identity validation and tampering models are simulated demonstration algorithms; biometric and cryptographic hash checks
          operate locally and are not connected to any live national database.
        </p>
      </footer>

      {/* Global Modals */}
      <ScreeningReportModal />
      <FlagCaseModal />
    </div>
  );
}