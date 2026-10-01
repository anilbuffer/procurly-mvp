"use client";

import React, { useState, useMemo } from "react";
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

type DashboardTab = "active" | "attention" | "delivered_completed" | "all";

export function AdminDashboardView() {
  const router = useRouter();
  const { requests, adminMetrics } = useUnifiedData();

  const [currentTab, setCurrentTab] = useState<DashboardTab>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Active & Open Orders: In-flight orders currently being sourced, quoted, paid, or shipped
  // Excludes completed/archived and delivered orders by default
  const activeOpenRequests = useMemo(
    () => requests.filter((r) => r.status !== "Completed" && r.status !== "Delivered"),
    [requests]
  );

  // Requests requiring urgent attention / action
  const attentionRequests = useMemo(
    () =>
      requests.filter(
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
      ),
    [requests]
  );

  // Delivered & Completed orders (fulfilled / closed)
  const deliveredCompletedRequests = useMemo(
    () => requests.filter((r) => r.status === "Delivered" || r.status === "Completed"),
    [requests]
  );

  // Current tab dataset
  const currentDataset = useMemo(() => {
    switch (currentTab) {
      case "active":
        return activeOpenRequests;
      case "attention":
        return attentionRequests;
      case "delivered_completed":
        return deliveredCompletedRequests;
      case "all":
        return requests;
      default:
        return activeOpenRequests;
    }
  }, [currentTab, activeOpenRequests, attentionRequests, deliveredCompletedRequests, requests]);

  // Apply search query filter
  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return currentDataset;
    const q = searchQuery.toLowerCase().trim();
    return currentDataset.filter(
      (r) =>
        r.requestNumber.toLowerCase().includes(q) ||
        (r.customerName || "").toLowerCase().includes(q) ||
        (r.contactName || "").toLowerCase().includes(q) ||
        r.vehicle.make.toLowerCase().includes(q) ||
        r.vehicle.model.toLowerCase().includes(q) ||
        (r.vehicle.vin || "").toLowerCase().includes(q) ||
        (r.vehicle.registration || "").toLowerCase().includes(q) ||
        r.part.name.toLowerCase().includes(q)
    );
  }, [currentDataset, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / ITEMS_PER_PAGE));
  const paginatedRequests = useMemo(
    () =>
      filteredRequests.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [filteredRequests, currentPage]
  );

  const handleTabChange = (tab: DashboardTab) => {
    setCurrentTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* SECTION 5: Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: "NEW REQUESTS", value: requests.filter((r) => r.status === "Submitted").length, link: "/admin/requests?status=Submitted", icon: Inbox, color: "text-sky-600" },
          { label: "SOURCING", value: requests.filter((r) => r.status === "Sourcing").length, link: "/admin/requests?status=Sourcing", icon: Search, color: "text-amber-600" },
          { label: "QUOTED", value: requests.filter((r) => r.status === "Quoted").length, link: "/admin/requests?status=Quoted", icon: FileCheck, color: "text-purple-600" },
          { label: "AWAITING PAYMENT", value: requests.filter((r) => r.status === "Awaiting Payment").length, link: "/admin/requests?status=Awaiting Payment", icon: CreditCard, color: "text-[#FE0000]" },
          { label: "Subadmin REVIEW", value: requests.filter((r) => r.status === "Subadmin Review" || r.status === "Subadmin Hold").length, link: "/subadmin/dashboard", icon: AlertTriangle, color: "text-rose-600" },
          { label: "READY TO ORDER", value: requests.filter((r) => r.status === "Approved").length, link: "/admin/requests?status=Approved", icon: ShoppingBag, color: "text-emerald-600" },
          { label: "SHIPPED", value: requests.filter((r) => r.status === "Shipped").length, link: "/admin/requests?status=Shipped", icon: Truck, color: "text-cyan-600" },
          { label: "DELIVERED", value: requests.filter((r) => r.status === "Delivered").length, link: "/admin/requests?status=Delivered", icon: CheckCircle2, color: "text-teal-600" },
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

      {/* Main Section: ACTIVE & OPEN ORDERS (Default) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {currentTab === "active" && "Active & Open Orders"}
                  {currentTab === "attention" && "Requests Requiring Attention"}
                  {currentTab === "delivered_completed" && "Delivered & Completed Orders"}
                  {currentTab === "all" && "All Requests & Orders"}
                </h2>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${currentTab === "active"
                  ? "text-[#FE0000] bg-red-50"
                  : currentTab === "attention"
                    ? "text-amber-700 bg-amber-50"
                    : currentTab === "delivered_completed"
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-slate-700 bg-slate-100"
                  }`}>
                  {filteredRequests.length} {currentTab === "active" ? "Active" : "Orders"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentTab === "active" && "Live operational pipeline of open parts requests and supplier orders in progress."}
                {currentTab === "attention" && '"What requires action right now?" — Prioritized operational queue.'}
                {currentTab === "delivered_completed" && "Historical archive of delivered consignments and finalized orders."}
                {currentTab === "all" && "Complete register across all active and historical lifecycle stages."}
              </p>
            </div>

            <Link
              href="/admin/requests"
              className="text-xs font-bold text-[#FE0000] hover:text-[#C8101E] transition-colors flex items-center gap-1 self-start sm:self-auto"
            >
              View Full Register ({requests.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Tab navigation pills & Quick search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2">
            <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100 p-2 rounded-xl">
              <button
                type="button"
                onClick={() => handleTabChange("active")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${currentTab === "active"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <span>Active & Open</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full  ${currentTab === "active" ? "bg-red-50 text-[#FE0000]" : "bg-slate-200 text-slate-700"
                  }`}>
                  {activeOpenRequests.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("attention")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${currentTab === "attention"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <span>Needs Attention</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full  ${currentTab === "attention" ? "bg-amber-50 text-amber-700" : "bg-slate-200 text-slate-700"
                  }`}>
                  {attentionRequests.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("delivered_completed")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${currentTab === "delivered_completed"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <span>Delivered / Closed</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full  ${currentTab === "delivered_completed" ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-700"
                  }`}>
                  {deliveredCompletedRequests.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${currentTab === "all"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <span>All Orders</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full  ${currentTab === "all" ? "bg-slate-200 text-slate-800" : "bg-slate-200 text-slate-700"
                  }`}>
                  {requests.length}
                </span>
              </button>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by Request #, Customer, Part..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FE0000] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Requests Table / Empty State */}
        {paginatedRequests.length === 0 ? (
          <div className="text-center py-14 px-4 bg-white">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No orders found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No orders matching "${searchQuery}" in this view.`
                : "There are currently no orders in this category."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[700px] text-left text-xs border-collapse">
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
                {paginatedRequests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => router.push(`/admin/requests?id=${req.id}`)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4  font-bold text-slate-700 hover:text-slate-800 hover:underline">
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
                      <span className="text-[10px] text-slate-400 ">
                        {req.vehicle.registration || req.vehicle.vin}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800">
                      <span className="font-medium line-clamp-1">{req.part.name}</span>
                      <span className="text-[10px] text-slate-400">Qty: {req.part.quantity}</span>
                      {req.supporting?.freightPreference && (
                        <span className="text-[10px] font-medium text-[#FE0000] block mt-0.5">
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
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white group-hover:bg-red-50 text-slate-700 group-hover:text-[#FE0000] font-semibold text-xs rounded-xl border border-slate-200 group-hover:border-red-200 shadow-xs transition-colors">
                        View
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {filteredRequests.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredRequests.length)} of {filteredRequests.length} orders
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
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
                type="button"
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
