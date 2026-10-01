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
    <main className="w-full min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-[#EAECEF]">
      {/* Mobile Top Header (Visible only on <1024px screens) */}
      <header className="lg:hidden w-full bg-[#FE0000] text-white px-5 py-3.5 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg border border-white flex items-center justify-center font-black text-sm leading-none text-white bg-[#FE0000] shadow-xs">
            A
          </div>
          <span className="font-black italic text-lg tracking-tight text-white uppercase leading-none ">
            PROCUR<span className="not-italic font-bold text-white/90">LY</span>
          </span>
        </div>
        <span className="text-[10px] font-bold tracking-widest text-white/90 uppercase px-2.5 py-0.5 rounded bg-white/15">
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
        className="w-full lg:w-1/2 min-h-[calc(100vh-60px)] lg:min-h-full flex flex-col justify-between items-center px-4 sm:px-8 lg:px-12 py-8 lg:py-10 bg-[#EAECEF] overflow-y-auto"
      >
        <div className={`w-full ${maxWidth} my-auto`}>
          {children}
        </div>

        {/* Bottom of Page Footer with Subtle Powered by AutoHub Signature & Legal Links */}
        <footer className={`w-full ${maxWidth} pt-6 pb-2 text-center flex flex-col items-center gap-2.5 select-none`}>
          {/* Mobile view subtle Powered by AutoHub mark */}
          <div className="lg:hidden w-full flex justify-center">
            <PoweredByAutohub variant="light" />
          </div>

          {/* Desktop subtle co-branding signature */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-500 font-medium">
            <span>© 2026 Procurly Ltd.</span>
            <span className="text-slate-300">•</span>
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FE0000] transition-colors underline underline-offset-2"
            >
              Terms of Trade
            </a>
            <span className="text-slate-300">•</span>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FE0000] transition-colors underline underline-offset-2"
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
