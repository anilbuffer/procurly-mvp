"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Truck,
  Plane,
  ArrowRight,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  FastForward,
} from "lucide-react";
import { useUnifiedData } from "@/context/unified-data-context";
import { ShipmentMilestone } from "@/types/shared";
import { ShipmentMilestoneBadge, StatusBadge } from "../status-badge";

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
  const { requests, updateShipmentMilestone } = useUnifiedData();
  const [search, setSearch] = useState("");
  const [milestoneFilter, setMilestoneFilter] = useState<string>("All");

  // All requests with shipments or marked as Shipped/Delivered
  const shipmentRequests = useMemo(() => {
    return requests.filter(
      (r) => r.status === "Shipped" || r.status === "Delivered" || !!r.shipment
    );
  }, [requests]);

  const filtered = useMemo(() => {
    return shipmentRequests.filter((r) => {
      if (milestoneFilter !== "All") {
        const ms = r.shipment?.currentMilestone || (r.status === "Delivered" ? "Delivered" : "In Transit");
        if (ms !== milestoneFilter) return false;
      }

      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      return (
        (r.requestNumber || "").toLowerCase().includes(q) ||
        (r.customerName || "").toLowerCase().includes(q) ||
        (r.part?.name || "").toLowerCase().includes(q) ||
        (r.shipment?.trackingNumber && r.shipment.trackingNumber.toLowerCase().includes(q)) ||
        (r.shipment?.carrier && r.shipment.carrier.toLowerCase().includes(q))
      );
    });
  }, [shipmentRequests, milestoneFilter, search]);

  const inTransitCount = shipmentRequests.filter((r) => (r.shipment?.currentMilestone || r.status) !== "Delivered").length;
  const deliveredCount = shipmentRequests.filter((r) => (r.shipment?.currentMilestone || r.status) === "Delivered").length;

  const handleQuickAdvance = (e: React.MouseEvent, reqId: string, currentMilestone?: ShipmentMilestone) => {
    e.stopPropagation();
    const curr = currentMilestone || "Received At Shipping Facility";
    const currIdx = MILESTONES.indexOf(curr);
    if (currIdx < MILESTONES.length - 1) {
      const next = MILESTONES[currIdx + 1];
      updateShipmentMilestone(reqId, next, `Quick milestone advance to ${next}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider">
            Total Freight Consignments
          </span>
          <span className="font-mono text-2xl font-black text-slate-900 mt-1 block">
            {shipmentRequests.length}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            International air cargo & domestic delivery
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider">
            Active in Transit
          </span>
          <span className="font-mono text-2xl font-black text-cyan-600 mt-1 block">
            {inTransitCount}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Awaiting customs or final delivery
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider">
            Delivered to Workshop
          </span>
          <span className="font-mono text-2xl font-black text-emerald-600 mt-1 block">
            {deliveredCount}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Full proof of delivery confirmed
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Carrier, Tracking #, Request..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B4499]/30 focus:border-[#2B4499]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["All", "In Transit", "Customs Clearance", "Out For Delivery", "Delivered"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setMilestoneFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                milestoneFilter === filter
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Request #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Part</th>
                <th className="py-3 px-4">Carrier</th>
                <th className="py-3 px-4">Tracking Number</th>
                <th className="py-3 px-4">Shipment Status</th>
                <th className="py-3 px-4">Estimated Delivery</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No active shipments matching your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((req) => {
                  const ms = req.shipment?.currentMilestone;
                  const canAdvance = ms && ms !== "Delivered";
                  const nextMilestoneName = canAdvance ? MILESTONES[MILESTONES.indexOf(ms) + 1] : null;

                  return (
                    <tr
                      key={req.id}
                      onClick={() => router.push(`/admin/requests?id=${req.id}`)}
                      className="hover:bg-slate-50/70 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#ED2025]">
                        {req.requestNumber}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{req.customerName}</td>
                      <td className="py-3.5 px-4 text-slate-800">
                        <span className="font-medium line-clamp-1">{req.part.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-semibold">
                        {req.shipment?.carrier || "Standard Freight"}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#2B4499]">
                        {req.shipment?.trackingNumber || "PENDING"}
                      </td>
                      <td className="py-3.5 px-4">
                        {req.shipment?.currentMilestone ? (
                          <ShipmentMilestoneBadge milestone={req.shipment.currentMilestone} />
                        ) : (
                          <StatusBadge status={req.status} size="sm" />
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {req.shipment?.estimatedDelivery || "5-7 Business Days"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {req.lastUpdated}
                      </td>
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          {canAdvance && nextMilestoneName && (
                            <button
                              type="button"
                              onClick={(e) => handleQuickAdvance(e, req.id, ms)}
                              title={`Advance to ${nextMilestoneName}`}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1 transition-colors"
                            >
                              <FastForward className="w-3 h-3" />
                              Advance
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => router.push(`/admin/requests?id=${req.id}`)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-xs transition-colors"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
