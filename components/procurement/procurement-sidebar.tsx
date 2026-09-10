"use client";

import React from "react";
import {
  LayoutGrid,
  Search as SearchIcon,
  FileText,
  Building2,
  FileCheck,
  ShoppingCart,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  KeyRound,
  UserCog,
  ArrowRightLeft,
} from "lucide-react";
import { useProcurement } from "@/context/procurement-context";
import { ProcurementTab } from "@/types/procurement";
import Link from "next/link";

interface ProcurementSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function ProcurementSidebar({
  collapsed = false,
  onToggleCollapse,
}: ProcurementSidebarProps) {
  const { activeTab, setActiveTab, metrics } = useProcurement();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const navItems: {
    id: ProcurementTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    {
      id: "sourcing",
      label: "Sourcing Queue",
      icon: SearchIcon,
      badge: metrics.sourcing + metrics.newRequests,
      badgeColor: "bg-[#ED2025] text-white",
    },
    { id: "requests", label: "Requests", icon: FileText },
    { id: "suppliers", label: "Suppliers", icon: Building2 },
    {
      id: "quotes",
      label: "Quotes",
      icon: FileCheck,
      badge: metrics.quotesReady > 0 ? metrics.quotesReady : undefined,
      badgeColor: "bg-amber-500 text-white",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      badge: metrics.ordersInProgress > 0 ? metrics.ordersInProgress : undefined,
      badgeColor: "bg-blue-600 text-white",
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-[#0C101A] border-r border-[#1E2538] transition-all duration-300 flex flex-col justify-between select-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#1E2538]/60">
          <Link
            href="/procurement?tab=dashboard"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("dashboard");
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ED2025] to-[#B91C1C] flex items-center justify-center shadow-md shadow-[#ED2025]/30">
              <span className="text-white font-black text-lg tracking-wider">P</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-white font-black text-lg tracking-tight leading-none group-hover:text-red-400 transition-colors">
                  PROCUR<span className="text-[#ED2025]">ly</span>
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Procurement Portal
                </span>
              </div>
            )}
          </Link>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="w-7 h-7 rounded-lg bg-[#182033] hover:bg-[#222C46] text-slate-400 hover:text-white flex items-center justify-center transition-all"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="px-3 py-4 space-y-6">
          {/* Procurement Section */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Procurement
              </div>
            )}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const href = `/procurement?tab=${item.id}`;
                return (
                  <Link
                    key={item.id}
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(item.id);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? "bg-[#1E2538] text-white shadow-inner font-bold"
                        : "text-slate-400 hover:text-white hover:bg-[#151C2C]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? "text-[#ED2025]"
                            : "text-slate-400 group-hover:text-white"
                        }`}
                      />
                      {!collapsed && <span>{item.label}</span>}
                    </div>

                    {!collapsed && item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.badgeColor || "bg-slate-700 text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Divider */}
          <div className="border-t border-[#1E2538]/60" />

          {/* Settings Section */}
          <div>
            <nav className="space-y-1">
              <Link
                href="/procurement?tab=settings"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("settings");
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  activeTab === "settings"
                    ? "bg-[#1E2538] text-white shadow-inner font-bold"
                    : "text-slate-400 hover:text-white hover:bg-[#151C2C]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings
                    className={`w-4 h-4 transition-colors ${
                      activeTab === "settings"
                        ? "text-[#ED2025]"
                        : "text-slate-400 group-hover:text-white"
                    }`}
                  />
                  {!collapsed && <span>Settings</span>}
                </div>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-3 border-t border-[#1E2538]/60 relative">
        <div
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center justify-between p-2 rounded-xl bg-[#141B2B] hover:bg-[#1B2338] cursor-pointer transition-all border border-[#1E2538]/40"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ED2025] to-[#B91C1C] text-white font-bold text-xs flex items-center justify-center shadow-md shadow-red-500/20 shrink-0">
              SJ
            </div>
            {!collapsed && (
              <div className="truncate text-left">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  Sarah Jenkins
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  Senior Sourcing Specialist
                </p>
              </div>
            )}
          </div>
          {!collapsed && <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
        </div>

        {/* User dropdown popover */}
        {showUserMenu && !collapsed && (
          <div className="absolute bottom-16 left-3 right-3 bg-[#182033] border border-[#27324D] rounded-xl shadow-2xl p-2.5 space-y-2 z-50 text-xs text-slate-200">
            <div className="px-2 py-1 border-b border-[#27324D]/60 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Autohub Procurement
              </span>
              <p className="font-bold text-white text-xs mt-0.5">Sourcing Desk</p>
            </div>
            <button
              onClick={() => {
                setActiveTab("settings");
                setShowUserMenu(false);
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#222C46] text-slate-300 hover:text-white transition-colors"
            >
              <UserCog className="w-3.5 h-3.5 text-emerald-400" />
              <span>Staff Profile & Settings</span>
            </button>
            <Link
              href="/dashboard"
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-red-500/15 text-red-400 hover:text-red-300 transition-colors font-medium"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-red-400" />
              <span>Switch to Customer Portal</span>
            </Link>
            <Link
              href="/login?mode=change_password"
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#222C46] text-slate-300 hover:text-white transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Change Password</span>
            </Link>
            <Link
              href="/login"
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
