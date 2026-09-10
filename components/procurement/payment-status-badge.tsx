"use client";

import React from "react";
import { PaymentStatus } from "@/types/portal";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const isPaid = status === "Paid";

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
        isPaid
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-red-50 text-red-700 border-red-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isPaid ? "bg-emerald-500" : "bg-red-500 animate-pulse"
        }`}
      />
      {status}
    </span>
  );
}
