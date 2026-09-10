"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutGrid,
  FileText,
  CheckSquare,
  Truck,
  CreditCard,
  FolderArchive,
  Settings,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCheck,
  KeyRound,
} from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { PortalTab } from "@/types/portal";

interface PortalSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function PortalSidebar({ collapsed = false, onToggleCollapse }: PortalSidebarProps) {
  const { activeTab, setActiveTab, setIsNewRequestModalOpen, metrics } = usePortal();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const navItems: {
    id: PortalTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    {
      id: "requests",
      label: "Requests",
      icon: FileText,
      badge: 3,
      badgeColor: "bg-[#ED2025] text-white",
    },
    { id: "orders", label: "Orders", icon: CheckSquare },
    {
      id: "shipments",
      label: "Shipments",
      icon: Truck,
      badge: 4,
      badgeColor: "bg-[#2563EB] text-white",
    },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "documents", label: "Documents", icon: FolderArchive },
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
          <div
            onClick={() => setActiveTab("dashboard")}
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
                  Customer Portal
                </span>
              </div>
            )}
          </div>

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

        {/* Action Button: + NEW PARTS REQUEST */}
        <div className="p-4">
          <button
            onClick={() => setIsNewRequestModalOpen(true)}
            className={`w-full bg-gradient-to-r from-[#ED2025] to-[#E11D48] hover:from-[#d11a1f] hover:to-[#be123c] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#ED2025]/25 hover:shadow-xl hover:shadow-[#ED2025]/35 transition-all transform active:scale-95 flex items-center justify-center gap-2 py-3 px-3.5`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            {!collapsed && <span>New Parts Request</span>}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="px-3 py-2 space-y-6">
          {/* Main Section */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Main
              </div>
            )}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
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

                    {!collapsed && item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.badgeColor || "bg-slate-700 text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Settings Section */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Settings
              </div>
            )}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("settings")}
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
              </button>
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              JW
            </div>
            {!collapsed && (
              <div className="truncate text-left">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  James Wilson
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  Service Manager
                </p>
              </div>
            )}
          </div>
          {!collapsed && <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
        </div>

        {/* User dropdown popover */}
        {showUserMenu && !collapsed && (
          <div className="absolute bottom-16 left-3 right-3 bg-[#182033] border border-[#27324D] rounded-xl shadow-2xl p-2.5 space-y-2 z-50 text-xs text-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="px-2 py-1 border-b border-[#27324D]/60 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Customer Account
              </span>
              <p className="font-bold text-white text-xs mt-0.5">SP Motors Auckland</p>
              <p className="text-[10px] text-slate-400 font-mono">NZBN: 9429049988776</p>
            </div>
            <button
              onClick={() => {
                setActiveTab("settings");
                setShowUserMenu(false);
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#222C46] text-slate-300 hover:text-white transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Trade Profile & Settings</span>
            </button>
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
