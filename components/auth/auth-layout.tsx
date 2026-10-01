"use client";

import React from "react";
import { BrandPanel } from "@/components/auth/brand-panel";
import { PoweredByAutohub } from "@/components/auth/powered-by-autohub";

interface AuthLayoutProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export function AuthLayout({ children, maxWidth = "max-w-[430px]" }: AuthLayoutProps) {
  return (
    <main className="w-full min-h-[100dvh] lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-[#EAECEF] antialiased">
      {/* Mobile Top Header (Visible only on <1024px screens) - Ultra Premium Brand Gradient */}
      <header className="lg:hidden sticky top-0 w-full bg-gradient-to-r from-[#D9141B] via-[#C40E14] to-[#8A080C] text-white px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between shadow-md border-b border-red-900/30 z-30 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg border-2 border-white/90 bg-[#FE0000] flex items-center justify-center font-black text-sm leading-none text-white shadow-xs shrink-0">
            P
          </div>
          <div className="flex flex-col">
            <span className="font-black italic text-lg tracking-tight text-white uppercase leading-none">
              PROCUR<span className="not-italic font-bold text-white/95">LY</span>
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-4 h-0.5 rounded-full bg-white/80" />
              <div className="w-1.5 h-0.5 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
        <span className="text-[10px] font-extrabold tracking-widest text-white uppercase px-2.5 py-1 rounded-md bg-white/20 border border-white/25 shadow-2xs backdrop-blur-xs select-none">
          TRADE PORTAL
        </span>
      </header>

      {/* Desktop Left Brand Panel: 50% Width, 100vh */}
      <div className="hidden lg:block lg:w-1/2 h-full z-10 relative">
        <BrandPanel />
      </div>

      {/* Right Authentication Panel: 50% Width on desktop, full-width on mobile */}
      <section
        aria-label="Account Access & Verification"
        className="w-full lg:w-1/2 min-h-[calc(100dvh-57px)] lg:min-h-full flex flex-col justify-between items-center px-3.5 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 lg:py-10 bg-[#EAECEF] overflow-y-auto overflow-x-hidden"
      >
        <div className={`w-full ${maxWidth} my-auto py-2`}>
          {children}
        </div>

        {/* Bottom of Page Footer with Subtle Powered by AutoHub Signature & Legal Links */}
        <footer className={`w-full ${maxWidth} pt-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center flex flex-col items-center gap-2.5 select-none`}>
          {/* Mobile view subtle Powered by AutoHub mark */}
          <div className="lg:hidden w-full flex justify-center py-1">
            <PoweredByAutohub variant="light" />
          </div>

          {/* Desktop subtle co-branding signature */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] text-slate-500 font-medium">
            <span>© 2026 Procurly Ltd.</span>
            <span className="text-slate-300">•</span>
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FE0000] active:text-[#FE0000] transition-colors underline underline-offset-2 py-0.5 px-1"
            >
              Terms of Trade
            </a>
            <span className="text-slate-300">•</span>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FE0000] active:text-[#FE0000] transition-colors underline underline-offset-2 py-0.5 px-1"
            >
              Privacy Policy
            </a>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="hidden lg:inline-flex">
              <PoweredByAutohub variant="minimal" />
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
