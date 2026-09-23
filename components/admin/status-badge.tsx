"use client";

import React from "react";
import {
  RequestStatus,
  PaymentStatus,
  ShipmentMilestone,
  CustomerResponse,
} from "@/types/shared";

interface StatusBadgeProps {
  status: RequestStatus | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusBadge({ status, size = "md", className = "" }: StatusBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
    lg: "px-3 py-1.5 text-sm font-semibold",
  };

  const getStyle = (s: string) => {
    switch (s) {
      // In-Process States
      case "Submitted":
      case "Sourcing":
      case "Quoted":
      case "Approved":
      case "Ordered":
      case "QA Review":
      case "Ready for Dispatch":
      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/10";
      
      // Waiting / Attention States
      case "Awaiting Payment":
      case "QA Pending":
      case "QA Hold":
        return "bg-red-50 text-red-700 border-red-200 ring-red-600/10";
      
      // Completed States
      case "QA Approved":
      case "Delivered":
      case "Completed":
        return "bg-green-50 text-green-700 border-green-200 ring-green-600/10";
        
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 ring-slate-600/10";
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs transition-colors ${
        sizeClasses[size]
      } ${getStyle(status)} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}

export function PaymentStatusBadge({
  status,
  size = "md",
}: {
  status: PaymentStatus | string;
  size?: "sm" | "md";
}) {
  const isPaid = status === "Paid";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold border ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      } ${
        isPaid
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-rose-50 text-rose-700 border-rose-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isPaid ? "bg-emerald-500" : "bg-rose-500 animate-pulse"
        }`}
      />
      {isPaid ? "Paid" : "Unpaid"}
    </span>
  );
}

export function ShipmentMilestoneBadge({
  milestone,
}: {
  milestone: ShipmentMilestone | string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
      {milestone}
    </span>
  );
}

export function CustomerResponseBadge({
  response,
}: {
  response?: CustomerResponse | string;
}) {
  if (!response) return null;

  if (response === "Accepted") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
        Customer Response: Accepted
      </span>
    );
  }
  if (response === "Rejected") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
        Customer Response: Declined
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
      Info Requested
    </span>
  );
}
