"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Truck,
  CreditCard,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { useUnifiedData } from "@/context/unified-data-context";
import { StatusBadge, PaymentStatusBadge } from "../status-badge";

export function AdminDashboardView() {
  const router = useRouter();
  const { requests, adminMetrics } = useUnifiedData();

  // "What requires action right now?"
  // Requests that need attention:
  // - Submitted (needs sourcing)
  // - Quoted (waiting customer approval)
  // - Approved (needs payment / order)
  // - Awaiting Payment (Unpaid)
  // - Ordered (needs shipment)
  // - Shipped (active tracking)
  const attentionRequests = requests.filter(
    (r) =>
      r.status === "Submitted" ||
      r.status === "Sourcing" ||
      r.status === "Awaiting Payment" ||
      r.status === "Approved" ||
      r.payment?.status === "Unpaid" ||
      (r.status === "Ordered" && !r.shipment)
  );

  const summaryCards = [
    {
      title: "NEW REQUESTS",
      count: adminMetrics.newRequests,
      statusFilter: "Submitted",
      bgClass: "bg-sky-50 text-sky-700 border-sky-200",
    },
    {
      title: "SOURCING",
      count: adminMetrics.sourcing,
      statusFilter: "Sourcing",
      bgClass: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      title: "QUOTED",
      count: adminMetrics.quoted,
      statusFilter: "Quoted",
      bgClass: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      title: "AWAITING PAYMENT",
      count: adminMetrics.awaitingPayment,
      statusFilter: "Awaiting Payment",
      bgClass: "bg-orange-50 text-orange-800 border-orange-200",
    },
    {
      title: "READY TO ORDER",
      count: adminMetrics.readyToOrder,
      statusFilter: "Approved",
      bgClass: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "SHIPPED",
      count: adminMetrics.shipped,
      statusFilter: "Shipped",
      bgClass: "bg-cyan-50 text-cyan-800 border-cyan-200",
    },
    {
      title: "DELIVERED",
      count: adminMetrics.delivered,
      statusFilter: "Delivered",
      bgClass: "bg-green-50 text-green-700 border-green-200",
    },
  ];

  return (
    <div className="space-y-6">
      {/* SECTION 5: Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {summaryCards.map((card) => (
          <Link
            key={card.title}
            href={`/admin/requests?status=${encodeURIComponent(card.statusFilter)}`}
            className={`p-3.5 rounded-2xl border shadow-xs hover:scale-[1.02] transition-all text-left block ${card.bgClass}`}
          >
            <span className="block text-[10px] font-bold tracking-wider uppercase opacity-80 line-clamp-1">
              {card.title}
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-black mt-1 block">
              {card.count}
            </span>
          </Link>
        ))}
      </div>

      {/* Main Section: REQUESTS REQUIRING ATTENTION (Section 5) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Requests Requiring Attention
              </h2>
              <span className="text-xs font-bold text-[#ED2025] bg-red-50 px-2 py-0.5 rounded-full">
                {attentionRequests.length} Pending
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              &quot;What requires action right now?&quot; — Prioritized operational queue.
            </p>
          </div>

          <Link
            href="/admin/requests"
            className="text-xs font-bold text-[#ED2025] hover:text-[#C8101E] transition-colors flex items-center gap-1 self-start sm:self-auto"
          >
            View All Requests ({requests.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Request #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Part</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attentionRequests.map((req) => (
                <tr
                  key={req.id}
                  onClick={() => router.push(`/admin/requests?id=${req.id}`)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#ED2025]">
                    {req.requestNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{req.customerName}</span>
                    <span className="text-[11px] text-slate-400">{req.contactName}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <span className="font-semibold block">
                      {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {req.vehicle.registration || req.vehicle.vin}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-800">
                    <span className="font-medium line-clamp-1">{req.part.name}</span>
                    <span className="text-[10px] text-slate-400">Qty: {req.part.quantity}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={req.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <PaymentStatusBadge status={req.payment?.status || "Unpaid"} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                    {req.lastUpdated}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white group-hover:bg-red-50 text-slate-700 group-hover:text-[#ED2025] font-semibold text-xs rounded-xl border border-slate-200 group-hover:border-red-200 shadow-xs transition-colors">
                      View
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
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
