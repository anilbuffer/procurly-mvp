export type RequestStatus =
  | "Submitted"
  | "Sourcing"
  | "Quoted"
  | "Approved"
  | "Awaiting Payment"
  | "Ordered"
  | "Shipped"
  | "Delivered"
  | "Completed"
  | "Logistics Exception"
  | "Payment Disputed";


export type ShipmentMilestone =
  | "Received At Shipping Facility"
  | "In Transit"
  | "Arrived in NZ"
  | "Customs Clearance"
  | "Out For Delivery"
  | "Delivered";

export type PaymentStatus = "Unpaid" | "Paid";

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  vin: string;
  registration?: string;
  engine?: string;
  variant?: string;
  transmission?: string;
  driveConfig?: string;
}

export type PartPreference =
  | "Genuine OEM"
  | "OEM Supplier Tier 1"
  | "Quality Aftermarket"
  | "Any Suitable Alternative";

export type PartCondition =
  | "Brand New OEM"
  | "Brand New Certified Aftermarket"
  | "Used Grade A"
  | "Remanufactured";

export interface PartInfo {
  name: string;
  partNumber?: string;
  quantity: number;
  preference: PartPreference;
  condition: PartCondition;
}

export interface SupportingInfo {
  notes?: string;
  photos: string[];
  documents: string[];
}

export interface SavedAddress {
  id: string;
  label: string;
  recipientName: string;
  businessName: string;
  streetAddress: string;
  suburb: string;
  city: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
}

export interface FreightOption {
  id: string;
  name: string;
  carrier: string;
  transitTime: string;
  cost: number;
}

export interface Quotation {
  id: string;
  requestId: string;
  itemDescription: string;
  oemNumber?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  gstAmount: number;
  freightCost: number; // Single flat freight value entered manually by staff for MVP
  freightNote?: string;
  totalAmount: number;
  currency: string;
  validUntil: string;
  termsAccepted?: boolean; // Single static acceptance
  termsVersion?: string; // Optional legacy / audit
  freightOptions?: FreightOption[]; // Optional/deprecated for MVP
  selectedFreightId?: string;
  supplierLocation: string;
  notes?: string;
}

export interface QuoteAcceptanceAudit {
  acceptedAt: string;
  acceptedBy: string;
  userRole: string;
  termsAccepted: boolean; // Single static acceptance checkbox
  termsVersion?: string;
  vehicleVerified: boolean;
  partVerified: boolean;
  addressVerified: boolean;
  selectedFreightMethod?: string;
  freightCost?: number;
}

export interface PaymentDetails {
  id: string;
  requestId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: "Bank Transfer" | "Credit Card";
  paymentReference: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swiftBic?: string;
  };
  paidAt?: string;
  paymentProofUrl?: string;
  dueDate: string;
}

export interface MilestoneLog {
  milestone: ShipmentMilestone;
  location: string;
  timestamp: string;
  description: string;
  isCompleted: boolean;
}

export interface ShipmentDetails {
  trackingNumber: string;
  carrier: string;
  carrierWebsite?: string;
  currentMilestone: ShipmentMilestone;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  dispatchedAt: string;
  deliveredAt?: string;
  milestonesHistory: MilestoneLog[];
}

export interface RequestMessage {
  id: string;
  senderName: string;
  senderRole: "Customer" | "Autohub Operations";
  message: string;
  timestamp: string;
  avatarUrl?: string;
}

export interface PartRequest {
  id: string;
  requestNumber: string; // e.g. AH-P-000128
  vehicle: VehicleInfo;
  part: PartInfo;
  supporting: SupportingInfo;
  deliveryAddress: SavedAddress;
  dateSubmitted: string;
  status: RequestStatus;
  quotedValue?: number;
  actionRequired?: string;
  actionType?: "review_quote" | "pay_now" | "view_details" | "none";
  quotation?: Quotation;
  quoteAcceptance?: QuoteAcceptanceAudit;
  payment?: PaymentDetails;
  shipment?: ShipmentDetails;
  messages?: RequestMessage[];
}

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
  | "Quote Available"
  | "Quote Accepted"
  | "Payment Received"
  | "Order Placed"
  | "Shipment Dispatched"
  | "Shipment Arrived"
  | "Delivery Out"
  | "Delivered";

export interface PortalNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  requestId?: string;
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
