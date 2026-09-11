"use client";

import React, { useState } from "react";
import {
  Car,
  User,
  Package,
  MapPin,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Edit2,
  Send,
  MessageSquare,
  Plus,
} from "lucide-react";
import { PartRequest, RequestStatus } from "@/types/shared";
import { useUnifiedData } from "@/context/unified-data-context";
import { StatusBadge, PaymentStatusBadge } from "../../status-badge";

interface OverviewTabProps {
  request: PartRequest;
}

export function OverviewTab({ request }: OverviewTabProps) {
  const {
    updateRequestStatus,
    assignStaff,
    addInternalNote,
    staffUsers,
    activeStaffRole,
  } = useUnifiedData();

  // Status modal state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<RequestStatus>(request.status);

  // Assign staff modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(
    staffUsers.find((s) => s.name === request.assignedStaff)?.id || staffUsers[0].id
  );

  // Note modal state
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

  const ALL_STATUSES: RequestStatus[] = [
    "Submitted",
    "Sourcing",
    "Quoted",
    "Approved",
    "Awaiting Payment",
    "Ordered",
    "Shipped",
    "Delivered",
    "Completed",
  ];

  return (
    <div className="space-y-6">
      {/* Contextual Action Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Assigned Staff
            </span>
            <span className="text-sm font-bold text-slate-900">
              {request.assignedStaff || "Unassigned"}
              {request.assignedStaffRole && (
                <span className="ml-2 text-xs font-medium text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded">
                  {request.assignedStaffRole}
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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

      {/* Grid: Customer, Vehicle, Part, Delivery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Customer Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-[#ED2025]" />
              Customer Details
            </h3>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Trade Account
            </span>
          </div>
          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Business Name</span>
              <span className="font-bold text-slate-900 text-sm">{request.customerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Contact Person</span>
              <span className="font-semibold text-slate-800">{request.contactName}</span>
            </div>
            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <a href={`mailto:${request.customerEmail}`} className="hover:underline">
                  {request.customerEmail}
                </a>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <a href={`tel:${request.customerPhone}`} className="hover:underline">
                  {request.customerPhone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Delivery Address */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#2B4499]" />
              Delivery Destination
            </h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Workshop Bay
            </span>
          </div>
          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-slate-900 block">{request.deliveryAddress.label}</span>
            <p className="text-slate-600 leading-relaxed">
              Attn: {request.deliveryAddress.recipientName}
              <br />
              {request.deliveryAddress.streetAddress}, {request.deliveryAddress.suburb}
              <br />
              {request.deliveryAddress.city} {request.deliveryAddress.postalCode}
              <br />
              Phone: {request.deliveryAddress.phone}
            </p>
          </div>
        </div>

        {/* 3. Vehicle Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Car className="w-4 h-4 text-[#ED2025]" />
              Vehicle Specifications
            </h3>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {request.vehicle.registration || "NO PLATE"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Make & Model</span>
              <span className="font-bold text-slate-900">
                {request.vehicle.year} {request.vehicle.make} {request.vehicle.model}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">VIN / Chassis</span>
              <span className="font-mono font-semibold text-slate-800 break-all">
                {request.vehicle.vin}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Engine Spec</span>
              <span className="font-medium text-slate-700">
                {request.vehicle.engine || "Standard factory spec"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Variant</span>
              <span className="font-medium text-slate-700">
                {request.vehicle.variant || "Standard"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Transmission</span>
              <span className="font-medium text-slate-700">
                {request.vehicle.transmission || "Automatic"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Drivetrain</span>
              <span className="font-medium text-slate-700">
                {request.vehicle.driveConfig || "RWD"}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Part Requirements */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#2B4499]" />
              Requested Part Specification
            </h3>
            <span className="text-xs font-bold text-[#ED2025] bg-red-50 px-2 py-0.5 rounded">
              Qty: {request.part.quantity}
            </span>
          </div>
          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Part Name</span>
              <span className="font-bold text-slate-900 text-sm block">
                {request.part.name}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-400 block text-[11px]">Part Number (OEM)</span>
                <span className="font-mono font-semibold text-slate-800">
                  {request.part.partNumber || "To be sourced by Autohub"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Preference</span>
                <span className="font-semibold text-slate-800">{request.part.preference}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Condition Requirement</span>
              <span className="font-medium text-slate-700">{request.part.condition}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Notes & Attachments */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          Customer Information & Notes
        </h3>
        {request.supporting?.notes ? (
          <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed font-normal">
            &quot;{request.supporting.notes}&quot;
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic">No notes provided by customer.</p>
        )}

        {request.supporting?.photos && request.supporting.photos.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Attached Photos
            </span>
            <div className="flex items-center gap-3">
              {request.supporting.photos.map((p, idx) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={idx}
                  src={p}
                  alt="Customer attachment"
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 hover:scale-105 transition-transform"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Internal & Customer Notes List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-500" />
            Workspace Notes
          </h3>
          <button
            type="button"
            onClick={() => setShowNoteModal(true)}
            className="text-xs font-semibold text-[#ED2025] hover:underline"
          >
            + Add New Note
          </button>
        </div>

        {request.internalNotes.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No notes logged yet. Click &quot;Add Note&quot; to leave internal guidance.
          </div>
        ) : (
          <div className="space-y-3">
            {request.internalNotes.map((note) => (
              <div
                key={note.id}
                className={`p-3.5 rounded-xl border text-xs ${
                  note.isCustomerVisible
                    ? "bg-amber-50/50 border-amber-200/80"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{note.author}</span>
                    <span className="text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {note.role}
                    </span>
                    {note.isCustomerVisible && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                        Customer Visible
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{note.timestamp}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{note.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: Change Status */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">Change Request Status</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select the new operational stage for {request.requestNumber}.
            </p>
            <div className="space-y-1.5 mb-6 max-h-60 overflow-y-auto">
              {ALL_STATUSES.map((st) => (
                <label
                  key={st}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                    newStatus === st
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
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                    selectedStaffId === staff.id
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
