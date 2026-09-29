import {
  RequestStatus,
  PaymentStatus,
  ShipmentMilestone,
  CustomerResponse,
} from "@/types/shared";

/**
 * Standardized status color mapping across all portals (Admin, Subadmin, Customer Portal).
 * Establishes consistent visual hierarchy:
 * - Informational / New: Sky
 * - Research / Sourcing: Amber
 * - Commercial / Quoted: Purple
 * - Customer Approval / Cleared: Emerald
 * - Financial Invoicing: Indigo
 * - Financial Action Required: Brand Red (#FE0000)
 * - Purchase Order Released: Brand Navy (#2B4499)
 * - Quality / Inspection: Rose / Amber
 * - Transit / Logistics: Cyan
 * - Final Landed: Teal
 * - Finalized Archive: Slate
 */
export function getStatusBadgeClasses(status: RequestStatus | string): string {
  switch (status) {
    case "Submitted":
      return "bg-sky-50 text-sky-700 border-sky-200 ring-sky-600/10";
    case "Sourcing":
      return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/10";
    case "Quoted":
      return "bg-purple-50 text-purple-700 border-purple-200 ring-purple-600/10";
    case "Approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/10";
    case "Invoicing":
      return "bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-600/10";
    case "Awaiting Payment":
      return "bg-red-50 text-[#FE0000] border-red-200 ring-red-600/10";
    case "Ordered":
      return "bg-blue-50 text-[#2B4499] border-blue-200 ring-blue-600/10";
    case "Subadmin Pending":
      return "bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/10";
    case "Subadmin Review":
      return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/10";
    case "Subadmin Hold":
      return "bg-rose-50 text-rose-800 border-rose-200 ring-rose-600/10";
    case "Subadmin Approved":
    case "Ready for Dispatch":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/10";
    case "Shipped":
      return "bg-cyan-50 text-cyan-800 border-cyan-200 ring-cyan-600/10";
    case "Delivered":
      return "bg-teal-50 text-teal-700 border-teal-200 ring-teal-600/10";
    case "Completed":
      return "bg-slate-100 text-slate-700 border-slate-200 ring-slate-600/10";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200 ring-slate-600/10";
  }
}

/**
 * Standardized payment status styling
 */
export function getPaymentBadgeClasses(status: PaymentStatus | string) {
  const isPaid = status === "Paid";
  return {
    badgeClass: isPaid
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-red-50 text-[#FE0000] border-red-200",
    dotClass: isPaid ? "bg-emerald-500" : "bg-[#FE0000] animate-pulse",
    label: isPaid ? "Paid" : "Unpaid",
  };
}

/**
 * Standardized shipment milestone styling
 */
export function getShipmentMilestoneBadgeClasses(milestone: ShipmentMilestone | string) {
  switch (milestone) {
    case "Received At Shipping Facility":
      return {
        badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
        dotClass: "bg-indigo-500",
      };
    case "In Transit":
      return {
        badgeClass: "bg-cyan-50 text-cyan-800 border-cyan-200",
        dotClass: "bg-cyan-500 animate-pulse",
      };
    case "Arrived in NZ":
      return {
        badgeClass: "bg-sky-50 text-sky-800 border-sky-200",
        dotClass: "bg-sky-500",
      };
    case "Out For Delivery":
      return {
        badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
        dotClass: "bg-amber-500 animate-pulse",
      };
    case "Delivered":
      return {
        badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
        dotClass: "bg-emerald-500",
      };
    default:
      return {
        badgeClass: "bg-slate-100 text-slate-800 border-slate-200",
        dotClass: "bg-slate-400",
      };
  }
}

/**
 * Customer quote response badge styling
 */
export function getCustomerResponseBadgeClasses(response?: CustomerResponse | string) {
  if (!response) return null;
  if (response === "Accepted") {
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  }
  if (response === "Rejected") {
    return "bg-rose-100 text-rose-800 border-rose-200";
  }
  return "bg-amber-100 text-amber-800 border-amber-200";
}
