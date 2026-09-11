"use client";

import React, { useRef, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  DollarSign,
  Truck,
  Box,
  Check,
} from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { NotificationType } from "@/types/portal";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    requests,
    setSelectedRequest,
    setIsQuoteModalOpen,
    setQuoteRequest,
    setIsPaymentModalOpen,
    setPaymentRequest,
    setActiveTab,
  } = usePortal();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "Quote Available":
      case "Quote Accepted":
        return <FileCheck2 className="w-4 h-4 text-amber-500" />;
      case "Payment Received":
      case "Payment Updated":
        return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case "Order Placed":
        return <Box className="w-4 h-4 text-purple-500" />;
      case "Shipment Dispatched":
      case "Shipment Arrived":
      case "Delivery Out":
      case "Delivered":
        return <Truck className="w-4 h-4 text-blue-500" />;
      case "Information Required":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "Status Update":
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    }
  };

  const handleNotificationClick = (notif: (typeof notifications)[0]) => {
    markNotificationAsRead(notif.id);
    setIsOpen(false);

    if (
      notif.type === "Shipment Dispatched" ||
      notif.type === "Shipment Arrived" ||
      notif.type === "Delivery Out" ||
      notif.type === "Delivered"
    ) {
      setActiveTab("shipments");
    } else if (notif.type === "Order Placed") {
      setActiveTab("orders");
    } else if (notif.type === "Registration Approval") {
      setActiveTab("settings");
    }

    if (notif.requestId) {
      const targetReq = requests.find((r) => r.id === notif.requestId);
      if (targetReq) {
        if (targetReq.actionType === "review_quote" || targetReq.status === "Quoted") {
          setSelectedRequest(targetReq);
        } else if (targetReq.actionType === "pay_now" || ((targetReq.status === "Approved" || targetReq.status === "Awaiting Payment") && targetReq.payment?.status !== "Paid")) {
          setPaymentRequest(targetReq);
          setIsPaymentModalOpen(true);
        } else {
          setSelectedRequest(targetReq);
        }
      }
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all border border-slate-200/60"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationsCount > 0 && (
          <span
            suppressHydrationWarning
            className="absolute -top-1 -right-1 w-5 h-5 bg-[#ED2025] text-white font-black text-[11px] rounded-full flex items-center justify-center shadow-md shadow-red-500/30 border-2 border-white animate-pulse"
          >
            {unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                {unreadNotificationsCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-[#ED2025]">
                    {unreadNotificationsCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Procurement, quote & dispatch alerts
              </p>
            </div>
            {unreadNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[11px] font-semibold text-[#ED2025] hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No notifications right now
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 text-left ${
                    !n.read ? "bg-amber-50/20" : ""
                  }`}
                >
                  <div className="mt-0.5 p-2 rounded-xl bg-slate-100 shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4
                        className={`text-xs truncate ${
                          !n.read
                            ? "font-bold text-slate-900"
                            : "font-semibold text-slate-700"
                        }`}
                      >
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                      {n.description}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-[#ED2025] shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-medium">
              Autohub New Zealand • Trade Operations Live Feed
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
