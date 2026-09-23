"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useUnifiedData } from "@/context/unified-data-context";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function InvoicePrintPage() {
  const params = useParams();
  const id = params.id as string;
  const { getRequestById } = useUnifiedData();

  const request = getRequestById(id);

  if (!request) {
    return <div className="p-10 text-center">Request not found.</div>;
  }

  const invoiceNumber = `INV-2026-${request.requestNumber.replace("AH-P-", "")}`;
  const currentDate = new Date().toLocaleDateString("en-NZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  // Due date is +5 days
  const dueDate = new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-NZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const quote = request.customerQuote;
  const amount = quote?.totalAmount || request.quotedValue || 0;
  const subtotal = quote?.subtotal || (amount - (quote?.freightCost || 0));
  const freight = quote?.freightCost || quote?.airFreightCost || quote?.seaFreightCost || 0;
  const gst = quote?.gstAmount || Number(((amount * 15) / 115).toFixed(2));
  const subtotalExGst = amount - gst;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans print:bg-white print:p-0">
      {/* Non-printable action bar */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link 
          href={`/admin/workspace/${request.id}`}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workspace
        </Link>
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </button>
      </div>

      {/* Invoice Document */}
      <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 shadow-xl rounded-xl print:shadow-none print:p-0">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-[#ED2025] mb-2">AUTOHUB</h1>
            <p className="text-sm text-slate-500 font-medium">Procurement & Parts</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 uppercase tracking-tight">Invoice</h2>
            <p className="text-sm text-slate-600"><strong>Invoice Number:</strong> {invoiceNumber}</p>
            <p className="text-sm text-slate-600"><strong>Date of Issue:</strong> {currentDate}</p>
            <p className="text-sm text-slate-600"><strong>Due Date:</strong> {dueDate}</p>
            <p className="text-sm text-slate-600"><strong>Reference:</strong> {request.requestNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Billed To</h3>
            <p className="text-lg font-bold text-slate-900 mb-1">{request.customerName}</p>
            <p className="text-sm text-slate-700 leading-relaxed">
              Attn: {request.contactName}<br />
              {request.deliveryAddress?.streetAddress}<br />
              {request.deliveryAddress?.suburb}, {request.deliveryAddress?.city} {request.deliveryAddress?.postalCode}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Details</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-sm text-slate-700 mb-1"><strong>Bank:</strong> ANZ New Zealand</p>
              <p className="text-sm text-slate-700 mb-1"><strong>Account Name:</strong> Autohub Procurement NZ Ltd</p>
              <p className="text-sm text-slate-700 mb-1"><strong>Account Number:</strong> 01-0288-0349821-00</p>
              <p className="text-sm text-slate-700 mt-2 text-[#ED2025] font-semibold">Please use {invoiceNumber} as reference</p>
            </div>
          </div>
        </div>

        <table className="w-full text-left mb-12">
          <thead>
            <tr className="border-b-2 border-slate-900">
              <th className="py-3 text-sm font-bold text-slate-900">Description</th>
              <th className="py-3 text-sm font-bold text-slate-900 text-center">Qty</th>
              <th className="py-3 text-sm font-bold text-slate-900 text-right">Amount (NZD)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-4">
                <p className="font-bold text-slate-900">{request.part.name}</p>
                <p className="text-sm text-slate-500">{request.vehicle.make} {request.vehicle.model} {request.vehicle.year}</p>
                {request.vehicle.vin && <p className="text-xs text-slate-400 mt-1">VIN: {request.vehicle.vin}</p>}
              </td>
              <td className="py-4 text-center font-medium">1</td>
              <td className="py-4 text-right font-medium">${subtotal.toFixed(2)}</td>
            </tr>
            {freight > 0 && (
              <tr className="border-b border-slate-100">
                <td className="py-4">
                  <p className="font-bold text-slate-900">Consolidated Freight & Handling</p>
                  <p className="text-sm text-slate-500">Delivery to {request.deliveryAddress?.city}</p>
                </td>
                <td className="py-4 text-center font-medium">1</td>
                <td className="py-4 text-right font-medium">${freight.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-end mb-12">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal (Excl. GST)</span>
              <span>${subtotalExGst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>GST (15%)</span>
              <span>${gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-extrabold text-slate-900 border-t-2 border-slate-900 pt-3">
              <span>Total Amount</span>
              <span>${amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 mt-16">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Terms & Conditions</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All parts are supplied under standard Autohub B2B Trade Warranty. 
            Payment is strictly due by the due date specified above. 
            Title of goods does not pass until payment is received in full.
          </p>
        </div>
      </div>
    </div>
  );
}
