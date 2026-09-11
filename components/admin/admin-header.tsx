"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  ChevronRight,
  User,
  Shield,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Check,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useUnifiedData } from "@/context/unified-data-context";
import { NotificationPopover } from "./notification-popover";
import { StaffRole } from "@/types/shared";

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [requestedIdParam, setRequestedIdParam] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setRequestedIdParam(params.get("id"));
    }
  }, [pathname]);

  const {
    requests,
    activeStaffRole,
    currentStaffUser,
    switchStaffRole,
  } = useUnifiedData();

  const [globalSearch, setGlobalSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Search matches
  const searchResults = React.useMemo(() => {
    if (!globalSearch.trim()) return [];
    const query = globalSearch.toLowerCase().trim();
    return requests
      .filter((r) => {
        return (
          r.requestNumber.toLowerCase().includes(query) ||
          r.customerName.toLowerCase().includes(query) ||
          r.contactName.toLowerCase().includes(query) ||
          r.vehicle.make.toLowerCase().includes(query) ||
          r.vehicle.model.toLowerCase().includes(query) ||
          r.part.name.toLowerCase().includes(query) ||
          (r.selectedQuotationId &&
            r.supplierQuotations.some((sq) =>
              sq.supplierName.toLowerCase().includes(query)
            ))
        );
      })
      .slice(0, 6);
  }, [globalSearch, requests]);

  const handleSelectSearchResult = (reqId: string) => {
    setGlobalSearch("");
    setIsSearchFocused(false);
    router.push(`/admin/requests?id=${reqId}`);
  };

  const rolesList: StaffRole[] = [
    "Administrator",
    "Procurement",
    "Operations",
    "Finance",
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 px-6 sm:px-8 py-3.5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Breadcrumbs & Current Page Title */}
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Link
              href="/admin/dashboard"
              className="hover:text-slate-900 transition-colors"
            >
              Admin
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link
              href={`/admin/${currentSection}`}
              className="text-slate-600 hover:text-slate-900 transition-colors capitalize font-medium"
            >
              {currentSection}
            </Link>
            {requestedIdParam && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[#ED2025] font-semibold">
                  {requestedIdParam}
                </span>
              </>
            )}
          </nav>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span>{getSectionTitle()}</span>
            {requestedIdParam && (
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-red-50 text-[#ED2025] font-mono font-bold border border-red-200">
                Workspace
              </span>
            )}
          </h1>
        </div>

        {/* Right: Global Search, Notification Icon, User Profile */}
        <div className="flex items-center gap-3">
          {/* Global Search with Dropdown */}
          <div className="relative w-full md:w-80" ref={searchContainerRef}>
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search Request #, Customer, Vehicle, Part..."
              className="w-full pl-10 pr-12 py-2 text-xs bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025] transition-all shadow-xs"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
                ⌘K
              </kbd>
            </div>

            {/* Instant Search Results Dropdown */}
            {isSearchFocused && globalSearch.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2 animate-in fade-in-0 zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Requests Matching &quot;{globalSearch}&quot;
                </div>
                {searchResults.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No requests found matching &quot;{globalSearch}&quot;
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50 mt-1 max-h-72 overflow-y-auto">
                    {searchResults.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => handleSelectSearchResult(r.id)}
                        className="p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#ED2025]">
                              {r.requestNumber}
                            </span>
                            <span className="text-xs font-semibold text-slate-800">
                              {r.customerName}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {r.vehicle.year} {r.vehicle.make} {r.vehicle.model} — {r.part.name}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {r.status}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Top-Right Notification Icon */}
          <NotificationPopover />

          {/* User Profile & Role Switcher */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30"
            >
              {currentStaffUser.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentStaffUser.avatarUrl}
                  alt={currentStaffUser.name}
                  className="w-7 h-7 rounded-lg object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                  {currentStaffUser.name[0]}
                </div>
              )}
              <div className="text-left hidden lg:block">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  {currentStaffUser.name}
                </span>
                <span className="block text-[10px] font-medium text-slate-500 leading-tight">
                  {activeStaffRole}
                </span>
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white p-3 shadow-xl border border-slate-200 z-50 animate-in fade-in-0 zoom-in-95">
                {/* Current User Info */}
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentStaffUser.name}</p>
                  <p className="text-[11px] text-slate-500">{currentStaffUser.email}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{currentStaffUser.title}</p>
                </div>

                {/* RBAC Role Switcher (Section 29) */}
                <div className="py-2 border-b border-slate-100">
                  <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Staff Role (RBAC)
                  </div>
                  <div className="space-y-0.5">
                    {rolesList.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          switchStaffRole(role);
                          setIsProfileOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          activeStaffRole === role
                            ? "bg-red-50 text-[#ED2025] font-bold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Shield className="w-3.5 h-3.5" />
                          {role}
                        </span>
                        {activeStaffRole === role && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="pt-2 space-y-0.5">
                  <Link
                    href="/customer/dashboard"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    Switch to Customer Portal
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
