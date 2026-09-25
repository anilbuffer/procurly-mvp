"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  ExternalLink,
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

  const [invoiceNumber, setInvoiceNumber] = useState(request.payment?.invoiceNumber || `INV-2026-${request.requestNumber.replace("AutoHub-P-", "")}`);
  const [fileAttached, setFileAttached] = useState(false);
  const [isMarking, setIsMarking] = useState(false);

  const finalAmount = request.payment?.amount || request.quotedValue || request.customerQuote?.totalAmount || request.costCalculation?.totalCustomerQuote || 410.0;

  const isInvoiced = request.status === "Awaiting Payment" || request.status === "Ordered" || request.status === "Shipped" || request.status === "Delivered" || request.status === "Completed";

  const handleMarkInvoiced = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMarking(true);
    setTimeout(() => {
      // Transition from Invoicing to Awaiting Payment and save invoiceNumber
      updateRequestStatus(request.id, "Awaiting Payment", invoiceNumber, fileAttached ? "Invoice_Attached.pdf" : undefined);
      setIsMarking(false);
      if (onNavigateToTab) {
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
              Generate order summary and attach official invoice for the customer before payment. This allows the team to determine whether an approved order has actually been invoiced before it moves to payment tracking.
            </p>
          </div>
          {isInvoiced && (
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Invoiced
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
                <span className="font-bold text-slate-900">{request.vehicle.year} {request.vehicle.make} {request.vehicle.model}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Part:</span>
                <span className="font-bold text-slate-900">{request.part.name} (Qty: {request.part.quantity})</span>
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Invoice Details</h3>
              <Link
                href={`/admin/invoice/${request.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline"
                title="Preview full system-generated invoice in new tab"
              >
                <span>Preview System Invoice</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="border-t border-slate-200 mb-4"></div>

            <form onSubmit={handleMarkInvoiced} className="flex flex-col gap-5 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Invoice Number</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  disabled={isInvoiced}
                  className="w-full text-sm p-3 rounded-xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-medium text-slate-700 disabled:bg-slate-50 disabled:text-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Attach PDF Invoice</label>
                <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors ${fileAttached ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'} ${isInvoiced && !fileAttached ? 'opacity-50' : ''}`}>
                  {fileAttached ? (
                    <>
                      <FileText className="w-8 h-8 text-emerald-500 mb-2" />
                      <p className="text-sm font-bold text-emerald-700">Invoice_Attached.pdf</p>
                      {!isInvoiced && (
                        <button type="button" onClick={() => setFileAttached(false)} className="text-xs text-slate-500 mt-2 hover:underline">Remove</button>
                      )}
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm font-bold text-slate-700">Drag & drop PDF here</p>
                      <p className="text-xs text-slate-500 mt-1">or click to browse</p>
                      <button
                        type="button"
                        disabled={isInvoiced}
                        onClick={() => setFileAttached(true)}
                        className="mt-3 px-3 py-1.5 bg-white border border-slate-200 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                      >
                        Select File
                      </button>
                    </>
                  )}
                </div>
              </div>

              {!isInvoiced && (
                <div className="mt-auto pt-2">
                  <button
                    type="submit"
                    disabled={isMarking}
                    className="w-full py-3 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 bg-[#B30D12] hover:bg-[#C8101E] disabled:opacity-50 disabled:cursor-not-allowed text-white"
                  >
                    {isMarking ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Mark as Invoiced (Move to Awaiting Payment)
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
