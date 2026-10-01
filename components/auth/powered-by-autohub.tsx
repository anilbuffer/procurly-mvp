"use client";

import React from "react";

interface PoweredByAutohubProps {
  variant?: "dark" | "light" | "minimal";
  className?: string;
  showSubtext?: boolean;
}

/**
 * Subtle, professional "Powered by AutoHub" corporate signature treatment.
 * Uses official AutoHub brand asset with polished responsive presentation.
 */
export function PoweredByAutohub({
  variant = "dark",
  className = "",
}: PoweredByAutohubProps) {
  // Minimal inline signature (used for compact copyright lines and footers)
  if (variant === "minimal") {
    return (
      <div
        className={`inline-flex items-center select-none ${className}`}
        aria-label="Powered by AutoHub Network"
      >
        <img
          src="/Powered-by-autohub.png"
          alt="Powered by AutoHub"
          className="h-3.5 sm:h-4 w-auto object-contain"
        />
      </div>
    );
  }

  // Light variant (used on light authentication panels and mobile footers)
  if (variant === "light") {
    return (
      <div
        className={`inline-flex items-center px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-xs transition-all duration-200 select-none group ${className}`}
        aria-label="Powered by AutoHub - Global Logistics & Sourcing Network"
      >
        <img
          src="/Powered-by-autohub.png"
          alt="Powered by AutoHub"
          className="h-5 sm:h-6 w-auto object-contain"
        />
      </div>
    );
  }

  // Dark variant (used on rich red / dark brand panel surfaces)
  return (
    <div
      className={`inline-flex items-center px-3.5 py-2 rounded-xl bg-white hover:bg-white shadow-sm hover:shadow transition-all duration-200 select-none group ${className}`}
      aria-label="Powered by AutoHub - Official Sourcing and Logistics Network"
    >
      <img
        src="/Powered-by-autohub.png"
        alt="Powered by AutoHub"
        className="h-6 sm:h-7 w-auto object-contain"
      />
    </div>
  );
}
