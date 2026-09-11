"use client";

import React from "react";
import {
  FileText,
  Clock,
  Box,
  Truck,
  Plus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { PartRequest, RequestStatus } from "@/types/portal";

export function DashboardView() {
  const {
    metrics,
    requests,
    setIsNewRequestModalOpen,
    setActiveTab,
    setSelectedRequest,
    setIsQuoteModalOpen,
    setQuoteRequest,
    setIsPaymentModalOpen,
    setPaymentRequest,
    activeCustomer,
  } = usePortal();

  // Action required items from requests
  const actionItems = requests.filter(
    (r) =>
      r.actionType === "review_quote" ||
      r.actionType === "pay_now" ||
      r.actionType === "view_details" ||
      r.status === "Quoted" ||
      (r.status === "Approved" && r.payment?.status !== "Paid") ||
      (r.status === "Awaiting Payment" && r.payment?.status !== "Paid")
  );

  // Status badge styling helper (covers all 9 canonical workflow statuses)
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
      case "Awaiting Payment":
        return "bg-orange-50 text-orange-800 border border-orange-200";
      case "Ordered":
        return "bg-blue-50 text-blue-700 border border-blue-200";
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

  const handleActionClick = (req: PartRequest) => {
    if (req.actionType === "review_quote" || req.status === "Quoted") {
      setSelectedRequest(req);
    } else if (req.actionType === "pay_now" || req.status === "Approved" || req.status === "Awaiting Payment") {
      setPaymentRequest(req);
      setIsPaymentModalOpen(true);
    } else {
      setSelectedRequest(req);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          {/* Approved Trade Customer Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>APPROVED TRADE CUSTOMER</span>
            <span className="text-blue-300">•</span>
            <span className="font-mono text-[11px]">{activeCustomer.businessName}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good morning, {activeCustomer.businessName}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Here&apos;s an overview of your procurement activity across all 9 workflow stages.
          </p>
        </div>

        {/* New Parts Request Button */}
        <button
          onClick={() => setIsNewRequestModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Parts Request</span>
        </button>
      </div>

      {/* 2. KPI Summary Cards (4 Interactive Nav Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Requests -> Links to Requests tab */}
        <div
          onClick={() => setActiveTab("requests")}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 p-5 flex items-start justify-between cursor-pointer transition-all group"
          title="Click to view all active requests"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors tracking-wider uppercase">
              Active Requests
            </span>
            <div className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
              {metrics.activeRequests}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Synced • View all</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Awaiting Your Action -> Links to Requests tab */}
        <div
          onClick={() => setActiveTab("requests")}
          className="bg-white rounded-2xl border-2 border-amber-400 bg-amber-50/20 shadow-sm hover:shadow-md hover:border-amber-500 p-5 flex items-start justify-between relative overflow-hidden cursor-pointer transition-all group"
          title="Click to view requests requiring action"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-amber-900 group-hover:text-[#ED2025] transition-colors tracking-wider uppercase">
                Awaiting Your Action
              </span>
              <span className="w-2 h-2 rounded-full bg-[#ED2025]" />
            </div>
            <div className="text-3xl font-black text-slate-900 group-hover:text-[#ED2025] transition-colors">
              0{metrics.awaitingAction}
            </div>
            <div className="text-xs text-amber-700 font-medium">
              Requires attention • View actions
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 group-hover:bg-amber-500 group-hover:text-white transition-all flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: In Procurement -> Links to Orders tab */}
        <div
          onClick={() => setActiveTab("orders")}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-purple-300 p-5 flex items-start justify-between cursor-pointer transition-all group"
          title="Click to view orders in procurement"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 group-hover:text-purple-600 transition-colors tracking-wider uppercase">
              In Procurement
            </span>
            <div className="text-3xl font-black text-slate-900 group-hover:text-purple-600 transition-colors">
              0{metrics.inProcurement}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Currently processed • View queue
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all flex items-center justify-center">
            <Box className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: In Transit -> Links to Shipments tab */}
        <div
          onClick={() => setActiveTab("shipments")}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-sky-300 p-5 flex items-start justify-between cursor-pointer transition-all group"
          title="Click to track live shipments"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 group-hover:text-sky-600 transition-colors tracking-wider uppercase">
              In Transit
            </span>
            <div className="text-3xl font-black text-slate-900 group-hover:text-sky-600 transition-colors">
              0{metrics.inTransit}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              On the way • Live tracking
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Action Required Warning Banner Card */}
      {actionItems.length > 0 && (
        <div className="bg-[#FFFBEB] border border-amber-300 rounded-2xl p-6 shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-sm shrink-0">
              !
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Action Required
              </h2>
              <p className="text-xs text-slate-600">
                Complete these actions to keep your procurement moving.
              </p>
            </div>
          </div>

          {/* Actionable items list */}
          <div className="divide-y divide-amber-200/70">
            {actionItems.map((req) => (
              <div
                key={req.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {req.requestNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {req.vehicle.make} {req.vehicle.model} - {req.vehicle.year}
                    </span>

                    {/* Pill Tag */}
                    {req.status === "Quoted" && (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Quote Ready
                      </span>
                    )}
                    {(req.status === "Awaiting Payment" || req.payment?.status === "Unpaid") && (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Unpaid
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600">
                    <span className="font-medium text-slate-700">{req.part.name}</span>
                    {req.quotedValue && (
                      <>
                        {" "}
                        • Amount:{" "}
                        <span className="font-bold text-slate-900 font-mono">
                          ${req.quotedValue.toFixed(2)}
                        </span>
                      </>
                    )}
                  </p>
                </div>

                {/* Right Action Button */}
                <div>
                  <button
                    onClick={() => handleActionClick(req)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition-all active:scale-95"
                  >
                    <span>
                      {req.actionType === "review_quote"
                        ? "Review Quote"
                        : req.actionType === "pay_now"
                          ? "Pay Now"
                          : "View Details"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
