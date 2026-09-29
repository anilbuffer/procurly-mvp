"use client";

import React from "react";
import {
  RequestStatus,
  PaymentStatus,
  ShipmentMilestone,
  CustomerResponse,
} from "@/types/shared";
import {
  getStatusBadgeClasses,
  getPaymentBadgeClasses,
  getShipmentMilestoneBadgeClasses,
  getCustomerResponseBadgeClasses,
} from "@/lib/status-styles";

export {
  getStatusBadgeClasses,
  getPaymentBadgeClasses,
  getShipmentMilestoneBadgeClasses,
  getCustomerResponseBadgeClasses,
};

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

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs transition-colors ${
        sizeClasses[size]
      } ${getStatusBadgeClasses(status)} ${className}`}
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
  const { badgeClass, dotClass, label } = getPaymentBadgeClasses(status);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold border ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      } ${badgeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
}

export function ShipmentMilestoneBadge({
  milestone,
}: {
  milestone: ShipmentMilestone | string;
}) {
  const { badgeClass, dotClass } = getShipmentMilestoneBadgeClasses(milestone);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${badgeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
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
  const badgeClass = getCustomerResponseBadgeClasses(response);

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
      {response === "Accepted"
        ? "Customer Response: Accepted"
        : response === "Rejected"
        ? "Customer Response: Declined"
        : "Info Requested"}
    </span>
  );
}
