"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  ArrowUpDown,
  ArrowRight,
  Eye,
  Plus,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";
import { useUnifiedData } from "@/context/unified-data-context";
import { StatusBadge, PaymentStatusBadge } from "../status-badge";
import { RequestDetailWorkspace } from "../request-workspace/request-detail-workspace";

export function RequestsTableView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { requests, getRequestById } = useUnifiedData();

  // If a request ID is selected via query param, display the detail workspace!
  const selectedRequestId = searchParams.get("id");
  const selectedRequest = selectedRequestId ? getRequestById(selectedRequestId) : null;

  // Filter & Search State (Section 6)
  const [searchQuery, setSearchQuery] = useState("");
  const initialStatusParam = searchParams.get("status") || "All";
  const [statusFilter, setStatusFilter] = useState(initialStatusParam);
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [customerFilter, setCustomerFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "recently_updated">("newest");

  // Distinct customer list for filter
  const customerNames = useMemo(() => {
    return Array.from(new Set(requests.map((r) => r.customerName)));
  }, [requests]);

  // Filtered & Sorted Requests
  const filteredRequests = useMemo(() => {
    return requests
      .filter((r) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const match =
            r.requestNumber.toLowerCase().includes(q) ||
            r.customerName.toLowerCase().includes(q) ||
            r.contactName.toLowerCase().includes(q) ||
            r.vehicle.make.toLowerCase().includes(q) ||
            r.vehicle.model.toLowerCase().includes(q) ||
            r.part.name.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Status Filter
        if (statusFilter !== "All" && r.status !== statusFilter) {
          return false;
        }

        // Payment Filter
        if (paymentFilter !== "All") {
          const payStatus = r.payment?.status || "Unpaid";
          if (payStatus !== paymentFilter) return false;
        }

        // Customer Filter
        if (customerFilter !== "All" && r.customerName !== customerFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.dateSubmitted).getTime() - new Date(b.dateSubmitted).getTime();
        }
        // recently_updated
        return a.lastUpdated.localeCompare(b.lastUpdated);
      });
  }, [requests, searchQuery, statusFilter, paymentFilter, customerFilter, sortBy]);

  // If a request is active, render the Central Request Detail Workspace!
  if (selectedRequest) {
    return (
      <RequestDetailWorkspace
        request={selectedRequest}
        onBack={() => router.push("/admin/requests")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Request # (e.g. AH-P-000123), Customer, Vehicle, Part..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025] transition-all"
            />
          </div>

          {/* Reset Filters button */}
          {(statusFilter !== "All" ||
            paymentFilter !== "All" ||
            customerFilter !== "All" ||
            searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
                setPaymentFilter("All");
                setCustomerFilter("All");
              }}
              className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 self-start md:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#ED2025]"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Sourcing">Sourcing</option>
              <option value="Quoted">Quoted</option>
              <option value="Approved">Approved</option>
              <option value="Awaiting Payment">Awaiting Payment</option>
              <option value="Ordered">Ordered</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Payment
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#ED2025]"
            >
              <option value="All">All Payment States</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          {/* Customer Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Customer
            </label>
            <select
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#ED2025]"
            >
              <option value="All">All Customers</option>
              {customerNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#ED2025]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="recently_updated">Recently Updated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table (Section 6) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-900">{filteredRequests.length}</strong> of{" "}
            {requests.length} requests
          </span>
          <span className="text-[11px] text-slate-400">
            Click any row to open the central workspace
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Request #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Part</th>
                <th className="py-3 px-4">Date Submitted</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quote Value</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No requests match your current search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
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
                    <td className="py-3.5 px-4 text-slate-600 text-[11px] whitespace-nowrap">
                      {req.dateSubmitted}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={req.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      {req.quotedValue || req.customerQuote?.totalAmount
                        ? `NZ$${(req.quotedValue || req.customerQuote?.totalAmount || 0).toFixed(2)}`
                        : "—"}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
