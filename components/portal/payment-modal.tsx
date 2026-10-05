"use client";

import React, { useState } from "react";
import {
  X,
  Building2,
  Copy,
  Check,
  ArrowRight,
  DollarSign,
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Info,
} from "lucide-react";
import { usePortal } from "@/context/portal-context";

export function PaymentModal() {
  const {
    requests,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    paymentRequest,
    setPaymentRequest,
    submitPayment,
  } = usePortal();

  const [bankReference, setBankReference] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [referenceSubmitted, setReferenceSubmitted] = useState(false);

  if (!isPaymentModalOpen || !paymentRequest) return null;

  const req = requests.find((r) => r.id === paymentRequest.id) || paymentRequest;
  const pay = req.payment || {
    id: `pay-${req.id}`,
    requestId: req.id,
    invoiceNumber: req.payment?.invoiceNumber || (req.requestNumber ? `INV-2026-${req.requestNumber.replace(/[^0-9]/g, "").padStart(4, "0")}` : "INV-2026-0001"),
    amount:
      req.quotedValue ||
      req.customerQuote?.totalAmount ||
      req.costCalculation?.totalCustomerQuote ||
      485.0,
    currency: "NZD",
    status: "Unpaid" as "Unpaid" | "Paid",
    paymentReference: req.payment?.paymentReference || `${req.requestNumber}`,
    bankDetails: {
      bankName: "ANZ New Zealand",
      accountName: "Autohub Procurement NZ Ltd",
      accountNumber: "01-0288-0349821-00",
      swiftBic: "ANZBNZ22",
    },
    dueDate: "2026-09-30",
  };

  const isPaid = pay.status === "Paid";

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmitRemittanceNote = () => {
    const ref = bankReference.trim() || `${req.requestNumber}-CONFIRMED`;
    submitPayment(req.id, ref);
    setReferenceSubmitted(true);
    setTimeout(() => {
      setIsPaymentModalOpen(false);
      setPaymentRequest(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-6">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Bank Settlement &amp; Invoice Status
                </h2>
                {isPaid ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <Clock className="w-3 h-3 text-amber-600" />
                    Awaiting Settlement
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 ">
                Autohub Invoice Ref: {pay.invoiceNumber} • Reference: {pay.paymentReference}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Autohub Invoice Notice Callout */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-800 block">
                Official Autohub Procurement GST Tax Invoice
              </span>
              <p className="text-slate-500 mt-0.5">
                Issued by Autohub Procurement NZ Ltd (NZBN: 9429038291024, GST: 112-984-291) for order fulfillment and international shipping.
              </p>
            </div>
          </div>

          {isPaid ? (
            /* Paid state display */
            <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-950">
                  Payment Reconciled &amp; Confirmed by Admin
                </h3>
                <p className="text-xs text-emerald-800 mt-1">
                  Tax invoice {pay.invoiceNumber} has been reconciled and recorded as Paid by the Autohub finance team.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left max-w-sm mx-auto text-xs">
                <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Amount Settled
                  </span>
                  <span className=" font-bold text-emerald-900 text-sm">
                    ${pay.amount.toFixed(2)} NZD
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Payment Reference
                  </span>
                  <span className=" font-bold text-slate-800">
                    {pay.paymentReference}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Autohub Operations has verified payment confirmation. Your order is unlocked and in procurement fulfillment with Autohub Logistics.
              </p>
            </div>
          ) : (
            <>
              {/* Summary Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Part &amp; Order Description
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
                  <div className="text-2xl font-black text-slate-900 ">
                    ${pay.amount.toFixed(2)}{" "}
                    <span className="text-xs font-bold text-slate-500">NZD</span>
                  </div>
                </div>
              </div>

              {/* Direct Bank Settlement Details */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-700" />
                  <h4 className="font-bold text-slate-900">
                    Autohub NZ Direct Deposit / Wire Details:
                  </h4>
                </div>

                <div className="space-y-2 ">
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500  text-xs">Bank:</span>
                    <span className="font-bold text-slate-900">
                      {pay.bankDetails?.bankName || "ANZ New Zealand"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500  text-xs">
                      Account Name:
                    </span>
                    <span className="font-bold text-slate-900">
                      {pay.bankDetails?.accountName || "Autohub Procurement NZ Ltd"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500  text-xs">
                      Account Number:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">
                        {pay.bankDetails?.accountNumber || "01-0288-0349821-00"}
                      </span>
                      <button
                        onClick={() =>
                          handleCopy(pay.bankDetails?.accountNumber || "01-0288-0349821-00", "acc")
                        }
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                        title="Copy account number"
                      >
                        {copiedField === "acc" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-amber-50/50 p-2.5 rounded-lg border border-amber-300">
                    <span className="text-amber-900  text-xs font-bold">
                      Mandatory Reference:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-900 text-sm">
                        {pay.paymentReference}
                      </span>
                      <button
                        onClick={() => handleCopy(pay.paymentReference, "ref")}
                        className="p-1 hover:bg-amber-100 rounded text-amber-700 cursor-pointer"
                        title="Copy reference"
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

                {/* Bank Reference Note Input */}
                <div className="pt-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Bank Deposit Transaction Reference (Optional)
                  </label>
                  <input
                    type="text"
                    value={bankReference}
                    onChange={(e) => setBankReference(e.target.value)}
                    placeholder="e.g. ANZ-TX-98124912"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-[#FE0000] bg-white "
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    If you have already initiated your bank transfer, enter your transaction reference above to assist our accounts team with reconciliation.
                  </p>
                </div>
              </div>

              {/* Policy Callout - No Manual Customer Mark As Paid */}
              <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-950">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>Only Admins Can Update Payment Status</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  In accordance with commercial trade guidelines, customers cannot manually mark invoices as paid. Once your bank deposit is received using the mandatory reference, the Autohub Accounts team reconciles the bank ledger and updates your order status to <strong>Paid</strong>, releasing the consignment for dispatch.
                </p>
              </div>

              {referenceSubmitted && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Remittance reference submitted to Autohub Accounts team!</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="px-4 py-2 text-xs font-bold text-slate-600 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>

          {!isPaid && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSubmitRemittanceNote}
                className="px-4 py-2.5 bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>
                  {bankReference.trim()
                    ? "Submit Remittance Note"
                    : "I Have Paid / Record Settlement"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
