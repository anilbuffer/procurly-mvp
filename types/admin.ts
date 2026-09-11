import { StaffRole, RequestStatus, PaymentStatus } from "./shared";

export type AdminNavTab =
  | "dashboard"
  | "requests"
  | "customers"
  | "suppliers"
  | "shipments"
  | "payments"
  | "users"
  | "settings";

export type RequestDetailTab =
  | "overview"
  | "sourcing"
  | "quote"
  | "payment"
  | "shipment"
  | "documents"
  | "activity";

export interface RequestFilterOptions {
  searchQuery: string;
  status: string;
  payment: string;
  customer: string;
  dateRange: "all" | "today" | "this_week" | "this_month";
  sortBy: "newest" | "oldest" | "recently_updated";
}

export interface AdminMetrics {
  newRequests: number;
  sourcing: number;
  quoted: number;
  awaitingPayment: number;
  readyToOrder: number;
  shipped: number;
  delivered: number;
  totalActive: number;
}
