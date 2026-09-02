import React, { useState, useEffect } from "react";
import { useScreening } from "../../context/ScreeningContext";
import { useAuth } from "../../context/AuthContext";
import {
  Search,
  Bell,
  MapPin,
  Clock,
  ShieldCheck,
  Scan,
  Activity,
  AlertCircle,
  Building,
  Lock
} from "lucide-react";

export const Topbar = () => {
  const { setActiveTab, startNewScreening, alerts, searchQuery, setSearchQuery } = useScreening();
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadAlerts = alerts.filter((a) => a.status === "OPEN" || a.status === "INVESTIGATING").length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab("identity-search");
    }
  };

  return (
    <header className="bg-[#0a1424] border-b border-slate-700/80 px-6 py-2.5 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-md">
      {/* Search Bar with Gov Code placeholder */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Traveler Name, Passport/Visa ID (e.g. DEMO-28469), DOB..."
            className="w-full bg-[#060c17] border border-slate-700 rounded-md pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all font-mono"
          />
        </div>
      </form>

      {/* Center & Right Status Elements */}
      <div className="flex items-center gap-3.5">
        {/* Checkpoint Station & Gate */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0f1d33] border border-slate-700 text-xs">
          <Building className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 font-mono text-[11px]">CHECKPOINT:</span>
          <span className="font-bold text-slate-100 font-mono text-[11px]">DELHI IGI T3 // GATE-04</span>
        </div>

        {/* Live IST Time Clock */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0f1d33] border border-slate-700 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300">
            {time.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
          <span className="text-amber-400 font-bold">
            {time.toLocaleTimeString("en-GB", { hour12: false })} IST
          </span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setActiveTab("alerts")}
          className="relative p-2 rounded-md bg-[#0f1d33] border border-slate-700 text-slate-300 hover:text-amber-300 hover:border-amber-400/50 transition-all"
          title="Active Immigration & Threat Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadAlerts > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold flex items-center justify-center animate-pulse">
              {unreadAlerts}
            </span>
          )}
        </button>

        {/* Start New Screening CTA */}
        <button
          onClick={() => startNewScreening()}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 border border-blue-400/40 text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-md"
        >
          <Scan className="w-3.5 h-3.5" />
          <span>New Screening</span>
        </button>

        {/* Officer Clearance Pill */}
        <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-slate-700">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-100">{user?.officerName || "Officer V. Sharma"}</div>
            <div className="text-[10px] font-mono text-emerald-400 flex items-center justify-end gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              TIER-3 IMMIGRATION OFFICER
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};