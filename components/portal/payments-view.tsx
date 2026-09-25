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
  const {
    requests,
    setIsPaymentModalOpen,
    setPaymentRequest,
    setSelectedRequest,
    openInvoiceModal,
  } = usePortal();
  const [filterStatus, setFilterStatus] = useState<"All" | "Unpaid" | "Paid">("All");

  // Requests that have payment record, are invoiceable, or in stages Approved onwards
  const paymentRequests = requests.filter(
    (r) =>
      r.payment ||
      [
        "Approved",
        "Invoicing",
        "Awaiting Payment",
        "Ordered",
        "Shipped",
        "Delivered",
        "Completed",
      ].includes(r.status) ||
      r.quotedValue !== undefined
  );

  const getAmount = (r: PartRequest) => {
    return (
      r.payment?.amount ||
      r.quotedValue ||
      r.customerQuote?.totalAmount ||
      r.costCalculation?.totalCustomerQuote ||
      450.0
    );
  };

  const getInvoiceNumber = (r: PartRequest) => {
    return (
      r.payment?.invoiceNumber ||
      `INV-2026-${r.requestNumber.replace(/[^0-9]/g, "")}`
    );
  };

  const filtered = paymentRequests.filter((r) => {
    const isPaid = r.payment?.status === "Paid";
    const status = isPaid ? "Paid" : "Unpaid";
    if (filterStatus === "All") return true;
    return status === filterStatus;
  });

  const totalPaid = paymentRequests
    .filter((r) => r.payment?.status === "Paid")
    .reduce((sum, r) => sum + getAmount(r), 0);
  const totalUnpaid = paymentRequests
    .filter((r) => r.payment?.status !== "Paid")
    .reduce((sum, r) => sum + getAmount(r), 0);

  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 10;
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedPayments = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

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
            View, generate, and download official Autohub GST tax invoices. Review settlement references and bank remittance details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-6 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold">
                Awaiting Settlement
              </span>
              <span className="font-bold text-amber-600">${totalUnpaid.toFixed(2)} NZD</span>
            </div>
            <div className="border-l pl-6 border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold">
                Total Settled
              </span>
              <span className="font-bold text-emerald-600">${totalPaid.toFixed(2)} NZD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Notice Banner */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Autohub Invoicing & Accounts Receivable Handover</span>
          <p className="text-blue-800 text-[11px] leading-relaxed">
            Tax invoices are generated upon quote approval. Click on any invoice number or the <strong>Invoice</strong> button to view the full breakdown, print, or download a local copy.
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
              className={`px-3.5 py-1.5 rounded-xl transition-all ${isActive
                  ? "bg-[#C40E14] text-white shadow-xs"
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
                <th className="py-3.5 px-6 text-right">Settlement & Actions</th>
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
                paginatedPayments.map((req) => {
                  const pay = req.payment;
                  const isPaid = pay?.status === "Paid";
                  const paymentStatus: "Unpaid" | "Paid" = isPaid ? "Paid" : "Unpaid";
                  const invoiceNum = getInvoiceNumber(req);
                  const amount = getAmount(req);

                  return (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">
                        <button
                          type="button"
                          onClick={() => openInvoiceModal(req)}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline group cursor-pointer text-left"
                          title="Click to view & download official Tax Invoice"
                        >
                          <span className="font-mono font-bold">{invoiceNum}</span>
                          <FileText className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                        </button>
                      </td>
                      <td className="py-4 px-4 font-mono">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="text-slate-700 hover:text-[#B30D12] font-bold hover:underline"
                          title="Click to view full request details"
                        >
                          {req.requestNumber}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-800">{req.part?.name || "Component"}</p>
                        <p className="text-[11px] text-slate-500">
                          {req.vehicle?.year} {req.vehicle?.make} {req.vehicle?.model}
                        </p>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        ${amount.toFixed(2)}
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
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openInvoiceModal(req)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1"
                            title="View & Download Invoice"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-600" />
                            <span>Invoice</span>
                          </button>
                          {paymentStatus === "Unpaid" ? (
                            <button
                              onClick={() => handleOpenPaymentModal(req)}
                              className="px-3.5 py-1.5 bg-[#B30D12] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs transition-all"
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
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} invoices
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-[11px] font-bold text-slate-600 px-3 uppercase tracking-wider">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
