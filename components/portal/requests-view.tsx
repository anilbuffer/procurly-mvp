"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { usePortal } from "@/context/portal-context";
import { PartRequest, RequestStatus } from "@/types/portal";

export function RequestsView() {
  const {
    requests,
    setSelectedRequest,
    setIsNewRequestModalOpen,
    searchQuery,
    setSearchQuery,
    setIsQuoteModalOpen,
    setQuoteRequest,
    setIsPaymentModalOpen,
    setPaymentRequest,
  } = usePortal();

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      // Status filter
      if (statusFilter === "Awaiting Action") {
        if (
          (!r.actionType || r.actionType === "none") &&
          r.status !== "Quoted" &&
          !(r.status === "Approved" && r.payment?.status !== "Paid") &&
          !(r.status === "Awaiting Payment" && r.payment?.status !== "Paid")
        )
          return false;
      } else if (statusFilter === "In Procurement") {
        if (
          r.status !== "Sourcing" &&
          r.status !== "Ordered" &&
          r.status !== "Approved" &&
          r.status !== "Invoicing" &&
          r.status !== "Awaiting Payment"
        )
          return false;
      } else if (statusFilter !== "All") {
        if (r.status !== statusFilter) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchReq = r.requestNumber.toLowerCase().includes(q);
        const matchMake = r.vehicle.make.toLowerCase().includes(q);
        const matchModel = r.vehicle.model.toLowerCase().includes(q);
        const matchVin = r.vehicle.vin.toLowerCase().includes(q);
        const matchPart = r.part.name.toLowerCase().includes(q);
        return matchReq || matchMake || matchModel || matchVin || matchPart;
      }

      return true;
    });
  }, [requests, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "Submitted":
        return "bg-sky-50 text-sky-700 border border-sky-200";
      case "Sourcing":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case "Quoted":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Invoicing":
        return "bg-indigo-50 text-indigo-700 border border-indigo-200";
      case "Awaiting Payment":
        return "bg-orange-50 text-orange-800 border border-orange-200";
      case "Ordered":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Subadmin Pending":
        return "bg-red-50 text-[#B30D12] border border-red-200";
      case "Subadmin Review":
        return "bg-amber-50 text-amber-600 border border-amber-200";
      case "Subadmin Hold":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case "Subadmin Approved":
      case "Ready for Dispatch":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Shipped":
        return "bg-cyan-50 text-cyan-800 border border-cyan-200";
      case "Delivered":
        return "bg-teal-50 text-teal-700 border border-teal-200";
      case "Completed":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Select */}
        <div className="flex items-center gap-3">
          <label htmlFor="status-filter" className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Filter Status:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-[13px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-[#B30D12] focus:ring-1 focus:ring-[#B30D12] transition-all min-w-[180px] cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2.5' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 14px center",
              backgroundSize: "14px",
              paddingRight: "40px",
            }}
          >
            {[
              "All",
              "Awaiting Action",
              "Submitted",
              "Sourcing",
              "Quoted",
              "Approved",
              "Invoicing",
              "Awaiting Payment",
              "Ordered",
              "Shipped",
              "Delivered",
              "Completed",
              "Subadmin Pending",
              "Subadmin Review",
              "Subadmin Hold",
              "Subadmin Approved",
              "Ready for Dispatch",
            ].map((tab) => (
              <option key={tab} value={tab}>
                {tab}
              </option>
            ))}
          </select>
        </div>

        {/* Action button */}
        <Link
          href="/customer/requests/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B30D12] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Parts Request</span>
        </Link>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Request ID</th>
                <th className="py-3.5 px-4">Vehicle Specs</th>
                <th className="py-3.5 px-4">Part Details</th>
                <th className="py-3.5 px-4">Date Submitted</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Quoted Value</th>
                <th className="py-3.5 px-6 text-right">Action Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No requests found matching your filter.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    {/* Request Number */}
                    <td className="py-4 px-6 font-mono font-black text-slate-900 group-hover:text-[#B30D12] transition-colors">
                      {req.requestNumber}
                    </td>

                    {/* Vehicle */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="font-bold text-slate-800">
                        {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                      </p>
                      <p className="text-[11px] font-mono text-slate-500">
                        {req.vehicle.vin}
                      </p>
                    </td>

                    {/* Part */}
                    <td className="py-4 px-4 max-w-[240px]">
                      <p className="font-semibold text-slate-800 truncate" title={req.part.name}>
                        {req.part.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Qty: {req.part.quantity} • {req.part.condition}
                      </p>
                      {req.supporting?.freightPreference && (
                        <p className="text-[11px] text-[#0ea5e9] font-medium mt-0.5">
                          Freight: {req.supporting.freightPreference === "Sea Freight" ? "Ocean Freight" : req.supporting.freightPreference}
                        </p>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {req.dateSubmitted}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                          req.status
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        {req.status}
                      </span>
                    </td>

                    {/* Quoted Value */}
                    <td className="py-4 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {req.quotedValue ? `$${req.quotedValue.toFixed(2)}` : "Pending Quote"}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      {req.actionType === "review_quote" || req.status === "Quoted" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(req);
                          }}
                          className="px-3 py-1 bg-[#B30D12] hover:bg-[#9B0A0F] text-white font-bold text-[11px] uppercase tracking-wider rounded-lg shadow-xs"
                        >
                          Review Quote →
                        </button>
                      ) : req.actionType === "pay_now" || ((req.status === "Approved" || req.status === "Awaiting Payment") && req.payment?.status !== "Paid") ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPaymentRequest(req);
                            setIsPaymentModalOpen(true);
                          }}
                          className="px-3 py-1 bg-[#B30D12] hover:bg-[#9B0A0F] text-white font-bold text-[11px] uppercase tracking-wider rounded-lg shadow-xs"
                        >
                          Pay Now →
                        </button>
                      ) : req.status === "Shipped" ? (
                        <span className="text-blue-600 font-bold text-[11px] inline-flex items-center gap-1 group-hover:underline">
                          <span>Track Shipment →</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 group-hover:text-[#B30D12] font-semibold inline-flex items-center gap-1">
                          <span>View</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredRequests.length)} of {filteredRequests.length} requests
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
