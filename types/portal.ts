// ─── Customer Portal Types (Aligned with Canonical Shared Types) ───

export type {
  RequestStatus,
  ShipmentMilestone,
  PaymentStatus,
  CustomerResponse,
  VehicleInfo,
  PartPreference,
  PartCondition,
  PartInfo,
  SupportingInfo,
  SavedAddress,
  SupplierAvailability,
  SupplierCondition,
  SupplierQuotation,
  CostCalculation,
  CustomerQuoteVersion,
  Quotation,
  QuoteAcceptanceAudit,
  PaymentDetails,
  SupplierOrder,
  MilestoneLog,
  ShipmentDetails,
  RequestDocument,
  InternalNote,
  RequestActivity,
  PartRequest,
} from "./shared";

export type PortalTab =
  | "dashboard"
  | "requests"
  | "orders"
  | "shipments"
  | "payments"
  | "documents"
  | "settings";

export type NotificationType =
  | "Registration Approval"
  | "Request Submitted"
  | "Information Required"
  | "Status Update"
  | "Quote Available"
  | "Quote Accepted"
  | "Quote Sent"
  | "Quote Rejected"
  | "Payment Received"
  | "Payment Updated"
  | "Order Placed"
  | "Shipment Dispatched"
  | "Shipment Arrived"
  | "Shipment Updated"
  | "Delivery Out"
  | "Delivered"
  | "New Request"
  | "Customer Registration"
  | "General";

export interface PortalNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  requestId?: string;
}

export interface RequestMessage {
  id: string;
  senderName: string;
  senderRole: "Customer" | "Autohub Operations";
  message: string;
  timestamp: string;
  avatarUrl?: string;
}

export interface ProcurementActivity {
  id: string;
  timestamp: string;
  timeLabel: string;
  title: string;
  description: string;
  type: "quote" | "payment" | "shipment" | "request" | "alert";
  requestId?: string;
}
