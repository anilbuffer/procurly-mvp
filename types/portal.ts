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
  NotificationType,
  PortalNotification,
} from "./shared";

export type PortalTab =
  | "dashboard"
  | "requests"
  | "orders"
  | "shipments"
  | "payments"
  | "settings";


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
