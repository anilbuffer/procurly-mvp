"use client";

import React from "react";
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
} from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { ShipmentMilestone } from "@/types/portal";

export function ShipmentsView() {
  const { requests, setSelectedRequest, setActiveTab } = usePortal();
  const [copiedTracking, setCopiedTracking] = React.useState<string | null>(null);

  // Filter requests that have shipment tracking
  const shippedRequests = requests.filter((r) => r.shipment);

  const MILESTONES: ShipmentMilestone[] = [
    "Received At Shipping Facility",
    "In Transit",
    "Arrived in NZ",
    "Customs Clearance",
    "Out For Delivery",
    "Delivered",
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTracking(code);
    setTimeout(() => setCopiedTracking(null), 2000);
  };

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
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            All Requests →
          </button>
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                In Transit
              </span>
              <span className="text-lg font-black text-slate-900">
                0{shippedRequests.length}
              </span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-[10px] text-emerald-600 block uppercase font-bold">
                On Schedule
              </span>
              <span className="text-lg font-black text-emerald-700">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipment Cards */}
      <div className="space-y-6">
        {shippedRequests.map((req) => {
          const sh = req.shipment!;
          const currentMilestoneIdx = MILESTONES.indexOf(sh.currentMilestone);

          return (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6"
            >
              {/* Card Top: Request, Carrier & Tracking */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-slate-900">
                      {req.requestNumber}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold uppercase">
                      {sh.currentMilestone}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {req.part.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Vehicle: {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}{" "}
                    (VIN: {req.vehicle.vin})
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Carrier
                    </span>
                    <span className="font-bold text-slate-800">{sh.carrier}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Tracking Code
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">
                        {sh.trackingNumber}
                      </span>
                      <button
                        onClick={() => handleCopy(sh.trackingNumber)}
                        className="text-slate-400 hover:text-slate-700"
                        title="Copy tracking code"
                      >
                        {copiedTracking === sh.trackingNumber ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-600 uppercase font-bold block">
                      Estimated Delivery
                    </span>
                    <span className="font-bold text-emerald-800">
                      {sh.estimatedDelivery}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Stepper Bar for 5 Internal Logistics Milestones */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-2">
                  <span>Shipment Logistics Pipeline</span>
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Autohub Operations Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {MILESTONES.slice(0, 5).map((m, idx) => {
                    const isCompleted = idx <= currentMilestoneIdx;
                    const isCurrent = idx === currentMilestoneIdx;

                    return (
                      <div
                        key={m}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isCurrent
                            ? "border-[#ED2025] bg-red-50/20 shadow-xs"
                            : isCompleted
                            ? "border-emerald-300 bg-emerald-50/40 text-emerald-800"
                            : "border-slate-200 bg-slate-50/60 text-slate-400"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-[10px] font-bold ${
                            isCurrent
                              ? "bg-[#ED2025] text-white animate-pulse"
                              : isCompleted
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {isCompleted && !isCurrent ? (
                            <Check className="w-3 h-3 stroke-[3]" />
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

              {/* Action row */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <div className="text-slate-500">
                  Origin: <strong>{sh.origin}</strong> → Destination:{" "}
                  <strong>{req.deliveryAddress.label}</strong>
                </div>

                <button
                  onClick={() => setSelectedRequest(req)}
                  className="inline-flex items-center gap-1.5 font-bold text-[#ED2025] hover:underline"
                >
                  <span>View Complete Shipment Audit Log</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
