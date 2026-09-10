"use client";

import React, { Suspense } from "react";
import { PortalProvider } from "@/context/portal-context";
import { CustomerPortalLayout } from "@/components/portal/customer-portal-layout";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ED2025] to-[#B91C1C] flex items-center justify-center shadow-md animate-pulse">
          <span className="text-white font-black text-lg">P</span>
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Portal…</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PortalProvider>
      <Suspense fallback={<LoadingFallback />}>
        <CustomerPortalLayout />
      </Suspense>
    </PortalProvider>
  );
}
