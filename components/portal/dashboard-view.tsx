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
  ChevronRight,
  Rocket,
  Search,
  FileCheck,
  CreditCard,
  Package,
} from "lucide-react";
import Link from "next/link";
import { usePortal } from "@/context/portal-context";
import { PartRequest, RequestStatus } from "@/types/portal";
import { getStatusBadgeClasses } from "@/lib/status-styles";

export function DashboardView() {
  const {
    metrics,
    requests,
    setIsNewRequestModalOpen,
    setActiveTab,
    setSelectedRequest,
    setSelectedRequestDetailsTab,
    setIsQuoteModalOpen,
    setQuoteRequest,
    setIsPaymentModalOpen,
    setPaymentRequest,
    activeCustomer,
    simulateZeroState,
    setSimulateZeroState,
  } = usePortal();

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.max(1, Math.ceil(requests.length / ITEMS_PER_PAGE));

  // Action required items from requests
  const actionItems = requests.filter(
    (r) =>
      r.actionType === "review_quote" ||
      r.actionType === "pay_now" ||
      r.status === "Quoted" ||
      (r.status === "Awaiting Payment" && r.payment?.status !== "Paid") ||
      (r.payment && r.payment.status !== "Paid" && (r.status === "Invoicing" || r.customerResponse === "Accepted")) ||
      (r.actionType === "view_details" && !r.status.startsWith("Subadmin"))
  );

  // Status badge styling helper (covers all workflow statuses)
  const getStatusBadge = (status: RequestStatus | string) => {
    return getStatusBadgeClasses(status);
  };

  const handleActionClick = (req: PartRequest) => {
    if (req.actionType === "review_quote" || req.status === "Quoted") {
      setSelectedRequestDetailsTab?.("quote");
      setSelectedRequest(req);
    } else if (
      req.actionType === "pay_now" ||
      (req.status === "Awaiting Payment" && req.payment?.status !== "Paid") ||
      (req.payment && req.payment.status !== "Paid" && (req.status === "Invoicing" || req.customerResponse === "Accepted"))
    ) {
      setPaymentRequest(req);
      setIsPaymentModalOpen(true);
    } else {
      setSelectedRequest(req);
    }
  };

  return (
    <div className="space-y-6">
      {requests.length === 0 ? (
        <>
          {/* Welcome Card tailored for empty state */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-12 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-50 to-white/0 pointer-events-none" />

            <div className="w-20 h-20 bg-red-50 text-[#FE0000] rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100 relative z-10">
              <Rocket className="w-10 h-10" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mb-3 relative z-10 ">
              Welcome to your Procurly Portal, {activeCustomer.businessName}!
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto mb-8 relative z-10 text-sm sm:text-base">
              Your procurement dashboard is currently empty. Start by submitting your first parts request, and we'll handle the sourcing, quoting, and logistics.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
              <Link
                href="/customer/requests/new"
                className="inline-flex items-center justify-center gap-2 bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold uppercase tracking-wider py-3.5 px-8 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
                <span>Create Your Request</span>
              </Link>

              <button
                onClick={() => setSimulateZeroState(false)}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold uppercase tracking-wider py-3.5 px-8 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>View Mock Data</span>
              </button>
            </div>
          </div>

          {/* How it works steps */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 lg:py-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight ">How Procurly Works</h2>
              <div className="w-8 h-0.5 bg-[#FE0000] rounded-full mx-auto mt-1.5" />
            </div>

            <div className="relative">
              {/* Dotted path connecting the nodes across columns on desktop */}
              <div
                className="hidden lg:block absolute top-5 left-[12.5%] right-[12.5%] h-[2px] pointer-events-none z-0"
                aria-hidden="true"
              >
                <svg className="w-full h-full" style={{ overflow: "visible" }}>
                  <line
                    x1="0"
                    y1="1"
                    x2="100%"
                    y2="1"
                    stroke="#CBD5E1"
                    strokeWidth="2"
                    strokeDasharray="4 6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative z-10">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="relative z-10 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-500 text-blue-600 ring-4 ring-blue-50 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:ring-blue-100">
                      <Search className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-sm pointer-events-none">
                      1
                    </span>
                  </div>
                  <div className="min-h-[42px] flex items-center justify-center mb-1 px-1">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                      We Source
                    </h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed max-w-[220px]">
                    You submit a request, and our experts find the exact parts you need.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="relative z-10 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-amber-500 text-amber-600 ring-4 ring-amber-50 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:ring-amber-100">
                      <FileCheck className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-sm pointer-events-none">
                      2
                    </span>
                  </div>
                  <div className="min-h-[42px] flex items-center justify-center mb-1 px-1">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                      Receive a landed door-to-door quote for your approval
                    </h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed max-w-[220px]">
                    Receive a landed quote for your approval for your approval, with complete transparency.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="relative z-10 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-emerald-500 text-emerald-600 ring-4 ring-emerald-50 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:ring-emerald-100">
                      <CreditCard className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-sm pointer-events-none">
                      3
                    </span>
                  </div>
                  <div className="min-h-[42px] flex items-center justify-center mb-1 px-1">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                      Approve the quote and pay the invoice
                    </h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed max-w-[220px]">
                    Approve quote and pay securely through your dashboard.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="relative z-10 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-sky-500 text-sky-600 ring-4 ring-sky-50 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:ring-sky-100">
                      <Package className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-sm pointer-events-none">
                      4
                    </span>
                  </div>
                  <div className="min-h-[42px] flex items-center justify-center mb-1 px-1">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                      We Deliver
                    </h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed max-w-[220px]">
                    Track your parts as they make their way to your specified address.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* 1. Welcome Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              {/* Approved Trade Customer Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px]">APPROVED TRADE CUSTOMER</span>
                <span className="text-emerald-300">•</span>
                <span className="text-[11px]">{activeCustomer.businessName}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight ">
                Good morning, {activeCustomer.businessName}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Here&apos;s an overview of your procurement activity across all 9 workflow stages.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => setSimulateZeroState(true)}
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all active:scale-95"
              >
                <span>Preview Empty State</span>
              </button>
              <Link
                href="/customer/requests/new"
                className="inline-flex items-center justify-center gap-2 bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all transform active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>New Parts Request</span>
              </Link>
            </div>
          </div>

          {/* 2. KPI Summary Cards (4 Interactive Nav Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Active Requests -> Links to Requests tab */}
            <div
              onClick={() => setActiveTab("requests")}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#FE0000]/40 p-5 flex items-start justify-between cursor-pointer transition-all group"
              title="Click to view all active requests"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-[#FE0000] transition-colors tracking-wider uppercase">
                  Active Requests
                </span>
                <div className="text-3xl font-black text-slate-900 group-hover:text-[#FE0000] transition-colors">
                  {metrics.activeRequests}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Synced • View all</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#FE0000] group-hover:bg-[#FE0000] group-hover:text-white transition-all flex items-center justify-center">
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
                  <span className="text-[11px] font-bold text-amber-900 group-hover:text-[#FE0000] transition-colors tracking-wider uppercase">
                    Awaiting Your Action
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#FE0000]" />
                </div>
                <div className="text-3xl font-black text-slate-900 group-hover:text-[#FE0000] transition-colors">
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
                        <span className=" text-xs font-bold text-slate-900">
                          {req.requestNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {req.vehicle.make} {req.vehicle.model} - {req.vehicle.year}
                        </span>

                        {/* Pill Tag with prominent Accept Quote Alert */}
                        {req.status === "Quoted" && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                              Quote Ready
                            </span>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Accept Quote
                            </span>
                          </div>
                        )}
                        {(req.status === "Awaiting Payment" || (req.payment && req.payment.status !== "Paid" && (req.status === "Invoicing" || req.customerResponse === "Accepted"))) && (
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
                            <span className="font-bold text-slate-900 ">
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
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
                      >
                        <span>
                          {req.actionType === "review_quote" || req.status === "Quoted"
                            ? "Accept Quote"
                            : req.actionType === "pay_now" || (req.payment?.status !== "Paid" && (req.status === "Awaiting Payment" || req.status === "Invoicing" || req.customerResponse === "Accepted"))
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

          {/* 4. Recent Activity Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {requests.length} Requests
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Overview of current parts procurement requests and status
                </p>
              </div>

              {/* View All Requests Link */}
              <button
                onClick={() => setActiveTab("requests")}
                className="text-xs font-bold text-slate-600 hover:text-[#FE0000] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-red-50/70 transition-all"
              >
                <span>View All Requests</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Recent Requests Table */}
            <div className="overflow-x-auto custom-scrollbar">
              {requests.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">No requests found</p>
                  <p className="text-xs text-slate-500 mt-1">Submit your first parts procurement request to get started.</p>
                  <Link
                    href="/customer/requests/new"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#FE0000] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#9B0A0F] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Parts Request</span>
                  </Link>
                </div>
              ) : (
                <table className="w-full min-w-[650px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-5">Request</th>
                      <th className="py-3 px-4">Vehicle</th>
                      <th className="py-3 px-4">Part</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-5 text-right">Value</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {requests.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((req) => (
                      <tr
                        key={req.id}
                        onClick={() => setSelectedRequest(req)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                      >
                        {/* Request Number */}
                        <td className="py-3.5 px-5  font-bold text-slate-900 group-hover:text-[#FE0000] transition-colors">
                          {req.requestNumber}
                        </td>

                        {/* Vehicle */}
                        <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                          {req.vehicle.make} {req.vehicle.model} {req.vehicle.year}
                        </td>

                        {/* Part Name */}
                        <td className="py-3.5 px-4 text-slate-600 max-w-[220px] truncate" title={req.part.name}>
                          {req.part.name}
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                          {req.dateSubmitted}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                              req.status
                            )}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                            {req.status}
                          </span>
                        </td>

                        {/* Value */}
                        <td className="py-3.5 px-5 text-right  font-bold text-slate-900 whitespace-nowrap">
                          {req.quotedValue ? `$${req.quotedValue.toFixed(2)}` : "—"}
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 group-hover:text-[#FE0000] transition-colors">
                            View
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Footer */}
            {requests.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, requests.length)} of {requests.length} requests
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
        </>
      )}
    </div>
  );
}

