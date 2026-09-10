"use client";

import React, { useState } from "react";
import { Sliders, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { clsx } from "clsx";

export type AuthStateType =
  | "initial"
  | "invalid_code"
  | "expired_code"
  | "too_many_attempts"
  | "qr_expired"
  | "cannot_scan"
  | "loading"
  | "success"
  | "account_locked"
  | "session_expired";

interface AuthStateSimulatorProps {
  currentState: AuthStateType;
  onStateChange: (state: AuthStateType) => void;
}

const STATES: { id: AuthStateType; label: string; number: number }[] = [
  { id: "initial", label: "Initial MFA Setup", number: 1 },
  { id: "invalid_code", label: "Invalid MFA Code", number: 2 },
  { id: "expired_code", label: "Expired MFA Code", number: 3 },
  { id: "too_many_attempts", label: "Too Many Attempts", number: 4 },
  { id: "qr_expired", label: "QR Code Expired", number: 5 },
  { id: "cannot_scan", label: "Cannot Scan QR", number: 6 },
  { id: "loading", label: "Verification Loading", number: 7 },
  { id: "success", label: "Verification Successful", number: 8 },
  { id: "account_locked", label: "Account Locked", number: 9 },
  { id: "session_expired", label: "Session Expired", number: 10 },
];

export function AuthStateSimulator({
  currentState,
  onStateChange,
}: AuthStateSimulatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full mt-6 pt-4 border-t border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          aria-expanded={isExpanded}
        >
          <Sliders className="w-3.5 h-3.5 text-[#ED2025]" />
          <span>Test 10 Auth States (QA Controls)</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
          State: {STATES.find((s) => s.id === currentState)?.number}/10
        </span>
      </div>

      {isExpanded && (
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm animate-in fade-in-50 duration-150">
          <p className="text-[11px] text-slate-500 mb-2.5">
            Click any state to preview the enterprise UX & error handling:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-1.5">
            {STATES.map((state) => {
              const isActive = currentState === state.id;
              return (
                <button
                  key={state.id}
                  type="button"
                  onClick={() => onStateChange(state.id)}
                  className={clsx(
                    "flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                    isActive
                      ? "bg-[#ED2025] text-white shadow-2xs font-semibold"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
                  )}
                >
                  <span className="truncate">
                    {state.number}. {state.label}
                  </span>
                  {isActive && <CheckCircle2 className="w-3 h-3 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
