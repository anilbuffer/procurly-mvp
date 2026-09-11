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
  ChevronDown,
  ArrowRightLeft,
  LogOut,
} from "lucide-react";
import { useUnifiedData } from "@/context/unified-data-context";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function AdminSidebar({ collapsed, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname();
  const { adminMetrics, currentStaffUser } = useUnifiedData();
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
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-[#0C101A] text-slate-300 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${collapsed ? "w-20" : "w-64"
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
                    className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${active
                      ? "bg-[#ED2025] text-white shadow-md shadow-red-900/20 font-semibold"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70"
                      } ${collapsed ? "justify-center" : ""}`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${active ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                        }`}
                    />
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.name}</span>
                    )}

                    {!collapsed && item.badge !== undefined && (
                      <span
                        suppressHydrationWarning
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${active
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

      {/* User Info / Profile Card at Bottom */}
      <div ref={userMenuRef} className="p-3 border-t border-slate-800 shrink-0 relative bg-[#111827]">
        <div
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={`flex items-center justify-between p-2 rounded-xl transition-all select-none cursor-pointer hover:bg-[#182033] border border-transparent hover:border-[#27324D]/60 ${collapsed ? "justify-center" : ""
            }`}
          title={collapsed ? `${currentStaffUser?.name || "David Vance"} (${currentStaffUser?.role || "Administrator"})` : undefined}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {currentStaffUser?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentStaffUser.avatarUrl}
                alt={currentStaffUser?.name || "Admin"}
                className="w-8 h-8 rounded-full object-cover shrink-0 shadow-md ring-1 ring-white/10"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ED2025] to-orange-500 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md">
                {(currentStaffUser?.name || "Admin")
                  .split(" ")
                  .map((n) => n[0])
                  .join("") || "AD"}
              </div>
            )}
            {!collapsed && (
              <div className="truncate text-left">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {currentStaffUser?.name || "David Vance"}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  {currentStaffUser?.role || "Administrator"}
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""
                }`}
            />
          )}
        </div>

        {/* User dropdown popover */}
        {showUserMenu && (
          <div
            className={`absolute bottom-16 ${collapsed ? "left-20 ml-2 w-64" : "left-3 right-3"
              } bg-[#182033] border border-[#27324D] rounded-xl shadow-2xl p-2.5 space-y-2 z-50 text-xs text-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-150`}
          >
            <div className="px-2 py-1 border-b border-[#27324D]/60 pb-2">
              <p className="font-bold text-white text-xs mt-0.5">{currentStaffUser?.name || "David Vance"}</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{currentStaffUser?.email}</p>
            </div>

            <div className="pt-0.5 space-y-0.5">
              <Link
                href="/admin/settings"
                onClick={() => setShowUserMenu(false)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#222C46] text-slate-300 hover:text-white transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Profile & Settings</span>
              </Link>
              <Link
                href="/customer/dashboard"
                onClick={() => setShowUserMenu(false)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-blue-500/15 text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" />
                <span>Switch to Customer Portal</span>
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
