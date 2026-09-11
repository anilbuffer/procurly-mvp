"use client";

import React, { useState } from "react";
import {
  Truck,
  Plane,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  ArrowRight,
  ShieldCheck,
  Package,
  Calendar,
  MapPin,
} from "lucide-react";
import { PartRequest, ShipmentMilestone } from "@/types/shared";
import { useUnifiedData } from "@/context/unified-data-context";
import { ShipmentMilestoneBadge } from "../../status-badge";

interface ShipmentTabProps {
  request: PartRequest;
}

export function ShipmentTab({ request: initialRequest }: ShipmentTabProps) {
  const {
    requests,
    createShipment,
    updateShipmentMilestone,
    recordDelivery,
    completeRequest,
  } = useUnifiedData();

  const request = requests.find((r) => r.id === initialRequest.id) || initialRequest;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  // Create Shipment Form
  const [carrier, setCarrier] = useState("DHL Global Forwarding");
  const [trackingNumber, setTrackingNumber] = useState(
    "NZ" + Math.floor(100000000 + Math.random() * 900000000)
  );
  const [estimatedDelivery, setEstimatedDelivery] = useState("2026-09-18");
  const [origin, setOrigin] = useState("Nagoya Consolidation Hub, Japan");
  const [destination, setDestination] = useState(request.deliveryAddress.label);

  // Advance Milestone Form
  const [selectedMilestone, setSelectedMilestone] = useState<ShipmentMilestone>("In Transit");
  const [milestoneNote, setMilestoneNote] = useState("");
  const [deliveryProof, setDeliveryProof] = useState("Signed by Workshop Manager");

  const shipment = request.shipment;

  const MILESTONES: { name: ShipmentMilestone; label: string; desc: string }[] = [
    {
      name: "Received At Shipping Facility",
      label: "1. Received At Facility",
      desc: "Supplier consignment delivered to export warehouse.",
    },
    {
      name: "In Transit",
      label: "2. In Transit",
      desc: "Dispatched on international airfreight flight.",
    },
    {
      name: "Arrived in NZ",
      label: "3. Arrived in NZ",
      desc: "Touched down at Auckland Airport cargo terminal.",
    },
    {
      name: "Customs Clearance",
      label: "4. Customs Clearance",
      desc: "Cleared by NZ Customs Service & MPI bio-security.",
    },
    {
      name: "Out For Delivery",
      label: "5. Out For Delivery",
      desc: "Dispatched on local Auckland courier van.",
    },
    {
      name: "Delivered",
      label: "6. Delivered",
      desc: "Successfully delivered to customer workshop.",
    },
  ];

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    createShipment(request.id, {
      carrier,
      trackingNumber,
      estimatedDelivery,
      origin,
      destination,
    });
    setShowCreateModal(false);
  };

  const handleAdvanceMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    updateShipmentMilestone(request.id, selectedMilestone, milestoneNote);
    setShowAdvanceModal(false);
  };

  const handleRecordDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    recordDelivery(request.id, deliveryProof);
    setShowDeliveryModal(false);
  };

  const getMilestoneIndex = (name: ShipmentMilestone) => {
    return MILESTONES.findIndex((m) => m.name === name);
  };

  const currentMilestoneIndex = shipment ? getMilestoneIndex(shipment.currentMilestone) : -1;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Operations & Shipment Tracking
            </h3>
            {shipment && <ShipmentMilestoneBadge milestone={shipment.currentMilestone} />}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Customer-facing status remains <span className="font-bold text-slate-700">SHIPPED</span>.
            Internal logistics milestones are tracked below.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!shipment ? (
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-[#ED2025] hover:bg-[#C8101E] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Create Shipment
            </button>
          ) : (
            <>
              {shipment.currentMilestone !== "Delivered" ? (
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = Math.min(currentMilestoneIndex + 1, MILESTONES.length - 1);
                    setSelectedMilestone(MILESTONES[nextIdx].name);
                    setShowAdvanceModal(true);
                  }}
                  className="px-3.5 py-2 bg-[#2B4499] hover:bg-[#1E3270] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <ArrowRight className="w-4 h-4" />
                  Advance Milestone
                </button>
              ) : (
                request.status !== "Completed" && (
                  <button
                    type="button"
                    onClick={() => completeRequest(request.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Request
                  </button>
                )
              )}
            </>
          )}
        </div>
      </div>

      {!shipment ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center shadow-xs">
          <Truck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700">No Shipment Record Created</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Once the overseas supplier dispatches the consignment, create the shipment and assign carrier tracking details.
          </p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[#ED2025] text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Create Consignment Shipment
          </button>
        </div>
      ) : (
        <>
          {/* Shipment Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 block text-[11px]">Freight Carrier</span>
              <span className="font-bold text-slate-900 text-sm">{shipment.carrier}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 block text-[11px]">Tracking Number</span>
              <span className="font-mono font-bold text-[#2B4499] text-sm">
                {shipment.trackingNumber}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 block text-[11px]">Origin & Transit</span>
              <span className="font-medium text-slate-800 line-clamp-1">{shipment.origin}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 block text-[11px]">Estimated Delivery</span>
              <span className="font-bold text-slate-900 text-sm">
                {shipment.estimatedDelivery}
              </span>
            </div>
          </div>

          {/* Internal Shipping Milestones Stepper (Section 23) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Internal Shipping Milestones (Inside &quot;SHIPPED&quot;)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  The Customer Portal automatically displays the latest achieved milestone.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200">
                Step {currentMilestoneIndex + 1} of {MILESTONES.length}
              </span>
            </div>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {MILESTONES.map((m, idx) => {
                const isPassed = idx < currentMilestoneIndex;
                const isCurrent = idx === currentMilestoneIndex;
                const isFuture = idx > currentMilestoneIndex;

                const matchingLog = shipment.milestonesHistory?.find(
                  (log) => log.milestone === m.name
                );

                return (
                  <div key={m.name} className="relative flex items-start gap-4">
                    {/* Circle marker */}
                    <div
                      className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-all ${
                        isPassed
                          ? "bg-emerald-500 text-white ring-4 ring-emerald-50"
                          : isCurrent
                          ? "bg-[#2B4499] text-white ring-4 ring-blue-100 animate-pulse"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="flex-1 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
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
                        {matchingLog?.timestamp && (
                          <span className="text-[11px] text-slate-400 font-mono">
                            {matchingLog.timestamp}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-1">
                        {matchingLog?.description || m.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* MODAL: Create Shipment */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create Consignment Shipment</h3>
            <p className="text-xs text-slate-500 mb-4">
              Initialize logistics tracking for {request.requestNumber}.
            </p>

            <form onSubmit={handleCreateShipment} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Carrier Name
                  </label>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  >
                    <option value="DHL Global Forwarding">DHL Global Forwarding</option>
                    <option value="Mainfreight Air & Ocean">Mainfreight Air & Ocean</option>
                    <option value="FedEx Express International">FedEx Express International</option>
                    <option value="Japan Post EMS">Japan Post EMS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Origin Facility
                  </label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estimated Delivery Date
                  </label>
                  <input
                    type="date"
                    value={estimatedDelivery}
                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#ED2025] hover:bg-[#C8101E] text-white rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" />
                  Save Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Advance Milestone */}
      {showAdvanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">Advance Shipping Milestone</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select the milestone achieved for tracking {shipment?.trackingNumber}.
            </p>

            <form onSubmit={handleAdvanceMilestone} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Next Milestone
                </label>
                <select
                  value={selectedMilestone}
                  onChange={(e) => setSelectedMilestone(e.target.value as ShipmentMilestone)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2B4499]/30 focus:border-[#2B4499]"
                >
                  {MILESTONES.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Milestone Note / Flight / Dispatch Details
                </label>
                <textarea
                  value={milestoneNote}
                  onChange={(e) => setMilestoneNote(e.target.value)}
                  placeholder="e.g. Flight touched down at AKL cargo terminal. In customs inspection."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2B4499]/30 focus:border-[#2B4499]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAdvanceModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#2B4499] hover:bg-[#1E3270] text-white rounded-xl shadow-xs"
                >
                  Update Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
