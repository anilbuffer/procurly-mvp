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
      case "Submitted":
        return "bg-sky-50 text-sky-700 border-sky-200 ring-sky-600/10";
      case "Sourcing":
        return "bg-purple-50 text-purple-700 border-purple-200 ring-purple-600/10";
      case "Quoted":
        return "bg-amber-50 text-amber-800 border-amber-200 ring-amber-600/10";
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/10";
      case "Awaiting Payment":
        return "bg-orange-50 text-orange-800 border-orange-200 ring-orange-600/10";
      case "Ordered":
        return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/10";
      case "Shipped":
        return "bg-cyan-50 text-cyan-800 border-cyan-200 ring-cyan-600/10";
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-200 ring-green-600/10";
      case "Completed":
        return "bg-slate-100 text-slate-700 border-slate-200 ring-slate-600/10";
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
