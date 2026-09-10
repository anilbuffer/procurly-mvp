import { PartRequest, RequestStatus, PaymentStatus } from "./portal";

// ─── Procurement Portal Navigation ─────────────────────────

export type ProcurementTab =
  | "dashboard"
  | "sourcing"
  | "requests"
  | "suppliers"
  | "quotes"
  | "orders"
  | "settings";

// ─── Supplier Quotation (Internal Only) ────────────────────

export type SupplierAvailability =
  | "In Stock"
  | "Available"
  | "Back Order"
  | "Out of Stock";

export type SupplierCondition =
  | "Genuine"
  | "Aftermarket"
  | "Remanufactured"
  | "Used";

export interface SupplierQuotation {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierContact: string;
  supplierCountry: string;
  supplierPartRef: string;
  availability: SupplierAvailability;
  supplierCost: number;
  supplierFreight: number;
  leadTimeDays: number;
  condition: SupplierCondition;
  notes: string;
  attachmentUrl?: string;
  isSelected: boolean;
  createdAt: string;
}

// ─── Cost Calculation Model ────────────────────────────────

export interface CostCalculation {
  supplierCost: number;
  supplierFreight: number;
  autohubMarginPercent: number;
  autohubMarginAmount: number;
  customerSellPrice: number;
  customerFreight: number; // Single freight value entered manually by staff. No freight comparison engine.
  totalCustomerQuote: number;
}

// ─── Customer Quote Versions ───────────────────────────────

export type CustomerQuoteStatus =
  | "Draft"
  | "Sent"
  | "Accepted"
  | "Rejected"
  | "Revised";

export interface CustomerQuoteVersion {
  version: number;
  sellPrice: number;
  freight: number; // Single flat freight value entered manually by staff
  totalAmount: number;
  estimatedTransitDays: number;
  notes: string;
  terms: string;
  sentAt: string;
  status: CustomerQuoteStatus;
}

// ─── Supplier Order ────────────────────────────────────────

export interface SupplierOrder {
  id: string;
  supplierName: string;
  supplierRef: string;
  orderDate: string;
  cost: number;
  notes: string;
  documents: string[];
}

// ─── Internal Notes ────────────────────────────────────────

export interface ProcurementNote {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

// ─── Supplier Directory ────────────────────────────────────

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  country: string;
  specializations: string[];
  rating?: number;
}

// ─── Customer Response ─────────────────────────────────────

export type CustomerResponse =
  | "Accepted"
  | "Rejected"
  | "Request More Information";

// ─── Extended Procurement Request ──────────────────────────

export interface ProcurementRequest extends PartRequest {
  customerName: string;
  assignedStaff: string;
  supplierQuotations: SupplierQuotation[];
  selectedQuotationId?: string;
  costCalculation?: CostCalculation;
  customerQuoteVersions: CustomerQuoteVersion[];
  supplierOrder?: SupplierOrder;
  internalNotes: ProcurementNote[];
  customerResponse?: CustomerResponse;
}

// ─── Procurement Notification ──────────────────────────────

export type ProcurementNotificationType =
  | "New Request"
  | "Quote Sent"
  | "Quote Accepted"
  | "Quote Rejected"
  | "Payment Received"
  | "Order Placed"
  | "Shipment Update"
  | "Info Requested";

export interface ProcurementNotification {
  id: string;
  type: ProcurementNotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  requestId?: string;
}

// ─── Procurement Metrics ───────────────────────────────────

export interface ProcurementMetrics {
  newRequests: number;
  sourcing: number;
  quotesReady: number;
  awaitingPayment: number;
  readyToOrder: number;
  ordersInProgress: number;
}
