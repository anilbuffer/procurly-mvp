"use client";

import React from "react";
import { clsx } from "clsx";

interface MfaCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
}

export function MfaCodeInput({
  value,
  onChange,
  disabled = false,
  hasError = false,
  autoFocus = true,
}: MfaCodeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Digits only, max 6
    const clean = e.target.value.replace(/\D/g, "").slice(0, 6);
    onChange(clean);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(paste);
  };

  return (
    <div className="w-full space-y-1.5">
      <label
        htmlFor="authenticator-code"
        className="block text-[13px] font-bold text-[#1E293B] select-none"
      >
        Authenticator code
      </label>

      {/* Single Unified Input Box matching reference image */}
      <div className="relative">
        <input
          id="authenticator-code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          autoComplete="one-time-code"
          autoFocus={autoFocus}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          onPaste={handlePaste}
          placeholder=""
          aria-label="Authenticator code"
          className={clsx(
            "w-full h-12 px-4 bg-white rounded-lg text-slate-900 font-mono text-base tracking-[0.25em] font-semibold transition-all",
            "bg-[#E8EAEF]/60 border border-slate-300 shadow-2xs",
            "focus:bg-white focus:outline-none focus:border-[#C40E14] focus:ring-2 focus:ring-[#C40E14]/20",
            hasError && "border-red-500 bg-red-50/40 text-red-900 focus:border-red-600 focus:ring-red-500/20",
            disabled && "bg-slate-200/60 text-slate-400 cursor-not-allowed border-slate-300"
          )}
        />
        {value.length > 0 && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-400 pointer-events-none">
            {value.length}/6
          </span>
        )}
      </div>
    </div>
  );
}
