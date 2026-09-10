"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, ChevronRight, Bell, X } from "lucide-react";
import { useProcurement } from "@/context/procurement-context";

export function ProcurementHeader() {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedRequest,
    backToList,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useProcurement();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Keyboard shortcut ⌘K or Ctrl+K
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

  const getTabTitle = () => {
    if (selectedRequest) {
      return selectedRequest.requestNumber;
    }
    switch (activeTab) {
      case "dashboard":
        return "Procurement Dashboard";
      case "sourcing":
        return "Sourcing Queue";
      case "requests":
        return "All Requests";
      case "suppliers":
        return "Supplier Directory";
      case "quotes":
        return "Customer Quotes";
      case "orders":
        return "Procurement Orders";
      case "settings":
        return "Settings";
      default:
        return "Procurement Portal";
    }
  };

  useEffect(() => {
    document.title = `${getTabTitle()} | Procurly Procurement`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedRequest]);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-6 sm:px-8 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Breadcrumbs & Page Title */}
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <button
              onClick={() => {
                backToList();
                setActiveTab("dashboard");
              }}
              className="hover:text-slate-900 transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <button
              onClick={() => {
                backToList();
                setActiveTab("dashboard");
              }}
              className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              Procurement
            </button>
            {selectedRequest && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <button
                  onClick={backToList}
                  className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
                >
                  {activeTab === "sourcing"
                    ? "Sourcing Queue"
                    : activeTab === "requests"
                    ? "Requests"
                    : activeTab === "orders"
                    ? "Orders"
                    : "Requests"}
                </button>
              </>
            )}
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-[#ED2025] font-semibold">{getTabTitle()}</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {getTabTitle()}
          </h1>
        </div>

        {/* Right: Search & Notifications */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requests, suppliers, orders..."
              className="w-full pl-10 pr-12 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025] transition-all"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#ED2025] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] font-bold text-[#ED2025] hover:text-[#d11a1f] transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.slice(0, 8).map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        setShowNotifications(false);
                      }}
                      className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${
                        !notif.read ? "bg-blue-50/30" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#ED2025] mt-1.5 shrink-0" />
                        )}
                        <div className={!notif.read ? "" : "pl-5"}>
                          <p className="text-xs font-bold text-slate-900">{notif.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                            {notif.description}
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                            {notif.timestamp}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
