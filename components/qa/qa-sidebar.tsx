"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Camera,
  CheckCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowRightLeft,
  LogOut,
} from "lucide-react";
import { useUnifiedData } from "@/context/unified-data-context";

interface QASidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function QASidebar({ collapsed, onToggleCollapse }: QASidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { requests, currentStaffUser } = useUnifiedData();
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
    if (path === "/qa" || path === "/qa/dashboard") {
      return pathname === "/qa" || pathname === "/qa/dashboard";
    }
    return pathname.startsWith(path);
  };

  const pendingQACount = requests.filter(r => r.status === "QA Pending").length;
  const qaReviewCount = requests.filter(r => r.status === "QA Review").length;

  const navGroups = [
    {
      label: "QA OPERATIONS",
      items: [
        {
          name: "Dashboard",
          href: "/qa/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: "Pending QA",
          href: "/qa/dashboard?filter=pending",
          icon: Camera,
          badge: pendingQACount > 0 ? pendingQACount : undefined,
          badgeColor: "bg-[#B30D12] text-white",
        },
        {
          name: "Awaiting Approval",
          href: "/qa/dashboard?filter=review",
          icon: CheckCircle,
          badge: qaReviewCount > 0 ? qaReviewCount : undefined,
          badgeColor: "bg-amber-500 text-white",
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-[#0C101A] text-slate-300 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${collapsed ? "w-20" : "w-64"
        }`}
    >
      <div className={`h-16 flex items-center justify-between border-b border-slate-800 shrink-0 ${collapsed ? "px-2.5" : "px-4"}`}>
        {!collapsed ? (
          <Link href="/qa/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg border-2 border-white bg-[#C40E14] flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-sm tracking-tighter leading-none shrink-0">A</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black italic text-white uppercase text-base tracking-tight leading-none font-sans">
                  PROCUR<span className="not-italic">LY</span>
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block -mt-1">
                QA Portal
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/qa/dashboard" className="flex items-center">
            <div className="w-9 h-9 rounded-lg border-2 border-white bg-[#C40E14] flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-sm tracking-tighter leading-none shrink-0">A</span>
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
                let active = false;
                const itemPath = item.href.split('?')[0];
                const itemFilter = item.href.includes('?filter=') ? item.href.split('?filter=')[1] : null;
                const currentFilter = searchParams.get('filter');

                if (itemPath === "/qa/dashboard" && pathname === "/qa/dashboard") {
                   if (itemFilter) {
                       active = currentFilter === itemFilter;
                   } else {
                       active = !currentFilter;
                   }
                } else {
                   active = isMainActive(itemPath);
                }

                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${active
                      ? "bg-[#1E2538] text-white shadow-inner font-bold"
                      : "text-slate-400 hover:text-white hover:bg-[#151C2C]"
                      } ${collapsed ? "justify-center" : ""}`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${active
                        ? "text-[#B30D12]"
                        : "text-slate-400 group-hover:text-white"
                        }`}
                    />
                    {!collapsed && (
                      <span className="flex-1 truncate text-left">{item.name}</span>
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
            </div>
          </div>
        ))}
      </div>

      <div ref={userMenuRef} className="p-3 border-t border-[#1E2538]/60 relative">
        <div
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={`flex items-center justify-between p-2 rounded-xl transition-all select-none cursor-pointer bg-[#141B2B] hover:bg-[#182033] border border-transparent hover:border-[#27324D]/60 ${collapsed ? "justify-center" : ""
            }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            {currentStaffUser?.avatarUrl ? (
              <img
                src={currentStaffUser.avatarUrl}
                alt="Admin"
                className="w-8 h-8 rounded-full object-cover shrink-0 shadow-md ring-1 ring-white/10"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#B30D12] to-red-600 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md">
                QA
              </div>
            )}
            {!collapsed && (
              <div className="truncate text-left">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  Akira Yamamoto
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  QA Inspector
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
        
        {showUserMenu && (
          <div
            className={`absolute bottom-16 ${collapsed ? "left-20 ml-2 w-64" : "left-3 right-3"
              } bg-[#182033] border border-[#27324D] rounded-xl shadow-2xl p-2.5 space-y-2 z-50 text-xs text-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-150`}
          >
            <div className="px-2 py-1 border-b border-[#27324D]/60 pb-2">
              <p className="font-bold text-white text-xs mt-0.5">Akira Yamamoto</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">akira.yamamoto@procurly.io</p>
            </div>

            <div className="pt-0.5 space-y-0.5">
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
