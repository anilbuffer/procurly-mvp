"use client";

import React, { useState } from "react";
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
  Mail,
  Phone,
  Headphones,
  Copy,
} from "lucide-react";
import { usePortal } from "@/context/portal-context";
import {
  PartRequest,
  RequestStatus,
  ShipmentMilestone,
  QuoteAcceptanceAudit,
} from "@/types/portal";

export function RequestDetailsModal() {
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
  } = usePortal();

  // Navigation tabs: overview | quote | shipment (in-app messaging removed for MVP)
  const [activeTab, setActiveTab] = useState<"overview" | "quote" | "shipment">("overview");
  const [showDirectContactModal, setShowDirectContactModal] = useState(false);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

  // Quote acceptance verification state
  const [isAcceptingQuote, setIsAcceptingQuote] = useState(false);
  const [verifyVehicle, setVerifyVehicle] = useState(false);
  const [verifyPart, setVerifyPart] = useState(false);
  const [verifyAddress, setVerifyAddress] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false); // Single static acceptance checkbox

  // Quote reject state
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("Local source found faster");

  if (!selectedRequest) return null;

  const req = requests.find((r) => r.id === selectedRequest.id) || selectedRequest;

  // The 9-stage customer-facing lifecycle
  const LIFECYCLE_STAGES: RequestStatus[] = [
    "Submitted",
    "Sourcing",
    "Quoted",
    "Approved",
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
    "Customs Clearance",
    "Out For Delivery",
  ];

  const currentStageIndex = LIFECYCLE_STAGES.indexOf(
    req.status === "Logistics Exception" || req.status === "Payment Disputed"
      ? "Sourcing"
      : req.status
  );

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedContact(label);
    setTimeout(() => setCopiedContact(null), 2000);
  };

  const handleConfirmAcceptance = () => {
    if (!verifyVehicle || !verifyPart || !verifyAddress || !acceptTerms) return;

    const audit: QuoteAcceptanceAudit = {
      acceptedAt: new Date().toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" }),
      acceptedBy: activeCustomer?.contactName || req.contactName || "Customer",
      userRole: `Authorized Representative (${activeCustomer?.businessName || req.customerName || "Trade Customer"})`,
      termsAccepted: true, // Static acceptance verified
      vehicleVerified: true,
      partVerified: true,
      addressVerified: true,
      freightCost: req.quotation?.freightCost || 45.0,
    };

    acceptQuote(req.id, audit);
    setIsAcceptingQuote(false);
    setActiveTab("overview");
  };

  const handleConfirmReject = () => {
    rejectQuote(req.id, rejectReason);
    setIsRejecting(false);
    setSelectedRequest(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0C101A] text-white flex items-center justify-center font-mono font-bold text-xs shadow-md">
              AH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 font-mono">
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

          <button
            onClick={() => setSelectedRequest(null)}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 9-Stage Visual Lifecycle Stepper Bar */}
        <div className="px-6 py-3 bg-slate-900 text-white shrink-0 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] gap-2">
            {LIFECYCLE_STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div key={stage} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        isPast
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-[#ED2025] text-white ring-4 ring-red-500/20 animate-pulse"
                          : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {isPast ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] mt-1 whitespace-nowrap ${
                        isCurrent
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
                      className={`flex-1 h-0.5 mx-1.5 ${
                        idx < currentStageIndex ? "bg-emerald-500" : "bg-slate-700"
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
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "overview"
                ? "border-[#ED2025] text-[#ED2025]"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Overview & Vehicle</span>
          </button>

          {req.quotation && (
            <button
              onClick={() => setActiveTab("quote")}
              className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === "quote"
                  ? "border-[#ED2025] text-[#ED2025]"
                  : "border-transparent hover:text-slate-900"
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Quotation & Pricing</span>
              {req.status === "Quoted" && (
                <span className="w-2 h-2 rounded-full bg-[#ED2025]" />
              )}
            </button>
          )}

          {req.shipment && (
            <button
              onClick={() => setActiveTab("shipment")}
              className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === "shipment"
                  ? "border-[#ED2025] text-[#ED2025]"
                  : "border-transparent hover:text-slate-900"
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Shipment Milestones</span>
            </button>
          )}

          <div className="ml-auto py-2 flex items-center">
            <button
              type="button"
              onClick={() => setShowDirectContactModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#ED2025]" />
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
                      className="px-4 py-1.5 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm whitespace-nowrap"
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
                      className="px-4 py-1.5 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm whitespace-nowrap"
                    >
                      Record Settlement (Unpaid) →
                    </button>
                  )}
                </div>
              )}

              {/* 2-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Specifications */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Car className="w-4 h-4 text-[#ED2025]" />
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
                      <span className="font-mono font-bold text-slate-800">
                        {req.vehicle.vin}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Registration Plate:</span>
                      <span className="font-mono font-bold text-slate-800 uppercase">
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
                    <Package className="w-4 h-4 text-[#ED2025]" />
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
                      <span className="font-mono font-bold text-slate-800">
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
                    <MapPin className="w-4 h-4 text-[#ED2025]" />
                    <span>Delivery Address</span>
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
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
                    <FileText className="w-4 h-4 text-[#ED2025]" />
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
          {activeTab === "quote" && req.quotation && (
            <div className="space-y-6">
              {/* Quote Overview Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Official Quotation
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      {req.quotation.itemDescription}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      OEM Ref: {req.quotation.oemNumber} • Supplier Hub:{" "}
                      {req.quotation.supplierLocation}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Final Sell Price
                    </span>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      ${req.quotation.totalAmount.toFixed(2)}{" "}
                      <span className="text-xs font-bold text-slate-500">NZD</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      Includes 15% NZ GST
                    </span>
                  </div>
                </div>

                {/* Breakdown Table */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Unit Price:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      ${req.quotation.unitPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Quantity:</span>
                    <span className="font-semibold text-slate-800">
                      {req.quotation.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Parts Subtotal (Excl. GST):</span>
                    <span className="font-mono font-semibold text-slate-800">
                      ${req.quotation.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Freight (Manual Staff Entry):</span>
                    <span className="font-mono font-semibold text-slate-800">
                      ${req.quotation.freightCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">NZ GST (15%):</span>
                    <span className="font-mono font-semibold text-slate-800">
                      ${req.quotation.gstAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Quote Validity:</span>
                    <span className="font-semibold text-amber-700">
                      Valid for 48 Hours (Guaranteed Allocation)
                    </span>
                  </div>
                </div>

                {/* Freight Option: Single flat value entered manually by staff (No comparison engine) */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#ED2025]" />
                      <span className="text-xs font-bold text-slate-900">
                        Delivery Freight
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700 uppercase">
                        Staff Flat Rate
                      </span>
                    </div>
                    <span className="font-mono text-sm font-bold text-slate-900">
                      ${req.quotation.freightCost.toFixed(2)} NZD
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Single freight value entered manually by Autohub operations staff. Freight comparison engine and air/sea selections are omitted for MVP.
                  </p>
                </div>

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
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            req.payment.status === "Paid"
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
                      {req.quoteAcceptance.acceptedAt}. Autohub Invoice Ref:{" "}
                      <strong className="font-mono">{req.payment?.invoiceNumber || "INV-2026-XXXX"}</strong> (Issued by Autohub Operations).
                    </p>
                    {(!req.payment || req.payment.status === "Unpaid") && (
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-200/60">
                        <button
                          onClick={() => {
                            setPaymentRequest(req);
                            setIsPaymentModalOpen(true);
                          }}
                          className="px-4 py-2 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm inline-flex items-center gap-1.5"
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
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
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
                        onClick={() => setIsAcceptingQuote(true)}
                        className="px-6 py-2.5 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-red-500/25 transition-all"
                      >
                        Accept Quote →
                      </button>
                    </div>
                  </div>
                )}

                {/* Single Static Terms Verification Checklist Before Acceptance */}
                {isAcceptingQuote && (
                  <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 animate-in fade-in duration-200">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Required Quote Acceptance Verification
                      </h4>
                      <p className="text-xs text-slate-400">
                        Please verify order parameters and confirm static terms acceptance
                      </p>
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* 1. Vehicle verification */}
                      <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800">
                        <input
                          type="checkbox"
                          checked={verifyVehicle}
                          onChange={(e) => setVerifyVehicle(e.target.checked)}
                          className="w-4 h-4 rounded text-[#ED2025] focus:ring-0"
                        />
                        <span>
                          <strong>Verify Vehicle Information:</strong> {req.vehicle.year}{" "}
                          {req.vehicle.make} {req.vehicle.model} (VIN:{" "}
                          {req.vehicle.vin})
                        </span>
                      </label>

                      {/* 2. Part verification */}
                      <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800">
                        <input
                          type="checkbox"
                          checked={verifyPart}
                          onChange={(e) => setVerifyPart(e.target.checked)}
                          className="w-4 h-4 rounded text-[#ED2025] focus:ring-0"
                        />
                        <span>
                          <strong>Verify Part Information:</strong> {req.part.name} (Qty:{" "}
                          {req.part.quantity}, {req.part.condition})
                        </span>
                      </label>

                      {/* 3. Delivery address */}
                      <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800">
                        <input
                          type="checkbox"
                          checked={verifyAddress}
                          onChange={(e) => setVerifyAddress(e.target.checked)}
                          className="w-4 h-4 rounded text-[#ED2025] focus:ring-0"
                        />
                        <span>
                          <strong>Verify Delivery Address:</strong>{" "}
                          {req.deliveryAddress.streetAddress},{" "}
                          {req.deliveryAddress.city}
                        </span>
                      </label>

                      {/* 4. Single static acceptance checkbox */}
                      <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800">
                        <input
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="w-4 h-4 rounded text-[#ED2025] focus:ring-0"
                        />
                        <span>
                          <strong>Accept Procurement Terms:</strong> I agree to the Procurly Terms of Trade and Privacy Policy
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <button
                        onClick={() => setIsAcceptingQuote(false)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={
                          !verifyVehicle || !verifyPart || !verifyAddress || !acceptTerms
                        }
                        onClick={handleConfirmAcceptance}
                        className="px-6 py-2.5 bg-[#ED2025] disabled:bg-slate-700 disabled:text-slate-500 hover:bg-[#d11a1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
                      >
                        Confirm Acceptance & Record Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Tracking Code:</span>
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {req.shipment.trackingNumber}
                    </span>
                  </div>
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
                          className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            m.isCompleted
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : isCurrent
                              ? "bg-[#ED2025] border-[#ED2025] text-white animate-pulse"
                              : "bg-white border-slate-300"
                          }`}
                        >
                          {m.isCompleted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold ${
                                isCurrent
                                  ? "text-[#ED2025]"
                                  : m.isCompleted
                                  ? "text-slate-900"
                                  : "text-slate-500"
                              }`}
                            >
                              {m.milestone}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
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
                      setSelectedRequest(null);
                      setPortalTab("shipments");
                    }}
                    className="inline-flex items-center gap-1.5 font-bold text-[#ED2025] hover:underline"
                  >
                    <span>Open in Full Shipments View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Direct MVP Communication Modal (Email, Teams, Phone) */}
      {showDirectContactModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#ED2025] flex items-center justify-center font-bold">
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
                    <Mail className="w-4 h-4 text-[#ED2025]" />
                    <span className="font-bold text-slate-900">Email Operations</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Recommended
                  </span>
                </div>
                <p className="text-slate-600 font-mono text-xs">
                  procurement@autohub.co.nz
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`mailto:procurement@autohub.co.nz?subject=${encodeURIComponent(
                      `[Procurly Quote Query] ${req.requestNumber} - ${req.vehicle.year} ${req.vehicle.make} ${req.vehicle.model}`
                    )}&body=${encodeURIComponent(
                      `Hi Autohub Operations Team,\n\nRegarding request ${req.requestNumber} (${req.part.name}):\n\n[Please enter your inquiry here]\n\nTrade Customer: SP Motors Auckland\nContact: James Wilson`
                    )}`}
                    className="px-3 py-1.5 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-1.5"
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
                <p className="text-slate-600 font-mono text-xs">
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
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                Close Support
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
