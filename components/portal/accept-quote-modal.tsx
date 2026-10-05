"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plane,
  Ship,
  FileText,
  AlertCircle,
  ExternalLink,
  Check,
  Building2,
  MapPin,
  Car,
  Package,
} from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { PartRequest, QuoteAcceptanceAudit } from "@/types/portal";

export function AcceptQuoteModal() {
  const {
    requests,
    isQuoteModalOpen,
    setIsQuoteModalOpen,
    quoteRequest,
    setQuoteRequest,
    acceptQuote,
    setIsPaymentModalOpen,
    setPaymentRequest,
    activeCustomer,
    setSelectedRequest,
    setSelectedRequestDetailsTab,
  } = usePortal();

  const [selectedFreight, setSelectedFreight] = useState<"Sea" | "Air">("Sea");
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isQuoteModalOpen || !quoteRequest) return null;

  const req = requests.find((r) => r.id === quoteRequest.id) || quoteRequest;
  const quote = req.customerQuote || req.quotation || {
    itemDescription: req.part?.name || "Genuine OEM Part",
    oemNumber: req.part?.partNumber || "OEM-PART",
    unitPrice: 420.0,
    subtotal: 420.0,
    seaFreightCost: 65.0,
    airFreightCost: 105.0,
    gstAmount: 63.26,
    totalAmount: 485.0,
    currency: "NZD",
    estimatedTransitDays: 5,
    supplierLocation: "Autohub Nagoya Logistics Hub, Japan",
  };

  const partPrice = quote.unitPrice || quote.subtotal || 420.0;
  const seaFreight = quote.seaFreightCost || 65.0;
  const airFreight = quote.airFreightCost || 105.0;
  const freightCost = selectedFreight === "Air" ? airFreight : seaFreight;
  const totalLandedAmount = partPrice + freightCost;

  const handleConfirmAcceptance = () => {
    if (!termsAgreed || isProcessing) return;

    setIsProcessing(true);

    const audit: QuoteAcceptanceAudit = {
      acceptedAt: new Date().toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" }),
      acceptedBy: activeCustomer?.contactName || req.contactName || "Authorized Representative",
      userRole: `Authorized Representative (${activeCustomer?.businessName || req.customerName || "Trade Customer"})`,
      termsAccepted: true,
      termsAcceptedAt: new Date().toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" }),
      ipAddress: "112.213.120.14",
      vehicleVerified: true,
      partVerified: true,
      addressVerified: true,
      selectedFreightType: selectedFreight,
      freightCost,
    };

    setTimeout(() => {
      acceptQuote(req.id, audit);
      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsQuoteModalOpen(false);
        setQuoteRequest(null);
        setIsSuccess(false);

        // Seamless transition to Payment modal so customer can settle immediately
        const updatedReq: PartRequest = {
          ...req,
          status: "Awaiting Payment",
          customerResponse: "Accepted",
          quotedValue: totalLandedAmount,
          actionType: "pay_now",
          actionRequired: "Settle invoice via Bank Transfer or Card",
          payment: {
            id: `pay-${req.requestNumber}`,
            requestId: req.id,
            invoiceNumber: req.payment?.invoiceNumber || `INV-2026-${req.requestNumber.replace(/[^0-9]/g, "").padStart(4, "0")}`,
            amount: totalLandedAmount,
            currency: "NZD",
            status: "Unpaid",
            paymentReference: req.requestNumber,
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            lastUpdated: "Just now",
          },
        };
        setPaymentRequest(updatedReq);
        setIsPaymentModalOpen(true);
      }, 700);
    }, 450);
  };

  const handleOpenFullDetails = () => {
    setIsQuoteModalOpen(false);
    setSelectedRequestDetailsTab?.("quote");
    setSelectedRequest(req);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-6 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/70 via-white to-red-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-900">
                  Review &amp; Accept Landed Quote
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Action Required
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {req.requestNumber} &bull; {req.vehicle.make} {req.vehicle.model} ({req.vehicle.year})
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsQuoteModalOpen(false);
              setQuoteRequest(null);
            }}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[calc(85vh-140px)] overflow-y-auto">
          {/* Success Banner if accepted */}
          {isSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-xs">Quote Accepted Successfully!</p>
                <p className="text-[11px] text-emerald-700">
                  Status updated to Awaiting Payment. Preparing your invoice settlement...
                </p>
              </div>
            </div>
          )}

          {/* Part & Sourcing Summary Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Sourced Part Specification
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    OEM Verified
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{req.part.name}</h3>
                <p className="text-xs text-slate-600">
                  OEM Part Number: <span className="font-semibold text-slate-800">{req.part.partNumber || "48069-26150"}</span> &bull; Condition: {req.part.condition || "Brand New Genuine OEM"}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Unit Cost</span>
                <span className="text-sm font-bold text-slate-900">${partPrice.toFixed(2)} NZD</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-2">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Nagoya Logistics Sourcing Hub, Japan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Deliver to: {activeCustomer.businessName} (Penrose, Auckland)</span>
              </div>
            </div>
          </div>

          {/* Freight Selection Options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Select Delivery Freight Mode</span>
                <span className="text-slate-400 font-normal">(Door-to-Door Landed)</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">Clearance &amp; Port fees included</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Sea Freight Card */}
              <div
                onClick={() => setSelectedFreight("Sea")}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedFreight === "Sea"
                    ? "border-emerald-500 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${selectedFreight === "Sea" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                      <Ship className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Consolidated Sea Freight</span>
                      <span className="text-[10px] text-slate-500 font-medium">Standard Economy</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">${seaFreight.toFixed(2)} NZD</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1.5 border-t border-slate-100">
                  <span>Estimated Transit:</span>
                  <span className="font-semibold text-slate-800">14–18 Business Days</span>
                </div>
              </div>

              {/* Air Express Freight Card */}
              <div
                onClick={() => setSelectedFreight("Air")}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedFreight === "Air"
                    ? "border-[#FE0000] bg-red-50/40 shadow-sm ring-2 ring-red-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${selectedFreight === "Air" ? "bg-[#FE0000] text-white" : "bg-slate-100 text-slate-600"}`}>
                      <Plane className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Express Air Freight</span>
                      <span className="text-[10px] text-[#FE0000] font-bold">Fastest Dispatch</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">${airFreight.toFixed(2)} NZD</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1.5 border-t border-slate-100">
                  <span>Estimated Transit:</span>
                  <span className="font-semibold text-slate-800">5–7 Business Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Landed Door-to-Door Cost Calculation */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>OEM Part Price</span>
              <span className="font-semibold text-slate-800">${partPrice.toFixed(2)} NZD</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>International Freight ({selectedFreight === "Air" ? "Express Air" : "Sea Cargo"})</span>
              <span className="font-semibold text-slate-800">${freightCost.toFixed(2)} NZD</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Import Clearance, Duties &amp; Bio-Security Check</span>
              <span className="font-bold text-emerald-600">Included ($0.00)</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>GST (15% Included)</span>
              <span className="font-medium text-slate-700">${((totalLandedAmount * 0.15) / 1.15).toFixed(2)} NZD</span>
            </div>

            <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Total Landed Quote Amount</span>
                <span className="text-[10px] text-slate-500">Guaranteed landed door-to-door, no hidden fees</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-slate-900 tracking-tight">
                  ${totalLandedAmount.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-slate-500 ml-1">NZD</span>
              </div>
            </div>
          </div>

          {/* Pre-Verification Trust Checklist */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Autohub Pre-Verification &amp; Guarantee</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-emerald-800">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Vehicle &amp; VIN Compatibility Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Genuine OEM Specification Checked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Door-to-Door Delivery Address Confirmed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>12-Month Autohub Trade Warranty Applied</span>
              </div>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="w-4 h-4 rounded text-[#FE0000] focus:ring-red-500 mt-0.5 cursor-pointer accent-[#FE0000]"
            />
            <span className="text-xs text-slate-700 leading-snug">
              I authorize procurement of this landed quote on behalf of{" "}
              <strong>{activeCustomer.businessName}</strong> under Autohub Particular Terms of Trade.
            </span>
          </label>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 sm:px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleOpenFullDetails}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Full Part Inspection &amp; Photos &rarr;</span>
          </button>

          <div className="flex items-center gap-2.5 justify-end">
            <button
              type="button"
              onClick={() => {
                setIsQuoteModalOpen(false);
                setQuoteRequest(null);
              }}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!termsAgreed || isProcessing}
              onClick={handleConfirmAcceptance}
              className="px-6 py-2.5 bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/35 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Accepting Quote...</span>
                </>
              ) : isSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Quote Accepted!</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                  <span>Accept Quote &amp; Settle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
