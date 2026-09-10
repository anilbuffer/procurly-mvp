"use client";

import React, { useState } from "react";
import { Copy, Check, KeyRound } from "lucide-react";
import { clsx } from "clsx";

interface MfaHelpAccordionProps {
  setupKey?: string;
  defaultOpen?: boolean;
}

export function MfaHelpAccordion({
  setupKey = "AHUB 7K9M 2PV8 N3BQ",
  defaultOpen = false,
}: MfaHelpAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(setupKey.replace(/\s+/g, ""));
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  return (
    <div className="w-full my-3 transition-all duration-200">
      {/* Toggle Button matching reference image: ▶ Cannot scan the code? */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="group flex items-center gap-1.5 py-1 text-[13px] font-bold text-[#ED2025] hover:text-[#C40E14] transition-colors select-none"
      >
        <span
          className={clsx(
            "text-[10px] transform transition-transform duration-200 leading-none",
            isOpen ? "rotate-90" : "rotate-0"
          )}
        >
          ▶
        </span>
        <span className="hover:underline">Cannot scan the code?</span>
      </button>

      {/* Expanded Manual Key Section */}
      {isOpen && (
        <div className="mt-2.5 p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs animate-in fade-in-50 slide-in-from-top-1 duration-150 text-left">
          <div className="flex items-center gap-2 mb-1.5 text-slate-800">
            <KeyRound className="w-4 h-4 text-[#ED2025] shrink-0" />
            <h4 className="text-xs font-bold">Can&apos;t scan the QR code?</h4>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            Enter this setup key manually in your authenticator application.
          </p>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Setup key:
            </span>
            <div className="flex items-center justify-between gap-2 p-2 rounded-md bg-slate-50 border border-slate-200">
              <span className="font-mono text-xs font-bold tracking-wider text-slate-900 select-all">
                {setupKey}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className={clsx(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all",
                  hasCopied
                    ? "bg-emerald-600 text-white"
                    : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs"
                )}
                aria-label={hasCopied ? "Key copied" : "Copy setup key"}
              >
                {hasCopied ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
