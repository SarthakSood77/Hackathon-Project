import React from "react";

export const StatCard = ({ title, value, subtitle, trend, icon: Icon, color = "blue", alertCount }) => {
  const colorMap = {
    blue: {
      border: "border-[#d9e2ec] hover:border-[#0B1F51]",
      iconBg: "bg-[#edf4fb] text-[#0B1F51]",
      valColor: "text-[#0B1F51]"
    },
    green: {
      border: "border-[#d9e2ec] hover:border-[#1e7e48]",
      iconBg: "bg-[#eef7f2] text-[#1e7e48]",
      valColor: "text-[#1e7e48]"
    },
    amber: {
      border: "border-[#d9e2ec] hover:border-[#b4690e]",
      iconBg: "bg-[#fdf8eb] text-[#b4690e]",
      valColor: "text-[#b4690e]"
    },
    red: {
      border: "border-[#d9e2ec] hover:border-[#b3261e]",
      iconBg: "bg-[#fdf0ee] text-[#b3261e]",
      valColor: "text-[#b3261e]"
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`bg-white border ${scheme.border} rounded-xl p-5 shadow-[0_2px_8px_rgba(11,31,81,0.04)] transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#627d98] font-mono">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg ${scheme.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span className={`text-3xl font-serif font-bold tracking-tight ${scheme.valColor}`}>{value}</span>
        {alertCount && (
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#fdf0ee] text-[#b3261e] border border-[#b3261e]/30">
            {alertCount} Active
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[#627d98] border-t border-[#f0f4f8] pt-2.5 font-sans">
        <span>{subtitle}</span>
        {trend && <span className="font-mono text-[#0B1F51] font-semibold">{trend}</span>}
      </div>
    </div>
  );
};