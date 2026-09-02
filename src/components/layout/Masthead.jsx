import React, { useState } from "react";
import { useScreening } from "../../context/ScreeningContext";
import { useAuth } from "../../context/AuthContext";
import { 
  Shield, 
  Sparkles, 
  UserCheck, 
  LayoutDashboard, 
  ScanLine, 
  LogOut, 
  Radio, 
  ChevronRight,
  ShieldCheck,
  Activity,
  AlertTriangle,
  BarChart3
} from "lucide-react";
import { SystemStatusModal } from "./SystemStatusModal";

export const Masthead = () => {
  const { 
    activeTab, 
    setActiveTab, 
    startNewScreening 
  } = useScreening();
  const { user, logout } = useAuth();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#d9e1ec] shadow-[0_1px_4px_rgba(11,31,81,0.06)] sticky top-0 z-40">
      {/* Top Tricolor Strip */}
      <div className="h-[3.5px] w-full flex">
        <div className="flex-1 bg-[#ff9933]"></div>
        <div className="flex-1 bg-[#ffffff]"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Emblem and Title */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
          <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#0B1F51" strokeWidth="2"/>
            <circle cx="20" cy="20" r="3" fill="#0B1F51"/>
            <g stroke="#0B1F51" strokeWidth="1">
              <line x1="20" y1="2" x2="20" y2="38"/>
              <line x1="2" y1="20" x2="38" y2="20"/>
              <line x1="6.2" y1="6.2" x2="33.8" y2="33.8"/>
              <line x1="6.2" y1="33.8" x2="33.8" y2="6.2"/>
              <line x1="20" y1="2" x2="20" y2="38" transform="rotate(30 20 20)"/>
              <line x1="20" y1="2" x2="20" y2="38" transform="rotate(60 20 20)"/>
            </g>
          </svg>

          <div>
            <p className="text-[10.5px] uppercase font-mono tracking-wider text-[#5a6e85] font-semibold">
              भारत सरकार · Government of India | गृह मंत्रालय · Ministry of Home Affairs
            </p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0B1F51] tracking-tight">
                SENTINEL AI
              </h1>
              <span className="bg-[#eef2f8] border border-[#c9d5e7] rounded px-2 py-0.5 text-xs font-mono font-semibold text-[#0B1F51]">
                Bureau of Immigration · Portal Gateway
              </span>
            </div>
          </div>
        </div>

        {/* Right: Navigation Links & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="hidden lg:flex items-center gap-1 bg-[#f4f7fb] p-1 rounded-lg border border-[#dce4ef] text-xs font-medium">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === "dashboard"
                  ? "bg-[#0B1F51] text-white font-semibold shadow-sm"
                  : "text-[#486581] hover:text-[#0B1F51] hover:bg-[#e4ebf5]"
              }`}
            >
              Operations Dashboard
            </button>
            <button
              onClick={() => startNewScreening()}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === "new-screening"
                  ? "bg-[#0B1F51] text-white font-semibold shadow-sm"
                  : "text-[#486581] hover:text-[#0B1F51] hover:bg-[#e4ebf5]"
              }`}
            >
              New Screening
            </button>
            <button
              onClick={() => setActiveTab("alerts")}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1 ${
                activeTab === "alerts"
                  ? "bg-[#0B1F51] text-white font-semibold shadow-sm"
                  : "text-[#486581] hover:text-[#0B1F51] hover:bg-[#e4ebf5]"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Alerts
            </button>
            <button
              onClick={() => setActiveTab("blockchain")}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1 ${
                activeTab === "blockchain" || activeTab === "audit-trail"
                  ? "bg-[#0B1F51] text-white font-semibold shadow-sm"
                  : "text-[#486581] hover:text-[#0B1F51] hover:bg-[#e4ebf5]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Ledger Audit
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1 ${
                activeTab === "analytics"
                  ? "bg-[#0B1F51] text-white font-semibold shadow-sm"
                  : "text-[#486581] hover:text-[#0B1F51] hover:bg-[#e4ebf5]"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Analytics
            </button>
          </div>

          {/* System Health Diagnostics Trigger */}
          <button
            onClick={() => setIsStatusModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#eef4fb] hover:bg-[#e2ecf9] text-[#1a56a4] border border-[#c6daf4] text-xs font-semibold font-mono transition-all cursor-pointer"
            title="View Real-Time Subsystem Health"
          >
            <Activity className="w-3.5 h-3.5 animate-pulse text-[#1a56a4]" />
            <span className="hidden sm:inline">System Status</span>
          </button>

          {/* Officer Tag */}
          <div className="flex items-center gap-1.5 bg-[#f0f4f8] border border-[#d9e2ec] px-2.5 py-1.5 rounded-lg text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#1e7e48] animate-pulse"></span>
            <span className="font-semibold text-[#102a43]">
              {user?.officerName ? (user.officerName.split(" ")[1] || user.officerName) : "Officer"}
            </span>
            <span className="text-[#627d98] hidden md:inline">
              ({user?.officerId || "IND-DEL-4092"})
            </span>
          </div>

          <button
            onClick={logout}
            className="p-1.5 rounded text-[#627d98] hover:text-[#b3261e] hover:bg-[#fdf0ee] border border-transparent hover:border-[#b3261e]/30 transition-all text-xs cursor-pointer"
            title="Logout of session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-Time Subsystem Status Diagnostic Modal */}
      <SystemStatusModal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} />
    </header>
  );
};