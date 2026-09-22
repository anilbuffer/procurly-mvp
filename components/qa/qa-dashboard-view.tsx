"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUnifiedData } from "@/context/unified-data-context";
import { Camera, CheckCircle, Clock, AlertCircle, FileText, Package } from "lucide-react";
import { QAUploadModal } from "@/components/qa/qa-upload-modal";
import { QADetailsModal } from "@/components/qa/qa-details-modal";

export function QADashboardView() {
  const { requests } = useUnifiedData();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  // Get orders that require QA action or are in QA review
  const baseQaRequests = requests.filter(r => 
    r.status === "QA Pending" || r.status === "QA Review" || r.status === "QA Approved"
  );

  const pendingQACount = baseQaRequests.filter(r => r.status === "QA Pending").length;
  const reviewCount = baseQaRequests.filter(r => r.status === "QA Review").length;
  const approvedCount = baseQaRequests.filter(r => r.status === "QA Approved").length;

  const qaRequests = baseQaRequests.filter(r => {
    if (filter === "pending") return r.status === "QA Pending";
    if (filter === "review") return r.status === "QA Review";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#ED2025] flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">QA Pending</p>
            <h3 className="text-2xl font-black text-slate-900">{pendingQACount}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Awaiting Customer Approval</p>
            <h3 className="text-2xl font-black text-slate-900">{reviewCount}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">QA Approved</p>
            <h3 className="text-2xl font-black text-slate-900">{approvedCount}</h3>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#ED2025]" />
            Quality Assurance Queue
          </h2>
        </div>
        
        {qaRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Queue Empty</h3>
            <p className="text-sm text-slate-500 max-w-sm">
              There are no parts currently requiring quality assurance inspection.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Request / Supplier Ref</th>
                  <th className="px-6 py-3 font-semibold">Vehicle & Part</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {qaRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-slate-900">{req.requestNumber}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Ref: {req.selectedQuotationId ? req.supplierQuotations?.find(q => q.id === req.selectedQuotationId)?.supplierPartRef : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 truncate max-w-[200px]">
                        {req.part.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {req.vehicle.make} {req.vehicle.model} ({req.vehicle.year})
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        req.status === "QA Pending"
                          ? "bg-red-50 text-[#ED2025] border border-red-100"
                          : req.status === "QA Review"
                          ? "bg-amber-50 text-amber-600 border border-amber-100"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {req.status === "QA Pending" && <AlertCircle className="w-3 h-3" />}
                        {req.status === "QA Review" && <Clock className="w-3 h-3" />}
                        {req.status === "QA Approved" && <CheckCircle className="w-3 h-3" />}
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                      {req.lastUpdated}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedRequestId(req.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          req.status === "QA Pending"
                            ? "bg-[#ED2025] text-white hover:bg-[#d11a1f] shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {req.status === "QA Pending" ? (
                          <>
                            <Camera className="w-3.5 h-3.5" />
                            Upload QA Media
                          </>
                        ) : (
                          <>
                            <FileText className="w-3.5 h-3.5" />
                            View Details
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRequestId && (
        requests.find((r) => r.id === selectedRequestId)?.status === "QA Pending" ? (
          <QAUploadModal 
            requestId={selectedRequestId} 
            onClose={() => setSelectedRequestId(null)} 
          />
        ) : (
          <QADetailsModal 
            requestId={selectedRequestId} 
            onClose={() => setSelectedRequestId(null)} 
          />
        )
      )}
    </div>
  );
}
