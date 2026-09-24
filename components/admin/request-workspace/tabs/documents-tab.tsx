"use client";

import React, { useState } from "react";
import {
  FileText,
  Upload,
  Download,
  Eye,
  File,
  Image,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { PartRequest, RequestDocument } from "@/types/shared";
import { useUnifiedData } from "@/context/unified-data-context";

interface DocumentsTabProps {
  request: PartRequest;
}

export function DocumentsTab({ request }: DocumentsTabProps) {
  const { addDocument } = useUnifiedData();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<RequestDocument | null>(null);

  // Form State
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState<"Customer" | "Supplier" | "Shipment" | "General">("General");
  const [docSize, setDocSize] = useState("1.2 MB");

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    addDocument(request.id, {
      name: docName.endsWith(".pdf") ? docName : `${docName}.pdf`,
      type: docType,
      size: docSize,
    });

    setDocName("");
    setShowUploadModal(false);
  };

  const allDocuments: RequestDocument[] = [
    ...(request.documents || []),
    // Add customer photos as previewable document objects if not already listed
    ...(request.supporting?.photos?.map((photoUrl, idx) => ({
      id: `photo-${idx}`,
      name: `Customer_Hoist_Photo_0${idx + 1}.jpg`,
      type: "Customer" as const,
      size: "2.4 MB",
      uploadedAt: request.dateSubmitted,
      uploadedBy: request.contactName || request.customerName || "Customer",
      url: photoUrl,
    })) || []),
    // Add customer supporting pdfs
    ...(request.supporting?.documents?.map((docName, idx) => ({
      id: `supp-doc-${idx}`,
      name: docName,
      type: "Customer" as const,
      size: "850 KB",
      uploadedAt: request.dateSubmitted,
      uploadedBy: request.contactName || request.customerName || "Customer",
    })) || []),
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Request Documents ({allDocuments.length})
          </h3>
          <p className="text-xs text-slate-500">
            Customer photos, fitment verification PDFs, supplier quotations, and shipping documentation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="px-3.5 py-2 bg-[#B30D12] hover:bg-[#C8101E] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Documents Grid / Table */}
      {allDocuments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center shadow-xs">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700">No Documents Uploaded</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Upload spec sheets, fitment diagrams, or supplier invoices for {request.requestNumber}.
          </p>
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-[#B30D12] text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Upload First Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allDocuments.map((doc) => {
            const isImage = doc.name.endsWith(".jpg") || doc.name.endsWith(".png");

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        {isImage ? <Image className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate" title={doc.name}>
                          {doc.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 block">{doc.size}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${doc.type === "Customer"
                        ? "bg-blue-50 text-blue-700"
                        : doc.type === "Supplier"
                          ? "bg-purple-50 text-purple-700"
                          : doc.type === "Shipment"
                            ? "bg-cyan-50 text-cyan-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                    >
                      {doc.type}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-0.5 mb-4">
                    <p>Uploaded: {doc.uploadedAt}</p>
                    <p>By: {doc.uploadedBy || "System"}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(doc)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                  <a
                    href={doc.url || "#"}
                    download={doc.name}
                    onClick={(e) => {
                      if (!doc.url) {
                        e.preventDefault();
                        alert(`Simulated download for: ${doc.name}`);
                      }
                    }}
                    className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Upload Document */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowUploadModal(false)}
          />

          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 relative z-10 flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0 border border-rose-100 shadow-inner">
                <Upload className="w-6 h-6 text-[#B30D12]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Upload Request Document</h3>
                <p className="text-sm text-slate-500">
                  Attach files to {request.requestNumber}. Select a file or drag and drop.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">

              {/* Drag and Drop Zone */}
              <div className="relative border-2 border-dashed border-slate-200 hover:border-[#B30D12]/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-rose-50/30 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-[#B30D12] transition-colors" />
                </div>
                <p className="text-sm font-bold text-slate-900 mb-1">
                  <span className="text-[#B30D12]">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">PDF, JPG, PNG, or DOCX (max. 25MB)</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Document Title / File Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FileText className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      placeholder="e.g. Fitment_Verification_Toyota_Hiace.pdf"
                      required
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#B30D12]/10 focus:border-[#B30D12] transition-all bg-white placeholder:text-slate-400 shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Classification
                    </label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as any)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#B30D12]/10 focus:border-[#B30D12] transition-all bg-white appearance-none shadow-sm cursor-pointer hover:border-slate-400"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em', paddingRight: '2.5rem' }}
                    >
                      <option value="Customer">Customer Supporting</option>
                      <option value="Supplier">Supplier Spec / Quote</option>
                      <option value="Shipment">Shipment / Air Waybill</option>
                      <option value="General">General Documentation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Simulated File Size
                    </label>
                    <input
                      type="text"
                      value={docSize}
                      onChange={(e) => setDocSize(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#B30D12]/10 focus:border-[#B30D12] transition-all bg-slate-50 shadow-sm text-slate-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold bg-[#B30D12] hover:bg-[#C8101E] text-white rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 group"
                >
                  <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Preview Document */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 truncate">{previewDoc.name}</h3>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="text-xs text-slate-400 hover:text-slate-700 font-bold"
              >
                Close
              </button>
            </div>

            <div className="bg-slate-100 rounded-xl p-6 flex flex-col items-center justify-center min-h-64 text-center">
              {previewDoc.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewDoc.url}
                  alt={previewDoc.name}
                  className="max-h-80 rounded-lg object-contain shadow-md"
                />
              ) : (
                <div className="space-y-3">
                  <FileText className="w-16 h-16 text-slate-400 mx-auto" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{previewDoc.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {previewDoc.type} Document • {previewDoc.size}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto italic">
                    PDF document fitment verification stored in Autohub cloud repository.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
