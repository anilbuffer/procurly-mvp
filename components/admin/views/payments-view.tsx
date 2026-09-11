"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Search,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  RotateCcw,
  Check,
} from "lucide-react";
import { useUnifiedData } from "@/context/unified-data-context";
import { PaymentStatusBadge } from "../status-badge";

export function PaymentsView() {
  const router = useRouter();
  const { requests, markPaymentPaid, markPaymentUnpaid } = useUnifiedData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Paid" | "Unpaid">("All");

  // Requests that have a quoted amount or payment record
  const payableRequests = requests.filter(
    (r) =>
      r.status === "Approved" ||
      r.status === "Awaiting Payment" ||
      r.status === "Ordered" ||
      r.status === "Shipped" ||
      r.status === "Delivered" ||
      r.status === "Completed" ||
      !!r.payment
  );

  const filtered = payableRequests.filter((r) => {
    const payStatus = r.payment?.status || "Unpaid";
    if (statusFilter !== "All" && payStatus !== statusFilter) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      (r.requestNumber || "").toLowerCase().includes(q) ||
      (r.customerName || "").toLowerCase().includes(q) ||
      (r.payment?.paymentReference && r.payment.paymentReference.toLowerCase().includes(q)) ||
      (r.payment?.invoiceNumber && r.payment.invoiceNumber.toLowerCase().includes(q))
    );
  });

  const totalCollected = payableRequests
    .filter((r) => r.payment?.status === "Paid")
    .reduce((sum, r) => sum + (r.payment?.amount || r.quotedValue || 0), 0);

  const totalOutstanding = payableRequests
    .filter((r) => (r.payment?.status || "Unpaid") === "Unpaid")
    .reduce((sum, r) => sum + (r.payment?.amount || r.quotedValue || 0), 0);

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider">
            Total Outstanding (Unpaid)
          </span>
          <span className="font-mono text-2xl font-black text-rose-600 mt-1 block">
            NZ${totalOutstanding.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Awaiting customer payment release
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider">
            Settled Payments (Paid)
          </span>
          <span className="font-mono text-2xl font-black text-emerald-600 mt-1 block">
            NZ${totalCollected.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Cleared & unlocked for purchasing
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider">
              Payment Gate Rule
            </span>
            <p className="text-xs text-slate-600 mt-1">
              Supplier ordering remains strictly blocked until Payment is marked as <strong>PAID</strong>.
            </p>
          </div>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded self-start mt-2">
            Section 18 Policy
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Request #, Customer, Invoice, Reference..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(["All", "Unpaid", "Paid"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === filter
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table (Section 17) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Request #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4 text-right">Amount (NZD)</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Payment Reference</th>
                <th className="py-3 px-4">Payment Date</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No payment records matching your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((req) => {
                  const pay = req.payment;
                  const isPaid = pay?.status === "Paid";
                  const amt = pay?.amount || req.quotedValue || 0;

                  return (
                    <tr
                      key={req.id}
                      onClick={() => router.push(`/admin/requests?id=${req.id}`)}
                      className="hover:bg-slate-50/70 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#ED2025]">
                        {req.requestNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{req.customerName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {pay?.invoiceNumber || `INV-${req.requestNumber.replace("AH-P-", "")}`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        NZ${amt.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <PaymentStatusBadge status={pay?.status || "Unpaid"} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {pay?.paymentReference || req.requestNumber}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {pay?.paidAt || (isPaid ? "Today" : "Pending")}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {req.lastUpdated}
                      </td>
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          {!isPaid ? (
                            <button
                              type="button"
                              onClick={() => markPaymentPaid(req.id)}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Mark Paid
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => markPaymentUnpaid(req.id)}
                              className="px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 rounded-lg"
                            >
                              Revert
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => router.push(`/admin/requests?id=${req.id}`)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-xs"
                          >
                            View
                          </button>
                        </div>
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
