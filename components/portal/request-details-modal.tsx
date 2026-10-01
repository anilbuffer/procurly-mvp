"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Car,
  Package,
  Clock,
  ShieldCheck,
  Send,
  Truck,
  CheckCircle2,
  FileCheck2,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Check,
  Calendar,
  MessageSquare,
  FileText,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  Headphones,
  Copy,
  Download,
  ShoppingBag,
  Camera,
} from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { InvoiceDocument } from "@/components/shared/invoice-document";
import { LegalModal } from "@/components/auth/legal-modal";
import {
  PartRequest,
  RequestStatus,
  ShipmentMilestone,
  QuoteAcceptanceAudit,
} from "@/types/portal";
import { DEFAULT_PART_IMAGE, handleImageError } from "@/lib/default-images";

export function RequestDetailsModal() {
  const router = useRouter();
  const {
    requests,
    selectedRequest,
    setSelectedRequest,
    acceptQuote,
    rejectQuote,
    setIsPaymentModalOpen,
    setPaymentRequest,
    setActiveTab: setPortalTab,
    activeCustomer,
    approveSubadmin,
    rejectSubadmin,
    openInvoiceModal,
    selectedRequestDetailsTab,
    setSelectedRequestDetailsTab,
  } = usePortal();

  // Navigation tabs: overview | quote | shipment | Subadmin | invoice
  const [activeTab, setActiveTab] = useState<"overview" | "quote" | "shipment" | "Subadmin" | "invoice">(
    (selectedRequestDetailsTab as any) || "overview"
  );
  const [showDirectContactModal, setShowDirectContactModal] = useState(false);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

  // Quote acceptance verification state
  const [isAcceptingQuote, setIsAcceptingQuote] = useState(false);
  const [verifyVehicle, setVerifyVehicle] = useState(false);
  const [verifyPart, setVerifyPart] = useState(false);
  const [verifyAddress, setVerifyAddress] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false); // Single static acceptance checkbox
  const [termsAcceptedAt, setTermsAcceptedAt] = useState<string | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Quote reject state
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("Local source found faster");

  const [selectedFreightType, setSelectedFreightType] = useState<"Air" | "Sea" | null>(null);
  const [quotePhotoLightbox, setQuotePhotoLightbox] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [lightboxPhotos, setLightboxPhotos] = useState<string[]>([]);

  const openLightbox = (photos: string[], index: number = 0) => {
    if (!photos || photos.length === 0) return;
    setLightboxPhotos(photos);
    setLightboxIndex(index);
    setQuotePhotoLightbox(photos[index]);
  };

  // Sync active tab based on selected request status
  React.useEffect(() => {
    if (selectedRequestDetailsTab && ["overview", "quote", "shipment", "Subadmin", "invoice"].includes(selectedRequestDetailsTab)) {
      setActiveTab(selectedRequestDetailsTab as any);
      return;
    }
    if (!selectedRequest) return;
    const req = requests.find((r) => r.id === selectedRequest.id) || selectedRequest;
    if (req.status === "Quoted" && (req.quotation || req.customerQuote)) {
      setActiveTab("quote");
    } else if ((req.status === "Shipped" || req.status === "Delivered") && req.shipment) {
      setActiveTab("shipment");
    } else if (req.status === "Subadmin Review" && req.SubadminDetails) {
      setActiveTab("Subadmin");
    } else {
      setActiveTab("overview");
    }
  }, [selectedRequest?.id, selectedRequest?.status, selectedRequestDetailsTab, requests]);

  if (!selectedRequest) return null;

  const req = requests.find((r) => r.id === selectedRequest.id) || selectedRequest;

  // The 9-stage customer-facing lifecycle
  const LIFECYCLE_STAGES: RequestStatus[] = [
    "Submitted",
    "Sourcing",
    "Quoted",
    "Approved",
    "Invoicing",
    "Awaiting Payment",
    "Ordered",
    "Shipped",
    "Delivered",
    "Completed",
  ];

  // The internal shipment milestones
  const SHIPMENT_MILESTONES: ShipmentMilestone[] = [
    "Received At Shipping Facility",
    "In Transit",
    "Arrived in NZ",
    "Out For Delivery",
  ];

  const currentStageIndex = (() => {
    const idx = LIFECYCLE_STAGES.indexOf(req.status);
    if (idx !== -1) return idx;
    if (["Subadmin Pending", "Subadmin Review", "Subadmin Hold", "Subadmin Approved", "Ready for Dispatch"].includes(req.status)) {
      return LIFECYCLE_STAGES.indexOf("Ordered");
    }
    return -1;
  })();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedContact(label);
    setTimeout(() => setCopiedContact(null), 2000);
  };

  const handleConfirmAcceptance = () => {
    if (!verifyVehicle || !verifyPart || !verifyAddress || !acceptTerms || !selectedFreightType) return;

    const audit: QuoteAcceptanceAudit = {
      acceptedAt: new Date().toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" }),
      acceptedBy: activeCustomer?.contactName || req.contactName || "Customer",
      userRole: `Authorized Representative (${activeCustomer?.businessName || req.customerName || "Trade Customer"})`,
      termsAccepted: true, // Static acceptance verified
      termsAcceptedAt: termsAcceptedAt || new Date().toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" }),
      ipAddress: "112.213.120.14", // Mocked for MVP
      vehicleVerified: true,
      partVerified: true,
      addressVerified: true,
      selectedFreightType: selectedFreightType!,
      freightCost: selectedFreightType === "Air" ? (req.quotation?.airFreightCost || req.customerQuote?.airFreightCost || 0) : (req.quotation?.seaFreightCost || req.customerQuote?.seaFreightCost || req.quotation?.freightCost || req.customerQuote?.freightCost || 45.0),
    };

    acceptQuote(req.id, audit);
    setIsAcceptingQuote(false);
    // Switch directly to the Tax Invoice tab within the current view (no floating popup modal)
    setActiveTab("invoice");
    setSelectedRequestDetailsTab?.("invoice");
  };

  const handleConfirmReject = () => {
    rejectQuote(req.id, rejectReason);
    setIsRejecting(false);
    setSelectedRequest(null);
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-200">
      <div className="bg-white w-full rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedRequest(null)}
              className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shrink-0"
              title="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0C101A] text-white flex items-center justify-center  font-bold text-xs shadow-md">
                AH
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 ">
                    {req.requestNumber}
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase bg-slate-200/80 text-slate-800">
                    {req.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {req.vehicle.year} {req.vehicle.make} {req.vehicle.model} • Submitted on{" "}
                  {req.dateSubmitted}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 9-Stage Visual Lifecycle Stepper Bar */}
        <div className="px-6 py-3 bg-[#111f4e] text-white shrink-0 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] gap-2">
            {LIFECYCLE_STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div key={stage} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${isPast
                        ? "bg-emerald-500 text-white"
                        : isCurrent
                          ? "bg-[#FE0000] text-white ring-4 ring-red-500/20 animate-pulse"
                          : "bg-slate-700 text-slate-400"
                        }`}
                    >
                      {isPast ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] mt-1 whitespace-nowrap ${isCurrent
                        ? "text-white font-bold"
                        : isPast
                          ? "text-emerald-400 font-medium"
                          : "text-slate-500"
                        }`}
                    >
                      {stage}
                    </span>
                  </div>

                  {idx < LIFECYCLE_STAGES.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-1.5 ${idx < currentStageIndex ? "bg-emerald-500" : "bg-slate-700"
                        }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 text-xs font-bold text-slate-600 shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${activeTab === "overview"
              ? "border-[#FE0000] text-[#FE0000]"
              : "border-transparent hover:text-slate-900"
              }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Overview & Vehicle</span>
          </button>

          {(req.quotation || req.customerQuote) && (
            <button
              onClick={() => setActiveTab("quote")}
              className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${activeTab === "quote"
                ? "border-[#FE0000] text-[#FE0000]"
                : "border-transparent hover:text-slate-900"
                }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Quotation & Pricing</span>
              {req.status === "Quoted" && (
                <span className="w-2 h-2 rounded-full bg-[#FE0000]" />
              )}
            </button>
          )}

          {req.shipment && (
            <button
              onClick={() => setActiveTab("shipment")}
              className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${activeTab === "shipment"
                ? "border-[#FE0000] text-[#FE0000]"
                : "border-transparent hover:text-slate-900"
                }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Shipment Milestones</span>
            </button>
          )}

          {req.SubadminDetails && (
            <button
              onClick={() => setActiveTab("Subadmin")}
              className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${activeTab === "Subadmin"
                ? "border-[#FE0000] text-[#FE0000]"
                : "border-transparent hover:text-slate-900"
                }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Subadmin Review</span>
              {req.status === "Subadmin Review" && (
                <span className="w-2 h-2 rounded-full bg-[#FE0000]" />
              )}
            </button>
          )}

          {(req.payment || req.quoteAcceptance || ["Approved", "Invoicing", "Awaiting Payment", "Ordered", "Shipped", "Delivered", "Completed"].includes(req.status)) && (
            <button
              onClick={() => {
                setActiveTab("invoice");
                setSelectedRequestDetailsTab?.("invoice");
              }}
              className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${activeTab === "invoice"
                ? "border-[#FE0000] text-[#FE0000]"
                : "border-transparent hover:text-slate-900 text-slate-700"
                }`}
              title="View & Download Official GST Tax Invoice"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tax Invoice</span>
              {req.payment?.invoiceUrl && (
                <span className="text-[10px]  bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                  {req.payment?.invoiceNumber || `INV-2026-${req.requestNumber.replace(/[^0-9]/g, "").padStart(4, "0")}`}
                </span>
              )}
            </button>
          )}

          <div className="ml-auto py-2 flex items-center">
            <button
              type="button"
              onClick={() => setShowDirectContactModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#FE0000]" />
              <span>Contact Operations (Email / Teams / Phone)</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW & VEHICLE DETAILS */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Top Quick Status Alert */}
              {req.actionRequired && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-900">
                        Action Required: {req.actionRequired}
                      </h4>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Please review quotation or approve payment to avoid logistics delays.
                      </p>
                    </div>
                  </div>
                  {req.status === "Quoted" && (
                    <button
                      onClick={() => setActiveTab("quote")}
                      className="px-4 py-1.5 bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm whitespace-nowrap"
                    >
                      Review Quote →
                    </button>
                  )}
                  {(req.status === "Awaiting Payment" || req.payment?.status === "Unpaid") && (
                    <button
                      onClick={() => {
                        setPaymentRequest(req);
                        setIsPaymentModalOpen(true);
                      }}
                      className="px-4 py-1.5 bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm whitespace-nowrap"
                    >
                      Record Settlement (Unpaid) →
                    </button>
                  )}
                </div>
              )}

              {/* Quotation Ready Highlight Banner in Overview */}
              {(req.quotation || req.customerQuote) && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-50/90 via-white to-slate-50 border border-red-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FE0000] text-white">
                        Quotation Ready
                      </span>
                      <span className="text-xs font-semibold text-slate-500 ">
                        {(req.quotation || req.customerQuote)?.oemNumber ? `OEM Ref: ${(req.quotation || req.customerQuote)?.oemNumber}` : "Verified Part"}
                      </span>
                      {req.status === "Quoted" && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Awaiting Customer Action
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {(req.quotation || req.customerQuote)?.itemDescription}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-1 italic">
                      &ldquo;{(req.quotation || req.customerQuote)?.notes || "Genuine OEM part inspected and verified by AutoHub sourcing specialist."}&rdquo;
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {/* Thumbnail previews */}
                    {(() => {
                      const qPhotos = (req.quotation?.quotePhotos || req.customerQuote?.quotePhotos || req.customerQuoteVersions?.[0]?.quotePhotos || req.SubadminDetails?.photos || []);
                      if (qPhotos.length === 0) return null;
                      return (
                        <div className="flex -space-x-2 overflow-hidden items-center py-1">
                          {qPhotos.slice(0, 3).map((p: string, idx: number) => (
                            <img
                              key={idx}
                              src={p}
                              alt="Quote part preview"
                              className="inline-block h-10 w-10 rounded-lg ring-2 ring-white object-cover shadow-xs cursor-pointer hover:scale-110 transition-transform"
                              onError={handleImageError}
                              onClick={() => {
                                setLightboxPhotos(qPhotos);
                                setLightboxIndex(idx);
                                setQuotePhotoLightbox(p);
                              }}
                            />
                          ))}
                          {qPhotos.length > 3 && (
                            <span className="flex items-center justify-center h-10 w-10 rounded-lg ring-2 ring-white bg-slate-800 text-white text-[10px] font-bold">
                              +{qPhotos.length - 3}
                            </span>
                          )}
                        </div>
                      );
                    })()}

                    <button
                      onClick={() => setActiveTab("quote")}
                      className="px-4 py-2 bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5 shrink-0"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>View Quote &amp; Photos</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* 2-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Specifications */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Car className="w-4 h-4 text-[#FE0000]" />
                    <span>Vehicle Information</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Make & Model:</span>
                      <span className="font-bold text-slate-800">
                        {req.vehicle.make} {req.vehicle.model} ({req.vehicle.year})
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">VIN / Chassis:</span>
                      <span className=" font-bold text-slate-800">
                        {req.vehicle.vin}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Registration Plate:</span>
                      <span className=" font-bold text-slate-800 uppercase">
                        {req.vehicle.registration || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Engine / Drivetrain:</span>
                      <span className="text-slate-800">
                        {req.vehicle.engine || "—"} • {req.vehicle.driveConfig || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Transmission:</span>
                      <span className="text-slate-800">
                        {req.vehicle.transmission || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Part Requirements */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Package className="w-4 h-4 text-[#FE0000]" />
                    <span>Part Specifications</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Part Name:</span>
                      <span className="font-bold text-slate-800 text-right">
                        {req.part.name}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Part Number:</span>
                      <span className=" font-bold text-slate-800">
                        {req.part.partNumber || "OEM Catalog Lookup Required"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Quantity:</span>
                      <span className="font-bold text-slate-800">
                        {req.part.quantity} Unit(s)
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Preference:</span>
                      <span className="font-semibold text-slate-800">
                        {req.part.preference}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Condition:</span>
                      <span className="font-semibold text-emerald-700">
                        {req.part.condition}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address & Notes */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
                    <MapPin className="w-4 h-4 text-[#FE0000]" />
                    <span>Delivery Address & Logistics</span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-0.5">
                    <p className="font-bold text-slate-800">
                      {req.deliveryAddress.label}
                    </p>
                    <p>
                      {req.deliveryAddress.streetAddress}, {req.deliveryAddress.suburb}
                    </p>
                    <p>
                      {req.deliveryAddress.city} {req.deliveryAddress.postalCode}
                    </p>
                    <p className="text-slate-500 mt-1">
                      Recipient: {req.deliveryAddress.recipientName} (
                      {req.deliveryAddress.phone})
                    </p>
                    {req.supporting?.freightPreference && (
                      <p className="text-slate-800 mt-2 pt-2 border-t border-slate-200/60 font-semibold inline-flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#0ea5e9]" />
                        <span>Freight Preference: <span className="text-[#0ea5e9]">{req.supporting.freightPreference === "Sea Freight" ? "Ocean Freight" : req.supporting.freightPreference}</span></span>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
                    <FileText className="w-4 h-4 text-[#FE0000]" />
                    <span>Customer Notes</span>
                  </div>
                  <p className="text-xs text-slate-600 italic bg-white p-3 rounded-lg border border-slate-200">
                    &ldquo;{req.supporting.notes || "No special instructions provided."}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUOTATION & ACCEPTANCE */}
          {activeTab === "quote" && (req.quotation || req.customerQuote) && (() => {
            const quote = req.quotation || req.customerQuote!;
            const adminPhotos: string[] = (
              (quote.quotePhotos && quote.quotePhotos.length > 0) ? quote.quotePhotos :
                (req.customerQuote?.quotePhotos && req.customerQuote.quotePhotos.length > 0) ? req.customerQuote.quotePhotos :
                  (req.customerQuoteVersions?.find((v: any) => v.quotePhotos && v.quotePhotos.length > 0)?.quotePhotos) ||
                  (req.SubadminDetails?.photos && req.SubadminDetails.photos.length > 0 ? req.SubadminDetails.photos : [])
            );
            const customerPhotos: string[] = req.supporting?.photos || [];
            const specialistNote: string = quote.notes || req.customerQuote?.notes || "";
            const customerVisibleNotes = (req.internalNotes || []).filter((n: any) => n.isCustomerVisible);

            return (
              <div className="space-y-6">
                {/* Quote Overview Card */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Official Quotation
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        {quote.itemDescription}
                      </h3>
                      <p className="text-xs text-slate-500 ">
                        OEM Ref: {quote.oemNumber || req.part.partNumber || "Verified"} • Supplier Hub:{" "}
                        {quote.supplierLocation || "Japan / Global"}
                      </p>
                      {req.supporting?.freightPreference && (
                        <div className="mt-1">
                          <span className="text-[10px] font-bold text-[#FE0000] bg-red-50 px-2 py-0.5 rounded border border-red-100 inline-flex items-center gap-1">
                            Freight Preference: {req.supporting.freightPreference === "Sea Freight" ? "Ocean Freight" : req.supporting.freightPreference}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Total Landed Price
                      </span>
                      <div className="text-2xl font-black text-slate-900 ">
                        {selectedFreightType ? (
                          <>
                            ${(
                              (quote.subtotal +
                                (selectedFreightType === "Air"
                                  ? quote.airFreightCost || 0
                                  : quote.seaFreightCost || quote.freightCost || 0)) * 1.15
                            ).toFixed(2)}{" "}
                            <span className="text-xs font-bold text-slate-500">NZD</span>
                          </>
                        ) : (
                          <>
                            <span className="text-slate-400">— </span>
                            <span className="text-xs font-bold text-slate-400">NZD</span>
                          </>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        {selectedFreightType
                          ? "Includes 15% NZ GST & Freight"
                          : "Select freight option below"}
                      </span>
                    </div>
                  </div>

                  {/* Sourcing Specialist Advisory & Admin Notes */}
                  {(specialistNote || customerVisibleNotes.length > 0) && (
                    <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-amber-950">
                          <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-sm font-bold block">Sourcing Specialist Advisory &amp; Admin Notes</span>
                            <span className="text-[10px] text-amber-800 font-normal">Direct notes from AutoHub Operations &amp; Inspection Team</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900 border border-amber-300">
                          Verified by AutoHub
                        </span>
                      </div>

                      {specialistNote && (
                        <div className="bg-white/90 p-3.5 rounded-xl border border-amber-200/70 text-slate-800 leading-relaxed font-normal shadow-xs">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                            <span>Part Specification &amp; Fitment Advisory</span>
                          </div>
                          <p className="whitespace-pre-wrap text-xs text-slate-800">
                            {specialistNote}
                          </p>
                        </div>
                      )}

                      {customerVisibleNotes.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Operational Updates
                          </span>
                          {customerVisibleNotes.map((note: any) => (
                            <div key={note.id} className="bg-white/70 p-2.5 rounded-lg border border-amber-100 flex items-start justify-between gap-3 text-xs">
                              <p className="text-slate-700">{note.content}</p>
                              <span className="text-[10px] text-slate-400  shrink-0">{note.createdAt}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pre-Dispatch Inspection Photos from Admin */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 text-[#FE0000] flex items-center justify-center">
                          <Camera className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span>Pre-Dispatch Part Photos &amp; Visual Inspection</span>
                            {adminPhotos.length > 0 && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {adminPhotos.length} Photo{adminPhotos.length > 1 ? "s" : ""} Available
                              </span>
                            )}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Verified physical inspection photos uploaded by the sourcing hub prior to dispatch.
                          </p>
                        </div>
                      </div>

                      {adminPhotos.length > 0 && (
                        <span className="text-[11px] text-slate-400 italic">
                          Click any image to expand full size
                        </span>
                      )}
                    </div>

                    {adminPhotos.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                        {adminPhotos.map((photo: string, idx: number) => (
                          <div
                            key={idx}
                            className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-square bg-slate-900 cursor-pointer"
                            onClick={() => openLightbox(adminPhotos, idx)}
                          >
                            <img
                              src={photo}
                              alt={`Admin inspection photo ${idx + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-95 group-hover:opacity-100"
                              onError={handleImageError}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                              <span className="text-[10px] font-bold text-white flex items-center gap-1 w-full">
                                <span>Photo {idx + 1} of {adminPhotos.length}</span>
                                <ExternalLink className="w-3 h-3 text-slate-300 ml-auto" />
                              </span>
                            </div>
                            <span className="absolute top-2 left-2 text-[9px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10">
                              Admin Sourced
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 text-center space-y-1.5">
                        <Camera className="w-6 h-6 text-slate-400 mx-auto" />
                        <p className="text-xs font-semibold text-slate-700">Visual Inspection Pending Arrival</p>
                        <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                          High-resolution physical inspection photos will be uploaded by AutoHub operations upon warehouse arrival before international dispatch.
                        </p>
                      </div>
                    )}

                    {/* Customer Reference Photos Comparison */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          Customer Reference Photos (Submitted at Request)
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {customerPhotos.length > 0
                            ? `${customerPhotos.length} reference photo${customerPhotos.length > 1 ? "s" : ""}`
                            : "Default reference spec"}
                        </span>
                      </div>
                      {customerPhotos.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {customerPhotos.map((photo: string, idx: number) => (
                            <div
                              key={idx}
                              className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-100 cursor-pointer"
                              onClick={() => openLightbox(customerPhotos, idx)}
                            >
                              <img
                                src={photo}
                                alt={`Customer reference ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                onError={handleImageError}
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ExternalLink className="w-3.5 h-3.5 text-white" />
                              </div>
                              <span className="absolute bottom-1 left-1 text-[8px] font-bold text-white bg-black/60 px-1 rounded">
                                Ref #{idx + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <div
                            className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0 cursor-pointer hover:border-red-300 transition-colors shadow-xs"
                            onClick={() => openLightbox([DEFAULT_PART_IMAGE], 0)}
                          >
                            <img
                              src={DEFAULT_PART_IMAGE}
                              alt="Default OEM Reference"
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-700">OEM Catalog Schematic Reference</p>
                            <p className="text-[11px] text-slate-500">Standard factory fitment diagram. No custom workshop photos attached at submission.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Freight Selection Options */}
                  {req.status === "Quoted" && !req.quoteAcceptance ? (
                    <div className="space-y-3">
                      {/* Required Selection Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#FE0000]" />
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Select Your Freight Option</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${selectedFreightType
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-[#FE0000] border-red-200 animate-pulse'
                          }`}>
                          {selectedFreightType ? '✓ Selected' : '⚠ Required'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Air Freight Option */}
                        <div
                          onClick={() => setSelectedFreightType("Air")}
                          className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${selectedFreightType === "Air"
                            ? "border-[#FE0000] bg-red-50/30 shadow-lg shadow-red-500/10 ring-1 ring-[#FE0000]/20"
                            : selectedFreightType === null
                              ? "border-slate-300 bg-white hover:border-[#FE0000]/50 hover:shadow-md"
                              : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                        >
                          {/* Radio indicator */}
                          <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedFreightType === "Air" ? "border-[#FE0000]" : "border-slate-300"
                            }`}>
                            {selectedFreightType === "Air" && <div className="w-2.5 h-2.5 bg-[#FE0000] rounded-full" />}
                          </div>

                          <div className="flex items-center gap-2.5 mb-3">
                            <div className={`p-2 rounded-xl ${selectedFreightType === "Air" ? "bg-red-100 text-[#FE0000]" : "bg-slate-100 text-slate-500"}`}>
                              <Send className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-slate-900 block">Air Express</span>
                              <span className="text-[10px] text-slate-500">Fastest option</span>
                            </div>
                          </div>
                          <div className="text-xl font-black text-slate-900  mb-2">
                            ${((quote.subtotal + (quote.airFreightCost || 0)) * 1.15).toFixed(2)}
                            <span className="text-xs font-bold text-slate-500 ml-1">NZD</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mb-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-semibold">7–10 business days</span> transit
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Priority air cargo. Landed door-to-door.
                          </p>
                        </div>

                        {/* Sea Freight Option */}
                        <div
                          onClick={() => setSelectedFreightType("Sea")}
                          className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${selectedFreightType === "Sea"
                            ? "border-[#FE0000] bg-red-50/30 shadow-lg shadow-red-500/10 ring-1 ring-[#FE0000]/20"
                            : selectedFreightType === null
                              ? "border-slate-300 bg-white hover:border-[#FE0000]/50 hover:shadow-md"
                              : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                        >
                          {/* Radio indicator */}
                          <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedFreightType === "Sea" ? "border-[#FE0000]" : "border-slate-300"
                            }`}>
                            {selectedFreightType === "Sea" && <div className="w-2.5 h-2.5 bg-[#FE0000] rounded-full" />}
                          </div>

                          <div className="flex items-center gap-2.5 mb-3">
                            <div className={`p-2 rounded-xl ${selectedFreightType === "Sea" ? "bg-red-100 text-[#FE0000]" : "bg-slate-100 text-slate-500"}`}>
                              <Truck className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-slate-900 block">Sea Freight</span>
                              <span className="text-[10px] text-emerald-600 font-semibold">Budget-friendly</span>
                            </div>
                          </div>
                          <div className="text-xl font-black text-slate-900  mb-2">
                            ${((quote.subtotal + (quote.seaFreightCost || quote.freightCost || 0)) * 1.15).toFixed(2)}
                            <span className="text-xs font-bold text-slate-500 ml-1">NZD</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mb-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-semibold">25–40 business days</span> transit
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Economy ocean route. Landed door-to-door.
                          </p>
                          {/* Savings badge */}
                          {(quote.airFreightCost && (quote.seaFreightCost || quote.freightCost)) && (
                            <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Save ${(((quote.airFreightCost - (quote.seaFreightCost || quote.freightCost || 0)) * 1.15)).toFixed(2)} NZD
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Validation prompt when no freight selected */}
                      {!selectedFreightType && (
                        <p className="text-[11px] text-[#FE0000] font-medium text-center py-1">
                          Please select a freight option above to continue
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {req.quoteAcceptance?.selectedFreightType === "Air" ? (
                            <Send className="w-4 h-4 text-[#FE0000]" />
                          ) : (
                            <Truck className="w-4 h-4 text-[#FE0000]" />
                          )}
                          <span className="text-xs font-bold text-slate-900">
                            Selected Freight: {req.quoteAcceptance?.selectedFreightType || "Sea"}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700 uppercase">
                            Locked
                          </span>
                        </div>
                        <span className=" text-sm font-bold text-slate-900">
                          ${(req.quoteAcceptance?.freightCost || quote.freightCost || 0).toFixed(2)} NZD
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Acceptance Record if already accepted */}
                  {req.quoteAcceptance && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Quote Accepted & Order Logged</span>
                        </div>
                        {req.payment && (
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${req.payment.status === "Paid"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : "bg-amber-100 text-amber-800 border-amber-200"
                              }`}
                          >
                            Payment: {req.payment.status}
                          </span>
                        )}
                      </div>
                      <p className="text-emerald-700">
                        Accepted by {req.quoteAcceptance.acceptedBy} (
                        {req.quoteAcceptance.userRole}) on{" "}
                        {req.quoteAcceptance.acceptedAt}.
                        {req.payment?.invoiceUrl && (
                          <>
                            {" "}Procurly Invoice Ref:{" "}
                            <strong className="">{req.payment.invoiceNumber}</strong> (Issued by Procurly Operations).
                          </>
                        )}
                      </p>

                      {/* Accounts Receivable Invoice Handover Action Box - only once invoice PDF uploaded */}
                      {req.payment?.invoiceUrl && (
                        <div className="bg-white p-3.5 rounded-xl border border-emerald-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Accounts Receivable Invoice Handover
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className=" font-bold text-slate-900 text-sm">
                                {req.payment?.invoiceNumber || `INV-2026-${req.requestNumber.replace(/[^0-9]/g, "").padStart(4, "0")}`}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium">
                                &bull; Total: ${(req.payment?.amount || req.customerQuote?.totalAmount || req.quotedValue || 450).toFixed(2)} NZD
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab("invoice");
                                setSelectedRequestDetailsTab?.("invoice");
                              }}
                              className="px-3 py-1.5 bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Invoice Tab</span>
                            </button>
                            <a
                              href={req.payment.invoiceUrl}
                              download={req.payment.invoiceFileName || `Tax_Invoice_${req.payment.invoiceNumber || req.requestNumber}.pdf`}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                              title="Download official attached PDF invoice"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF</span>
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Supplier Order Handover Active Box */}
                      {req.supplierOrder && (
                        <div className="bg-white p-3.5 rounded-xl border border-indigo-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                              <ShoppingBag className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Supplier Order Handover Active</span>
                            </div>
                            <p className="text-slate-600 text-[11px] mt-0.5">
                              Purchase Order <strong className=" text-slate-800">{req.supplierOrder.supplierRef}</strong> released to {req.supplierOrder.supplierName}. Handover Route: <span className="font-semibold text-slate-700">{req.supplierOrder.handoverMode || "Consolidated via Autohub Hub"}</span>.
                            </p>
                          </div>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                            PO Placed ({req.supplierOrder.orderDate})
                          </span>
                        </div>
                      )}
                      <div className="mt-2 pt-3 border-t border-emerald-200/60 text-[11px] text-emerald-700 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Particular Terms of Trade digitally accepted by customer on {req.quoteAcceptance.termsAcceptedAt || req.quoteAcceptance.acceptedAt} {req.quoteAcceptance.ipAddress && `(IP: ${req.quoteAcceptance.ipAddress})`}.</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Order Parameters Verified (Vehicle, Part, Delivery Address).</span>
                        </div>
                      </div>
                      {(!req.payment || req.payment.status === "Unpaid") && (
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-200/60">
                          <button
                            onClick={() => {
                              setPaymentRequest(req);
                              setIsPaymentModalOpen(true);
                            }}
                            className="px-4 py-2 bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm inline-flex items-center gap-1.5"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Record Settlement (Status: Unpaid) →</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(null);
                              setPortalTab("payments");
                            }}
                            className="text-xs text-emerald-900 font-bold hover:underline"
                          >
                            View Billing & Payments Tab →
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons if in Quoted status */}
                  {req.status === "Quoted" && !isAcceptingQuote && (
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => setIsRejecting(true)}
                        className="px-4 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Decline Quote
                      </button>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setShowDirectContactModal(true)}
                          className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-600" />
                          <span>Request Info (Email/Teams/Phone)</span>
                        </button>
                        <button
                          onClick={() => {
                            if (!selectedFreightType) {
                              // Scroll to freight section or flash it
                              const el = document.getElementById('freight-selection-section');
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              return;
                            }
                            setIsAcceptingQuote(true);
                          }}
                          className={`px-6 py-2.5 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all inline-flex items-center gap-2 ${selectedFreightType
                            ? 'bg-[#FE0000] hover:bg-[#9B0A0F] text-white shadow-red-500/25'
                            : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                            }`}
                        >
                          <FileCheck2 className="w-4 h-4" />
                          Review Quote
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Single Static Terms Verification Checklist Before Acceptance */}
                  {isAcceptingQuote && (
                    <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-black space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="border-b border-slate-200 pb-4">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-[#FE0000]" />
                          Quote Acceptance — Final Review
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Please review the details below and confirm all information is correct before accepting this quotation.
                        </p>
                      </div>

                      {/* Prominent Admin Comments in Acceptance */}
                      {(specialistNote || customerVisibleNotes.length > 0) && (
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs space-y-2">
                          <div className="flex items-center gap-1.5 font-bold text-amber-900">
                            <MessageSquare className="w-4 h-4 text-amber-600" />
                            <span>Specialist Note from AutoHub</span>
                          </div>
                          {specialistNote && (
                            <p className="text-amber-950 font-medium leading-relaxed whitespace-pre-wrap bg-white/70 p-3 rounded-lg border border-amber-200/60">
                              {specialistNote}
                            </p>
                          )}
                          {customerVisibleNotes.map((note: any) => (
                            <div key={note.id} className="text-amber-900 text-[11px] bg-white/50 p-2 rounded border border-amber-200/40">
                              <strong>Note:</strong> {note.content}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Prominent Admin Photos in Acceptance */}
                      {adminPhotos.length > 0 && (
                        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                              <Camera className="w-4 h-4 text-[#FE0000]" />
                              <span>Pre-Dispatch Part Photos ({adminPhotos.length})</span>
                            </div>
                            <span className="text-[10px] text-slate-500">Click to view full size</span>
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                            {adminPhotos.map((photo: string, idx: number) => (
                              <div
                                key={idx}
                                className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-square bg-slate-50 cursor-pointer"
                                onClick={() => openLightbox(adminPhotos, idx)}
                              >
                                <img
                                  src={photo}
                                  alt={`Part photo ${idx + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                  onError={handleImageError}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Selected Freight Summary */}
                      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs">
                          {selectedFreightType === "Air" ? (
                            <Send className="w-4 h-4 text-[#FE0000]" />
                          ) : (
                            <Truck className="w-4 h-4 text-[#FE0000]" />
                          )}
                          <span className="font-bold text-slate-900">
                            {selectedFreightType === "Air" ? "Air Express" : "Sea Freight"} — {selectedFreightType === "Air" ? "7–10 days" : "25–40 days"}
                          </span>
                        </div>
                        <span className=" text-sm font-bold text-[#FE0000]">
                          ${(
                            (quote.subtotal +
                              (selectedFreightType === "Air"
                                ? quote.airFreightCost || 0
                                : quote.seaFreightCost || quote.freightCost || 0)) * 1.15
                          ).toFixed(2)} NZD
                        </span>
                      </div>

                      {/* Verification Checklist */}
                      <div className="space-y-2.5 text-xs">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Verification Checklist</p>
                        {/* 1. Vehicle verification */}
                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors">
                          <input
                            type="checkbox"
                            checked={verifyVehicle}
                            onChange={(e) => setVerifyVehicle(e.target.checked)}
                            className="w-4 h-4 rounded text-[#FE0000] focus:ring-0 shrink-0"
                          />
                          <span>
                            <strong>Verify Vehicle Information:</strong> {req.vehicle.year}{" "}
                            {req.vehicle.make} {req.vehicle.model} (VIN:{" "}
                            {req.vehicle.vin})
                          </span>
                        </label>

                        {/* 2. Part verification */}
                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors">
                          <input
                            type="checkbox"
                            checked={verifyPart}
                            onChange={(e) => setVerifyPart(e.target.checked)}
                            className="w-4 h-4 rounded text-[#FE0000] focus:ring-0 shrink-0"
                          />
                          <span>
                            <strong>Verify Part Information:</strong> {req.part.name} (Qty:{" "}
                            {req.part.quantity}, {req.part.condition})
                          </span>
                        </label>

                        {/* 3. Delivery address */}
                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors">
                          <input
                            type="checkbox"
                            checked={verifyAddress}
                            onChange={(e) => setVerifyAddress(e.target.checked)}
                            className="w-4 h-4 rounded text-[#FE0000] focus:ring-0 shrink-0"
                          />
                          <span>
                            <strong>Verify Delivery Address:</strong>{" "}
                            {req.deliveryAddress.streetAddress},{" "}
                            {req.deliveryAddress.city}
                          </span>
                        </label>

                        {/* 4. Single static acceptance checkbox */}
                        <div className={`p-3 rounded-xl border transition-all ${acceptTerms ? "bg-slate-50 border-slate-200" : "bg-white border-slate-200 hover:border-slate-300"
                          }`}>
                          <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={acceptTerms}
                              onChange={(e) => {
                                if (!acceptTerms) {
                                  e.preventDefault();
                                  setShowTermsModal(true);
                                } else {
                                  setAcceptTerms(false);
                                }
                              }}
                              onClick={(e) => {
                                if (!acceptTerms) {
                                  e.preventDefault();
                                  setShowTermsModal(true);
                                }
                              }}
                              className="w-4 h-4 rounded text-[#FE0000] focus:ring-0 cursor-pointer shrink-0"
                            />
                            <span className="text-xs text-slate-800">
                              <strong>Accept Procurement Terms:</strong> I agree to the{" "}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowTermsModal(true);
                                }}
                                className="text-[#FE0000] font-bold hover:underline cursor-pointer"
                              >
                                Particular Terms of Trade
                              </button>{" "}
                              and Privacy Policy
                            </span>
                          </label>
                          {acceptTerms && termsAcceptedAt && (
                            <p className="text-[11px] font-medium text-emerald-700 mt-1.5 ml-7 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Particular Terms of Trade viewed and accepted ({termsAcceptedAt})
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <button
                          onClick={() => {
                            setIsAcceptingQuote(false);
                            setVerifyVehicle(false);
                            setVerifyPart(false);
                            setVerifyAddress(false);
                            setAcceptTerms(false);
                          }}
                          className="text-sm bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-medium transition-colors"
                        >
                          ← Back to Quote
                        </button>
                        <button
                          disabled={
                            !verifyVehicle || !verifyPart || !verifyAddress || !acceptTerms
                          }
                          onClick={handleConfirmAcceptance}
                          className="px-6 py-2.5 bg-[#FE0000] hover:bg-[#d31318] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none text-white font-bold text-sm uppercase rounded-xl shadow-md shadow-red-500/20 transition-all inline-flex items-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Confirm Acceptance & Record Order
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* TAB 3: SHIPMENT TRACKING & INTERNAL LOGISTICS MILESTONES */}
          {activeTab === "shipment" && req.shipment && (
            <div className="space-y-6">
              {/* Carrier card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Assigned Freight Carrier
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {req.shipment.carrier}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Estimated Delivery
                  </span>
                  <div className="text-base font-bold text-slate-900">
                    {req.shipment.estimatedDelivery}
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    On Schedule
                  </span>
                </div>
              </div>

              {/* Subadmin Media Block */}
              {(req.supporting.photos || []).length > 0 && (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wider">
                        Supplier Subadmin Verified
                      </h4>
                      <p className="text-[11px] text-emerald-700">
                        Visual evidence verified by Autohub before dispatch
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {req.supporting.photos?.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-emerald-200">
                        <img
                          src={url}
                          alt={`Subadmin Media ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal Logistics Milestones within Shipped Stage */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Internal Logistics Milestones (Shipped Stage)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Real-time operational tracking from international facility to workshop
                  </p>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-300">
                  {req.shipment.milestonesHistory.map((m, idx) => {
                    const isCurrent =
                      req.shipment?.currentMilestone === m.milestone;
                    return (
                      <div key={idx} className="relative">
                        <div
                          className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${m.isCompleted
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : isCurrent
                              ? "bg-[#FE0000] border-[#FE0000] text-white animate-pulse"
                              : "bg-white border-slate-300"
                            }`}
                        >
                          {m.isCompleted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold ${isCurrent
                                ? "text-[#FE0000]"
                                : m.isCompleted
                                  ? "text-slate-900"
                                  : "text-slate-500"
                                }`}
                            >
                              {m.milestone}
                            </span>
                            <span className="text-[10px] text-slate-400 ">
                              • {m.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium">
                            {m.location}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {m.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-slate-200 text-xs">
                  <span className="text-slate-500">Need full tracking dashboard?</span>
                  <button
                    onClick={() => {
                      const id = selectedRequest.id;
                      setSelectedRequest(null);
                      router.push(`/customer/shipments?id=${encodeURIComponent(id)}`);
                    }}
                    className="inline-flex items-center gap-1.5 font-bold text-[#FE0000] hover:underline cursor-pointer"
                  >
                    <span>Open in Full Shipments View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Subadmin REVIEW */}
          {activeTab === "Subadmin" && req.SubadminDetails && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#FE0000]" />
                      Quality Assurance Review
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Uploaded by {req.SubadminDetails.uploadedBy} on {req.SubadminDetails.uploadedAt}
                    </p>
                  </div>
                  {req.SubadminDetails.status === "Review" && (
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                      Pending Your Approval
                    </span>
                  )}
                  {req.SubadminDetails.status === "Approved" && (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      Approved
                    </span>
                  )}
                  {req.SubadminDetails.status === "Rejected" && (
                    <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                      Rejected
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Inspection Photos / Videos
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {req.SubadminDetails.photos?.map((photo, i) => (
                      <div key={i} className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                        <img
                          src={photo}
                          alt={`Subadmin Photo ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Subadmin Operator Notes
                  </h4>
                  <p className="text-sm text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {req.SubadminDetails.notes}
                  </p>
                </div>

                {req.SubadminDetails.status === "Review" ? (
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      onClick={() => {
                        const reason = window.prompt("Reason for rejecting part:");
                        if (reason) {
                          rejectSubadmin(req.id, reason);
                          setSelectedRequest(null);
                        }
                      }}
                      className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Reject Part
                    </button>
                    <button
                      onClick={() => {
                        approveSubadmin(req.id);
                        setActiveTab("overview");
                      }}
                      className="px-6 py-2.5 text-sm font-bold text-white bg-[#FE0000] hover:bg-[#9B0A0F] rounded-xl shadow-md transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve & Dispatch
                    </button>
                  </div>
                ) : (
                  req.SubadminDetails.customerNotes && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Your Notes
                      </h4>
                      <p className="text-sm text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {req.SubadminDetails.customerNotes}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* TAB 5: TAX INVOICE (Within the tab, NOT modal) */}
          {activeTab === "invoice" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <InvoiceDocument
                request={req}
                isModal={false}
                onPayNow={() => {
                  setPaymentRequest(req);
                  setIsPaymentModalOpen(true);
                }}
                standaloneUrl={`/customer/invoice/${req.id}`}
              />
            </div>
          )}

        </div>
      </div>

      {/* Direct MVP Communication Modal (Email, Teams, Phone) */}
      {showDirectContactModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#FE0000] flex items-center justify-center font-bold">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Direct Operations Support
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Procurly Autohub Sourcing & Logistics Desk
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDirectContactModal(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
              <strong>MVP Communication Policy:</strong> In-app messaging is removed for MVP. Inquiries, price queries, and logistics updates occur directly via Email, Teams, and Phone.
            </div>

            {/* Channels List */}
            <div className="space-y-3 text-xs">
              {/* Channel 1: Email */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#FE0000]" />
                    <span className="font-bold text-slate-900">Email Operations</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Recommended
                  </span>
                </div>
                <p className="text-slate-600  text-xs">
                  procurement@autohub.co.nz
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`mailto:procurement@autohub.co.nz?subject=${encodeURIComponent(
                      `[Procurly Quote Query] ${req.requestNumber} - ${req.vehicle.year} ${req.vehicle.make} ${req.vehicle.model}`
                    )}&body=${encodeURIComponent(
                      `Hi Autohub Operations Team,\n\nRegarding request ${req.requestNumber} (${req.part.name}):\n\n[Please enter your inquiry here]\n\nTrade Customer: SP Motors Auckland\nContact: James Wilson`
                    )}`}
                    className="px-3 py-1.5 bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open Email Draft →</span>
                  </a>
                  <button
                    onClick={() => handleCopy("procurement@autohub.co.nz", "email")}
                    className="px-2.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg inline-flex items-center gap-1 text-xs"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedContact === "email" ? "Copied!" : "Copy Email"}</span>
                  </button>
                </div>
              </div>

              {/* Channel 2: Microsoft Teams */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900">Microsoft Teams</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Teams Desk
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Autohub Procurement Desk (Nagoya Sourcing & NZ Logistics)
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://teams.microsoft.com/l/chat/0/0?users=procurement@autohub.co.nz"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Launch Teams Chat →</span>
                  </a>
                </div>
              </div>

              {/* Channel 3: Phone */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900">Direct Phone Support</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    7:30 AM - 6:00 PM NZST
                  </span>
                </div>
                <p className="text-slate-600  text-xs">
                  +64 9 555 0192 (Ext 2 - Trade Desk)
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="tel:+6495550192"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Desk (+64 9 555 0192) →</span>
                  </a>
                  <button
                    onClick={() => handleCopy("+6495550192", "phone")}
                    className="px-2.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg inline-flex items-center gap-1 text-xs"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedContact === "phone" ? "Copied!" : "Copy Phone"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowDirectContactModal(false)}
                className="px-4 py-2 bg-slate-900 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                Close Support
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Trade & Privacy Policy Modal (Reused from auth with scroll enforcement) */}
      <LegalModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        initialDoc="terms"
        title="Particular Terms of Trade"
        onAccept={() => {
          setAcceptTerms(true);
          setTermsAcceptedAt(new Date().toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" }));
        }}
      />
      {/* QUOTE PHOTO LIGHTBOX WITH PREV/NEXT NAVIGATION */}
      {quotePhotoLightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none animate-in fade-in duration-200"
          onClick={() => setQuotePhotoLightbox(null)}
        >
          <div
            className="relative max-w-4xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-black border border-white/10 flex items-center justify-center max-h-[80vh] w-full">
              <img
                src={quotePhotoLightbox || DEFAULT_PART_IMAGE}
                alt="Part photo preview"
                className="max-w-full max-h-[80vh] object-contain rounded-xl"
                onError={handleImageError}
              />

              {lightboxPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const prevIndex = (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length;
                      setLightboxIndex(prevIndex);
                      setQuotePhotoLightbox(lightboxPhotos[prevIndex]);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition-colors border border-white/10 cursor-pointer"
                    title="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextIndex = (lightboxIndex + 1) % lightboxPhotos.length;
                      setLightboxIndex(nextIndex);
                      setQuotePhotoLightbox(lightboxPhotos[nextIndex]);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition-colors border border-white/10 cursor-pointer"
                    title="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom status & Close */}
            <div className="mt-3 flex items-center justify-between w-full px-2 text-white">
              <span className="text-xs font-medium text-slate-300">
                {lightboxPhotos.length > 1
                  ? `Photo ${lightboxIndex + 1} of ${lightboxPhotos.length}`
                  : "Verified inspection photo"}
              </span>
              <button
                type="button"
                onClick={() => setQuotePhotoLightbox(null)}
                className="px-3.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-sm transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close Preview</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
