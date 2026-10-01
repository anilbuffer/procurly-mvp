"use client";

import React, { useEffect, useRef } from "react";
import { Search, Menu } from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { NotificationCenter } from "./notification-center";

interface PortalHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export function PortalHeader({
  onToggleSidebar,
  isSidebarCollapsed,
}: PortalHeaderProps = {}) {
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
        {/* Left: Sidebar Toggle & Page Title */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              type="button"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="p-2 -ml-2 rounded-xl text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FE0000]/30 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
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
              className="w-full pl-10 pr-12 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE0000]/30 focus:border-[#FE0000] transition-all"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px]  font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
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
