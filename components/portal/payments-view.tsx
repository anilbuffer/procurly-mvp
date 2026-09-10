"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Building2,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  DollarSign,
  Info,
} from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { PartRequest } from "@/types/portal";

export function PaymentsView() {
  const { requests, setIsPaymentModalOpen, setPaymentRequest, setSelectedRequest, setActiveTab } = usePortal();
  const [filterStatus, setFilterStatus] = useState<"All" | "Unpaid" | "Paid">("All");

  // Requests that have payment record or are quoted/awaiting payment
  const paymentRequests = requests.filter(
    (r) => r.payment || r.quotedValue !== undefined
  );

  const filtered = paymentRequests.filter((r) => {
    const status = r.payment?.status === "Paid" ? "Paid" : "Unpaid";
    if (filterStatus === "All") return true;
    return status === filterStatus;
  });

  const handleOpenPaymentModal = (req: PartRequest) => {
    setPaymentRequest(req);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Ledger Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" />
            <span>Autohub Invoices & Settlement Ledger</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Payment Status & Invoices</h2>
          <p className="text-xs text-slate-500">
            Invoice generation remains in the existing Autohub operational process. The portal records payment status and settlement references.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab("documents")}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            All Documents (PDF) →
          </button>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-6 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold">
                Trade Credit Facility
              </span>
              <span className="font-bold text-slate-800">$50,000.00 NZD</span>
            </div>
            <div className="border-l pl-6">
              <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold">
                Available Line
              </span>
              <span className="font-bold text-emerald-600">$42,600.00 NZD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Notice Banner */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Autohub Invoicing & Payment Tracking Notice</span>
          <p className="text-blue-800 text-[11px] leading-relaxed">
            Tax invoices are generated within the existing Autohub operational workflow. For MVP, payment status is recorded strictly as <strong>Unpaid</strong> or <strong>Paid</strong>. Customers can record settlements directly or charge against their pre-approved trade credit facility.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-bold">
        {(["All", "Unpaid", "Paid"] as const).map((tab) => {
          const isActive = filterStatus === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                isActive
                  ? "bg-[#0C101A] text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab === "All" ? "All Invoices" : tab}
            </button>
          );
        })}
      </div>

      {/* Invoice Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Autohub Invoice #</th>
                <th className="py-3.5 px-4">Request Ref</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Amount (NZD)</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-6 text-right">Settlement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No invoice records found matching status &quot;{filterStatus}&quot;.
                  </td>
                </tr>
              ) : (
                filtered.map((req) => {
                  const pay = req.payment;
                  const paymentStatus: "Unpaid" | "Paid" =
                    pay?.status === "Paid" ? "Paid" : "Unpaid";

                  return (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">
                        {pay?.invoiceNumber || "AUTOHUB-INV"}
                      </td>
                      <td className="py-4 px-4 font-mono">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="text-slate-700 hover:text-[#ED2025] font-bold hover:underline"
                          title="Click to view full request details"
                        >
                          {req.requestNumber}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-800">{req.part.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                        </p>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        ${(pay?.amount || req.quotedValue || 0).toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        {paymentStatus === "Paid" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        {paymentStatus === "Unpaid" ? (
                          <button
                            onClick={() => handleOpenPaymentModal(req)}
                            className="px-3.5 py-1.5 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs transition-all"
                          >
                            Record Payment →
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenPaymentModal(req)}
                            className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold hover:underline"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Paid (View Record)</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
