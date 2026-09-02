import React from "react";

export const Badge = ({ variant = "info", children, size = "md", className = "" }) => {
  const styles = {
    verified: "bg-[#eef7f2] text-[#1e7e48] border border-[#1e7e48]/30",
    success: "bg-[#eef7f2] text-[#1e7e48] border border-[#1e7e48]/30",
    suspicious: "bg-[#fdf8eb] text-[#b4690e] border border-[#b4690e]/30",
    warning: "bg-[#fdf8eb] text-[#b4690e] border border-[#b4690e]/30",
    highRisk: "bg-[#fdf0ee] text-[#b3261e] border border-[#b3261e]/40",
    critical: "bg-[#fdf0ee] text-[#b3261e] border border-[#b3261e]/40",
    danger: "bg-[#fdf0ee] text-[#b3261e] border border-[#b3261e]/40",
    info: "bg-[#edf4fb] text-[#0f3566] border border-[#1a56a4]/30",
    neutral: "bg-[#f0f4f8] text-[#486581] border border-[#d9e2ec]",
    pass: "bg-[#eef7f2] text-[#1e7e48] border border-[#1e7e48]/30",
    fail: "bg-[#fdf0ee] text-[#b3261e] border border-[#b3261e]/40",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase font-mono",
    md: "px-2.5 py-1 text-xs font-semibold tracking-wider uppercase font-mono",
    lg: "px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase font-mono",
  };

  const selectedVariant = styles[variant] || styles.neutral;
  const selectedSize = sizes[size] || sizes.md;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded ${selectedVariant} ${selectedSize} ${className}`}>
      {variant === "verified" || variant === "success" || variant === "pass" ? (
        <span className="w-1.5 h-1.5 rounded-full bg-[#1e7e48]"></span>
      ) : variant === "suspicious" || variant === "warning" ? (
        <span className="w-1.5 h-1.5 rounded-full bg-[#b4690e]"></span>
      ) : variant === "highRisk" || variant === "critical" || variant === "danger" || variant === "fail" ? (
        <span className="w-1.5 h-1.5 rounded-full bg-[#b3261e]"></span>
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-[#1a56a4]"></span>
      )}
      {children}
    </span>
  );
};