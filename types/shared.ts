// ─── Unified Canonical Types for Procurly ─────────────────────────

export type RequestStatus =
  | "Submitted"
  | "Sourcing"
  | "Quoted"
  | "Approved"
  | "Invoicing"
  | "Awaiting Payment"
  | "Ordered"
  | "QA Pending"
  | "QA Review"
  | "QA Hold"
  | "QA Approved"
  | "Ready for Dispatch"
  | "Shipped"
  | "Delivered"
  | "Completed";

export type PaymentStatus = "Unpaid" | "Paid";

export type ShipmentMilestone =
  | "Received At Shipping Facility"
  | "In Transit"
  | "Arrived in NZ"
  | "Customs Clearance"
  | "Out For Delivery"
  | "Delivered";

export type StaffRole = "Administrator" | "Procurement" | "Operations" | "Finance" | "QA Operator";

export type CustomerStatus = "Pending Approval" | "Active" | "Suspended";

export type CustomerResponse =
  | "Accepted"
  | "Rejected"
  | "Request More Information";

// ─── Vehicle & Part ────────────────────────────────────────

export interface VehicleInfo {
  make: string;
  model: string;
  year: number | string;
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
  | "New"
  | "Used"
  | "Brand New OEM"
  | "Brand New Certified Aftermarket"
  | "Used Grade A"
  | "Remanufactured";

export interface PartInfo {
  name: string;
  partNumber?: string;
  quantity: number;
  preference?: PartPreference;
  condition: PartCondition | string;
}

export interface SupportingInfo {
  notes?: string;
  photos: string[];
  documents: string[];
  freightPreference?: "Air Express" | "Sea Freight" | "No Preference";
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

// ─── Sourcing & Supplier ───────────────────────────────────

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
  supplierCost: string | number; // Free-form NZD text or numeric
  supplierFreight: number; // NZD
  airFreightCost?: number; // NZD
  seaFreightCost?: number; // NZD
  leadTimeDays: number;
  condition: SupplierCondition;
  notes: string;
  attachmentUrl?: string;
  isSelected: boolean;
  createdAt: string;
}

export type SupplierStatus = "Active" | "Inactive" | "Suspended" | "Preferred";

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  country: string;
  category: string;
  specializations: string[];
  rating?: number;
  status: SupplierStatus;
}

// ─── Customer Quotation & Calculation ───────────────────────

export interface CostCalculation {
  supplierCost: number;
  supplierFreight: number;
  autohubMarginPercent: number;
  autohubMarginAmount: number;
  customerSellPrice: number;
  customerFreight?: number;
  airFreightCost?: number;
  seaFreightCost?: number;
  totalCustomerQuote: number;
}

export interface CustomerQuoteVersion {
  version: number;
  date: string;
  sellPrice: number;
  freight?: number; // Legacy
  airFreightCost?: number;
  seaFreightCost?: number;
  totalAmount: number;
  estimatedTransitDays: number;
  notes: string;
  terms: string;
  sentAt: string;
  status: "Draft" | "Sent" | "Accepted" | "Rejected" | "Revised";
  createdBy: string;
}

export interface Quotation {
  id: string;
  requestId: string;
  version?: number;
  itemDescription: string;
  oemNumber?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  gstAmount: number;
  freightCost?: number; // Legacy fallback
  airFreightCost?: number;
  seaFreightCost?: number;
  freightNote?: string;
  totalAmount: number;
  currency: string;
  estimatedTransitDays?: number;
  validUntil: string;
  termsAccepted?: boolean;
  termsVersion?: string;
  supplierLocation?: string;
  notes?: string;
  procurementTerms?: string;
}

export interface QuoteAcceptanceAudit {
  acceptedAt: string;
  acceptedBy: string;
  userRole: string;
  termsAccepted: boolean;
  termsAcceptedAt?: string;
  vehicleVerified: boolean;
  partVerified: boolean;
  addressVerified: boolean;
  freightCost?: number;
  selectedFreightType?: "Air" | "Sea";
}

// ─── Payment ───────────────────────────────────────────────

export interface PaymentDetails {
  id: string;
  requestId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: PaymentStatus; // "Unpaid" | "Paid"
  paymentMethod?: string;
  paymentReference: string;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swiftBic?: string;
  };
  paidAt?: string;
  dueDate: string;
  lastUpdated?: string;
  invoiceUrl?: string;
}

// ─── Supplier Order ────────────────────────────────────────

export interface SupplierOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierRef: string;
  orderDate: string;
  cost: number;
  freight: number;
  total: number;
  notes: string;
  documents: string[];
}

// ─── QA Verification ─────────────────────────────────────────

export interface QADetails {
  status: "Pending" | "Review" | "Approved" | "Rejected" | "Hold";
  photos: string[];
  videos?: string[];
  notes?: string;
  uploadedAt?: string;
  uploadedBy?: string;
  customerReviewedAt?: string;
  customerNotes?: string;
  resolution?: "Ship Replacement" | "Issue Refund" | "Return Shipment to Origin";
}

// ─── Shipment ──────────────────────────────────────────────

export interface MilestoneLog {
  milestone: ShipmentMilestone;
  location: string;
  timestamp: string;
  description: string;
  isCompleted: boolean;
}

export interface ShipmentDetails {
  id?: string;
  carrier: string;
  carrierWebsite?: string;
  trackingNumber?: string;
  currentMilestone: ShipmentMilestone;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  dispatchedAt: string;
  deliveredAt?: string;
  deliveryConfirmation?: string;
  milestonesHistory: MilestoneLog[];
  lastUpdated?: string;
}

// ─── Documents, Activity, Notes ────────────────────────────

export interface RequestDocument {
  id: string;
  name: string;
  type: "Customer" | "Supplier" | "Shipment" | "General";
  size: string;
  uploadedAt: string;
  uploadedBy?: string;
  url?: string;
}

export interface InternalNote {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
  isCustomerVisible?: boolean;
}

export interface RequestActivity {
  id: string;
  timestamp: string;
  timeLabel: string;
  title: string;
  description: string;
  actor: string;
  type: "status" | "quote" | "payment" | "order" | "shipment" | "note";
}

// ─── Customers & Staff Users ───────────────────────────────

export interface CustomerRecord {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  registrationDate: string;
  requestCount?: number;
  deliveryAddress?: SavedAddress;
  notes?: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: "Active" | "Inactive";
  lastLogin: string;
  avatarUrl?: string;
  department: string;
  title: string;
  phone?: string;
}

// ─── Unified Part Request (Shared by Admin & Customer) ───────

export interface PartRequest {
  id: string;
  requestNumber: string; // e.g. "AH-P-000123"
  customerId?: string;
  customerName?: string;
  contactName?: string;
  customerEmail?: string;
  customerPhone?: string;
  vehicle: VehicleInfo;
  part: PartInfo;
  supporting: SupportingInfo;
  deliveryAddress: SavedAddress;
  dateSubmitted: string;
  lastUpdated?: string;
  status: RequestStatus;
  specs?: {
    weight?: number;
    dimensions?: string;
  };

  // Assignment
  assignedStaff?: string;
  assignedStaffRole?: string;

  // Sourcing & Quotes
  supplierQuotations?: SupplierQuotation[];
  selectedQuotationId?: string;
  costCalculation?: CostCalculation;
  customerQuoteVersions?: CustomerQuoteVersion[];
  customerQuote?: Quotation;
  quotation?: Quotation;
  quotedValue?: number;
  customerResponse?: CustomerResponse;
  quoteAcceptance?: QuoteAcceptanceAudit;

  // Payment
  payment?: PaymentDetails;
  paymentStatus?: PaymentStatus;

  // Supplier Order
  supplierOrder?: SupplierOrder;

  // QA Verification
  qaDetails?: QADetails;

  // Shipment & Delivery
  shipment?: ShipmentDetails;

  // Documents, Notes, Activity
  documents?: RequestDocument[];
  internalNotes?: InternalNote[];
  activity?: RequestActivity[];
  messages?: any[];

  // Legacy / customer action prompt helpers
  actionRequired?: string;
  actionType?: "review_quote" | "pay_now" | "view_details" | "upload_invoice" | "none";
}

// ─── Notifications ─────────────────────────────────────────

export type NotificationType =
  | "New Request"
  | "Request Submitted"
  | "Information Required"
  | "Status Update"
  | "Quote Available"
  | "Quote Sent"
  | "Quote Accepted"
  | "Quote Rejected"
  | "Payment Received"
  | "Payment Updated"
  | "Order Placed"
  | "QA Review Required"
  | "QA Approved"
  | "Invoice Issued"
  | "Shipment Dispatched"
  | "Shipment Arrived"
  | "Shipment Updated"
  | "Delivery Out"
  | "Delivered"
  | "Customer Registration"
  | "Registration Approval"
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
