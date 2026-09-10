"use client";

import React from "react";

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string; // Tailwind color name e.g. "blue", "amber", "emerald"
  onClick?: () => void;
}

const COLOR_MAP: Record<string, { bg: string; text: string; hoverBorder: string; iconBg: string; iconHoverBg: string }> = {
  blue:    { bg: "bg-blue-50",    text: "text-blue-600",    hoverBorder: "hover:border-blue-300",    iconBg: "bg-blue-50 text-blue-600",    iconHoverBg: "group-hover:bg-blue-600 group-hover:text-white" },
  indigo:  { bg: "bg-indigo-50",  text: "text-indigo-600",  hoverBorder: "hover:border-indigo-300",  iconBg: "bg-indigo-50 text-indigo-600",  iconHoverBg: "group-hover:bg-indigo-600 group-hover:text-white" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-600",   hoverBorder: "hover:border-amber-300",   iconBg: "bg-amber-50 text-amber-700",   iconHoverBg: "group-hover:bg-amber-500 group-hover:text-white" },
  orange:  { bg: "bg-orange-50",  text: "text-orange-600",  hoverBorder: "hover:border-orange-300",  iconBg: "bg-orange-50 text-orange-600",  iconHoverBg: "group-hover:bg-orange-600 group-hover:text-white" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", hoverBorder: "hover:border-emerald-300", iconBg: "bg-emerald-50 text-emerald-600", iconHoverBg: "group-hover:bg-emerald-600 group-hover:text-white" },
  sky:     { bg: "bg-sky-50",     text: "text-sky-600",     hoverBorder: "hover:border-sky-300",     iconBg: "bg-sky-50 text-sky-600",     iconHoverBg: "group-hover:bg-sky-600 group-hover:text-white" },
  red:     { bg: "bg-red-50",     text: "text-red-600",     hoverBorder: "hover:border-red-300",     iconBg: "bg-red-50 text-red-600",     iconHoverBg: "group-hover:bg-red-600 group-hover:text-white" },
};

export function SummaryCard({ label, value, icon: Icon, color, onClick }: SummaryCardProps) {
  const c = COLOR_MAP[color] || COLOR_MAP.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md ${c.hoverBorder} p-5 flex items-start justify-between transition-all group ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="space-y-1">
        <span
          className={`text-[11px] font-bold text-slate-500 ${onClick ? `group-hover:${c.text}` : ""} transition-colors tracking-wider uppercase`}
        >
          {label}
        </span>
        <div
          className={`text-3xl font-black text-slate-900 ${onClick ? `group-hover:${c.text}` : ""} transition-colors`}
        >
          {value < 10 ? `0${value}` : value}
        </div>
      </div>
      <div
        className={`w-10 h-10 rounded-xl ${c.iconBg} ${onClick ? c.iconHoverBg : ""} transition-all flex items-center justify-center`}
      >
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
