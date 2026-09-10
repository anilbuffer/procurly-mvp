"use client";

import React from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface MfaQrCodeProps {
  isExpired?: boolean;
  onRefresh?: () => void;
  secondsRemaining?: number;
}

export function MfaQrCode({
  isExpired = false,
  onRefresh,
  secondsRemaining = 285,
}: MfaQrCodeProps) {
  return (
    <div className="relative inline-block select-none my-2">
      {/* QR Code Container matching reference image */}
      <div className="relative w-[185px] h-[185px] bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-xs flex items-center justify-center">
        {/* Dense Realistic QR Code matching reference */}
        <svg
          viewBox="0 0 145 145"
          className="w-full h-full text-black"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Authenticator setup QR code"
        >
          {/* Top-Left Finder Pattern (7x7) */}
          <rect x="5" y="5" width="35" height="35" rx="1" fill="#000000" />
          <rect x="10" y="10" width="25" height="25" fill="#ffffff" />
          <rect x="15" y="15" width="15" height="15" fill="#000000" />

          {/* Top-Right Finder Pattern (7x7) */}
          <rect x="105" y="5" width="35" height="35" rx="1" fill="#000000" />
          <rect x="110" y="10" width="25" height="25" fill="#ffffff" />
          <rect x="115" y="15" width="15" height="15" fill="#000000" />

          {/* Bottom-Left Finder Pattern (7x7) */}
          <rect x="5" y="105" width="35" height="35" rx="1" fill="#000000" />
          <rect x="10" y="110" width="25" height="25" fill="#ffffff" />
          <rect x="15" y="115" width="15" height="15" fill="#000000" />

          {/* Alignment Pattern (5x5 around x=107, y=107) */}
          <rect x="100" y="100" width="25" height="25" fill="#000000" />
          <rect x="105" y="105" width="15" height="15" fill="#ffffff" />
          <rect x="110" y="110" width="5" height="5" fill="#000000" />

          {/* Horizontal timing pattern */}
          <rect x="45" y="20" width="5" height="5" />
          <rect x="55" y="20" width="5" height="5" />
          <rect x="65" y="20" width="5" height="5" />
          <rect x="75" y="20" width="5" height="5" />
          <rect x="85" y="20" width="5" height="5" />
          <rect x="95" y="20" width="5" height="5" />

          {/* Vertical timing pattern */}
          <rect x="20" y="45" width="5" height="5" />
          <rect x="20" y="55" width="5" height="5" />
          <rect x="20" y="65" width="5" height="5" />
          <rect x="20" y="75" width="5" height="5" />
          <rect x="20" y="85" width="5" height="5" />
          <rect x="20" y="95" width="5" height="5" />

          {/* Dense High-Density Data Matrix Dots matching reference screenshot */}
          <rect x="45" y="10" width="5" height="5" />
          <rect x="55" y="10" width="5" height="5" />
          <rect x="70" y="10" width="5" height="5" />
          <rect x="85" y="10" width="5" height="5" />
          <rect x="95" y="10" width="5" height="5" />

          <rect x="45" y="30" width="5" height="5" />
          <rect x="60" y="30" width="5" height="5" />
          <rect x="75" y="30" width="5" height="5" />
          <rect x="90" y="30" width="5" height="5" />

          <rect x="10" y="45" width="5" height="5" />
          <rect x="30" y="45" width="5" height="5" />
          <rect x="40" y="45" width="5" height="5" />
          <rect x="50" y="45" width="5" height="5" />
          <rect x="60" y="45" width="5" height="5" />
          <rect x="75" y="45" width="5" height="5" />
          <rect x="85" y="45" width="5" height="5" />
          <rect x="100" y="45" width="5" height="5" />
          <rect x="115" y="45" width="5" height="5" />
          <rect x="125" y="45" width="5" height="5" />
          <rect x="135" y="45" width="5" height="5" />

          <rect x="10" y="55" width="5" height="5" />
          <rect x="35" y="55" width="5" height="5" />
          <rect x="45" y="55" width="5" height="5" />
          <rect x="55" y="55" width="5" height="5" />
          <rect x="70" y="55" width="5" height="5" />
          <rect x="80" y="55" width="5" height="5" />
          <rect x="95" y="55" width="5" height="5" />
          <rect x="110" y="55" width="5" height="5" />
          <rect x="130" y="55" width="5" height="5" />

          <rect x="30" y="65" width="5" height="5" />
          <rect x="40" y="65" width="5" height="5" />
          <rect x="65" y="65" width="5" height="5" />
          <rect x="80" y="65" width="5" height="5" />
          <rect x="90" y="65" width="5" height="5" />
          <rect x="105" y="65" width="5" height="5" />
          <rect x="120" y="65" width="5" height="5" />
          <rect x="135" y="65" width="5" height="5" />

          <rect x="10" y="75" width="5" height="5" />
          <rect x="30" y="75" width="5" height="5" />
          <rect x="50" y="75" width="5" height="5" />
          <rect x="60" y="75" width="5" height="5" />
          <rect x="75" y="75" width="5" height="5" />
          <rect x="85" y="75" width="5" height="5" />
          <rect x="100" y="75" width="5" height="5" />
          <rect x="115" y="75" width="5" height="5" />
          <rect x="130" y="75" width="5" height="5" />

          <rect x="35" y="85" width="5" height="5" />
          <rect x="45" y="85" width="5" height="5" />
          <rect x="60" y="85" width="5" height="5" />
          <rect x="70" y="85" width="5" height="5" />
          <rect x="90" y="85" width="5" height="5" />
          <rect x="110" y="85" width="5" height="5" />
          <rect x="125" y="85" width="5" height="5" />
          <rect x="135" y="85" width="5" height="5" />

          <rect x="10" y="95" width="5" height="5" />
          <rect x="30" y="95" width="5" height="5" />
          <rect x="50" y="95" width="5" height="5" />
          <rect x="65" y="95" width="5" height="5" />
          <rect x="80" y="95" width="5" height="5" />
          <rect x="95" y="95" width="5" height="5" />
          <rect x="130" y="95" width="5" height="5" />

          <rect x="45" y="105" width="5" height="5" />
          <rect x="55" y="105" width="5" height="5" />
          <rect x="70" y="105" width="5" height="5" />
          <rect x="85" y="105" width="5" height="5" />
          <rect x="135" y="105" width="5" height="5" />

          <rect x="50" y="115" width="5" height="5" />
          <rect x="65" y="115" width="5" height="5" />
          <rect x="80" y="115" width="5" height="5" />
          <rect x="90" y="115" width="5" height="5" />
          <rect x="130" y="115" width="5" height="5" />

          <rect x="45" y="125" width="5" height="5" />
          <rect x="60" y="125" width="5" height="5" />
          <rect x="75" y="125" width="5" height="5" />
          <rect x="85" y="125" width="5" height="5" />
          <rect x="100" y="125" width="5" height="5" />
          <rect x="115" y="125" width="5" height="5" />
          <rect x="125" y="125" width="5" height="5" />

          <rect x="50" y="135" width="5" height="5" />
          <rect x="70" y="135" width="5" height="5" />
          <rect x="90" y="135" width="5" height="5" />
          <rect x="105" y="135" width="5" height="5" />
          <rect x="135" y="135" width="5" height="5" />
        </svg>

        {/* Expired State Overlay */}
        {isExpired && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-[2px] rounded-lg flex flex-col items-center justify-center p-3 text-center transition-all">
            <AlertTriangle className="w-6 h-6 text-[#DC2626] mb-1" />
            <p className="text-xs font-bold text-slate-800">QR Code Expired</p>
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-[#ED2025] text-white hover:bg-[#D81419] transition-colors shadow-sm"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Regenerate</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
