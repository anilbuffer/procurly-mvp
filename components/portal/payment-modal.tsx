"use client";

import React, { useState } from "react";
import {
  X,
  CreditCard,
  Building2,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  DollarSign,
  FileText,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { usePortal } from "@/context/portal-context";

export function PaymentModal() {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    paymentRequest,
    setPaymentRequest,
    submitPayment,
  } = usePortal();

  const [paymentMethod, setPaymentMethod] = useState<
    "Trade Credit Account" | "Bank Transfer" | "Credit Card"
  >("Trade Credit Account");
  const [bankReference, setBankReference] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isPaymentModalOpen || !paymentRequest) return null;

  const req = paymentRequest;
  const pay = req.payment || {
    id: "pay-default",
    requestId: req.id,
    invoiceNumber: "INV-2026-00892",
    amount: req.quotedValue || 485.0,
    currency: "NZD",
    status: "Unpaid" as const,
    paymentReference: `${req.requestNumber}`,
    bankDetails: {
      bankName: "ANZ New Zealand",
      accountName: "Autohub Procurement NZ Ltd",
      accountNumber: "01-0288-0349821-00",
      swiftBic: "ANZBNZ22",
    },
    dueDate: "2026-09-14",
  };

  const isPaid = pay.status === "Paid";

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleProcessPayment = () => {
    submitPayment(req.id, paymentMethod, bankReference || pay.paymentReference);
    setIsPaymentModalOpen(false);
    setPaymentRequest(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Autohub Settlement & Payment Record
                </h2>
                {isPaid ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <Clock className="w-3 h-3 text-amber-600" />
                    Unpaid
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Autohub Invoice Ref: {pay.invoiceNumber} • Reference: {pay.paymentReference}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Autohub Invoice Notice Callout */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-800 block">
                Autohub Operational Invoicing
              </span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Official tax invoice generation remains in the existing Autohub operational process. The portal records payment status and settlement references.
              </p>
            </div>
          </div>

          {/* If already Paid */}
          {isPaid ? (
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-emerald-900">
                  Payment Status: Paid
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Settlement Method
                  </span>
                  <span className="font-bold text-slate-800">
                    {pay.paymentMethod || "Trade Credit Account"}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Payment Status
                  </span>
                  <span className="font-bold text-emerald-700">Paid ✓</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Autohub Invoice #
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    {pay.invoiceNumber}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Amount Settled
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    ${pay.amount.toFixed(2)} NZD
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Autohub Operations has logged this settlement. Your order is confirmed and scheduled for dispatch through Autohub Logistics.
              </p>
            </div>
          ) : (
            <>
              {/* Summary Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Part & Order Description
                  </span>
                  <h4 className="text-xs font-bold text-slate-800">
                    {req.part.name} (x{req.part.quantity})
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    For {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Payable Balance (incl GST)
                  </span>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    ${pay.amount.toFixed(2)}{" "}
                    <span className="text-xs font-bold text-slate-500">NZD</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Settlement Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: Trade Credit Account */}
                  <div
                    onClick={() => setPaymentMethod("Trade Credit Account")}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "Trade Credit Account"
                        ? "border-[#ED2025] bg-red-50/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-xs text-slate-900">
                        Trade Credit
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      30-Day Net Trade line (Immediate release)
                    </p>
                  </div>

                  {/* Option 2: Bank Transfer */}
                  <div
                    onClick={() => setPaymentMethod("Bank Transfer")}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "Bank Transfer"
                        ? "border-[#ED2025] bg-red-50/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-xs text-slate-900">
                        Bank Transfer
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      ANZ NZ direct deposit or wire
                    </p>
                  </div>

                  {/* Option 3: Credit Card */}
                  <div
                    onClick={() => setPaymentMethod("Credit Card")}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "Credit Card"
                        ? "border-[#ED2025] bg-red-50/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      <span className="font-bold text-xs text-slate-900">
                        Card Payment
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Visa / Mastercard / Amex
                    </p>
                  </div>
                </div>
              </div>

              {/* Details based on chosen method */}
              {paymentMethod === "Trade Credit Account" && (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900">
                      Approved SP Motors Trade Account
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      APPROVED
                    </span>
                  </div>
                  <p className="text-emerald-800 leading-relaxed">
                    Releasing this order onto your 30-day billing term records the status as Paid and releases the purchase order to the Japan parts supplier.
                  </p>
                  <div className="pt-2 flex justify-between text-slate-600 border-t border-emerald-200/60 font-mono text-[11px]">
                    <span>Credit Limit: $50,000 NZD</span>
                    <span className="font-bold text-emerald-800">
                      Available Line: $42,600 NZD
                    </span>
                  </div>
                </div>
              )}

              {paymentMethod === "Bank Transfer" && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900">
                    Autohub New Zealand Bank Account Details:
                  </h4>

                  <div className="space-y-2 font-mono">
                    <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-slate-500 font-sans text-xs">Bank:</span>
                      <span className="font-bold text-slate-900">
                        {pay.bankDetails.bankName}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-slate-500 font-sans text-xs">
                        Account Name:
                      </span>
                      <span className="font-bold text-slate-900">
                        {pay.bankDetails.accountName}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-slate-500 font-sans text-xs">
                        Account Number:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {pay.bankDetails.accountNumber}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(pay.bankDetails.accountNumber, "acc")
                          }
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                        >
                          {copiedField === "acc" ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-amber-300 bg-amber-50/20">
                      <span className="text-amber-900 font-sans text-xs font-bold">
                        Mandatory Reference:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-900">
                          {pay.paymentReference}
                        </span>
                        <button
                          onClick={() => handleCopy(pay.paymentReference, "ref")}
                          className="p-1 hover:bg-amber-100 rounded text-amber-700"
                        >
                          {copiedField === "ref" ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Bank Transaction Reference (After transfer)
                    </label>
                    <input
                      type="text"
                      value={bankReference}
                      onChange={(e) => setBankReference(e.target.value)}
                      placeholder="e.g. ANZ-TX-98124912"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-[#ED2025]"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "Credit Card" && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        CVC
                      </label>
                      <input
                        type="password"
                        placeholder="123"
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            {isPaid ? "Close" : "Cancel"}
          </button>

          {!isPaid && (
            <button
              onClick={handleProcessPayment}
              className="px-6 py-2.5 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-red-500/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <span>
                {paymentMethod === "Trade Credit Account"
                  ? "Release Order & Mark Paid"
                  : paymentMethod === "Bank Transfer"
                  ? "Record Bank Transfer (Mark Paid)"
                  : "Pay Now via Card (Mark Paid)"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
