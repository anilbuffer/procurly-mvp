"use client";

import React, { useState, useRef, useEffect } from "react";
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
  X,
  Download,
  RotateCcw,
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

  // Invoice Number configuration
  const defaultInvoiceNumber = `INV-2026-${request.requestNumber.replace(/[^0-9]/g, "").padStart(4, "0")}`;
  const [invoiceNumber, setInvoiceNumber] = useState(
    request.payment?.invoiceNumber || defaultInvoiceNumber
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

  // Preview modal states & safe blob URL handling
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);

  const [isMarking, setIsMarking] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to convert base64 data URL to a safe Blob URL to prevent Chrome top-frame navigation block
  const getBlobUrl = (dataUrl: string): string => {
    try {
      if (dataUrl.startsWith("blob:") || dataUrl.startsWith("http")) return dataUrl;
      const arr = dataUrl.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "application/pdf";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      return URL.createObjectURL(blob);
    } catch {
      return dataUrl;
    }
  };

  // Sync state when request prop changes
  useEffect(() => {
    setAttachedPdfUrl(request.payment?.invoiceUrl || null);
    setAttachedPdfName(
      request.payment?.invoiceFileName ||
      (request.payment?.invoiceUrl ? `Tax_Invoice_${request.requestNumber}.pdf` : null)
    );
    setAttachedPdfSize(request.payment?.invoiceUrl ? "PDF Document" : null);
    setInvoiceNumber(
      request.payment?.invoiceNumber ||
      `INV-2026-${request.requestNumber.replace(/[^0-9]/g, "").padStart(4, "0")}`
    );
    if (request.payment?.invoiceUrl) {
      setPreviewBlobUrl(getBlobUrl(request.payment.invoiceUrl));
    } else {
      setPreviewBlobUrl(null);
    }
  }, [request.id, request.payment?.invoiceUrl, request.payment?.invoiceFileName, request.payment?.invoiceNumber, request.requestNumber]);

  // Handle ESC key to close preview modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showPreviewModal) {
        setShowPreviewModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPreviewModal]);

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

    // Create immediate Object URL for instant previewing without top-frame data URL security blocks
    const objectUrl = URL.createObjectURL(file);
    setPreviewBlobUrl(objectUrl);

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
    setPreviewBlobUrl(null);
    setShowPreviewModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenPreview = () => {
    if (!attachedPdfUrl) return;
    const url = previewBlobUrl || getBlobUrl(attachedPdfUrl);
    setPreviewBlobUrl(url);
    setShowPreviewModal(true);
  };

  const handleOpenFullWindow = () => {
    if (!attachedPdfUrl) return;
    const url = previewBlobUrl || getBlobUrl(attachedPdfUrl);
    window.open(url, "_blank");
  };

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (!attachedPdfUrl) {
      setUploadError("Please drag & drop or select a real PDF invoice before releasing.");
      return;
    }

    if (!invoiceNumber.trim()) {
      setUploadError("Please enter a valid invoice number.");
      return;
    }

    setIsMarking(true);

    setTimeout(() => {
      // Transition from Invoicing to Awaiting Payment and save invoiceNumber & PDF
      const nextStatus = isInvoiced ? request.status : "Awaiting Payment";
      updateRequestStatus(
        request.id,
        nextStatus,
        invoiceNumber.trim(),
        attachedPdfUrl || undefined,
        attachedPdfName || undefined
      );
      setIsMarking(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);

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
              <FileText className="w-5 h-5 text-[#FE0000]" />
              Official PDF Invoice Upload &amp; Release
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Drag &amp; drop an authentic PDF tax invoice for this order and configure the invoice number. Clicking <strong>Mark as Invoiced &amp; Release to Customer</strong> immediately publishes this PDF to the customer portal and sets the status to Awaiting Payment.
            </p>
          </div>
          {isInvoiced && (
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Released to Customer
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Summary for AR */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col h-full">
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
                <span className="font-bold text-slate-900 text-base">
                  ${finalAmount.toFixed(2)} NZD
                </span>
              </div>
            </div>
          </div>

          {/* Invoice Attachment Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Invoice Details</h3>
              {attachedPdfUrl && (
                <button
                  type="button"
                  onClick={handleOpenPreview}
                  className="text-xs text-[#FE0000] hover:text-[#9B0A0F] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  title="Open live PDF invoice preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Attached PDF</span>
                </button>
              )}
            </div>
            <div className="border-t border-slate-200 mb-4"></div>

            <form onSubmit={handleSaveInvoice} className="flex flex-col gap-5 flex-1">
              {/* 2. Configurable / Editable Invoice Number */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Invoice Number <span className="text-[#FE0000]">*</span>
                  </label>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Configurable &amp; Editable
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="e.g. INV-2026-000128"
                    className="w-full text-sm p-3 rounded-xl bg-white border border-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FE0000]/30 focus:border-[#FE0000] font-bold text-slate-900 pr-24"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setInvoiceNumber(defaultInvoiceNumber)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    title="Reset to default sequential invoice identifier"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-500" />
                    <span>Reset</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Identifier released to the customer portal under Tax Invoice and used for remittance reconciliation.
                </p>
              </div>

              {/* 1. Drag & Drop PDF Invoice Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Attach Official PDF Invoice (Drag &amp; Drop) <span className="text-[#FE0000]">*</span>
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
                      {attachedPdfName || `Tax_Invoice_${invoiceNumber}.pdf`}
                    </p>
                    {attachedPdfSize && (
                      <p className="text-xs text-emerald-700 mt-0.5">{attachedPdfSize}</p>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
                      {/* 3. Fixed PDF Preview button opening built-in modal */}
                      <button
                        type="button"
                        onClick={handleOpenPreview}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                        title="Open in-app PDF invoice preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview PDF</span>
                      </button>

                      {/* Safe Full Window button */}
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
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
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
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Invoice #{invoiceNumber} and official PDF successfully released to customer!</span>
                </div>
              )}

              {/* 4. "Mark as Invoiced / Move to Awaiting Payment" Release Button */}
              <div className="mt-auto pt-3">
                <button
                  type="submit"
                  disabled={isMarking}
                  className="w-full py-3.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 bg-[#FE0000] hover:bg-[#9B0A0F] disabled:opacity-50 disabled:cursor-not-allowed text-white cursor-pointer active:scale-98"
                >
                  {isMarking ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>
                    {isInvoiced
                      ? "Update & Release Invoice to Customer"
                      : "Mark as Invoiced & Release to Customer (Move to Awaiting Payment)"}
                  </span>
                </button>
                <p className="text-[11px] text-slate-500 text-center mt-2 leading-relaxed">
                  Releases the attached PDF invoice directly to the customer portal under Tax Invoice and moves the request status to Awaiting Payment.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 3. In-App Interactive PDF Preview Modal (Fixed Preview) */}
      {showPreviewModal && attachedPdfUrl && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="bg-white w-full max-w-5xl h-[88vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-[#FE0000] flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 max-w-md truncate">
                      {attachedPdfName || `Tax_Invoice_${invoiceNumber}.pdf`}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Live Preview
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Invoice #{invoiceNumber} &bull; {attachedPdfSize || "PDF Document"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewBlobUrl || attachedPdfUrl}
                  download={attachedPdfName || `Invoice_${invoiceNumber}.pdf`}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Download</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors ml-2 cursor-pointer"
                  title="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Embedded PDF iframe */}
            <div className="flex-1 w-full bg-slate-100 relative">
              <iframe
                src={previewBlobUrl || attachedPdfUrl}
                className="w-full h-full border-none"
                title="Attached PDF Invoice Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
