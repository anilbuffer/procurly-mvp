"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useUnifiedData } from "@/context/unified-data-context";
import { InvoiceDocument } from "@/components/shared/invoice-document";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CustomerInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { getRequestById } = useUnifiedData();

  const request = getRequestById(id);

  if (!request) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Invoice Not Found</h2>
          <p className="text-xs text-slate-500 mb-6">
            The requested invoice reference could not be located in your account.
          </p>
          <Link
            href="/customer/payments"
            className="px-4 py-2 bg-[#B30D12] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#9B0A0F] inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Payments Ledger</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-sans print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/customer/payments"
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-xs hover:bg-slate-50 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Payments & Invoices</span>
        </Link>

        <span className="text-xs font-mono font-bold text-slate-500">
          Request: {request.requestNumber}
        </span>
      </div>

      <div className="max-w-4xl mx-auto">
        <InvoiceDocument
          request={request}
          isModal={false}
          onPayNow={() => {
            router.push(`/customer/payments`);
          }}
        />
      </div>
    </div>
  );
}
