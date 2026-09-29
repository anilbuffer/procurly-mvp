"use client";

import React from "react";

interface PoweredByAutohubProps {
  variant?: "dark" | "light" | "minimal";
  className?: string;
  showSubtext?: boolean;
}

/**
 * Subtle, professional "Powered by AutoHub" corporate signature treatment.
 * Understated executive co-branding adhering strictly to approved AutoHub brand guidelines.
 */
export function PoweredByAutohub({
  variant = "dark",
  className = "",
  showSubtext = true,
}: PoweredByAutohubProps) {
  // Minimal inline signature (used for compact copyright lines and footers)
  if (variant === "minimal") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 select-none ${className}`}
        aria-label="Powered by AutoHub Network"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-500 leading-none">
          Powered by
        </span>
        <div className="w-4 h-4 rounded-sm border border-slate-300/80 bg-[#FE0000] flex items-center justify-center shrink-0 shadow-2xs">
          <span className="text-white font-black text-[9px] tracking-tighter leading-none">
            A
          </span>
        </div>
        <span className="text-[11px] font-bold tracking-wider text-slate-700 uppercase font-sans leading-none">
          AutoHub
        </span>
      </div>
    );
  }

  // Light variant (used on light authentication panels and mobile footers)
  if (variant === "light") {
    return (
      <div
        className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/70 border border-slate-200/80 transition-colors duration-200 select-none group ${className}`}
        aria-label="Powered by AutoHub - Global Logistics & Sourcing Network"
      >
        {/* Approved AutoHub 'A' Logo Emblem Badge */}
        <div className="w-6 h-6 rounded-md border border-white bg-[#FE0000] shadow-xs flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
          <span className="text-white font-black text-[11px] tracking-tighter leading-none">
            A
          </span>
        </div>

        {/* Subtle Typographic Signature */}
        <div className="flex flex-col text-left">
          <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-slate-600 leading-none">
            POWERED BY
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xs font-bold tracking-[0.12em] text-slate-800 uppercase font-sans leading-none">
              AUTOHUB
            </span>
            {showSubtext && (
              <span className="text-[9px] text-slate-600 tracking-normal font-medium hidden sm:inline leading-none">
                • Global Sourcing Network
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dark variant (used on rich red / dark brand panel surfaces)
  return (
    <div
      className={`inline-flex flex-col gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/12 backdrop-blur-xs transition-all duration-200 select-none group ${className}`}
      aria-label="Powered by AutoHub - Official Sourcing and Logistics Network"
    >
      {/* Top line: Powered by + A icon + AUTOHUB — all on one row */}
      <div className="flex items-center gap-2.5">
        <span className="text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.22em] text-white/80 leading-none whitespace-nowrap">
          Powered by
        </span>
        {/* Approved AutoHub 'A' Logo Emblem Badge */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-white/40 bg-[#FE0000] shadow-xs flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
          <span className="text-white font-black text-xs sm:text-sm tracking-tighter leading-none">
            A
          </span>
        </div>
        <span className="text-xs sm:text-sm font-black tracking-[0.14em] text-white uppercase font-sans leading-none whitespace-nowrap">
          AUTOHUB
        </span>
      </div>
      {/* Bottom line: • Global Logistics & Sourcing */}
      {showSubtext && (
        <span className="text-[10px] sm:text-[12px] text-white/70 tracking-wide font-medium leading-none pl-0.5">
          • Global Logistics &amp; Sourcing
        </span>
      )}
    </div>
  );
}
