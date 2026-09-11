"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutGrid,
  FileText,
  CheckSquare,
  Truck,
  CreditCard,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ArrowRightLeft,
} from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { PortalTab } from "@/types/portal";

interface PortalSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function PortalSidebar({ collapsed = false, onToggleCollapse }: PortalSidebarProps) {
  const {
    activeTab,
    setActiveTab,
    metrics,
    requests,
    activeCustomer,
  } = usePortal();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOrdersCount = requests.filter(
    (r) => r.status === "Ordered" || r.status === "Approved" || r.status === "Awaiting Payment"
  ).length;

  const awaitingPaymentCount = requests.filter(
    (r) => r.status === "Awaiting Payment" || (r.status === "Approved" && r.payment?.status !== "Paid")
  ).length;

  const navGroups: {
    label: string;
    items: {
      id: PortalTab;
      label: string;
      icon: React.ElementType;
      badge?: number;
      badgeColor?: string;
    }[];
  }[] = [
    {
      label: "MAIN",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
      ],
    },
    {
      label: "OPERATIONS",
      items: [
        {
          id: "requests",
          label: "Requests",
          icon: FileText,
          badge: metrics.awaitingAction > 0 ? metrics.awaitingAction : undefined,
          badgeColor: "bg-[#ED2025] text-white",
        },
        {
          id: "orders",
          label: "Orders",
          icon: CheckSquare,
          badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
          badgeColor: "bg-purple-600 text-white",
        },
        {
          id: "shipments",
          label: "Shipments",
          icon: Truck,
          badge: metrics.inTransit > 0 ? metrics.inTransit : undefined,
          badgeColor: "bg-[#2563EB] text-white",
        },
      ],
    },
    {
      label: "FINANCE",
      items: [
        {
          id: "payments",
          label: "Payments",
          icon: CreditCard,
          badge: awaitingPaymentCount > 0 ? awaitingPaymentCount : undefined,
          badgeColor: "bg-amber-500 text-white",
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-[#0C101A] border-r border-[#1E2538] transition-all duration-300 flex flex-col justify-between select-none ${collapsed ? "w-20" : "w-64"
        }`}
    >
      {/* Top Section */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Header */}
        <div
          className={`h-16 flex items-center justify-between border-b border-[#1E2538]/60 shrink-0 ${
            collapsed ? "px-3" : "px-5"
          }`}
        >
          <Link
            href="/customer/dashboard"
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

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              {!collapsed && (
                <h3 className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  {group.label}
                </h3>
              )}
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const href = `/customer/${item.id}`;
                  return (
                    <Link
                      key={item.id}
                      href={href}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${isActive
                        ? "bg-[#1E2538] text-white shadow-inner font-bold"
                        : "text-slate-400 hover:text-white hover:bg-[#151C2C]"
                        } ${collapsed ? "justify-center" : ""}`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${isActive
                          ? "text-[#ED2025]"
                          : "text-slate-400 group-hover:text-white"
                          }`}
                      />
                      {!collapsed && (
                        <span className="flex-1 text-left truncate">{item.label}</span>
                      )}

                      {!collapsed && item.badge !== undefined && (
                        <span
                          suppressHydrationWarning
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor || "bg-slate-700 text-white"
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
          ))}
        </div>
      </div>

      {/* Bottom User Profile Section */}
      <div ref={userMenuRef} className="p-3 border-t border-[#1E2538]/60 relative">
        <div
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={`flex items-center justify-between p-2 rounded-xl bg-[#141B2B] hover:bg-[#1B2338] cursor-pointer transition-all border border-[#1E2538]/40 ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? `${activeCustomer.contactName} (${activeCustomer.businessName})` : undefined}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0 uppercase">
              {activeCustomer.contactName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("") || "CU"}
            </div>
            {!collapsed && (
              <div className="truncate text-left">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {activeCustomer.contactName}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  {activeCustomer.businessName}
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                showUserMenu ? "rotate-180" : ""
              }`}
            />
          )}
        </div>

        {/* User dropdown popover */}
        {showUserMenu && (
          <div
            className={`absolute bottom-16 ${
              collapsed ? "left-20 ml-2 w-64" : "left-3 right-3"
            } bg-[#182033] border border-[#27324D] rounded-xl shadow-2xl p-2.5 space-y-2 z-50 text-xs text-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-150`}
          >
            <div className="px-2 py-1 border-b border-[#27324D]/60 pb-2">
              <p className="font-bold text-white text-xs mt-0.5">{activeCustomer.businessName}</p>
              <p className="text-[10px] text-slate-400 font-mono">{activeCustomer.email}</p>
            </div>

            <div className="pt-0.5 space-y-0.5">
              <Link
                href="/customer/settings"
                onClick={() => {
                  setActiveTab("settings");
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#222C46] text-slate-300 hover:text-white transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-emerald-400" />
                <span>Trade Profile & Settings</span>
              </Link>
              <Link
                href="/admin/dashboard"
                onClick={() => setShowUserMenu(false)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-blue-500/15 text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" />
                <span>Switch to Admin Portal</span>
              </Link>
              <Link
                href="/login"
                onClick={() => setShowUserMenu(false)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
