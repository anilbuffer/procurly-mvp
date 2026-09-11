"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { NotificationCenter } from "./notification-center";

export function PortalHeader() {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery } = usePortal();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut ⌘K or Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";
      case "requests":
        return "Parts Requests";
      case "orders":
        return "Procurement Orders";
      case "shipments":
        return "Shipment Tracking";
      case "payments":
        return "Billing & Payments";
      case "settings":
        return "Trade Settings";
      default:
        return "Customer Portal";
    }
  };

  // Sync browser tab title with active portal section
  useEffect(() => {
    document.title = `${getTabTitle()} | Procurly`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-6 sm:px-8 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Breadcrumbs & Page Title */}
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Link
              href="/customer/dashboard"
              className="hover:text-slate-900 transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link
              href="/customer/dashboard"
              className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              Customer Portal
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-[#ED2025] font-semibold">{getTabTitle()}</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {getTabTitle()}
          </h1>
        </div>

        {/* Right: Global Search & Notifications */}
        <div className="flex items-center gap-3">
          {/* Search Bar with ⌘K */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && activeTab !== "requests") {
                  setActiveTab("requests");
                }
              }}
              placeholder="Search requests, orders or shipments..."
              className="w-full pl-10 pr-12 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025] transition-all"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Notifications Bell */}
          <NotificationCenter />
        </div>
      </div>
    </header>
  );
}
