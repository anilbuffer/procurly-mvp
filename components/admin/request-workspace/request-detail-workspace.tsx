"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Car,
  Package,
  Clock,
  DollarSign,
  CreditCard,
  Truck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Eye,
  ExternalLink,
  FileText,
  ArrowRight,
  Plus,
} from "lucide-react";
import { PartRequest, RequestStatus } from "@/types/shared";
import { RequestDetailTab } from "@/types/admin";
import { StatusBadge, PaymentStatusBadge, CustomerResponseBadge } from "../status-badge";
import { OverviewTab } from "./tabs/overview-tab";
import { SourcingTab } from "./tabs/sourcing-tab";
import { QuoteTab } from "./tabs/quote-tab";
import { InvoiceTab } from "./tabs/invoice-tab";
import { PaymentTab } from "./tabs/payment-tab";
import { ShipmentTab } from "./tabs/shipment-tab";
import { DocumentsTab } from "./tabs/documents-tab";
import { ActivityTab } from "./tabs/activity-tab";
import { QAMediaTab } from "./tabs/qa-media-tab";

import { useUnifiedData } from "@/context/unified-data-context";

interface RequestDetailWorkspaceProps {
  request: PartRequest;
  onBack?: () => void;
}

export function RequestDetailWorkspace({
  request: initialRequest,
  onBack,
}: RequestDetailWorkspaceProps) {
  const { requests, updateRequestStatus, assignStaff, addInternalNote, staffUsers } = useUnifiedData();
  const request = requests.find((r) => r.id === initialRequest.id) || initialRequest;
  const [activeTab, setActiveTab] = useState<RequestDetailTab>("overview");
  
  const finalAmount = request.payment?.amount || request.quotedValue || request.customerQuote?.totalAmount || request.costCalculation?.totalCustomerQuote || 0;

  // Modals state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<RequestStatus>(request.status);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(
    staffUsers.find((s) => s.name === request.assignedStaff)?.id || staffUsers[0].id
  );

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [isCustomerVisible, setIsCustomerVisible] = useState(false);

  const handleStatusChange = () => {
    updateRequestStatus(request.id, newStatus);
    setShowStatusModal(false);
  };

  const handleAssignStaff = () => {
    const staff = staffUsers.find((s) => s.id === selectedStaffId);
    if (staff) {
      assignStaff(request.id, staff.name, staff.role);
    }
    setShowAssignModal(false);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addInternalNote(request.id, noteText, isCustomerVisible);
    setNoteText("");
    setShowNoteModal(false);
  };

  // The 9 Canonical Lifecycle Stages (Section 8)
  const LIFECYCLE_STAGES: RequestStatus[] = [
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
  ];

  const currentStageIndex = LIFECYCLE_STAGES.indexOf(request.status);

  const handleAdvanceStage = () => {
    if (currentStageIndex < LIFECYCLE_STAGES.length - 1) {
      const nextStage = LIFECYCLE_STAGES[currentStageIndex + 1];
      updateRequestStatus(request.id, nextStage);
    }
  };

  const handleStageSelect = (stage: RequestStatus) => {
    updateRequestStatus(request.id, stage);
  };

  const handleStageClick = (stage: RequestStatus) => {
    if (stage === "Sourcing") setActiveTab("sourcing");
    else if (stage === "Quoted") setActiveTab("quote");
    else if (stage === "Approved" || stage === "Invoicing") setActiveTab("invoice");
    else if (stage === "Awaiting Payment") setActiveTab("payment");
    else if (stage === "Ordered" || stage === "Shipped" || stage === "Delivered") setActiveTab("shipment");
    else setActiveTab("overview");
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab request={request} />;
      case "sourcing":
        return <SourcingTab request={request} />;
      case "quote":
        return <QuoteTab request={request} onNavigateToTab={(tab) => setActiveTab(tab as any)} />;
      case "invoice":
        return <InvoiceTab request={request} onNavigateToTab={(tab) => setActiveTab(tab as any)} />;
      case "payment":
        return <PaymentTab request={request} onNavigateToTab={(tab) => setActiveTab(tab as any)} />;
      case "shipment":
        return <ShipmentTab request={request} />;
      case "documents":
        return <DocumentsTab request={request} />;
      case "qa":
        return <QAMediaTab request={request} />;
      case "activity":
        return <ActivityTab request={request} />;
      default:
        return <OverviewTab request={request} />;
    }
  };

  const tabsConfig: { id: RequestDetailTab; label: string; badge?: number | string }[] = [
    { id: "overview", label: "Overview" },
    {
      id: "sourcing",
      label: "Sourcing",
      badge: request.supplierQuotations?.length || undefined,
    },
    {
      id: "quote",
      label: "Quote",
      badge: request.customerQuote ? `v${request.customerQuote.version}` : undefined,
    },
    {
      id: "invoice",
      label: "Invoice",
      badge: request.status === "Invoicing" ? "Action Needed" : undefined,
    },
    {
      id: "payment",
      label: "Payment",
      badge: request.payment?.status === "Paid" ? "Paid" : "Unpaid",
    },
    {
      id: "shipment",
      label: "Shipment",
      badge: request.shipment ? "Active" : undefined,
    },
    {
      id: "documents",
      label: "Documents",
      badge: ((request.documents?.length || 0) + (request.supporting.photos?.length || 0)) || undefined,
    },
    {
      id: "qa",
      label: "QA Media",
    },
    {
      id: "activity",
      label: "Activity",
      badge: request.activity?.length || undefined,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Back Button & Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Requests
          </button>
        ) : (
          <Link
            href="/admin/requests"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Requests
          </Link>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden md:flex items-center gap-2 mr-3 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned:</span>
            <span className="text-xs font-bold text-slate-900">{request.assignedStaff || "Unassigned"}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowAssignModal(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            Assign Request
          </button>
          <button
            type="button"
            onClick={() => setShowStatusModal(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            Change Status
          </button>
          <button
            type="button"
            onClick={() => setShowNoteModal(true)}
            className="px-3 py-1.5 bg-[#ED2025] hover:bg-[#C8101E] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Note
          </button>
        </div>
      </div>

      {/* REQUEST SUMMARY HEADER CARD (Section 7) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-xl sm:text-2xl font-black text-[#ED2025]">
                {request.requestNumber}
              </span>
              <StatusBadge status={request.status} size="lg" />
              <PaymentStatusBadge status={request.payment?.status || "Unpaid"} />
              {request.customerResponse && (
                <CustomerResponseBadge response={request.customerResponse} />
              )}
            </div>

            <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span className="font-bold text-slate-800">{request.customerName}</span>
              <span>•</span>
              <span>{request.contactName}</span>
              <span>•</span>
              <span>Submitted {request.dateSubmitted}</span>
              <span>•</span>
              <span>Updated {request.lastUpdated}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 lg:border-l lg:pl-6 border-slate-200 shrink-0">
            <div>
              <span className="text-slate-400 block text-[11px] font-medium uppercase">
                Quote Value
              </span>
              <span className="font-mono text-xl sm:text-2xl font-black text-slate-900">
                NZ${finalAmount.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-medium uppercase">
                Payment Status
              </span>
              <span
                className={`font-bold text-xs ${request.payment?.status === "Paid" ? "text-emerald-600" : "text-rose-600"
                  }`}
              >
                {request.payment?.status === "Paid" ? "PAID" : "UNPAID"}
              </span>
            </div>
          </div>
        </div>

        {/* Vehicle & Part Quick Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <span className="text-slate-400 block text-[11px]">Vehicle</span>
            <span className="font-bold text-slate-900">
              {request.vehicle.year} {request.vehicle.make} {request.vehicle.model}
            </span>
            <span className="text-[10px] text-slate-500 block font-mono">
              VIN: {request.vehicle.vin}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Requested Part</span>
            <span className="font-bold text-slate-900 truncate block">
              {request.part.name}
            </span>
            <span className="text-[10px] text-slate-500 block font-mono">
              {request.part.partNumber || "OEM Part"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Quantity & Preference</span>
            <span className="font-semibold text-slate-800">
              Qty: {request.part.quantity} • {request.part.preference}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Workshop Delivery</span>
            <span className="font-semibold text-slate-800 truncate block">
              {request.deliveryAddress.city} ({request.deliveryAddress.suburb})
            </span>
          </div>
        </div>
      </div>

      {/* VISUAL REQUEST LIFECYCLE TRACKER (Section 8) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Request Lifecycle Progression
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Stage {currentStageIndex + 1}/9: <span className="text-slate-900 font-bold">{request.status}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={request.status}
              onChange={(e) => handleStageSelect(e.target.value as RequestStatus)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 outline-none focus:border-[#ED2025] cursor-pointer"
              title="Quickly jump or update stage status"
            >
              {LIFECYCLE_STAGES.map((s, idx) => (
                <option key={s} value={s}>
                  {idx + 1}. {s}
                </option>
              ))}
            </select>

            {currentStageIndex < LIFECYCLE_STAGES.length - 1 && (
              <button
                type="button"
                onClick={handleAdvanceStage}
                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-[#ED2025] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                title={`Advance to ${LIFECYCLE_STAGES[currentStageIndex + 1]}`}
              >
                <span>Advance to {LIFECYCLE_STAGES[currentStageIndex + 1]} →</span>
              </button>
            )}
          </div>
        </div>

        {/* Stepper container */}
        <div className="overflow-x-auto py-2">
          <div className="flex items-center justify-between min-w-[700px] relative">
            {/* Connecting background line */}
            <div className="absolute top-3.5 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

            {LIFECYCLE_STAGES.map((stage, idx) => {
              const isCompleted = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isPending = idx > currentStageIndex;

              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => handleStageClick(stage)}
                  className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                  title={`Click to view relevant tab for ${stage}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isCompleted
                        ? "bg-emerald-500 text-white shadow-xs group-hover:scale-110"
                        : isCurrent
                          ? "bg-[#ED2025] text-white ring-4 ring-red-100 animate-pulse shadow-md group-hover:scale-110"
                          : "bg-white border-2 border-slate-300 text-slate-400 group-hover:border-slate-500 group-hover:text-slate-600"
                      }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] mt-2 whitespace-nowrap font-medium text-center transition-colors ${isCurrent
                        ? "font-bold text-[#ED2025]"
                        : isCompleted
                          ? "text-slate-800 font-semibold group-hover:text-slate-950"
                          : "text-slate-400 group-hover:text-slate-700"
                      }`}
                  >
                    {stage}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* THE 7 REQUEST DETAIL TABS (Section 9) */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        {tabsConfig.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${isActive
                  ? "border-[#ED2025] text-[#ED2025]"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${isActive
                      ? "bg-red-50 text-[#ED2025]"
                      : "bg-slate-100 text-slate-600"
                    }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div>{renderActiveTabContent()}</div>
      {/* MODAL: Change Status */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">Change Request Status</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select the new operational stage for {request.requestNumber}.
            </p>
            <div className="space-y-1.5 mb-6 max-h-60 overflow-y-auto">
              {LIFECYCLE_STAGES.map((st) => (
                <label
                  key={st}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs font-medium transition-all ${newStatus === st
                    ? "bg-red-50 border-[#ED2025] text-[#ED2025] font-bold"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status_choice"
                      checked={newStatus === st}
                      onChange={() => setNewStatus(st)}
                      className="accent-[#ED2025]"
                    />
                    <span>{st}</span>
                  </div>
                  <StatusBadge status={st} size="sm" />
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStatusChange}
                className="px-4 py-2 text-xs font-semibold bg-[#ED2025] hover:bg-[#C8101E] text-white rounded-xl shadow-xs"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Assign Staff */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">Assign Internal Staff</h3>
            <p className="text-xs text-slate-500 mb-4">
              Designate the specialist responsible for {request.requestNumber}.
            </p>
            <div className="space-y-2 mb-6">
              {staffUsers.map((staff) => (
                <label
                  key={staff.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition-all ${selectedStaffId === staff.id
                    ? "bg-red-50 border-[#ED2025] text-slate-900 font-bold"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="assign_choice"
                      checked={selectedStaffId === staff.id}
                      onChange={() => setSelectedStaffId(staff.id)}
                      className="accent-[#ED2025]"
                    />
                    <div>
                      <span className="block font-bold">{staff.name}</span>
                      <span className="block text-[10px] text-slate-400">{staff.department}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    {staff.role}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignStaff}
                className="px-4 py-2 text-xs font-semibold bg-[#ED2025] hover:bg-[#C8101E] text-white rounded-xl shadow-xs"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Note */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Workspace Note</h3>
            <p className="text-xs text-slate-500 mb-4">
              Record fitment verification, supplier interactions, or internal remarks.
            </p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note Content
                </label>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={4}
                  placeholder="Type note details here..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={isCustomerVisible}
                  onChange={(e) => setIsCustomerVisible(e.target.checked)}
                  className="rounded border-slate-300 accent-[#ED2025]"
                />
                <span>Make visible to customer in Customer Portal</span>
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                className="px-4 py-2 text-xs font-semibold bg-[#ED2025] hover:bg-[#C8101E] disabled:opacity-50 text-white rounded-xl shadow-xs"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
