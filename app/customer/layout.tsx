"use client";

import React, { Suspense } from "react";
import { PortalProvider } from "@/context/portal-context";
import { CustomerPortalLayout } from "@/components/portal/customer-portal-layout";

function CustomerLoadingFallback() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center select-none">
      <div className="flex flex-col items-center gap-3">
        <div className="w-11 h-11 rounded-xl border-2 border-white bg-[#FE0000] shadow-md flex items-center justify-center animate-pulse">
          <span className="text-white font-black text-xl tracking-tighter leading-none shrink-0">A</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="font-black italic text-[#0F172A] uppercase text-base tracking-tight leading-none ">
            PROCUR<span className="not-italic font-bold text-slate-500">LY</span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Loading Customer Portal…
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalProvider>
      <Suspense fallback={<CustomerLoadingFallback />}>
        <CustomerPortalLayout>{children}</CustomerPortalLayout>
      </Suspense>
    </PortalProvider>
  );
}
