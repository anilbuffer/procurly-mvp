"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Printer,
  ArrowLeft,
  Download,
  CreditCard,
  CheckCircle2,
  Clock,
  FileText,
  ExternalLink,
  UploadCloud,
} from "lucide-react";
import { useUnifiedData } from "@/context/unified-data-context";

export default function AdminInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "";
  const { getRequestById, markPaymentPaid, markPaymentUnpaid } = useUnifiedData();

  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  const request = getRequestById(id);

  if (!request) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-10 max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#FE0000] flex items-center justify-center mx-auto mb-4 font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Invoice Not Found</h2>
          <p className="text-xs text-slate-500 mb-6">
            No parts request or invoice record could be located matching identifier &quot;{id}&quot;.
          </p>
          <button
            type="button"
            onClick={() => router.push("/admin/requests")}
            className="w-full py-2.5 bg-[#FE0000] hover:bg-[#9B0A0F] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Return to All Requests
          </button>
        </div>
      </div>
    );
  }

  const invoiceNumber =
    request.payment?.invoiceNumber ||
    `INV-2026-${request.requestNumber.replace(/[^0-9]/g, "").padStart(4, "0")}`;

  const isPaid = request.payment?.status === "Paid" || request.paymentStatus === "Paid";
  const pdfUrl = request.payment?.invoiceUrl;
  const fileName = request.payment?.invoiceFileName || `Tax_Invoice_${invoiceNumber}.pdf`;

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

  const handleTogglePaymentStatus = () => {
    setIsUpdatingPayment(true);
    setTimeout(() => {
      if (isPaid) {
        markPaymentUnpaid(request.id);
      } else {
        markPaymentPaid(request.id, `${invoiceNumber}-ADMIN-SETTLED`);
      }
      setIsUpdatingPayment(false);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 print:bg-white print:p-0">
      {/* Top Navigation & Controls */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-col gap-3 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 px-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/requests/${request.id}`}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 group cursor-pointer"
              title={`Return to Workspace for ${request.requestNumber}`}
            >
              <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Workspace</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="text-slate-300">/</span>
              <span className="font-bold text-slate-700">{request.requestNumber}</span>
              <span className="text-slate-300">/</span>
              <span className="font-bold text-[#FE0000]">Tax Invoice</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                isPaid
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {isPaid ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Paid in Full</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Awaiting Settlement</span>
                </>
              )}
            </span>

            {/* Toggle Payment Record */}
            <button
              type="button"
              onClick={handleTogglePaymentStatus}
              disabled={isUpdatingPayment}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                isPaid
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{isPaid ? "Mark as Unpaid" : "Record Payment →"}</span>
            </button>

            {pdfUrl && (
              <>
                <a
                  href={pdfUrl}
                  download={fileName}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Download attached PDF"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Download PDF</span>
                </a>

                <button
                  type="button"
                  onClick={handleOpenFullWindow}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Open PDF in new window"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                  <span>Full Window</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Print PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Invoice Document Sheet / Viewer */}
      <div className="max-w-5xl mx-auto">
        {pdfUrl ? (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
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

              <div className="text-xs text-slate-500 font-medium">
                Invoice Reference: <strong className="text-slate-900">{invoiceNumber}</strong>
              </div>
            </div>

            {/* Embedded PDF iframe */}
            <div className="w-full h-[800px] bg-slate-100 flex flex-col items-center justify-center relative">
              <iframe
                src={pdfUrl}
                className="w-full h-full border-none"
                title="Official Uploaded Tax Invoice PDF"
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              No Official PDF Invoice Attached Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
              An official PDF tax invoice has not been uploaded for {request.requestNumber}. The customer side invoice section will stay blank until an admin attaches a PDF invoice.
            </p>
            <Link
              href={`/admin/requests/${request.id}`}
              className="px-5 py-2.5 bg-[#FE0000] hover:bg-[#9B0A0F] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Go to Workspace &amp; Upload PDF</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
