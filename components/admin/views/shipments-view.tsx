"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useUnifiedData } from "@/context/unified-data-context";
import { ShipmentMilestoneBadge, StatusBadge } from "../status-badge";

export function ShipmentsView() {
  const router = useRouter();
  const { requests } = useUnifiedData();
  const [search, setSearch] = useState("");

  // All requests with shipments or marked as Shipped/Delivered
  const shipmentRequests = requests.filter(
    (r) => r.status === "Shipped" || r.status === "Delivered" || !!r.shipment
  );

  const filtered = shipmentRequests.filter((r) => {
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

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Operations: Active Shipments ({shipmentRequests.length})
          </h2>
          <p className="text-xs text-slate-500">
            Real-time international airfreight and domestic workshop delivery tracking.
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Carrier, Tracking #, Request..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B4499]/30 focus:border-[#2B4499]"
          />
        </div>
      </div>

      {/* Shipments Table (Section 22) */}
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
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No active shipments found.
                  </td>
                </tr>
              ) : (
                filtered.map((req) => (
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
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white group-hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 shadow-xs transition-colors">
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
