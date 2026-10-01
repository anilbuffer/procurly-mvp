"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  ArrowRight,
  Bell,
  Menu,
} from "lucide-react";
import { useGlobalSearch } from "@/context/global-search-context";

interface SubadminHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleMobile?: () => void;
}

export function SubadminHeader({
  onToggleSidebar,
  isSidebarCollapsed,
  onToggleMobile,
}: SubadminHeaderProps = {}) {
  const pathname = usePathname();
  const { openSearch } = useGlobalSearch();

  const segments = pathname.split("/").filter(Boolean);
  const currentSection = segments[1] || "dashboard";

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger toggle / Desktop collapse toggle & Page Title */}
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
            <span className="capitalize">Subadmin {currentSection}</span>
          </h1>
        </div>

        {/* Right: Global Search & Notifications */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Search Button */}
          <button
            type="button"
            onClick={() => openSearch()}
            aria-label="Open Global Search"
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer flex items-center justify-center"
          >
            <Search className="w-4 h-4 text-slate-500" />
          </button>

          {/* Desktop Global Search Trigger (Cmd+K) */}
          <button
            type="button"
            onClick={() => openSearch()}
            aria-label="Open Global Search (Cmd+K)"
            className="hidden md:flex relative w-64 lg:w-80 items-center justify-between pl-10 pr-3 py-2 text-xs bg-slate-100/90 hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-[#FE0000] transition-all shadow-xs text-left cursor-pointer group"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-slate-600 transition-colors pointer-events-none" />
            <span className="truncate">Search invoice #, quotes, parts, ref...</span>
            <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs shrink-0 group-hover:border-slate-300">
              ⌘K
            </kbd>
          </button>

          <div className="relative cursor-pointer w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors shrink-0">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </div>
        </div>
      </div>
    </header>
  );
}
