"use client";

import React from "react";
import { useUnifiedData } from "@/context/unified-data-context";
import { X, CheckCircle, AlertCircle, Clock, FileText } from "lucide-react";

interface QADetailsModalProps {
  requestId: string;
  onClose: () => void;
}

export function QADetailsModal({ requestId, onClose }: QADetailsModalProps) {
  const { getRequestById } = useUnifiedData();
  const req = getRequestById(requestId);

  if (!req) return null;

  const qa = req.qaDetails;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#ED2025]" />
              QA Inspection Details
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
              req.status === "QA Review" ? "bg-amber-100 text-amber-700" :
              req.status === "QA Approved" ? "bg-emerald-100 text-emerald-700" :
              "bg-red-100 text-[#ED2025]"
            }`}>
              {req.status === "QA Review" && <Clock className="w-4 h-4" />}
              {req.status === "QA Approved" && <CheckCircle className="w-4 h-4" />}
              {req.status === "QA Pending" && <AlertCircle className="w-4 h-4" />}
              {req.status}
            </div>
          </div>

          {qa && (
            <>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3">Inspection Photos</h3>
                {qa.photos && qa.photos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {qa.photos.map((url, i) => (
                      <div key={i} className="aspect-video rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="QA" className="w-full h-full object-cover" />
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
                  {qa.notes || "No notes provided."}
                </div>
                <div className="mt-2 text-xs text-slate-400 font-medium flex justify-between">
                  <span>Uploaded by: {qa.uploadedBy || "QA Inspector"}</span>
                  <span>{qa.uploadedAt}</span>
                </div>
              </div>
              
              {qa.customerNotes && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Customer Feedback</h3>
                  <div className={`border rounded-xl p-4 text-sm ${qa.status === "Rejected" ? "bg-red-50 border-red-100 text-[#ED2025]" : "bg-emerald-50 border-emerald-100 text-emerald-800"}`}>
                    <p className="whitespace-pre-wrap">{qa.customerNotes}</p>
                    <div className="mt-2 text-xs font-medium opacity-70">
                      Reviewed on: {qa.customerReviewedAt}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {!qa && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center justify-center text-amber-700 text-sm">
              No QA details have been submitted yet.
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
