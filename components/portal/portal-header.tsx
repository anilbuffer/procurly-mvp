"use client";

import React, { useEffect } from "react";
import { Search, Menu } from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { useGlobalSearch } from "@/context/global-search-context";
import { NotificationCenter } from "./notification-center";

interface PortalHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleMobile?: () => void;
}

export function PortalHeader({
  onToggleSidebar,
  isSidebarCollapsed,
  onToggleMobile,
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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Sidebar Toggle & Page Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile hamburger toggle (visible < lg) */}
          {onToggleMobile && (
            <button
              onClick={onToggleMobile}
              type="button"
              aria-label="Open navigation drawer"
              className="lg:hidden p-2 -ml-1 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FE0000]/30 cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Desktop collapse toggle (visible >= lg) */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              type="button"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden lg:inline-flex p-2 -ml-2 rounded-xl text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FE0000]/30 cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <h1 className="text-base sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight truncate">
            {getTabTitle()}
          </h1>
        </div>

        {/* Right: Global Search & Notifications */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Search Button (Compact icon trigger) */}
          <button
            type="button"
            onClick={() => openSearch()}
            aria-label="Open Global Search"
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer flex items-center justify-center"
          >
            <Search className="w-4 h-4 text-slate-500" />
          </button>

          {/* Desktop Search Trigger with ⌘K */}
          <button
            type="button"
            onClick={() => openSearch()}
            aria-label="Open Global Search (Cmd+K)"
            className="hidden md:flex relative w-64 lg:w-80 items-center justify-between pl-10 pr-3 py-2 text-xs bg-slate-100/90 hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE0000]/30 focus:border-[#FE0000] transition-all text-left cursor-pointer group shadow-xs"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-slate-600 transition-colors pointer-events-none" />
            <span className="truncate">Search invoice #, quotes, parts, ref...</span>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs shrink-0 group-hover:border-slate-300">
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
