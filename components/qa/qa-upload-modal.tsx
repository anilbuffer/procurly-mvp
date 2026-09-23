"use client";

import React, { useState } from "react";
import { useUnifiedData } from "@/context/unified-data-context";
import { X, UploadCloud, CheckCircle, AlertCircle, FileText, Camera } from "lucide-react";

interface QAUploadModalProps {
  requestId: string;
  onClose: () => void;
}

export function QAUploadModal({ requestId, onClose }: QAUploadModalProps) {
  const { getRequestById, submitQAMedia } = useUnifiedData();
  const req = getRequestById(requestId);
  
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoggingIssue, setIsLoggingIssue] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!req) return null;

  const handleSubmit = (e: React.FormEvent, asIssue: boolean = false) => {
    e.preventDefault();
    setIsUploading(true);
    setIsLoggingIssue(asIssue);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          if (submitQAMedia) {
            submitQAMedia(requestId, {
              notes: notes,
              photos: [
                "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=600&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1605333557550-96b6fbcf2b55?w=600&auto=format&fit=crop&q=80"
              ]
            }, isLoggingIssue);
          }
          setIsUploading(false);
          onClose();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#B30D12]" />
              Upload QA Media
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

        <form onSubmit={(e) => handleSubmit(e, false)} className="p-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#B30D12]"></div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Part Inspection Target</h3>
                  <p className="text-lg font-black text-slate-900">{req.part.name}</p>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">{req.vehicle.make} {req.vehicle.model} ({req.vehicle.year})</p>
                </div>
                <div className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
                  {req.part.condition}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100/80">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Part Number
                  </p>
                  <p className="text-sm font-bold text-slate-800">{req.part.partNumber || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Supplier Ref
                  </p>
                  <p className="text-sm font-bold text-slate-800 font-mono">
                    {req.selectedQuotationId ? req.supplierQuotations?.find(q => q.id === req.selectedQuotationId)?.supplierPartRef : "N/A"}
                  </p>
                </div>
                <div className="space-y-1 col-span-2 md:col-span-1">
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <UploadCloud className="w-3.5 h-3.5" />
                    Supplier Name
                  </p>
                  <p className="text-sm font-bold text-slate-800 truncate" title={req.selectedQuotationId ? req.supplierQuotations?.find(q => q.id === req.selectedQuotationId)?.supplierName : "N/A"}>
                    {req.selectedQuotationId ? req.supplierQuotations?.find(q => q.id === req.selectedQuotationId)?.supplierName : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Media Upload (Drag & Drop)
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-[#B30D12] hover:bg-red-50/50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-red-100 flex items-center justify-center mx-auto mb-3 transition-colors">
                <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-[#B30D12] transition-colors" />
              </div>
              <p className="text-sm font-bold text-slate-700 mb-1">Click or drag photos/videos here</p>
              <p className="text-xs text-slate-500">Supports JPG, PNG, MP4 (Max 50MB per file)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Inspection Notes (Required)
            </label>
            <textarea
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-[#B30D12] text-sm min-h-[100px]"
              placeholder="E.g., Factory seal intact. No visible damage on outer casing. Serial numbers match invoice."
            />
          </div>

          <div className="bg-amber-50 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 font-medium leading-relaxed">
              Ensure clear documentation of the part's condition. These images will be reviewed by the Admin for final approval.
            </p>
          </div>

          <div className="pt-4 flex justify-between gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isUploading || notes.trim() === ""}
              className="px-5 py-2.5 text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isUploading && isLoggingIssue ? (
                <>
                  <svg className="animate-spin -ml-1 h-4 w-4 text-purple-700" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Log Issue (Hold)
                </>
              )}
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || notes.trim() === ""}
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#B30D12] hover:bg-[#9B0A0F] rounded-xl shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isUploading && !isLoggingIssue ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading ({uploadProgress}%)
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Submit for Admin Approval
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
