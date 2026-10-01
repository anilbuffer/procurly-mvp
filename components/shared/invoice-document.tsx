"use client";

import React from "react";
import {
  Printer,
  Download,
  FileText,
  ExternalLink,
  X,
  CreditCard,
} from "lucide-react";
import { PartRequest } from "@/types/shared";
import Link from "next/link";

interface InvoiceDocumentProps {
  request: PartRequest;
  onClose?: () => void;
  onPayNow?: () => void;
  isModal?: boolean;
  standaloneUrl?: string;
}

export function InvoiceDocument({
  request,
  onClose,
  onPayNow,
  isModal = false,
  standaloneUrl,
}: InvoiceDocumentProps) {
  const hasUploadedPdf = Boolean(request.payment?.invoiceUrl);

  // If no real PDF invoice has been attached by admin yet, the section must stay blank
  if (!hasUploadedPdf || !request.payment?.invoiceUrl) {
    if (isModal) {
      return (
        <div className="relative w-full max-w-5xl my-4 sm:my-8 bg-white rounded-2xl border border-slate-200 min-h-[400px] p-6 shadow-xl">
          {onClose && (
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="w-full min-h-[450px] bg-white rounded-2xl border border-slate-200/80 shadow-xs" />
    );
  }

  const invoiceNumber =
    request.payment.invoiceNumber ||
    `INV-2026-${request.requestNumber.replace(/[^0-9]/g, "").padStart(4, "0")}`;

  const isPaid = request.payment.status === "Paid";
  const pdfUrl = request.payment.invoiceUrl;
  const fileName =
    request.payment.invoiceFileName || `Tax_Invoice_${invoiceNumber}.pdf`;

  const getSafePdfUrl = (url: string): string => {
    try {
      if (url.startsWith("blob:") || url.startsWith("http")) return url;
      const arr = url.split(",");
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
      return url;
    }
  };

  const handlePrint = () => {
    if (pdfUrl) {
      const safeUrl = getSafePdfUrl(pdfUrl);
      const printWindow = window.open(safeUrl, "_blank");
      printWindow?.focus();
      printWindow?.print();
    }
  };

  const handleOpenFullWindow = () => {
    if (pdfUrl) {
      const safeUrl = getSafePdfUrl(pdfUrl);
      window.open(safeUrl, "_blank");
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Top Action Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FE0000] to-[#ED2025] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">
                {invoiceNumber}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                  isPaid
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {isPaid ? "Paid in Full" : "Awaiting Settlement"}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Official Attached PDF Tax Invoice
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download Official Uploaded PDF */}
          <a
            href={pdfUrl}
            download={fileName}
            className="px-3.5 py-2 bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
            title="Download official attached PDF invoice"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </a>

          {/* Full Window - opens safe blob URL to avoid Chrome data URL block */}
          <button
            type="button"
            onClick={handleOpenFullWindow}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title="Open PDF in new window"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
            <span>Full Window</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Print PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print</span>
          </button>

          {/* Standalone link if in modal */}
          {isModal && standaloneUrl && (
            <Link
              href={standaloneUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="Open full page in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}

          {/* Settlement Details / Pay Instructions Button if Unpaid */}
          {!isPaid && onPayNow && (
            <button
              onClick={onPayNow}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="View bank deposit and payment settlement details"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Settlement Instructions →</span>
            </button>
          )}

          {/* Close button if modal */}
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors ml-1 cursor-pointer"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Embedded Real Uploaded PDF */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col w-full max-w-5xl mx-auto">
        {/* PDF Viewer Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-[#FE0000] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{fileName}</h3>
              <p className="text-xs text-slate-500">
                Official accounts receivable invoice attached by Autohub Finance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              download={fileName}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download</span>
            </a>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#FE0000] hover:bg-[#9B0A0F] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Window</span>
            </a>
          </div>
        </div>

        {/* Embedded PDF iframe */}
        <div className="w-full h-[750px] bg-slate-100 flex flex-col items-center justify-center relative">
          <iframe
            src={pdfUrl}
            className="w-full h-full border-none"
            title="Official Uploaded Tax Invoice PDF"
          />
        </div>
      </div>
    </div>
  );
}
