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

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      // Status filter
      if (statusFilter === "Awaiting Action") {
        if (!r.actionType || r.actionType === "none") return false;
      } else if (statusFilter === "Quoted") {
        if (r.status !== "Quoted") return false;
      } else if (statusFilter === "In Procurement") {
        if (
          r.status !== "Sourcing" &&
          r.status !== "Ordered" &&
          r.status !== "Approved"
        )
          return false;
      } else if (statusFilter === "Shipped") {
        if (r.status !== "Shipped") return false;
      } else if (statusFilter === "Completed") {
        if (r.status !== "Completed" && r.status !== "Delivered") return false;
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

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "Quoted":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "Awaiting Payment":
        return "bg-amber-50 text-amber-700 border border-amber-300";
      case "Payment Disputed":
        return "bg-red-50 text-red-700 border border-red-200";
      case "Logistics Exception":
        return "bg-slate-100 text-slate-700 border border-slate-300";
      case "Sourcing":
        return "bg-indigo-50 text-indigo-700 border border-indigo-200";
      case "Ordered":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Shipped":
        return "bg-sky-100 text-sky-800 border border-sky-300";
      case "Delivered":
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          {[
            "All",
            "Awaiting Action",
            "Quoted",
            "In Procurement",
            "Shipped",
            "Completed",
          ].map((tab) => {
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-[#0C101A] text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200/70 text-slate-600"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Action button */}
        <button
          onClick={() => setIsNewRequestModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Parts Request</span>
        </button>
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
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    {/* Request Number */}
                    <td className="py-4 px-6 font-mono font-black text-slate-900 group-hover:text-[#ED2025] transition-colors">
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
                      {req.actionType === "review_quote" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuoteRequest(req);
                            setIsQuoteModalOpen(true);
                          }}
                          className="px-3 py-1 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold text-[11px] uppercase tracking-wider rounded-lg shadow-xs"
                        >
                          Review Quote →
                        </button>
                      ) : req.actionType === "pay_now" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPaymentRequest(req);
                            setIsPaymentModalOpen(true);
                          }}
                          className="px-3 py-1 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold text-[11px] uppercase tracking-wider rounded-lg shadow-xs"
                        >
                          Pay Now →
                        </button>
                      ) : (
                        <span className="text-slate-400 group-hover:text-[#ED2025] font-semibold inline-flex items-center gap-1">
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
      </div>
    </div>
  );
}
