import React from "react";
import { useScreening } from "../../context/ScreeningContext";
import { useAuth } from "../../context/AuthContext";
import {
  Shield,
  LayoutDashboard,
  ScanLine,
  FileCheck,
  UserCheck,
  Search,
  Bell,
  History,
  Link2,
  BarChart3,
  Settings,
  LogOut,
  Radio,
  Sparkles,
  Lock,
  ChevronRight,
  Award
} from "lucide-react";

export const Sidebar = () => {
  const { activeTab, setActiveTab, startNewScreening, alerts } = useScreening();
  const { user, logout } = useAuth();

  const unreadAlerts = alerts.filter((a) => a.status === "OPEN" || a.status === "INVESTIGATING").length;

  const navItems = [
    { id: "dashboard", label: "Operations Dashboard", icon: LayoutDashboard },
    { id: "new-screening", label: "New Traveler Screening", icon: ScanLine, highlight: true },
    { id: "document-analysis", label: "Document Verification", icon: FileCheck },
    { id: "face-verification", label: "Biometric Face Match", icon: UserCheck },
    { id: "identity-search", label: "Central Identity Search", icon: Search },
    { id: "alerts", label: "Threat Alerts Center", icon: Bell, count: unreadAlerts },
    { id: "history", label: "Screening Audit Log", icon: History },
    { id: "blockchain", label: "Integrity Ledger", icon: Link2 },
    { id: "analytics", label: "Checkpoint Analytics", icon: BarChart3 },
    { id: "settings", label: "Portal & HSM Config", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#081220] border-r border-slate-700/80 flex flex-col h-screen select-none z-30 sticky top-0 flex-shrink-0">
      {/* Brand Header with Government Seal Insignia */}
      <div className="p-4 border-b border-slate-700/80 bg-[#060c17]">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-[#0f213a] border border-amber-400/50 text-amber-400 shadow-md">
            <Shield className="w-6 h-6" />
            <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-amber-500 text-slate-950 text-[8px] font-mono font-bold">
              BOI
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-wider font-mono text-white">IDShield</span>
              <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-sans tracking-wide">
              Bureau of Immigration • MHA
            </p>
          </div>
        </div>
      </div>

      {/* Official Security Classification Pill */}
      <div className="mx-3 my-2.5 px-3 py-1.5 rounded bg-[#0d1c30] border border-slate-700 flex items-center justify-between text-[10px] font-mono text-slate-300">
        <span className="flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-amber-400" />
          <span>FIPS 140-3 LEVEL 4</span>
        </span>
        <span className="text-[10px] text-emerald-400 font-bold">HSM ACTIVE</span>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          Official Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "new-screening") {
                  startNewScreening();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all group ${
                isActive
                  ? "bg-[#132845] border border-amber-400/50 text-amber-300 font-semibold shadow-sm"
                  : item.highlight
                  ? "bg-blue-900/30 border border-blue-500/30 text-cyan-200 hover:bg-blue-900/50"
                  : "text-slate-300 hover:text-white hover:bg-[#0f1f33] border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-amber-400" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                <span className="tracking-wide text-left">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.count !== undefined && item.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-rose-500/30 text-rose-300 border border-rose-500/40">
                    {item.count}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3 h-3 text-amber-400" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Officer & Checkpoint Official Footer */}
      <div className="p-3 border-t border-slate-700/80 bg-[#060c17] space-y-2.5">
        <div className="p-2 rounded bg-[#0f1d33] border border-slate-700 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-slate-400">Terminal Gate</span>
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              ONLINE
            </span>
          </div>
          <div className="mt-0.5 font-bold text-slate-100 text-[11px] truncate">
            Delhi IGI T3 // Gate 04
          </div>
          <div className="text-[10px] font-mono text-amber-400/90">ID: DEL-T3-INTL-04</div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#1b3457] border border-amber-400/40 flex items-center justify-center text-amber-300 font-mono text-xs font-bold flex-shrink-0">
              VS
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-100 truncate">{user?.officerName || "Officer V. Sharma"}</p>
              <p className="text-[10px] font-mono text-slate-400 truncate">Badge: {user?.badgeNumber || "BS-092-DEL"}</p>
            </div>
          </div>

          <button
            onClick={logout}
            title="Logout of Secure Government Session"
            className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};