"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Truck,
  Package,
  Calendar,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Clock,
  Check,
  ShieldCheck,
  Copy,
  ArrowLeft,
  Search,
  Eye,
  ChevronRight,
  Plane,
  Building,
  FileText,
  AlertCircle,
  Share2,
} from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { ShipmentMilestone, PartRequest } from "@/types/portal";

const MILESTONES: ShipmentMilestone[] = [
  "Received At Shipping Facility",
  "In Transit",
  "Arrived in NZ",
  "Customs Clearance",
  "Out For Delivery",
  "Delivered",
];

export function ShipmentsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { requests, setSelectedRequest, setActiveTab } = usePortal();

  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [milestoneFilter, setMilestoneFilter] = useState<string>("All");

  // Read initial shipment ID from URL if provided (e.g. ?id=PR-2026-004)
  const initialId = searchParams ? searchParams.get("id") : null;
  const [selectedReqId, setSelectedReqId] = useState<string | null>(initialId);

  // Sync state if URL searchParams changes (e.g. browser back/forward)
  useEffect(() => {
    const idFromUrl = searchParams ? searchParams.get("id") : null;
    if (idFromUrl !== selectedReqId) {
      setSelectedReqId(idFromUrl);
    }
  }, [searchParams]);

  // Shipped requests list
  const shippedRequests = useMemo(() => {
    return requests.filter(
      (r) => r.shipment || r.status === "Shipped" || r.status === "Delivered"
    );
  }, [requests]);

  // Filtered requests for the table list
  const filteredRequests = useMemo(() => {
    return shippedRequests.filter((req) => {
      const sh = req.shipment;
      const milestone = sh?.currentMilestone || (req.status === "Delivered" ? "Delivered" : "In Transit");

      // Milestone tab filter
      if (milestoneFilter !== "All" && milestone !== milestoneFilter) {
        return false;
      }

      // Search text filter
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase().trim();
        const matchReq = (req.requestNumber || "").toLowerCase().includes(q);
        const matchPart = (req.part?.name || "").toLowerCase().includes(q);
        const matchMake = (req.vehicle?.make || "").toLowerCase().includes(q);
        const matchModel = (req.vehicle?.model || "").toLowerCase().includes(q);
        const matchVin = (req.vehicle?.vin || "").toLowerCase().includes(q);
        const matchTrack = (sh?.trackingNumber || "").toLowerCase().includes(q);
        const matchCarrier = (sh?.carrier || "").toLowerCase().includes(q);
        const matchOrigin = (sh?.origin || "").toLowerCase().includes(q);
        const matchDest = (sh?.destination || req.deliveryAddress?.label || "").toLowerCase().includes(q);

        return (
          matchReq ||
          matchPart ||
          matchMake ||
          matchModel ||
          matchVin ||
          matchTrack ||
          matchCarrier ||
          matchOrigin ||
          matchDest
        );
      }

      return true;
    });
  }, [shippedRequests, milestoneFilter, searchFilter]);

  // Selected request object if viewing details
  const selectedReq = useMemo(() => {
    if (!selectedReqId) return null;
    return (
      shippedRequests.find(
        (r) => r.id === selectedReqId || r.requestNumber === selectedReqId
      ) || null
    );
  }, [shippedRequests, selectedReqId]);

  const handleSelectShipment = (reqId: string) => {
    setSelectedReqId(reqId);
    router.push(`/customer/shipments?id=${encodeURIComponent(reqId)}`);
  };

  const handleBackToList = () => {
    setSelectedReqId(null);
    router.push("/customer/shipments");
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTracking(code);
    setTimeout(() => setCopiedTracking(null), 2000);
  };

  const getMilestoneBadge = (milestone: ShipmentMilestone) => {
    switch (milestone) {
      case "Received At Shipping Facility":
        return {
          badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
          dotClass: "bg-slate-400",
        };
      case "In Transit":
        return {
          badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
          dotClass: "bg-sky-500 animate-pulse",
        };
      case "Arrived in NZ":
        return {
          badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
          dotClass: "bg-purple-500",
        };
      case "Customs Clearance":
        return {
          badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
          dotClass: "bg-amber-500",
        };
      case "Out For Delivery":
        return {
          badgeClass: "bg-cyan-50 text-cyan-800 border-cyan-200",
          dotClass: "bg-cyan-500 animate-pulse",
        };
      case "Delivered":
        return {
          badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
          dotClass: "bg-emerald-600",
        };
      default:
        return {
          badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
          dotClass: "bg-slate-400",
        };
    }
  };

  // Metrics counts
  const inTransitCount = shippedRequests.filter(
    (r) => (r.shipment?.currentMilestone || r.status) !== "Delivered"
  ).length;
  const deliveredCount = shippedRequests.filter(
    (r) => (r.shipment?.currentMilestone || r.status) === "Delivered"
  ).length;

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW 2: SHIPMENT DETAILS VIEW (When a shipment is selected)
  // ══════════════════════════════════════════════════════════════════════════
  if (selectedReq && selectedReq.shipment) {
    const sh = selectedReq.shipment;
    const currentMilestoneIdx = MILESTONES.indexOf(sh.currentMilestone);
    const badge = getMilestoneBadge(sh.currentMilestone);

    return (
      <div className="space-y-6">
        {/* Top Navigation & Breadcrumbs Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all shadow-xs group cursor-pointer"
              title="Return to shipments table list"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Shipments List</span>
            </button>
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />
            <div className="text-xs text-slate-500 font-medium">
              Shipments /{" "}
              <span className="font-mono font-bold text-slate-900">
                {selectedReq.requestNumber}
              </span>{" "}
              •{" "}
              <span className="font-mono font-semibold text-slate-700">
                {sh.trackingNumber}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedRequest(selectedReq)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Full Request Audit Log</span>
            </button>
            {sh.carrierWebsite && (
              <a
                href={sh.carrierWebsite}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                <span>Carrier Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Consignment Main Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          {/* Header row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-black text-base text-slate-900">
                  {selectedReq.requestNumber}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-bold uppercase tracking-wider ${badge.badgeClass}`}
                >
                  <span className={`w-2 h-2 rounded-full ${badge.dotClass}`} />
                  {sh.currentMilestone}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {selectedReq.part?.name || "Procured Component"}
              </h2>
              <p className="text-xs text-slate-500">
                Vehicle: {selectedReq.vehicle?.year} {selectedReq.vehicle?.make}{" "}
                {selectedReq.vehicle?.model} (VIN: {selectedReq.vehicle?.vin || "N/A"})
              </p>
            </div>

            {/* Quick Metrics Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Carrier
                </span>
                <span className="font-bold text-slate-900 truncate block" title={sh.carrier}>
                  {sh.carrier}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Tracking Code
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-900 truncate">
                    {sh.trackingNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(sh.trackingNumber)}
                    className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                    title="Copy tracking number"
                  >
                    {copiedTracking === sh.trackingNumber ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <span className="text-[10px] text-emerald-700 uppercase font-bold block">
                  Estimated Delivery
                </span>
                <span className="font-bold text-emerald-900 font-mono">
                  {sh.estimatedDelivery}
                </span>
              </div>

              <div className="bg-sky-50 p-3 rounded-xl border border-sky-200">
                <span className="text-[10px] text-sky-700 uppercase font-bold block">
                  Consignment Route
                </span>
                <span className="font-bold text-sky-900 truncate block">
                  International Air Cargo
                </span>
              </div>
            </div>
          </div>

          {/* Progress Stepper Bar for 6 Logistics Milestones */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Shipment Logistics Pipeline</span>
              </div>
              <span className="text-emerald-700 flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Autohub Operations Verified
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {MILESTONES.map((m, idx) => {
                const isCompleted = idx <= currentMilestoneIdx;
                const isCurrent = idx === currentMilestoneIdx;

                return (
                  <div
                    key={m}
                    className={`p-3.5 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? "border-[#ED2025] bg-red-50/30 shadow-xs ring-2 ring-red-100"
                        : isCompleted
                        ? "border-emerald-300 bg-emerald-50/50 text-emerald-800"
                        : "border-slate-200 bg-slate-50/60 text-slate-400"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full mx-auto mb-1.5 flex items-center justify-center text-[11px] font-bold ${
                        isCurrent
                          ? "bg-[#ED2025] text-white animate-pulse shadow-sm"
                          : isCompleted
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isCompleted && !isCurrent ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-bold block leading-tight ${
                        isCurrent
                          ? "text-[#ED2025]"
                          : isCompleted
                          ? "text-slate-900"
                          : "text-slate-400"
                      }`}
                    >
                      {m}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Consignment Info & Route Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Route & Carrier Information */}
            <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Origin & Final Destination</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Dispatched From (Origin)
                    </span>
                    <span className="font-semibold text-slate-800">
                      {sh.origin || "International Consolidation Hub"}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Delivery Destination
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedReq.deliveryAddress?.label ||
                        selectedReq.deliveryAddress?.streetAddress ||
                        sh.destination ||
                        "Auckland, New Zealand"}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      {selectedReq.deliveryAddress?.streetAddress}{" "}
                      {selectedReq.deliveryAddress?.city}{" "}
                      {selectedReq.deliveryAddress?.postalCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Part & Order Details */}
            <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Package className="w-4 h-4 text-purple-600" />
                <span>Consignment Cargo Details</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Part Name
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedReq.part?.name}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Part Condition
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedReq.part?.condition || "OEM Genuine"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Quantity
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedReq.part?.quantity || 1} Unit(s)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Order Value
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    ${(selectedReq.quotedValue || selectedReq.customerQuote?.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Milestone Event Timeline Audit Log */}
          {sh.milestonesHistory && sh.milestonesHistory.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Consignment Event Timeline & Audit Trail</span>
                </div>
                <span className="text-[11px] text-slate-500 font-normal">
                  {sh.milestonesHistory.length} tracked checkpoints
                </span>
              </div>

              <div className="bg-slate-50/50 rounded-xl border border-slate-200 p-4 space-y-4">
                {sh.milestonesHistory.map((m, idx) => {
                  return (
                    <div key={idx} className="flex items-start gap-3.5 text-xs group">
                      <div className="mt-0.5 relative">
                        <div
                          className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                            m.isCompleted
                              ? "bg-emerald-500 border-emerald-500"
                              : "bg-white border-slate-300"
                          }`}
                        >
                          {m.isCompleted && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                        </div>
                        {idx !== sh.milestonesHistory.length - 1 && (
                          <div className="w-0.5 h-7 bg-slate-200 absolute top-3.5 left-1.5 -translate-x-1/2" />
                        )}
                      </div>

                      <div className="flex-1 space-y-0.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span
                            className={`font-bold ${
                              m.isCompleted ? "text-slate-900" : "text-slate-500"
                            }`}
                          >
                            {m.milestone}
                          </span>
                          <span className="font-mono text-[11px] text-slate-400">
                            {m.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] font-medium">
                          {m.location}
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          {m.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Card Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
            <button
              onClick={handleBackToList}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Shipments List</span>
            </button>

            <button
              onClick={() => setSelectedRequest(selectedReq)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <span>View Complete Request Audit Log</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW 1: SHIPMENTS TABLE LIST VIEW (Default View)
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" />
            <span>Air Cargo & Express Logistics</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Active Freight Consignments
          </h2>
          <p className="text-xs text-slate-500">
            Real-time tracking of parts dispatched from Japan, Australia & international hubs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("requests")}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            All Requests →
          </button>
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                In Transit
              </span>
              <span className="text-lg font-black text-slate-900">
                0{inTransitCount}
              </span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-[10px] text-emerald-600 block uppercase font-bold">
                Delivered
              </span>
              <span className="text-lg font-black text-emerald-700">
                0{deliveredCount}
              </span>
            </div>
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-center hidden sm:block">
              <span className="text-[10px] text-sky-600 block uppercase font-bold">
                On Schedule
              </span>
              <span className="text-lg font-black text-sky-700">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Milestone Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          {["All", ...MILESTONES].map((tab) => {
            const isActive = milestoneFilter === tab;
            const count =
              tab === "All"
                ? shippedRequests.length
                : shippedRequests.filter(
                    (r) =>
                      (r.shipment?.currentMilestone ||
                        (r.status === "Delivered" ? "Delivered" : "In Transit")) === tab
                  ).length;

            return (
              <button
                key={tab}
                onClick={() => setMilestoneFilter(tab)}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-[#0C101A] text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200/70 text-slate-600"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search tracking, req, vehicle, carrier..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#ED2025]/20 focus:border-[#ED2025] transition-all"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Shipments Table List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <Truck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-700">No active consignments found</p>
          <p className="text-xs text-slate-400 mt-1">
            {searchFilter || milestoneFilter !== "All"
              ? "No shipments match your search or milestone filter criteria."
              : "When your supplier order is dispatched by Autohub Logistics, live tracking milestones will appear here."}
          </p>
          {(searchFilter || milestoneFilter !== "All") && (
            <button
              onClick={() => {
                setSearchFilter("");
                setMilestoneFilter("All");
              }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Tracking Number</th>
                  <th className="py-3.5 px-4">Request ID</th>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Part Details</th>
                  <th className="py-3.5 px-4">Carrier & Route</th>
                  <th className="py-3.5 px-4">Estimated Delivery</th>
                  <th className="py-3.5 px-4">Current Milestone</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRequests.map((req) => {
                  const sh = req.shipment || {
                    trackingNumber: `NZ-TRK-${req.requestNumber.replace("PR-", "")}`,
                    carrier: "Air Cargo Express",
                    currentMilestone: req.status === "Delivered" ? "Delivered" : "In Transit",
                    origin: "International Hub",
                    destination: req.deliveryAddress?.label || "Auckland, NZ",
                    estimatedDelivery: "Scheduled",
                    dispatchedAt: req.dateSubmitted,
                    milestonesHistory: [],
                  };
                  const badge = getMilestoneBadge(sh.currentMilestone);

                  return (
                    <tr
                      key={req.id}
                      onClick={() => handleSelectShipment(req.id)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                      title="Click row to view shipment details"
                    >
                      {/* Tracking Number */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-slate-900 group-hover:text-[#ED2025] transition-colors">
                            {sh.trackingNumber}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(sh.trackingNumber);
                            }}
                            className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors cursor-pointer"
                            title="Copy tracking number"
                          >
                            {copiedTracking === sh.trackingNumber ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Request ID */}
                      <td className="py-4 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                        {req.requestNumber}
                      </td>

                      {/* Vehicle */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <p className="font-semibold text-slate-800">
                          {req.vehicle?.year} {req.vehicle?.make} {req.vehicle?.model}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400">
                          {req.vehicle?.vin || "N/A"}
                        </p>
                      </td>

                      {/* Part Details */}
                      <td className="py-4 px-4 max-w-[200px]">
                        <p className="font-medium text-slate-800 truncate" title={req.part?.name}>
                          {req.part?.name || "Component"}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Qty: {req.part?.quantity || 1} • {req.part?.condition || "OEM"}
                        </p>
                      </td>

                      {/* Carrier & Route */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-800 block">
                          {sh.carrier}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {sh.origin.split(",")[0]} → Auckland
                        </span>
                      </td>

                      {/* Estimated Delivery */}
                      <td className="py-4 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{sh.estimatedDelivery}</span>
                        </div>
                      </td>

                      {/* Current Milestone Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
                          {sh.currentMilestone}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectShipment(req.id);
                          }}
                          className="px-3.5 py-1.5 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs inline-flex items-center gap-1.5 transition-all active:scale-95 group-hover:shadow cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
