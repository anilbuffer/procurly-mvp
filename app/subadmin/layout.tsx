"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import { SubadminSidebar } from "@/components/subadmin/subadmin-sidebar";
import { SubadminHeader } from "@/components/subadmin/subadmin-header";

export default function SubadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer whenever pathname changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-900 flex antialiased w-full overflow-x-hidden">
      {/* Subadmin Sidebar with Drawer on Mobile */}
      <Suspense fallback={<div className="w-64 bg-slate-900 min-h-screen hidden lg:block"></div>}>
        <SubadminSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
      </Suspense>

      {/* Main Content Area - ml-0 on mobile/tablet, lg:ml-64/20 on desktop */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-h-screen min-w-0 max-w-full overflow-x-hidden ml-0 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Top Header */}
        <SubadminHeader
          onToggleSidebar={() => setCollapsed(!collapsed)}
          isSidebarCollapsed={collapsed}
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
