"use client";

import React, { useState } from "react";
import { PartRequest } from "@/types/shared";
import { Camera, Image as ImageIcon, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useUnifiedData } from "@/context/unified-data-context";

interface SubadminMediaTabProps {
  request: PartRequest;
}

export function SubadminMediaTab({ request }: SubadminMediaTabProps) {
  const { approveSubadmin, resolveSubadminHold } = useUnifiedData();
  const [adminNotes, setAdminNotes] = useState("");
  const subadminDetails = request.SubadminDetails;

  const handleApprove = () => {
    if (approveSubadmin) approveSubadmin(request.id, adminNotes);
  };

  const handleResolve = (resolution: "Ship Replacement" | "Issue Refund" | "Return Shipment to Origin") => {
    if (resolveSubadminHold) resolveSubadminHold(request.id, resolution);
  };

  if (!subadminDetails) {
    return (
      <div className="text-center py-12 text-sm text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
        No Subadmin inspection details available yet.
      </div>
    );
  }

  const isHold = subadminDetails.status === "Hold";
  const isReview = subadminDetails.status === "Review";

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <Camera className="w-5 h-5 text-[#B30D12]" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Subadmin Port Inspection Evidence
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review media and notes uploaded by the inspector at the destination port.
            </p>
          </div>
        </div>

        {/* Media Gallery */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-slate-500" />
            Uploaded Evidence
          </h4>
          {subadminDetails.photos && subadminDetails.photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {subadminDetails.photos.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200">
                  <img src={url} alt={`Subadmin Media ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500 italic">No photos uploaded.</div>
          )}
        </div>

        {/* Inspector Notes */}
        {subadminDetails.notes && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Inspector Notes
            </h4>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{subadminDetails.notes}</p>
          </div>
        )}

        {/* Admin Review Action Area */}
        {isReview && (
          <div className="border-t border-slate-100 pt-6">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Admin Review
            </h4>
            <textarea
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12] mb-4"
              placeholder="Add optional notes before approving..."
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Approve & Clear for Dispatch
              </button>
            </div>
          </div>
        )}

        {/* Hold Resolution Area */}
        {isHold && (
          <div className="border-t border-red-100 pt-6 bg-red-50/30 -mx-6 -mb-6 p-6 rounded-b-2xl">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-red-900 uppercase tracking-wider">
                  Action Required: Subadmin Hold
                </h4>
                <p className="text-xs text-red-700 mt-1">
                  An issue was logged during inspection. Please select a resolution to proceed.
                </p>
              </div>
            </div>

            {!subadminDetails.resolution ? (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleResolve("Ship Replacement")}
                  className="px-4 py-2 bg-white border border-red-200 text-red-700 text-sm font-bold rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                >
                  Ship Replacement
                </button>
                <button
                  onClick={() => handleResolve("Issue Refund")}
                  className="px-4 py-2 bg-white border border-red-200 text-red-700 text-sm font-bold rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                >
                  Issue Refund
                </button>
                <button
                  onClick={() => handleResolve("Return Shipment to Origin")}
                  className="px-4 py-2 bg-white border border-red-200 text-red-700 text-sm font-bold rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                >
                  Return Shipment to Origin
                </button>
              </div>
            ) : (
              <div className="bg-white border border-red-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Resolution Applied</p>
                  <p className="text-sm font-bold text-slate-900">{subadminDetails.resolution}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
