"use client";

import React from "react";
import { useUnifiedData } from "@/context/unified-data-context";
import { X, CheckCircle, AlertCircle, Clock, FileText } from "lucide-react";

interface SubadminDetailsModalProps {
  requestId: string;
  onClose: () => void;
}

export function SubadminDetailsModal({ requestId, onClose }: SubadminDetailsModalProps) {
  const { getRequestById, approveSubadmin, rejectSubadmin, resolveSubadminHold } = useUnifiedData();
  const req = getRequestById(requestId);
  
  const [adminNotes, setAdminNotes] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!req) return null;

  const Subadmin = req.SubadminDetails;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#B30D12]" />
              Subadmin Inspection Details
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              For Request: <span className="text-slate-900 font-bold font-mono">{req.requestNumber}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">Part Details</h3>
              <p className="text-sm font-bold text-slate-900">{req.part.name}</p>
              <p className="text-sm text-slate-600 mb-2">{req.vehicle.make} {req.vehicle.model} ({req.vehicle.year})</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 pt-3 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Part Number</p>
                  <p className="text-sm font-medium text-slate-900">{req.part.partNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Supplier Ref</p>
                  <p className="text-sm font-medium text-slate-900">
                    {req.selectedQuotationId ? req.supplierQuotations?.find(q => q.id === req.selectedQuotationId)?.supplierPartRef : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Supplier Name</p>
                  <p className="text-sm font-medium text-slate-900">
                    {req.selectedQuotationId ? req.supplierQuotations?.find(q => q.id === req.selectedQuotationId)?.supplierName : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Condition</p>
                  <p className="text-sm font-medium text-slate-900">{req.part.condition}</p>
                </div>
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              req.status === "Subadmin Review" ? "bg-amber-100 text-amber-700" :
              req.status === "Subadmin Hold" ? "bg-purple-100 text-purple-700" :
              req.status === "Subadmin Approved" ? "bg-emerald-100 text-emerald-700" :
              "bg-red-100 text-[#B30D12]"
            }`}>
              {req.status === "Subadmin Review" && <Clock className="w-4 h-4" />}
              {req.status === "Subadmin Hold" && <AlertCircle className="w-4 h-4" />}
              {req.status === "Subadmin Approved" && <CheckCircle className="w-4 h-4" />}
              {req.status === "Subadmin Pending" && <AlertCircle className="w-4 h-4" />}
              {req.status}
            </div>
          </div>

          {Subadmin && (
            <>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3">Inspection Photos</h3>
                {Subadmin.photos && Subadmin.photos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {Subadmin.photos.map((url, i) => (
                      <div key={i} className="aspect-video rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="Subadmin" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">No photos uploaded.</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Inspector Notes</h3>
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap">
                  {Subadmin.notes || "No notes provided."}
                </div>
                <div className="mt-2 text-xs text-slate-400 font-medium flex justify-between">
                  <span>Uploaded by: {Subadmin.uploadedBy || "Subadmin Inspector"}</span>
                  <span>{Subadmin.uploadedAt}</span>
                </div>
              </div>
              
              {Subadmin.customerNotes && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Admin Feedback</h3>
                  <div className={`border rounded-xl p-4 text-sm ${Subadmin.status === "Rejected" ? "bg-red-50 border-red-100 text-[#B30D12]" : "bg-emerald-50 border-emerald-100 text-emerald-800"}`}>
                    <p className="whitespace-pre-wrap">{Subadmin.customerNotes}</p>
                    <div className="mt-2 text-xs font-medium opacity-70">
                      Reviewed on: {Subadmin.customerReviewedAt}
                    </div>
                  </div>
                </div>
              )}

              {Subadmin.resolution && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Issue Resolution</h3>
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-sm text-purple-800 font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    {Subadmin.resolution}
                  </div>
                </div>
              )}
            </>
          )}

          {!Subadmin && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center justify-center text-amber-700 text-sm">
              No Subadmin details have been submitted yet.
            </div>
          )}

          {req.status === "Subadmin Review" && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B30D12]/30 text-sm"
                  placeholder="Enter notes for this Subadmin review..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsSubmitting(true);
                    setTimeout(() => { rejectSubadmin(req.id, adminNotes); setIsSubmitting(false); onClose(); }, 500);
                  }}
                  disabled={isSubmitting || !adminNotes.trim()}
                  className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  Reject & Hold
                </button>
                <button
                  onClick={() => {
                    setIsSubmitting(true);
                    setTimeout(() => { approveSubadmin(req.id, adminNotes); setIsSubmitting(false); onClose(); }, 500);
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve for Final Dispatch
                </button>
              </div>
            </div>
          )}

          {req.status === "Subadmin Hold" && !Subadmin?.resolution && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-4">
              <h3 className="text-sm font-bold text-purple-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Select Resolution Path
              </h3>
              <p className="text-xs text-purple-800">
                The Subadmin issue has been logged and the customer has been notified of the delay. Select a resolution to proceed.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => {
                    setIsSubmitting(true);
                    setTimeout(() => { resolveSubadminHold(req.id, "Ship Replacement"); setIsSubmitting(false); }, 500);
                  }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-sm font-bold text-purple-700 bg-white hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
                >
                  Ship Replacement
                </button>
                <button
                  onClick={() => {
                    setIsSubmitting(true);
                    setTimeout(() => { resolveSubadminHold(req.id, "Issue Refund"); setIsSubmitting(false); }, 500);
                  }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-sm font-bold text-purple-700 bg-white hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
                >
                  Issue Refund
                </button>
                <button
                  onClick={() => {
                    setIsSubmitting(true);
                    setTimeout(() => { resolveSubadminHold(req.id, "Return Shipment to Origin"); setIsSubmitting(false); }, 500);
                  }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-sm font-bold text-purple-700 bg-white hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
                >
                  Return to Origin
                </button>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
