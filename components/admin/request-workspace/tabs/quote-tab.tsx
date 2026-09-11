"use client";

import React, { useState } from "react";
import {
  DollarSign,
  FileCheck,
  Send,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  Truck,
  MessageCircle,
  HelpCircle,
  History,
} from "lucide-react";
import { PartRequest, CustomerQuoteVersion } from "@/types/shared";
import { useUnifiedData } from "@/context/unified-data-context";
import { CustomerResponseBadge } from "../../status-badge";

interface QuoteTabProps {
  request: PartRequest;
}

export function QuoteTab({ request }: QuoteTabProps) {
  const { createCustomerQuote } = useUnifiedData();

  // Selected supplier quotation reference
  const selectedQuote = request.supplierQuotations?.find((q) => q.isSelected);

  // Quote builder form state
  const baseCost = selectedQuote
    ? selectedQuote.supplierCost + selectedQuote.supplierFreight
    : 275;
  const initialMargin = Math.round(baseCost * 0.2);
  const initialSellPrice = baseCost + initialMargin;

  const [sellPrice, setSellPrice] = useState<number>(
    request.customerQuote?.unitPrice || initialSellPrice
  );
  // MVP Freight Rule: Single flat manual freight value
  const [manualFreight, setManualFreight] = useState<number>(
    request.customerQuote?.freightCost || 85
  );
  const [estimatedTransitDays, setEstimatedTransitDays] = useState<number>(
    request.customerQuote?.estimatedTransitDays || selectedQuote?.leadTimeDays || 5
  );
  const [quoteNotes, setQuoteNotes] = useState<string>(
    request.customerQuote?.notes ||
      "Genuine factory sealed packaging. Backed by 12-month Autohub Trade Warranty."
  );
  const [procurementTerms, setProcurementTerms] = useState<string>(
    request.customerQuote?.procurementTerms ||
      "Autohub Trade Terms apply. 12-month warranty against manufacturing defects."
  );

  const [showBuilderModal, setShowBuilderModal] = useState(false);

  // Live calculation
  const totalCustomerQuote = Number(sellPrice) + Number(manualFreight);
  const gstAmount = Number(((totalCustomerQuote * 15) / 115).toFixed(2));

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    createCustomerQuote(request.id, {
      sellPrice: Number(sellPrice),
      freight: Number(manualFreight),
      notes: quoteNotes,
      terms: procurementTerms,
      estimatedTransitDays: Number(estimatedTransitDays),
    });
    setShowBuilderModal(false);
  };

  const activeQuote = request.customerQuote;

  return (
    <div className="space-y-6">
      {/* Customer Approval Response Banner (Section 16) */}
      {request.customerResponse && (
        <div
          className={`rounded-2xl p-4 border flex items-center justify-between shadow-xs ${
            request.customerResponse === "Accepted"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : request.customerResponse === "Rejected"
              ? "bg-rose-50 border-rose-200 text-rose-900"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          <div className="flex items-center gap-3">
            {request.customerResponse === "Accepted" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : request.customerResponse === "Rejected" ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Customer Response: {request.customerResponse}
              </h4>
              <p className="text-xs opacity-90 mt-0.5">
                {request.customerResponse === "Accepted"
                  ? "The customer has approved this quote. Proceed to payment recording."
                  : request.customerResponse === "Rejected"
                  ? "The customer has declined this quote version. You may revise or reissue."
                  : "Customer requested additional details. Please contact them externally via Email, Teams, or Phone."}
              </p>
            </div>
          </div>
          <CustomerResponseBadge response={request.customerResponse} />
        </div>
      )}

      {/* Internal Cost Calculation Box (Section 13) */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Internal Margin Calculation
            </span>
            <h3 className="text-sm font-bold text-white">
              Supplier Sourcing &rarr; Customer Sell Price
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-lg self-start">
            Confidential (Internal Only)
          </span>
        </div>

        {selectedQuote ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400 block text-[10px] uppercase">Supplier Cost</span>
              <span className="font-mono text-base font-bold text-slate-100">
                NZ${selectedQuote.supplierCost.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                {selectedQuote.supplierName}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400 block text-[10px] uppercase">Supplier Freight</span>
              <span className="font-mono text-base font-bold text-slate-100">
                NZ${selectedQuote.supplierFreight.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Landed freight</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400 block text-[10px] uppercase">Autohub Margin</span>
              <span className="font-mono text-base font-bold text-emerald-400">
                +NZ${(sellPrice - (selectedQuote.supplierCost + selectedQuote.supplierFreight)).toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {baseCost > 0
                  ? Math.round(
                      ((sellPrice - baseCost) / baseCost) * 100
                    )
                  : 20}
                % markup
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400 block text-[10px] uppercase">Manual Freight</span>
              <span className="font-mono text-base font-bold text-cyan-400">
                NZ${Number(manualFreight).toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Single freight rule</span>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-br from-[#ED2025]/20 to-red-900/30 border border-[#ED2025]/40 col-span-2 sm:col-span-1">
              <span className="text-red-300 block text-[10px] uppercase font-bold">
                Customer Total
              </span>
              <span className="font-mono text-lg font-black text-white">
                NZ${totalCustomerQuote.toFixed(2)}
              </span>
              <span className="text-[10px] text-red-200 block mt-0.5">Incl. 15% GST</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-xs text-slate-400">
            No supplier selected yet. Select a quotation in the Sourcing tab to calculate margin.
          </div>
        )}
      </div>

      {/* Customer-Facing Quote Preview (Section 14) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Customer-Facing Quote {activeQuote ? `(v${activeQuote.version})` : ""}
              </h3>
              {activeQuote && (
                <span className="text-xs px-2 py-0.5 rounded font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              This is the exact quotation visible to {request.customerName} in their Customer Portal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowBuilderModal(true)}
              className="px-4 py-2 bg-[#ED2025] hover:bg-[#C8101E] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
            >
              {activeQuote ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  Revise Quote
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Create Customer Quote
                </>
              )}
            </button>
          </div>
        </div>

        {activeQuote ? (
          <div className="p-6 space-y-6">
            {/* Quote Header / Reference */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px]">Request #</span>
                <span className="font-mono font-bold text-slate-900">{request.requestNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Vehicle</span>
                <span className="font-semibold text-slate-900">
                  {request.vehicle.year} {request.vehicle.make} {request.vehicle.model}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Estimated Transit</span>
                <span className="font-semibold text-slate-900">
                  {activeQuote.estimatedTransitDays} Business Days
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Valid Until</span>
                <span className="font-semibold text-slate-900">{activeQuote.validUntil}</span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">Item & Specification</th>
                    <th className="py-2.5 px-4 text-center">Quantity</th>
                    <th className="py-2.5 px-4 text-right">Sell Price</th>
                    <th className="py-2.5 px-4 text-right">Freight</th>
                    <th className="py-2.5 px-4 text-right">Total (NZD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{request.part.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {request.part.partNumber || "OEM Verified Spec"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-700">
                      {request.part.quantity}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-900">
                      NZ${activeQuote.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      NZ${activeQuote.freightCost.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                      NZ${activeQuote.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-200 font-medium">
                  <tr>
                    <td colSpan={4} className="py-2 px-4 text-right text-slate-500">
                      Includes 15% GST:
                    </td>
                    <td className="py-2 px-4 text-right font-mono text-slate-700">
                      NZ${activeQuote.gstAmount.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="font-bold text-slate-900 text-sm">
                    <td colSpan={4} className="py-3 px-4 text-right">
                      Total Payable Amount:
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#ED2025]">
                      NZ${activeQuote.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Notes & Procurement Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Quote Notes</span>
                <p className="text-slate-600 leading-relaxed">{activeQuote.notes}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Procurement Terms</span>
                <p className="text-slate-600 leading-relaxed">{activeQuote.procurementTerms}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            No customer quote has been created yet. Click &quot;Create Customer Quote&quot; to build
            and send one.
          </div>
        )}
      </div>

      {/* Quote History (Section 15) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          Quote History & Versions
        </h3>

        {(request.customerQuoteVersions || []).length === 0 ? (
          <p className="text-xs text-slate-400 italic">No previous versions.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase">
                  <th className="py-2">Version</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Created By</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(request.customerQuoteVersions || []).map((v) => (
                  <tr key={v.version} className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold text-slate-900">Quote v{v.version}</td>
                    <td className="py-2.5 text-slate-500">{v.date}</td>
                    <td className="py-2.5 text-slate-600">{v.createdBy}</td>
                    <td className="py-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          v.status === "Accepted"
                            ? "bg-emerald-50 text-emerald-700"
                            : v.status === "Sent"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                      NZ${v.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: Create / Revise Quote */}
      {showBuilderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {activeQuote ? "Revise Customer Quote" : "Create Customer Quote"}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter the sell price and single manual freight value for {request.customerName}.
            </p>

            <form onSubmit={handleSendQuote} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Part Sell Price (NZD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(Number(e.target.value))}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Base cost: NZ${baseCost.toFixed(2)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Manual Freight (NZD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={manualFreight}
                    onChange={(e) => setManualFreight(Number(e.target.value))}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    MVP single freight value
                  </span>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estimated Transit Time (Business Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={estimatedTransitDays}
                    onChange={(e) => setEstimatedTransitDays(Number(e.target.value))}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  />
                </div>
              </div>

              {/* Total calculation preview */}
              <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 block">Total Customer Quote</span>
                  <span className="font-bold text-slate-900">
                    Part: NZ${Number(sellPrice).toFixed(2)} + Freight: NZ${Number(manualFreight).toFixed(2)}
                  </span>
                </div>
                <span className="font-mono text-lg font-black text-[#ED2025]">
                  NZ${totalCustomerQuote.toFixed(2)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quote Notes (Visible to Customer)
                </label>
                <textarea
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Procurement Terms
                </label>
                <textarea
                  value={procurementTerms}
                  onChange={(e) => setProcurementTerms(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBuilderModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-[#ED2025] hover:bg-[#C8101E] text-white rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Quote to Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
