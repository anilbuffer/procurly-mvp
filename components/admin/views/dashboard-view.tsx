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
  Box,
  Inbox,
  FileCheck,
} from "lucide-react";
import { useUnifiedData } from "@/context/unified-data-context";
import { StatusBadge, PaymentStatusBadge } from "../status-badge";

export function AdminDashboardView() {
  const router = useRouter();
  const { requests, adminMetrics } = useUnifiedData();

  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 10;

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
      r.status === "Invoicing" ||
      r.payment?.status === "Unpaid" ||
      (r.status === "Ordered" && !r.shipment) ||
      r.status === "Subadmin Review" ||
      r.status === "Subadmin Hold"
  );

  const totalPages = Math.max(1, Math.ceil(attentionRequests.length / ITEMS_PER_PAGE));
  const currentAttentionRequests = attentionRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* SECTION 5: Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: "NEW REQUESTS", value: requests.filter((r) => r.status === "Submitted").length, link: "/admin/requests?status=Submitted", icon: Inbox, color: "text-blue-600" },
          { label: "SOURCING", value: requests.filter((r) => r.status === "Sourcing").length, link: "/admin/requests?status=Sourcing", icon: Search, color: "text-amber-600" },
          { label: "QUOTED", value: requests.filter((r) => r.status === "Quoted").length, link: "/admin/requests?status=Quoted", icon: FileCheck, color: "text-purple-600" },
          { label: "AWAITING PAYMENT", value: requests.filter((r) => r.status === "Awaiting Payment").length, link: "/admin/requests?status=Awaiting Payment", icon: CreditCard, color: "text-red-600" },
          { label: "Subadmin REVIEW", value: requests.filter((r) => r.status === "Subadmin Review" || r.status === "Subadmin Hold").length, link: "/subadmin/dashboard", icon: AlertTriangle, color: "text-rose-600" },
          { label: "READY TO ORDER", value: requests.filter((r) => r.status === "Approved").length, link: "/admin/requests?status=Approved", icon: ShoppingBag, color: "text-emerald-600" },
          { label: "SHIPPED", value: requests.filter((r) => r.status === "Shipped").length, link: "/admin/requests?status=Shipped", icon: Truck, color: "text-sky-600" },
          { label: "DELIVERED", value: requests.filter((r) => r.status === "Delivered").length, link: "/admin/requests?status=Delivered", icon: CheckCircle2, color: "text-slate-600" },
        ].map((stat, idx) => (
          <Link
            key={idx}
            href={stat.link}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between gap-3 group"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-700 transition-colors tracking-wider uppercase leading-tight">
                {stat.label}
              </span>
              <stat.icon className={`w-4 h-4 ${stat.color} shrink-0 opacity-80 group-hover:opacity-100 transition-opacity`} />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {stat.value < 10 ? `0${stat.value}` : stat.value}
            </div>
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
              <span className="text-xs font-bold text-[#B30D12] bg-red-50 px-2 py-0.5 rounded-full">
                {attentionRequests.length} Pending
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              &quot;What requires action right now?&quot; — Prioritized operational queue.
            </p>
          </div>

          <Link
            href="/admin/requests"
            className="text-xs font-bold text-[#B30D12] hover:text-[#C8101E] transition-colors flex items-center gap-1 self-start sm:self-auto"
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
              {currentAttentionRequests.map((req) => (
                <tr
                  key={req.id}
                  onClick={() => router.push(`/admin/requests?id=${req.id}`)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#B30D12]">
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
                    {req.supporting?.freightPreference && (
                      <span className="text-[10px] font-medium text-[#B30D12] block mt-0.5">
                        Freight: {req.supporting.freightPreference === "Sea Freight" ? "Ocean Freight" : req.supporting.freightPreference}
                      </span>
                    )}
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
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white group-hover:bg-red-50 text-slate-700 group-hover:text-[#B30D12] font-semibold text-xs rounded-xl border border-slate-200 group-hover:border-red-200 shadow-xs transition-colors">
                      View
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {attentionRequests.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, attentionRequests.length)} of {attentionRequests.length} requests
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
