"use client";

import React from "react";
import { RequestStatus } from "@/types/portal";

const STATUS_STYLES: Record<string, string> = {
  Submitted: "bg-slate-100 text-slate-700 border-slate-300",
  Sourcing: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Quoted: "bg-amber-100 text-amber-800 border-amber-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Awaiting Payment": "bg-orange-50 text-orange-700 border-orange-300",
  Ordered: "bg-blue-50 text-blue-700 border-blue-200",
  Shipped: "bg-sky-100 text-sky-800 border-sky-300",
  Delivered: "bg-emerald-100 text-emerald-800 border-emerald-300",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

interface StatusBadgeProps {
  status: RequestStatus | string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const styles = STATUS_STYLES[status] || "bg-slate-100 text-slate-600 border-slate-200";
  const sizeClass =
    size === "sm"
      ? "text-[10px] px-2 py-0.5"
      : "text-xs px-3 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wider border ${styles} ${sizeClass}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
