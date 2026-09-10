"use client";

import React from "react";
import {
  FileText,
  Search,
  FileCheck,
  Clock,
  CheckCircle,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { useProcurement } from "@/context/procurement-context";
import { StatusBadge } from "./status-badge";
import { PaymentStatusBadge } from "./payment-status-badge";
import { SummaryCard } from "./summary-card";

export function ProcurementDashboardView() {
  const {
    metrics,
    requests,
    setActiveTab,
    setStatusFilter,
    viewRequestDetail,
  } = useProcurement();

  // Work queue: items that need attention (not Completed)
  const workQueue = requests.filter(
    (r) => r.status !== "Completed"
  );

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ED2025]/10 text-[#ED2025] border border-[#ED2025]/20 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#ED2025] animate-pulse" />
            <span>PROCUREMENT SOURCING DESK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good morning, Sarah
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Here&apos;s what needs your attention today.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <SummaryCard
          label="New Requests"
          value={metrics.newRequests}
          icon={FileText}
          color="blue"
          onClick={() => setActiveTab("sourcing")}
        />
        <SummaryCard
          label="Sourcing"
          value={metrics.sourcing}
          icon={Search}
          color="indigo"
          onClick={() => setActiveTab("sourcing")}
        />
        <SummaryCard
          label="Quotes Ready"
          value={metrics.quotesReady}
          icon={FileCheck}
          color="amber"
          onClick={() => setActiveTab("quotes")}
        />
        <SummaryCard
          label="Awaiting Payment"
          value={metrics.awaitingPayment}
          icon={Clock}
          color="orange"
          onClick={() => {
            setStatusFilter("Awaiting Payment");
            setActiveTab("requests");
          }}
        />
        <SummaryCard
          label="Ready to Order"
          value={metrics.readyToOrder}
          icon={CheckCircle}
          color="emerald"
          onClick={() => setActiveTab("orders")}
        />
        <SummaryCard
          label="Orders In Progress"
          value={metrics.ordersInProgress}
          icon={ShoppingCart}
          color="sky"
          onClick={() => setActiveTab("orders")}
        />
      </div>

      {/* Procurement Work Queue */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Procurement Work Queue
            </h2>
            <p className="text-xs text-slate-500">
              Active requests requiring procurement attention
            </p>
          </div>
          <button
            onClick={() => setActiveTab("requests")}
            className="text-xs font-bold text-slate-600 hover:text-[#ED2025] inline-flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Request #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Part</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quote Value</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {workQueue.slice(0, 8).map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  onClick={() => viewRequestDetail(req)}
                >
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-900 group-hover:text-[#ED2025] transition-colors whitespace-nowrap">
                    {req.requestNumber}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                    {req.customerName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {req.vehicle.make} {req.vehicle.model} {req.vehicle.year}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-[180px] truncate" title={req.part.name}>
                    {req.part.name}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    {req.quotedValue ? `NZ$${req.quotedValue.toLocaleString()}` : "—"}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {req.payment ? (
                      <PaymentStatusBadge status={req.payment.status} />
                    ) : (
                      <span className="text-slate-400 text-[10px]">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {req.dateSubmitted === "2026-09-10" ? "Today" : req.dateSubmitted}
                  </td>
                  <td className="py-3.5 px-5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        viewRequestDetail(req);
                      }}
                      className="text-[11px] font-bold text-[#ED2025] hover:text-[#d11a1f] inline-flex items-center gap-1 transition-colors"
                    >
                      Open
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
