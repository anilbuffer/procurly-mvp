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
  Link,
  ArrowRight,
  UploadCloud,
  Printer,
} from "lucide-react";
import NextLink from "next/link";
import { PartRequest, RequestStatus } from "@/types/shared";
import { useUnifiedData } from "@/context/unified-data-context";
import { StatusBadge, PaymentStatusBadge } from "../../status-badge";

interface OverviewTabProps {
  request: PartRequest;
}

export function OverviewTab({ request }: OverviewTabProps) {
  const [showNoteModal, setShowNoteModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Grid: Customer, Vehicle, Part, Delivery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Customer Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-[#B30D12]" />
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
              <Car className="w-4 h-4 text-[#B30D12]" />
              Vehicle Specifications
            </h3>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {request.vehicle.registration || "NO PLATE"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Make</span>
              <span className="font-bold text-slate-900">
                {request.vehicle.make}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Model</span>
              <span className="font-bold text-slate-900">
                {request.vehicle.model}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Model Year</span>
              <span className="font-bold text-slate-900">
                {request.vehicle.year}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">VIN / Chassis Number (Mandatory)</span>
              <span className="font-mono font-semibold text-slate-800 break-all">
                {request.vehicle.vin}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">NZ Registration Plate (Optional)</span>
              <span className="font-medium text-slate-700">
                {request.vehicle.registration || "N/A"}
              </span>
            </div>
            {request.vehicle.engine && (
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Engine Code / Displacement</span>
                <span className="font-medium text-slate-700">
                  {request.vehicle.engine}
                </span>
              </div>
            )}
            {request.vehicle.transmission && (
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Transmission</span>
                <span className="font-medium text-slate-700">
                  {request.vehicle.transmission}
                </span>
              </div>
            )}
            {request.vehicle.driveConfig && (
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Drive Configuration</span>
                <span className="font-medium text-slate-700">
                  {request.vehicle.driveConfig}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 4. Part Requirements */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#2B4499]" />
              Requested Part Specification
            </h3>
            <span className="text-xs font-bold text-[#B30D12] bg-red-50 px-2 py-0.5 rounded">
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
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block text-[11px]">Condition Requirement</span>
                <span className="font-medium text-slate-700">{request.part.condition}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Freight Preference</span>
                <span className="font-bold text-[#B30D12] bg-red-50 px-2 py-0.5 rounded border border-red-100 inline-block mt-0.5">
                  {request.supporting?.freightPreference === "Sea Freight" ? "Ocean Freight" : (request.supporting?.freightPreference || "Not Specified")}
                </span>
              </div>
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
            className="text-xs font-semibold text-[#B30D12] hover:underline"
          >
            + Add New Note
          </button>
        </div>

        {(request.internalNotes || []).length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No notes logged yet. Click &quot;Add Note&quot; to leave internal guidance.
          </div>
        ) : (
          <div className="space-y-3">
            {(request.internalNotes || []).map((note) => (
              <div
                key={note.id}
                className={`p-3.5 rounded-xl border text-xs ${note.isCustomerVisible
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


    </div>
  );
}
