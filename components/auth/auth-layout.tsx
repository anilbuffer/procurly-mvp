"use client";

import React from "react";
import { BrandPanel } from "@/components/auth/brand-panel";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="w-full min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-[#EAECEF]">
      {/* Mobile Top Header (Visible only on <1024px screens) */}
      <header className="lg:hidden w-full bg-[#B30D12] text-white px-5 py-3.5 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg border border-white flex items-center justify-center font-black text-sm leading-none text-white bg-[#C40E14]">
            A
          </div>
          <span className="font-black italic text-lg tracking-tight text-white uppercase leading-none">
            PROCUR<span className="not-italic">LY</span>
          </span>
        </div>
        <span className="text-[10px] font-bold tracking-widest text-white/90 uppercase px-2 py-0.5 rounded bg-white/15">
          AUTOHUB PROCUREMENT
        </span>
      </header>

      {/* Desktop Left Brand Panel: 50% Width, 100vh */}
      <div className="hidden lg:block lg:w-1/2 h-full z-10 relative">
        <BrandPanel />
      </div>

      {/* Right Authentication Panel: 50% Width on desktop, full-width on mobile */}
      <section
        aria-label="Account Access & Verification"
        className="w-full lg:w-1/2 min-h-[calc(100vh-60px)] lg:min-h-full flex flex-col justify-center items-center px-6 sm:px-12 py-10 lg:py-16 bg-[#EAECEF] overflow-y-auto"
      >
        <div className="w-full max-w-[430px] my-auto">
          {children}
        </div>
      </section>
    </main>
  );
}
