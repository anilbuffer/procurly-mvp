"use client";

import React, { useState, Suspense } from "react";
import { SubadminSidebar } from "@/components/subadmin/subadmin-sidebar";
import { SubadminHeader } from "@/components/subadmin/subadmin-header";

export default function SubadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-900 flex font-sans antialiased">
      {/* Subadmin Sidebar */}
      <Suspense fallback={<div className="w-64 bg-slate-900 min-h-screen"></div>}>
        <SubadminSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </Suspense>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-h-screen ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Top Header */}
        <SubadminHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
