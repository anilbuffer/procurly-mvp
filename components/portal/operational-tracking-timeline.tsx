"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Package,
} from "lucide-react";
import { ShipmentDetails, ShipmentMilestone, RequestStatus, MilestoneLog } from "@/types/portal";

export const INTERNAL_MILESTONES: {
  name: ShipmentMilestone;
  label: string;
  desc: string;
}[] = [
  {
    name: "Received At Shipping Facility",
    label: "1. Received At Facility",
    desc: "Package received, scanned and allocated for consolidation.",
  },
  {
    name: "In Transit",
    label: "2. In Transit",
    desc: "Scheduled cargo flight.",
  },
  {
    name: "Arrived in NZ",
    label: "3. Arrived in NZ",
    desc: "Flight discharge, ground handling and border clearance.",
  },
  {
    name: "Out For Delivery",
    label: "4. Out For Delivery",
    desc: "Final-mile courier dispatch.",
  },
  {
    name: "Delivered",
    label: "5. Delivered",
    desc: "Proof of delivery.",
  },
];

export interface OperationalTrackingTimelineProps {
  shipment: ShipmentDetails;
  requestStatus?: RequestStatus | string;
  title?: string;
  subtitle?: string;
  showCarrierSummary?: boolean;
  onOpenFullShipments?: () => void;
  className?: string;
}

export function OperationalTrackingTimeline({
  shipment,
  requestStatus,
  title = 'INTERNAL SHIPPING MILESTONES (INSIDE "SHIPPED")',
  subtitle = "The Customer Portal automatically displays the latest achieved milestone.",
  showCarrierSummary = true,
  onOpenFullShipments,
  className = "",
}: OperationalTrackingTimelineProps) {
  const [copiedTracking, setCopiedTracking] = useState(false);

  // 1. Calculate active milestone index
  const isDeliveredFully =
    requestStatus === "Delivered" ||
    requestStatus === "Completed" ||
    shipment?.currentMilestone === "Delivered";

  const currentMilestoneIndex = React.useMemo(() => {
    if (!shipment) return 0;
    if (isDeliveredFully) {
      return INTERNAL_MILESTONES.length - 1; // 4 (Step 5 of 5)
    }

    const idx = INTERNAL_MILESTONES.findIndex((m) => m.name === shipment.currentMilestone);
    if (idx !== -1) return idx;

    // Check history if any milestone is marked completed
    if (shipment.milestonesHistory && shipment.milestonesHistory.length > 0) {
      for (let i = INTERNAL_MILESTONES.length - 1; i >= 0; i--) {
        const log = shipment.milestonesHistory.find((l) => l.milestone === INTERNAL_MILESTONES[i].name);
        if (log?.isCompleted) return i;
      }
    }

    return 0;
  }, [shipment, isDeliveredFully]);

  const handleCopyTracking = (trackingNum?: string) => {
    if (!trackingNum) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(trackingNum);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  // Helper to format timestamps to New Zealand locale or clean display
  const formatTimestamp = (
    matchingLog?: MilestoneLog,
    isPassed?: boolean,
    isCurrent?: boolean
  ): string => {
    if (!isPassed && !isCurrent) {
      return "Pending";
    }

    const raw = matchingLog?.timestamp;
    if (!raw || raw.toLowerCase().includes("pending")) {
      return isPassed ? "Completed" : "Pending";
    }

    // If ISO date or parseable timestamp, format to NZDT/NZST
    if (raw.includes("T") || (raw.includes("-") && !isNaN(Date.parse(raw)))) {
      try {
        const d = new Date(raw);
        if (!isNaN(d.getTime())) {
          return d.toLocaleString("en-NZ", {
            timeZone: "Pacific/Auckland",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZoneName: "short",
          });
        }
      } catch {
        return raw;
      }
    }

    return raw;
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 ${className}`}>
      {/* Top Header Row with Step Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {title}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200 whitespace-nowrap">
            Step {currentMilestoneIndex + 1} of {INTERNAL_MILESTONES.length}
          </span>
        </div>
      </div>

      {/* Customer Carrier & Tracking Quick Bar */}
      {showCarrierSummary && shipment && (
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Carrier &amp; Tracking
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{shipment.carrier}</span>
                {shipment.trackingNumber && (
                  <button
                    onClick={() => handleCopyTracking(shipment.trackingNumber)}
                    className="inline-flex items-center gap-1 font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Copy tracking number"
                  >
                    <span>{shipment.trackingNumber}</span>
                    {copiedTracking ? (
                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Operational Sync
            </span>

            {shipment.estimatedDelivery && (
              <span className="text-[11px] text-slate-600 font-medium px-2.5 py-1 bg-white rounded-lg border border-slate-200">
                ETA: <strong className="text-slate-900">{shipment.estimatedDelivery}</strong>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Stepper Vertical Timeline */}
      <div className="relative pl-6 space-y-8">
        {INTERNAL_MILESTONES.map((m, idx) => {
          const isPassed = isDeliveredFully ? true : idx < currentMilestoneIndex;
          const isCurrent = isDeliveredFully ? false : idx === currentMilestoneIndex;
          const isFuture = !isPassed && !isCurrent;

          const matchingLog = shipment?.milestonesHistory?.find(
            (log) => log.milestone === m.name
          );

          const formattedTime = formatTimestamp(matchingLog, isPassed, isCurrent);

          return (
            <div key={m.name} className="relative flex items-start gap-4">
              {/* Connector line segment to next milestone */}
              {idx < INTERNAL_MILESTONES.length - 1 && (
                <div
                  className={`absolute -left-[14px] top-4 -bottom-8 w-0.5 transition-colors ${
                    idx < currentMilestoneIndex || isDeliveredFully
                      ? "bg-emerald-500"
                      : "bg-slate-200"
                  }`}
                />
              )}

              {/* Circle marker */}
              <div
                className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-all ${
                  isPassed
                    ? "bg-emerald-500 text-white ring-4 ring-emerald-50 shadow-xs"
                    : isCurrent
                      ? "bg-[#2B4499] text-white ring-4 ring-blue-100 animate-pulse shadow-sm"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
              </div>

              {/* Milestone Box / Card */}
              <div
                className={`flex-1 p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? "bg-white border-blue-200/90 shadow-xs ring-1 ring-blue-50"
                    : "bg-slate-50/60 border-slate-200/80 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <h5
                      className={`text-xs font-bold ${
                        isCurrent ? "text-[#2B4499]" : "text-slate-900"
                      }`}
                    >
                      {m.label}
                    </h5>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#2B4499]">
                        Current Milestone
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[11px] ${
                      isFuture
                        ? "text-slate-400 font-medium"
                        : "text-slate-400 font-normal"
                    }`}
                  >
                    {formattedTime}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {matchingLog?.description || m.desc}
                </p>

                {matchingLog?.location && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{matchingLog.location}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Navigation (if requested) */}
      {onOpenFullShipments && (
        <div className="pt-3 flex items-center justify-between border-t border-slate-200 text-xs">
          <span className="text-slate-500">Need full tracking dashboard?</span>
          <button
            onClick={onOpenFullShipments}
            className="inline-flex items-center gap-1.5 font-bold text-[#FE0000] hover:underline cursor-pointer"
          >
            <span>Open in Full Shipments View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
