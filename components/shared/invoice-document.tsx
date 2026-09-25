"use client";

import React, { useState } from "react";
import {
  Printer,
  Download,
  Copy,
  Check,
  Building2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
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
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const invoiceNumber =
    request.payment?.invoiceNumber ||
    `INV-2026-${request.requestNumber.replace(/[^0-9]/g, "").padStart(4, "0")}`;

  const quote = request.customerQuote || request.quotation;
  const amount =
    request.payment?.amount ||
    quote?.totalAmount ||
    request.quotedValue ||
    request.costCalculation?.totalCustomerQuote ||
    450;

  const freight =
    quote?.freightCost ||
    quote?.airFreightCost ||
    quote?.seaFreightCost ||
    45;

  const subtotal = Math.max(0, amount - freight);
  const gst = quote?.gstAmount || Number(((amount * 15) / 115).toFixed(2));
  const subtotalExGst = Number((amount - gst).toFixed(2));

  const issueDate =
    request.quoteAcceptance?.acceptedAt?.split(",")[0] ||
    request.dateSubmitted ||
    new Date().toLocaleDateString("en-NZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const dueDate =
    request.payment?.dueDate ||
    new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-NZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const isPaid = request.payment?.status === "Paid";

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice ${invoiceNumber} - Autohub / Procurly</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 0; padding: 40px; background: #fff; line-height: 1.5; }
    .container { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 24px; margin-bottom: 30px; }
    .brand-title { color: #B30D12; font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -0.5px; }
    .brand-sub { color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; margin-top: 4px; }
    .invoice-title { font-size: 26px; font-weight: 800; text-transform: uppercase; text-align: right; margin: 0 0 8px 0; color: #0f172a; }
    .meta-text { font-size: 13px; color: #475569; margin: 3px 0; text-align: right; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-top: 6px; }
    .status-paid { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .status-unpaid { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .card-title { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .card-content { font-size: 13px; color: #1e293b; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { border-bottom: 2px solid #0f172a; padding: 10px 8px; text-align: left; font-size: 12px; font-weight: 800; text-transform: uppercase; color: #0f172a; }
    td { border-bottom: 1px solid #f1f5f9; padding: 12px 8px; font-size: 13px; }
    .totals { width: 300px; margin-left: auto; margin-bottom: 30px; }
    .totals-row { display: flex; justify-content: space-between; font-size: 13px; color: #475569; padding: 4px 0; }
    .totals-grand { display: flex; justify-content: space-between; font-size: 18px; font-weight: 900; color: #0f172a; border-top: 2px solid #0f172a; padding-top: 8px; margin-top: 8px; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #64748b; }
    @media print { body { padding: 0; } .container { border: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1 class="brand-title">AUTOHUB</h1>
        <div class="brand-sub">Procurement & Parts | New Zealand</div>
        <p style="font-size: 11px; color: #64748b; margin-top: 6px;">
          NZ GST Reg: 134-892-741 &bull; NZBN: 9429048392014<br>
          Level 3, 102 Hobson St, Auckland Central 1010<br>
          accounts@procurly.autohub.co.nz
        </p>
      </div>
      <div>
        <h2 class="invoice-title">Tax Invoice</h2>
        <p class="meta-text"><strong>Invoice #:</strong> ${invoiceNumber}</p>
        <p class="meta-text"><strong>Issue Date:</strong> ${issueDate}</p>
        <p class="meta-text"><strong>Due Date:</strong> ${dueDate}</p>
        <p class="meta-text"><strong>Request Ref:</strong> ${request.requestNumber}</p>
        <div style="text-align: right;">
          <span class="status-badge ${isPaid ? "status-paid" : "status-unpaid"}">${isPaid ? "Paid in Full" : "Payment Due / Awaiting Settlement"}</span>
        </div>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="card-title">Billed To</div>
        <div class="card-content">
          <strong>${request.customerName}</strong><br>
          Attn: ${request.contactName}<br>
          ${request.deliveryAddress?.streetAddress || "Trade Delivery Facility"}<br>
          ${request.deliveryAddress?.suburb ? `${request.deliveryAddress.suburb}, ` : ""}${request.deliveryAddress?.city || "Auckland"} ${request.deliveryAddress?.postalCode || ""}
        </div>
      </div>
      <div class="card">
        <div class="card-title">Bank Remittance Details</div>
        <div class="card-content">
          <strong>Bank:</strong> ANZ New Zealand<br>
          <strong>Account Name:</strong> Autohub Procurement NZ Ltd<br>
          <strong>Account No:</strong> 01-0288-0349821-00<br>
          <strong>SWIFT / BIC:</strong> ANZBNZ22<br>
          <strong style="color: #B30D12;">Reference:</strong> ${invoiceNumber}
        </div>
      </div>
    </div>

    <div style="background: #f1f5f9; padding: 10px 14px; border-radius: 8px; margin-bottom: 20px; font-size: 12px; color: #334155;">
      <strong>Vehicle:</strong> ${request.vehicle.year} ${request.vehicle.make} ${request.vehicle.model}
      ${request.vehicle.vin ? ` &bull; <strong>VIN/Chassis:</strong> ${request.vehicle.vin}` : ""}
    </div>

    <table>
      <thead>
        <tr>
          <th>Description & Scope</th>
          <th style="text-align: center; width: 60px;">Qty</th>
          <th style="text-align: right; width: 140px;">Amount (NZD)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${request.part.name}</strong><br>
            <span style="font-size: 11px; color: #64748b;">
              ${request.part.partNumber ? `OEM Part #${request.part.partNumber} &bull; ` : ""}Condition: ${request.part.condition || "Genuine OEM Verified"}
            </span>
          </td>
          <td style="text-align: center;">${request.part.quantity || 1}</td>
          <td style="text-align: right; font-weight: 600;">$${subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td>
            <strong>International Freight & Logistics</strong><br>
            <span style="font-size: 11px; color: #64748b;">Consolidated Air/Sea delivery, MPI inspection & customs clearance to ${request.deliveryAddress?.city || "New Zealand"}</span>
          </td>
          <td style="text-align: center;">1</td>
          <td style="text-align: right; font-weight: 600;">$${freight.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotal (Excl. GST)</span>
        <span>$${subtotalExGst.toFixed(2)}</span>
      </div>
      <div class="totals-row">
        <span>GST (15%)</span>
        <span>$${gst.toFixed(2)}</span>
      </div>
      <div class="totals-grand">
        <span>Total Amount</span>
        <span>$${amount.toFixed(2)} NZD</span>
      </div>
    </div>

    <div class="footer">
      <strong>Terms & Conditions:</strong> All parts are supplied under standard Autohub B2B Trade Customer Warranty.
      Payment is strictly due within 5 business days of issue date. Title of goods remains with Autohub until full settlement is cleared.
      For inquiries contact accounts@procurly.autohub.co.nz.
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Autohub_Tax_Invoice_${invoiceNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col font-sans">
      {/* Top Action Bar (Non-printable) */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#B30D12] to-[#ED2025] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-900 text-sm">
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
              Official Autohub B2B GST Tax Invoice
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download HTML/PDF File */}
          <button
            onClick={handleDownloadHtml}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            title="Download offline invoice file"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Download Invoice</span>
          </button>

          {/* Print / Save as PDF */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
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

          {/* Pay Now Button if Unpaid */}
          {!isPaid && onPayNow && (
            <button
              onClick={onPayNow}
              className="px-3.5 py-2 bg-[#B30D12] hover:bg-[#9B0A0F] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Record Payment →</span>
            </button>
          )}

          {/* Close button if modal */}
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors ml-1"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Printable Invoice Sheet */}
      <div className="bg-white p-8 sm:p-12 md:p-16 border border-slate-200 rounded-2xl shadow-sm text-slate-800 print:border-none print:shadow-none print:p-0 print:m-0 w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-slate-900 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl font-black italic tracking-tighter text-[#B30D12]">
                AUTOHUB
              </span>
              <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                Procurement
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Autohub Procurement NZ Ltd &bull; Trade Solutions
            </p>
            <div className="text-xs text-slate-500 mt-2 space-y-0.5">
              <p>NZ GST Registration: <strong>134-892-741</strong></p>
              <p>NZBN: <strong>9429048392014</strong></p>
              <p>Level 3, 102 Hobson Street, Auckland Central, 1010</p>
              <p>Email: accounts@procurly.autohub.co.nz &bull; Tel: +64 9 303 3338</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-1">
              Tax Invoice
            </h2>
            <div className="space-y-1 text-xs text-slate-600">
              <p>
                <strong>Invoice Number:</strong>{" "}
                <span className="font-mono font-bold text-slate-900">
                  {invoiceNumber}
                </span>
              </p>
              <p>
                <strong>Date of Issue:</strong> {issueDate}
              </p>
              <p>
                <strong>Due Date:</strong> {dueDate}
              </p>
              <p>
                <strong>Request Ref:</strong>{" "}
                <span className="font-mono text-slate-700">
                  {request.requestNumber}
                </span>
              </p>
            </div>
            <div className="mt-3 sm:flex sm:justify-end">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  isPaid
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : "bg-amber-100 text-amber-900 border-amber-300"
                }`}
              >
                {isPaid ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Paid in Full</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Payment Due</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Billed To & Bank Remittance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Customer Card */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Billed To</span>
            </h3>
            <p className="text-base font-bold text-slate-900">
              {request.customerName}
            </p>
            <div className="text-xs text-slate-600 mt-1 leading-relaxed">
              <p>Attn: <strong>{request.contactName}</strong></p>
              <p>{request.deliveryAddress?.streetAddress || "Designated Trade Facility"}</p>
              <p>
                {request.deliveryAddress?.suburb
                  ? `${request.deliveryAddress.suburb}, `
                  : ""}
                {request.deliveryAddress?.city || "Auckland"}{" "}
                {request.deliveryAddress?.postalCode || ""}
              </p>
              <p>New Zealand</p>
            </div>
          </div>

          {/* Payment Instructions Card */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-5 relative">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
              <span>Remittance / Bank Transfer</span>
            </h3>
            <div className="text-xs text-slate-700 space-y-1">
              <p><strong>Bank:</strong> ANZ New Zealand</p>
              <p><strong>Account Name:</strong> Autohub Procurement NZ Ltd</p>
              <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200 mt-1">
                <span className="font-mono font-bold text-slate-900">
                  01-0288-0349821-00
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy("01-0288-0349821-00", "account")}
                  className="text-[11px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 print:hidden"
                >
                  {copiedField === "account" ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedField === "account" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200 mt-1">
                <span className="text-slate-600 text-[11px]">
                  Ref: <strong className="text-[#B30D12] font-mono">{invoiceNumber}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(invoiceNumber, "ref")}
                  className="text-[11px] font-bold text-[#B30D12] hover:underline flex items-center gap-1 print:hidden"
                >
                  {copiedField === "ref" ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedField === "ref" ? "Copied" : "Copy Ref"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle & Sourcing Metadata Banner */}
        <div className="bg-slate-100/70 border border-slate-200 rounded-xl px-5 py-3 mb-8 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block">
              Vehicle Identified
            </span>
            <span className="font-bold text-slate-900 text-sm">
              {request.vehicle.year} {request.vehicle.make} {request.vehicle.model}
            </span>
            {request.vehicle.vin && (
              <span className="text-slate-500 font-mono text-xs ml-2">
                (VIN: {request.vehicle.vin})
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                Destination
              </span>
              <span className="font-semibold text-slate-800">
                {request.deliveryAddress?.city || "New Zealand"}
              </span>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                Payment Terms
              </span>
              <span className="font-semibold text-slate-800">
                Net 5 Days
              </span>
            </div>
          </div>
        </div>

        {/* Itemized Line Items Table */}
        <table className="w-full text-left mb-8 text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-900 text-slate-900">
              <th className="py-3 font-bold uppercase tracking-wider">Item & Description</th>
              <th className="py-3 font-bold uppercase tracking-wider text-center w-16">Qty</th>
              <th className="py-3 font-bold uppercase tracking-wider text-right w-28">Unit Price</th>
              <th className="py-3 font-bold uppercase tracking-wider text-right w-32">Total (NZD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td className="py-4 pr-4">
                <p className="font-bold text-slate-900 text-sm">
                  {request.part.name}
                </p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {request.part.partNumber && (
                    <span className="font-mono font-medium">OEM Part #{request.part.partNumber} &bull; </span>
                  )}
                  Condition: {request.part.condition || "Genuine OEM Verified"} &bull; Guaranteed Fitment
                </p>
              </td>
              <td className="py-4 text-center font-bold text-slate-900">
                {request.part.quantity || 1}
              </td>
              <td className="py-4 text-right font-mono font-semibold">
                ${subtotal.toFixed(2)}
              </td>
              <td className="py-4 text-right font-mono font-bold text-slate-900">
                ${subtotal.toFixed(2)}
              </td>
            </tr>

            {freight > 0 && (
              <tr>
                <td className="py-4 pr-4">
                  <p className="font-bold text-slate-900 text-sm">
                    Consolidated International Freight & Logistics
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Express transit, biosecurity inspection, MPI border clearance & domestic courier handling
                  </p>
                </td>
                <td className="py-4 text-center font-bold text-slate-900">
                  1
                </td>
                <td className="py-4 text-right font-mono font-semibold">
                  ${freight.toFixed(2)}
                </td>
                <td className="py-4 text-right font-mono font-bold text-slate-900">
                  ${freight.toFixed(2)}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-200 pt-6 mb-10">
          <div className="text-xs text-slate-500 max-w-sm">
            <p className="font-bold text-slate-700 mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Autohub Verified Transaction</span>
            </p>
            <p className="leading-relaxed">
              Amounts shown in New Zealand Dollars (NZD). GST is charged at 15% in accordance with the New Zealand Goods and Services Tax Act 1985.
            </p>
          </div>

          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 py-1">
              <span>Subtotal (Excl. GST)</span>
              <span className="font-mono font-semibold">${subtotalExGst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 py-1">
              <span>GST (15.0%)</span>
              <span className="font-mono font-semibold">${gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-black text-slate-900 border-t-2 border-slate-900 pt-3">
              <span>Total Amount</span>
              <span className="font-mono font-bold text-xl">${amount.toFixed(2)} NZD</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="font-semibold text-slate-500">Balance Due:</span>
              <span className={`font-mono font-bold ${isPaid ? "text-emerald-700" : "text-[#B30D12]"}`}>
                {isPaid ? "$0.00 NZD (Paid)" : `$${amount.toFixed(2)} NZD`}
              </span>
            </div>
          </div>
        </div>

        {/* Terms of Trade & Footnote */}
        <div className="border-t border-slate-200 pt-6 text-[11px] text-slate-500 leading-relaxed space-y-2">
          <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
            Autohub Terms & Conditions of Trade
          </h4>
          <p>
            1. <strong>Warranty & Fitment:</strong> All components are backed by standard Autohub B2B Trade Warranty. Warranty covers functional defects and verified fitment against specified VIN/chassis parameters.
          </p>
          <p>
            2. <strong>Payment Settlement:</strong> Payment is strictly due by the due date specified on this document. Title and property of goods shall not pass to the purchaser until payment has been made in full.
          </p>
          <p>
            3. <strong>Disputes & Inquiries:</strong> Any discrepancy must be reported within 5 business days of delivery to Autohub Operations at <span className="underline">accounts@procurly.autohub.co.nz</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
