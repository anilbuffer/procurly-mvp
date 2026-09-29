"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  ExternalLink,
  Trash2,
  Eye,
  Check,
} from "lucide-react";
import { PartRequest } from "@/types/shared";
import { useUnifiedData } from "@/context/unified-data-context";

interface InvoiceTabProps {
  request: PartRequest;
  onNavigateToTab?: (tab: string) => void;
}

export function InvoiceTab({ request: initialRequest, onNavigateToTab }: InvoiceTabProps) {
  const { requests, updateRequestStatus } = useUnifiedData();
  const request = requests.find((r) => r.id === initialRequest.id) || initialRequest;

  const [invoiceNumber, setInvoiceNumber] = useState(
    request.payment?.invoiceNumber ||
    `INV-2026-${request.requestNumber.replace(/[^0-9]/g, "").padStart(4, "0")}`
  );

  // File upload states
  const [isDragging, setIsDragging] = useState(false);
  const [attachedPdfUrl, setAttachedPdfUrl] = useState<string | null>(
    request.payment?.invoiceUrl || null
  );
  const [attachedPdfName, setAttachedPdfName] = useState<string | null>(
    request.payment?.invoiceFileName ||
    (request.payment?.invoiceUrl ? `Tax_Invoice_${request.requestNumber}.pdf` : null)
  );
  const [attachedPdfSize, setAttachedPdfSize] = useState<string | null>(
    request.payment?.invoiceUrl ? "PDF Document" : null
  );
  const [isMarking, setIsMarking] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const finalAmount =
    request.payment?.amount ||
    request.quotedValue ||
    request.customerQuote?.totalAmount ||
    request.costCalculation?.totalCustomerQuote ||
    410.0;

  const isInvoiced =
    request.status === "Awaiting Payment" ||
    request.status === "Ordered" ||
    request.status === "Shipped" ||
    request.status === "Delivered" ||
    request.status === "Completed";

  const processFile = (file: File) => {
    setUploadError(null);
    if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Only PDF files are supported for invoice upload.");
      return;
    }

    // Format size
    const sizeKb = Math.round(file.size / 1024);
    const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setAttachedPdfUrl(dataUrl);
      setAttachedPdfName(file.name);
      setAttachedPdfSize(sizeStr);
    };
    reader.onerror = () => {
      setUploadError("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAttachedPdfUrl(null);
    setAttachedPdfName(null);
    setAttachedPdfSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMarking(true);

    setTimeout(() => {
      // Transition from Invoicing to Awaiting Payment and save invoiceNumber & PDF
      updateRequestStatus(
        request.id,
        "Awaiting Payment",
        invoiceNumber,
        attachedPdfUrl || undefined,
        attachedPdfName || undefined
      );
      setIsMarking(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      if (onNavigateToTab && !isInvoiced) {
        onNavigateToTab("payment");
      }
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Accounts Receivable Invoicing
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Upload official PDF invoice for the customer. Uploaded PDFs are instantly visible to the customer in their portal under the Tax Invoice tab and Invoice views.
            </p>
          </div>
          {isInvoiced && (
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 flex items-center gap-1.5 self-start sm:self-auto">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Invoiced (Awaiting Payment)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Summary for AR */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <h3 className="text-base font-bold text-slate-900 mb-4">Order Summary for AR</h3>
            <div className="border-t border-slate-200 mb-4"></div>

            <div className="flex flex-col gap-4 flex-1 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Customer:</span>
                <span className="font-bold text-slate-900">{request.customerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Vehicle:</span>
                <span className="font-bold text-slate-900">
                  {request.vehicle.year} {request.vehicle.make} {request.vehicle.model}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Part:</span>
                <span className="font-bold text-slate-900">
                  {request.part.name} (Qty: {request.part.quantity})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Delivery Address:</span>
                <span className="font-semibold text-slate-800 text-right text-xs max-w-[200px] truncate">
                  {request.deliveryAddress?.streetAddress}, {request.deliveryAddress?.city}
                </span>
              </div>

              <div className="border-t border-slate-200 mt-auto pt-4 flex justify-between items-center">
                <span className="font-bold text-slate-700">Total Billable:</span>
                <span className="font-bold text-slate-900 text-base font-mono">
                  ${finalAmount.toFixed(2)} NZD
                </span>
              </div>
            </div>
          </div>

          {/* Invoice Attachment Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Invoice Details</h3>
              <Link
                href={`/admin/invoice/${request.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#FE0000] hover:text-[#9B0A0F] font-bold flex items-center gap-1 hover:underline"
                title="Preview full system-generated invoice in new tab"
              >
                <span>Preview System Invoice</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="border-t border-slate-200 mb-4"></div>

            <form onSubmit={handleSaveInvoice} className="flex flex-col gap-5 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Invoice Number</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FE0000]/30 focus:border-[#FE0000] font-medium text-slate-700 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Attach Official PDF Invoice (Drag &amp; Drop)
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="application/pdf, .pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {attachedPdfUrl ? (
                  <div className="border-2 border-emerald-500 bg-emerald-50/60 rounded-xl p-5 flex flex-col items-center justify-center text-center transition-all">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-2 shadow-xs">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-emerald-900 max-w-xs truncate" title={attachedPdfName || ""}>
                      {attachedPdfName || "Official_Invoice.pdf"}
                    </p>
                    {attachedPdfSize && (
                      <p className="text-xs text-emerald-700 mt-0.5 font-mono">{attachedPdfSize}</p>
                    )}

                    <div className="flex items-center gap-2 mt-3">
                      <a
                        href={attachedPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                      >
                        Replace File
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove attached PDF"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${isDragging
                        ? "border-[#FE0000] bg-red-50/50 scale-[1.01]"
                        : "border-slate-300 bg-slate-50/70 hover:bg-slate-100/70 hover:border-slate-400"
                      }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 mb-3 shadow-xs">
                      <UploadCloud className="w-6 h-6 text-[#FE0000]" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      Drag &amp; drop PDF invoice here
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      or click to browse from your computer (.pdf)
                    </p>
                    <button
                      type="button"
                      className="mt-3.5 px-4 py-1.5 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg shadow-xs hover:bg-slate-50 transition-colors"
                    >
                      Select PDF File
                    </button>
                  </div>
                )}

                {uploadError && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {uploadError}
                  </p>
                )}
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Invoice details &amp; PDF successfully saved to request!</span>
                </div>
              )}

              <div className="mt-auto pt-2">
                <button
                  type="submit"
                  disabled={isMarking}
                  className="w-full py-3 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 bg-[#FE0000] hover:bg-[#9B0A0F] disabled:opacity-50 disabled:cursor-not-allowed text-white cursor-pointer active:scale-98"
                >
                  {isMarking ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>
                    {isInvoiced
                      ? "Update Invoice & Attached PDF"
                      : "Mark as Invoiced (Move to Awaiting Payment)"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
