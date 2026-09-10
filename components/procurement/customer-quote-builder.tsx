"use client";

import React, { useState, useEffect } from "react";
import { Send, Save } from "lucide-react";
import { ProcurementRequest, CustomerQuoteVersion, CostCalculation } from "@/types/procurement";

interface CustomerQuoteBuilderProps {
  request: ProcurementRequest;
  onSendQuote: (version: CustomerQuoteVersion) => void;
  onUpdateCost: (calc: CostCalculation) => void;
}

export function CustomerQuoteBuilder({
  request,
  onSendQuote,
  onUpdateCost,
}: CustomerQuoteBuilderProps) {
  const selectedQuote = request.supplierQuotations.find(
    (q) => q.id === request.selectedQuotationId
  );

  const [marginPercent, setMarginPercent] = useState(
    request.costCalculation?.autohubMarginPercent || 25
  );
  const [customerFreight, setCustomerFreight] = useState(
    request.costCalculation?.customerFreight || 85
  );
  const [transitDays, setTransitDays] = useState(selectedQuote?.leadTimeDays || 7);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState(
    "Standard Autohub Trade Terms. Valid for 5 business days."
  );

  // Calculate costs
  const supplierCost = selectedQuote?.supplierCost || 0;
  const supplierFreight = selectedQuote?.supplierFreight || 0;
  const marginAmount = Math.round(supplierCost * (marginPercent / 100));
  const sellPrice = supplierCost + marginAmount;
  const totalQuote = sellPrice + customerFreight;

  useEffect(() => {
    if (selectedQuote) {
      const calc: CostCalculation = {
        supplierCost,
        supplierFreight,
        autohubMarginPercent: marginPercent,
        autohubMarginAmount: marginAmount,
        customerSellPrice: sellPrice,
        customerFreight,
        totalCustomerQuote: totalQuote,
      };
      onUpdateCost(calc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marginPercent, customerFreight, selectedQuote]);

  const handleSendQuote = () => {
    const nextVersion = request.customerQuoteVersions.length + 1;
    const version: CustomerQuoteVersion = {
      version: nextVersion,
      sellPrice,
      freight: customerFreight,
      totalAmount: totalQuote,
      estimatedTransitDays: transitDays,
      notes,
      terms,
      sentAt: new Date().toLocaleString("en-NZ", { dateStyle: "medium", timeStyle: "short" }),
      status: "Sent",
    };
    onSendQuote(version);
  };

  if (!selectedQuote) {
    return (
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-center">
        <p className="text-xs text-slate-500 font-medium">
          Select a supplier quotation above to build the customer quote.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Cost Calculation */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Cost & Margin Calculation
        </h4>

        <div className="space-y-3">
          {/* Supplier Cost (read-only) */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Supplier Cost</span>
            <span className="font-mono font-bold text-slate-900">
              NZ${supplierCost.toLocaleString()}
            </span>
          </div>

          {/* Supplier Freight (read-only) */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Supplier Freight</span>
            <span className="font-mono text-slate-700">
              NZ${supplierFreight.toLocaleString()}
            </span>
          </div>

          <div className="border-t border-slate-200" />

          {/* Margin */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Autohub Margin</span>
              <input
                type="number"
                min="0"
                max="100"
                value={marginPercent}
                onChange={(e) => setMarginPercent(parseInt(e.target.value) || 0)}
                className="w-16 px-2 py-1 text-xs font-mono font-bold bg-white border border-slate-200 rounded text-center focus:outline-none focus:ring-1 focus:ring-[#ED2025]/30"
              />
              <span className="text-slate-400">%</span>
            </div>
            <span className="font-mono font-bold text-emerald-600">
              +NZ${marginAmount.toLocaleString()}
            </span>
          </div>

          <div className="border-t border-slate-200" />

          {/* Customer Sell Price */}
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700">Part Sell Price</span>
            <span className="font-mono text-slate-900">
              NZ${sellPrice.toLocaleString()}
            </span>
          </div>

          {/* Customer Freight (Manual Entry) */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-slate-700 font-semibold">Freight (Manual Entry)</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium">Single Flat Value</span>
              </div>
              <span className="text-[10px] text-slate-400">Manual staff entry &bull; No comparison engine</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400 font-mono">NZ$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={customerFreight}
                onChange={(e) => setCustomerFreight(parseFloat(e.target.value) || 0)}
                className="w-24 px-2 py-1 text-xs font-mono font-bold bg-white border border-slate-200 rounded text-right focus:outline-none focus:ring-1 focus:ring-[#ED2025]/30"
              />
            </div>
          </div>

          <div className="border-t-2 border-slate-300" />

          {/* Total */}
          <div className="flex items-center justify-between text-sm font-black">
            <span className="text-slate-900">Total Customer Quote</span>
            <span className="font-mono text-[#ED2025]">
              NZ${totalQuote.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Quote Details */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Estimated Transit Time
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={transitDays}
              onChange={(e) => setTransitDays(parseInt(e.target.value) || 1)}
              className="w-20 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED2025]/20"
            />
            <span className="text-xs text-slate-500">business days</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Quote Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Notes visible to the customer..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED2025]/20 resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Procurement Terms
          </label>
          <textarea
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED2025]/20 resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSendQuote}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition-all active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Quote to Customer</span>
        </button>
      </div>
    </div>
  );
}
