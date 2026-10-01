"use client";

import React, { useEffect } from "react";
import { Search, Menu } from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { useGlobalSearch } from "@/context/global-search-context";
import { NotificationCenter } from "./notification-center";

interface PortalHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export function PortalHeader({
  onToggleSidebar,
  isSidebarCollapsed,
}: PortalHeaderProps = {}) {
  const { activeTab } = usePortal();
  const { openSearch } = useGlobalSearch();

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
          {/* Search Trigger with ⌘K */}
          <button
            type="button"
            onClick={() => openSearch()}
            aria-label="Open Global Search (Cmd+K)"
            className="relative w-full md:w-80 flex items-center justify-between pl-10 pr-3 py-2 text-xs bg-slate-100/90 hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE0000]/30 focus:border-[#FE0000] transition-all text-left cursor-pointer group shadow-xs"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-slate-600 transition-colors pointer-events-none" />
            <span className="truncate">Search invoice #, quotes, parts, ref...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs shrink-0 group-hover:border-slate-300">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Bell */}
          <NotificationCenter />
        </div>
      </div>
    </header>
  );
}
