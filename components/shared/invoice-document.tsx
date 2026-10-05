"use client";

import React, { useState } from "react";
import {
  Printer,
  Download,
  FileText,
  ExternalLink,
  X,
  CreditCard,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Building2,
  ShieldCheck,
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
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const hasUploadedPdf = Boolean(request.payment?.invoiceUrl);

  const invoiceNumber =
    request.payment?.invoiceNumber ||
    `INV-2026-${request.requestNumber.replace(/[^0-9]/g, "").padStart(4, "0")}`;

  const isPaid = request.payment?.status === "Paid";
  const amount =
    request.payment?.amount ||
    request.quotedValue ||
    request.customerQuote?.totalAmount ||
    485.0;

  const paymentReference =
    request.payment?.paymentReference || request.requestNumber;

  const bank = request.payment?.bankDetails || {
    bankName: "ANZ New Zealand",
    accountName: "Autohub Procurement NZ Ltd",
    accountNumber: "01-0288-0349821-00",
    swiftBic: "ANZBNZ22",
  };

  const pdfUrl = request.payment?.invoiceUrl;
  const fileName =
    request.payment?.invoiceFileName || `Tax_Invoice_${invoiceNumber}.pdf`;

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
    } else {
      window.print();
    }
  };

  const selectedFreightType =
    request.quoteAcceptance?.selectedFreightType ||
    request.customerQuote?.selectedFreightType ||
    "Sea";

  const freightCost =
    request.quoteAcceptance?.freightCost ||
    (selectedFreightType === "Air"
      ? request.customerQuote?.airFreightCost || 105.0
      : request.customerQuote?.seaFreightCost || request.customerQuote?.freightCost || 65.0);

  const unitPrice =
    request.customerQuote?.unitPrice ||
    request.quotation?.unitPrice ||
    amount - freightCost;

  const subtotal = unitPrice * (request.part?.quantity || 1) + freightCost;
  const gstAmount =
    request.customerQuote?.gstAmount || Math.round(subtotal * 0.15 * 100) / 100;
  const totalAmount = amount;

  return (
    <div className="w-full flex flex-col space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs print:hidden">
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
              {hasUploadedPdf
                ? "Official Attached PDF Tax Invoice"
                : "Official Autohub Digital GST Tax Invoice"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download Official Uploaded PDF if exists */}
          {hasUploadedPdf && pdfUrl && (
            <a
              href={pdfUrl}
              download={fileName}
              className="px-3.5 py-2 bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              title="Download official attached PDF invoice"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
          )}

          {/* Print */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Print invoice"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print Invoice</span>
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

          {/* Pay Now / Settlement Details Button if Unpaid */}
          {!isPaid && onPayNow && (
            <button
              onClick={onPayNow}
              className="px-4 py-2 bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-red-500/20 cursor-pointer active:scale-95"
              title="View bank deposit and payment settlement details"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Pay Now / Settlement Details →</span>
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

      {/* Invoice Document Body */}
      {hasUploadedPdf && pdfUrl ? (
        /* Embedded PDF iframe */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col w-full max-w-5xl mx-auto">
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
            </div>
          </div>

          <div className="w-full h-[750px] bg-slate-100 flex flex-col items-center justify-center relative">
            <iframe
              src={pdfUrl}
              className="w-full h-full border-none"
              title="Official Uploaded Tax Invoice PDF"
            />
          </div>
        </div>
      ) : (
        /* Digital Official GST Tax Invoice Card */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col w-full max-w-4xl mx-auto p-6 sm:p-10 space-y-8 print:p-0 print:border-none print:shadow-none">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-100 pb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FE0000] text-white flex items-center justify-center font-black text-sm tracking-tight shadow-sm">
                  AH
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    AUTOHUB PROCUREMENT
                  </h1>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    NEW ZEALAND TRADE DESK
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-500 pt-2 space-y-0.5">
                <p>Autohub Procurement NZ Ltd</p>
                <p>Level 4, 152 Quay Street, Auckland 1010, New Zealand</p>
                <p>NZBN: 9429038291024 &bull; GST No: 112-984-291</p>
                <p>Email: accounts@autohub.co.nz &bull; Phone: +64 9 555 0192</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1.5 sm:min-w-[220px]">
              <span className="text-2xl font-black tracking-tight text-slate-900 block">
                TAX INVOICE
              </span>
              <div className="text-xs space-y-1">
                <div className="flex sm:justify-end gap-2 text-slate-600">
                  <span className="text-slate-400">Invoice Number:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {invoiceNumber}
                  </span>
                </div>
                <div className="flex sm:justify-end gap-2 text-slate-600">
                  <span className="text-slate-400">Date Issued:</span>
                  <span className="font-semibold text-slate-800">
                    {request.payment?.dueDate ? "2026-09-10" : new Date().toISOString().split("T")[0]}
                  </span>
                </div>
                <div className="flex sm:justify-end gap-2 text-slate-600">
                  <span className="text-slate-400">Payment Due:</span>
                  <span className="font-semibold text-slate-800">
                    {request.payment?.dueDate || "Within 5 working days"}
                  </span>
                </div>
                <div className="flex sm:justify-end gap-2 text-slate-600">
                  <span className="text-slate-400">Payment Reference:</span>
                  <span className="font-bold text-[#FE0000] font-mono">
                    {paymentReference}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex sm:justify-end">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    isPaid
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isPaid ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                    }`}
                  />
                  {isPaid ? "Paid in Full" : "Awaiting Settlement"}
                </span>
              </div>
            </div>
          </div>

          {/* Billed To / Vehicle Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/80 p-5 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Billed To (Customer):
              </span>
              <h4 className="font-bold text-slate-900 text-sm">
                {request.customerName || "SP Motors Ltd"}
              </h4>
              <p className="text-slate-600 mt-0.5">
                Attention: {request.contactName || "Accounts / James Wilson"}
              </p>
              <p className="text-slate-600">
                {request.deliveryAddress?.streetAddress || "14 Penrose Road"},{" "}
                {request.deliveryAddress?.city || "Auckland"}
              </p>
              <p className="text-slate-600">
                {request.customerEmail || "procurement@spmotors.co.nz"} &bull;{" "}
                {request.customerPhone || "+64 21 555 0192"}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Vehicle &amp; Procurement Details:
              </span>
              <p className="font-bold text-slate-800 text-sm">
                {request.vehicle?.year} {request.vehicle?.make} {request.vehicle?.model}
              </p>
              <p className="text-slate-600 mt-0.5">
                Registration: <strong className="text-slate-800">{request.vehicle?.registration || "MTB842"}</strong> &bull; VIN: <strong className="text-slate-800">{request.vehicle?.vin || "GDH201-0012845"}</strong>
              </p>
              <p className="text-slate-600">
                Procurement Request: <strong className="text-slate-800">{request.requestNumber}</strong>
              </p>
              <p className="text-slate-600">
                Origin: Autohub Nagoya Consolidation Hub &bull; Warranty: 12-Month Trade
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Item / Description</th>
                  <th className="py-2.5 px-3">OEM / Part #</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Amount (NZD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 block">
                      {request.part?.name || "Left Front Lower Control Arm"}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Condition: {request.part?.condition || "Brand New OEM"} &bull; Verified Genuine
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600">
                    {request.part?.partNumber || "48069-26150"}
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold">
                    {request.part?.quantity || 1}
                  </td>
                  <td className="py-3.5 px-3 text-right font-medium">
                    ${unitPrice.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-slate-900">
                    ${(unitPrice * (request.part?.quantity || 1)).toFixed(2)}
                  </td>
                </tr>

                {/* Freight row */}
                <tr>
                  <td className="py-3.5 px-3" colSpan={2}>
                    <span className="font-semibold text-slate-800 block">
                      International Freight &bull; {selectedFreightType} Freight
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Consolidated shipping from Nagoya Hub to {request.deliveryAddress?.city || "Auckland"} workshop
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold">1</td>
                  <td className="py-3.5 px-3 text-right font-medium">
                    ${freightCost.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-slate-900">
                    ${freightCost.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Subtotal & Total */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500 max-w-sm space-y-1">
              <p className="font-bold text-slate-700">Particular Terms of Trade:</p>
              <p className="text-[11px] leading-relaxed">
                Backed by Autohub Trade Warranty. Title passes upon clearance of full settlement. Returns accepted within 14 days for uninstalled items in original packaging.
              </p>
            </div>

            <div className="space-y-2 text-xs min-w-[240px]">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (excl. GST):</span>
                <span className="font-semibold text-slate-900">
                  ${subtotal.toFixed(2)} NZD
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (15%):</span>
                <span className="font-semibold text-slate-900">
                  ${gstAmount.toFixed(2)} NZD
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-slate-200 text-base font-black text-slate-900">
                <span>Total Amount Due:</span>
                <span className="text-[#FE0000]">
                  ${totalAmount.toFixed(2)} NZD
                </span>
              </div>
            </div>
          </div>

          {/* Direct Bank Settlement Section & Pay Now */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-300 space-y-4 print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#FE0000]" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Settlement &amp; Bank Transfer Instructions
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Please transfer the total payable balance using the mandatory reference below.
                  </p>
                </div>
              </div>

              {!isPaid && onPayNow && (
                <button
                  onClick={onPayNow}
                  className="px-5 py-2.5 bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-red-500/25 transition-all inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Open Settlement Dialog →</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-amber-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Bank &amp; Account Name
                </span>
                <p className="font-bold text-slate-900 mt-0.5">{bank.bankName}</p>
                <p className="text-[11px] text-slate-600">{bank.accountName}</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Account Number
                  </span>
                  <p className="font-bold text-slate-900 font-mono mt-0.5">
                    {bank.accountNumber}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(bank.accountNumber, "acc")}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Copy account number"
                >
                  {copiedField === "acc" ? (
                    <span className="text-[10px] font-bold text-emerald-600">Copied</span>
                  ) : (
                    <span className="text-[10px] font-bold text-[#FE0000]">Copy</span>
                  )}
                </button>
              </div>

              <div className="bg-white p-3 rounded-xl border-2 border-amber-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                    Mandatory Reference
                  </span>
                  <p className="font-bold text-amber-950 font-mono mt-0.5">
                    {paymentReference}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(paymentReference, "ref")}
                  className="p-1.5 hover:bg-amber-100 rounded-lg text-amber-700 cursor-pointer"
                  title="Copy reference"
                >
                  {copiedField === "ref" ? (
                    <span className="text-[10px] font-bold text-emerald-600">Copied</span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-900">Copy</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
