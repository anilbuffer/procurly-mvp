"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  ArrowRight,
  Menu,
} from "lucide-react";
import { useGlobalSearch } from "@/context/global-search-context";
import { NotificationPopover } from "./notification-popover";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export function AdminHeader({
  onToggleSidebar,
  isSidebarCollapsed,
}: AdminHeaderProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const [requestedIdParam, setRequestedIdParam] = useState<string | null>(null);
  const { openSearch } = useGlobalSearch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setRequestedIdParam(params.get("id"));
    }
  }, [pathname]);

  // Compute breadcrumb info
  const segments = pathname.split("/").filter(Boolean);
  const currentSection = segments[1] || "dashboard";

  const getSectionTitle = () => {
    switch (currentSection) {
      case "dashboard":
        return "Operational Dashboard";
      case "requests":
        return "Customer Requests";
      case "customers":
        return "Customer Management";
      case "suppliers":
        return "Suppliers";
      case "shipments":
        return "Shipments";
      case "payments":
        return "Payments";
      case "users":
        return "User Management";
      case "settings":
        return "System Settings";
      default:
        return "Admin Portal";
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 px-6 sm:px-8 py-3.5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Sidebar Toggle & Current Page Title */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              type="button"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FE0000]/30 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span>{getSectionTitle()}</span>
            {requestedIdParam && (
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-red-50 text-[#FE0000]  font-bold border border-red-200">
                Workspace
              </span>
            )}
          </h1>
        </div>

        {/* Right: Global Search Trigger, Notification Icon */}
        <div className="flex items-center gap-3">
          {/* Global Search Trigger (Cmd+K) */}
          <button
            type="button"
            onClick={() => openSearch()}
            aria-label="Open Global Search (Cmd+K)"
            className="relative w-full md:w-80 flex items-center justify-between pl-10 pr-3 py-2 text-xs bg-slate-100/90 hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE0000]/30 focus:border-[#FE0000] transition-all shadow-xs text-left cursor-pointer group"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-slate-600 transition-colors pointer-events-none" />
            <span className="truncate">Search invoice #, quotes, parts, ref...</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs shrink-0 group-hover:border-slate-300">
              ⌘K
            </kbd>
          </button>

          {/* Top-Right Notification Icon */}
          <NotificationPopover />
        </div>
      </div>
    </header>
  );
}
