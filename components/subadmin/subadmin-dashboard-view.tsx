"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUnifiedData } from "@/context/unified-data-context";
import { Camera, CheckCircle, Clock, AlertCircle, FileText, Package, ShieldCheck, ChevronRight } from "lucide-react";
import { SubadminUploadModal } from "@/components/subadmin/subadmin-upload-modal";
import { SubadminDetailsModal } from "@/components/subadmin/subadmin-details-modal";

export function SubadminDashboardView() {
  const { requests } = useUnifiedData();
  const searchParams = useSearchParams();
  const router = useRouter();
  const filter = searchParams.get("filter");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  // Get orders that require Subadmin action or are in Subadmin review/hold
  const baseSubadminRequests = requests.filter(r =>
    r.status === "Subadmin Pending" || r.status === "Subadmin Review" || r.status === "Subadmin Hold" || r.status === "Subadmin Approved"
  );

  const pendingSubadminCount = baseSubadminRequests.filter(r => r.status === "Subadmin Pending").length;
  const reviewCount = baseSubadminRequests.filter(r => r.status === "Subadmin Review").length;
  const holdCount = baseSubadminRequests.filter(r => r.status === "Subadmin Hold").length;
  const approvedCount = baseSubadminRequests.filter(r => r.status === "Subadmin Approved").length;

  const SubadminRequests = baseSubadminRequests.filter(r => {
    if (filter === "pending") return r.status === "Subadmin Pending";
    if (filter === "review") return r.status === "Subadmin Review";
    if (filter === "hold") return r.status === "Subadmin Hold";
    if (filter === "approved") return r.status === "Subadmin Approved";
    return true;
  });

  const handleFilter = (newFilter: string | null) => {
    if (newFilter) {
      router.push(`/subadmin/dashboard?filter=${newFilter}`);
    } else {
      router.push(`/subadmin/dashboard`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>QUALITY ASSURANCE CENTER</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Subadmin Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage destination port inspections and admin approvals.
          </p>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Subadmin Pending Card */}
        <div
          onClick={() => handleFilter("pending")}
          className={`bg-white rounded-2xl border ${filter === "pending" ? 'border-[#B30D12] ring-1 ring-[#B30D12] bg-red-50/10' : 'border-slate-200/90 hover:border-red-300'} shadow-sm hover:shadow-md p-5 flex items-start justify-between cursor-pointer transition-all group`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-bold ${filter === "pending" ? 'text-[#B30D12]' : 'text-slate-500'} group-hover:text-[#B30D12] transition-colors tracking-wider uppercase`}>
                Subadmin Pending
              </span>
              {pendingSubadminCount > 0 && <span className="w-2 h-2 rounded-full bg-[#B30D12] animate-pulse" />}
            </div>
            <div className="text-3xl font-black text-slate-900 group-hover:text-[#B30D12] transition-colors">
              {pendingSubadminCount.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Requires Inspection
            </div>
          </div>
          <div className={`w-10 h-10 rounded-xl ${filter === "pending" ? 'bg-[#B30D12] text-white' : 'bg-red-50 text-[#B30D12] group-hover:bg-[#B30D12] group-hover:text-white'} transition-all flex items-center justify-center`}>
            <Camera className="w-5 h-5" />
          </div>
        </div>

        {/* Subadmin Review Card */}
        <div
          onClick={() => handleFilter("review")}
          className={`bg-white rounded-2xl border ${filter === "review" ? 'border-amber-400 ring-1 ring-amber-400 bg-amber-50/10' : 'border-slate-200/90 hover:border-amber-400'} shadow-sm hover:shadow-md p-5 flex items-start justify-between cursor-pointer transition-all group`}
        >
          <div className="space-y-1">
            <span className={`text-[11px] font-bold ${filter === "review" ? 'text-amber-600' : 'text-slate-500'} group-hover:text-amber-600 transition-colors tracking-wider uppercase`}>
              Awaiting Approval
            </span>
            <div className="text-3xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">
              {reviewCount.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Pending Admin Approval
            </div>
          </div>
          <div className={`w-10 h-10 rounded-xl ${filter === "review" ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white'} transition-all flex items-center justify-center`}>
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Subadmin Hold Card */}
        <div
          onClick={() => handleFilter("hold")}
          className={`bg-white rounded-2xl border ${filter === "hold" ? 'border-purple-500 ring-1 ring-purple-500 bg-purple-50/10' : 'border-slate-200/90 hover:border-purple-400'} shadow-sm hover:shadow-md p-5 flex items-start justify-between cursor-pointer transition-all group`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-bold ${filter === "hold" ? 'text-purple-600' : 'text-slate-500'} group-hover:text-purple-600 transition-colors tracking-wider uppercase`}>
                Subadmin Hold
              </span>
              {holdCount > 0 && <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />}
            </div>
            <div className="text-3xl font-black text-slate-900 group-hover:text-purple-600 transition-colors">
              {holdCount.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Requires Resolution
            </div>
          </div>
          <div className={`w-10 h-10 rounded-xl ${filter === "hold" ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-600 group-hover:bg-purple-500 group-hover:text-white'} transition-all flex items-center justify-center`}>
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Subadmin Approved Card */}
        <div
          onClick={() => handleFilter("approved")}
          className={`bg-white rounded-2xl border ${filter === "approved" ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/10' : 'border-slate-200/90 hover:border-emerald-400'} shadow-sm hover:shadow-md p-5 flex items-start justify-between cursor-pointer transition-all group`}
        >
          <div className="space-y-1">
            <span className={`text-[11px] font-bold ${filter === "approved" ? 'text-emerald-600' : 'text-slate-500'} group-hover:text-emerald-600 transition-colors tracking-wider uppercase`}>
              Subadmin Approved
            </span>
            <div className="text-3xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
              {approvedCount.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Ready for Next Stage
            </div>
          </div>
          <div className={`w-10 h-10 rounded-xl ${filter === "approved" ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white'} transition-all flex items-center justify-center`}>
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#B30D12]" />
                Quality Assurance Queue
              </h2>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {SubadminRequests.length} Items
              </span>
            </div>
            {filter && (
              <p className="text-xs text-slate-500 mt-1 flex items-center">
                Showing {filter === "pending" ? "Pending Inspection" : filter === "review" ? "Awaiting Admin Approval" : filter === "hold" ? "On Hold" : "Approved"} items.
                <button onClick={(e) => { e.stopPropagation(); handleFilter(null); }} className="ml-2 text-[#B30D12] hover:underline font-medium">Clear Filter</button>
              </p>
            )}
          </div>
        </div>

        {SubadminRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Queue Empty</h3>
            <p className="text-sm text-slate-500 max-w-sm">
              There are no parts currently requiring quality assurance inspection in this view.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Request / Supplier Ref</th>
                  <th className="px-6 py-3">Vehicle & Part</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {SubadminRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => setSelectedRequestId(req.id)}>
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-slate-900 group-hover:text-[#B30D12] transition-colors">{req.requestNumber}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        Ref: {req.selectedQuotationId ? req.supplierQuotations?.find(q => q.id === req.selectedQuotationId)?.supplierPartRef : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 truncate max-w-[200px]" title={req.part.name}>
                        {req.part.name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        {req.vehicle.make} {req.vehicle.model} ({req.vehicle.year})
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${req.status === "Subadmin Pending"
                        ? "bg-red-50 text-[#B30D12] border border-red-200"
                        : req.status === "Subadmin Review"
                          ? "bg-amber-50 text-amber-600 border border-amber-200"
                          : req.status === "Subadmin Hold"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                        {req.status === "Subadmin Pending" && <AlertCircle className="w-2.5 h-2.5" />}
                        {req.status === "Subadmin Review" && <Clock className="w-2.5 h-2.5" />}
                        {req.status === "Subadmin Hold" && <AlertCircle className="w-2.5 h-2.5" />}
                        {req.status === "Subadmin Approved" && <CheckCircle className="w-2.5 h-2.5" />}
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-[11px] font-medium whitespace-nowrap">
                      {req.lastUpdated}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequestId(req.id);
                        }}
                        className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ${req.status === "Subadmin Pending"
                          ? "bg-[#B30D12] text-white hover:bg-[#9B0A0F]"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                      >
                        {req.status === "Subadmin Pending" ? (
                          <>
                            <Camera className="w-3.5 h-3.5" />
                            Upload Media
                          </>
                        ) : (
                          <>
                            <FileText className="w-3.5 h-3.5" />
                            View Details
                          </>
                        )}
                        <ChevronRight className={`w-3.5 h-3.5 ${req.status === "Subadmin Pending" ? "text-white/70" : "text-slate-400"} group-hover:translate-x-0.5 transition-transform`} />
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
        requests.find((r) => r.id === selectedRequestId)?.status === "Subadmin Pending" ? (
          <SubadminUploadModal
            requestId={selectedRequestId}
            onClose={() => setSelectedRequestId(null)}
          />
        ) : (
          <SubadminDetailsModal
            requestId={selectedRequestId}
            onClose={() => setSelectedRequestId(null)}
          />
        )
      )}
    </div>
  );
}
