"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Building2,
  Package,
  Truck,
  CreditCard,
  UserCog,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useUnifiedData } from "@/context/unified-data-context";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function AdminSidebar({ collapsed, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname();
  const { adminMetrics, activeStaffRole } = useUnifiedData();

  const isMainActive = (path: string) => {
    if (path === "/admin/dashboard") {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }
    return pathname.startsWith(path);
  };

  const navGroups = [
    {
      label: "MAIN",
      items: [
        {
          name: "Dashboard",
          href: "/admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: "Requests",
          href: "/admin/requests",
          icon: FileText,
          badge: adminMetrics.totalActive > 0 ? adminMetrics.totalActive : undefined,
        },
        {
          name: "Customers",
          href: "/admin/customers",
          icon: Building2,
        },
      ],
    },
    {
      label: "OPERATIONS",
      items: [
        {
          name: "Suppliers",
          href: "/admin/suppliers",
          icon: Package,
        },
        {
          name: "Shipments",
          href: "/admin/shipments",
          icon: Truck,
          badge: adminMetrics.shipped > 0 ? adminMetrics.shipped : undefined,
        },
        {
          name: "Payments",
          href: "/admin/payments",
          icon: CreditCard,
          badge: adminMetrics.awaitingPayment > 0 ? adminMetrics.awaitingPayment : undefined,
          badgeVariant: "amber",
        },
      ],
    },
    {
      label: "ADMINISTRATION",
      items: [
        {
          name: "User Management",
          href: "/admin/users",
          icon: UserCog,
        },
        {
          name: "Settings",
          href: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-[#111827] text-slate-300 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
        {!collapsed ? (
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ED2025] to-[#B91C1C] flex items-center justify-center shadow-md shadow-red-900/30">
              <span className="text-white font-black text-sm tracking-wider">P</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white text-base tracking-tight">PROCURly</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block -mt-1">
                Admin Portal
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/admin/dashboard" className="mx-auto">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#ED2025] to-[#B91C1C] flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm">P</span>
            </div>
          </Link>
        )}

        <button
          onClick={onToggleCollapse}
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Indicator Banner */}
      {!collapsed && (
        <div className="px-4 py-2.5 bg-slate-900/70 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-semibold text-slate-300">
              Role: <span className="text-white font-bold">{activeStaffRole}</span>
            </span>
          </div>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
            RBAC
          </span>
        </div>
      )}

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            {!collapsed && (
              <h3 className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                {group.label}
              </h3>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isMainActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? "bg-[#ED2025] text-white shadow-md shadow-red-900/20 font-semibold"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        active ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                      }`}
                    />
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.name}</span>
                    )}

                    {!collapsed && item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          active
                            ? "bg-white/20 text-white"
                            : item.badgeVariant === "amber"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Switch to Customer Portal */}
      <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-900/40">
        <Link
          href="/customer/dashboard"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
          title="Switch to Customer Portal"
        >
          <ExternalLink className="w-4 h-4 text-slate-500" />
          {!collapsed && (
            <div className="truncate">
              <span className="block font-semibold text-slate-200">Customer Portal</span>
              <span className="block text-[10px] text-slate-500">Live Trade View</span>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
