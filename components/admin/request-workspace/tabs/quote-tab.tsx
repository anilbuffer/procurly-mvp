"use client";

import React, { useState } from "react";
import {
  Package,
  Plus,
  Car,
  Plane,
  Anchor,
  Box,
  Check,
  Building2,
  ShieldCheck,
  Clock,
  Globe
} from "lucide-react";
import { PartRequest, SupplierQuotation } from "@/types/shared";
import { useUnifiedData } from "@/context/unified-data-context";

interface QuoteTabProps {
  request: PartRequest;
  onNavigateToTab?: (tab: string) => void;
}

export function QuoteTab({ request, onNavigateToTab }: QuoteTabProps) {
  const { createCustomerQuote, selectSupplierQuotation, adminSettings } = useUnifiedData();

  const supplierQuotations = request.supplierQuotations || [];
  const selectedQuote = supplierQuotations.find((q) => q.isSelected) || supplierQuotations[0];

  const basePartCost = selectedQuote
    ? parseFloat(selectedQuote.supplierCost.toString()) || 0
    : 0;

  const [targetMargin, setTargetMargin] = useState<number>(adminSettings.baseMarginPercent || 18);
  const defaultAir = selectedQuote?.airFreightCost || adminSettings.defaultAirFreight || 185.00;
  const defaultOcean = selectedQuote?.seaFreightCost || adminSettings.defaultSeaFreight || 65.00;

  const [selectedFreight, setSelectedFreight] = useState<"air" | "ocean" | "custom">(
    request.supporting?.freightPreference === "Sea Freight" ? "ocean" : "air"
  );

  const [freightCost, setFreightCost] = useState<number>(
    request.supporting?.freightPreference === "Sea Freight" ? defaultOcean : defaultAir
  );

  const [advisoryNote, setAdvisoryNote] = useState<string>("Genuine OEM specification part sourced directly from Japan authorized dealer network.");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showActionDetailsModal, setShowActionDetailsModal] = useState(false);

  const combinedCost = basePartCost + freightCost;
  const marginAmount = combinedCost * (targetMargin / 100);
  const subtotal = combinedCost + marginAmount;
  const gstAmount = subtotal * 0.15;
  const totalCustomerQuote = subtotal + gstAmount;
  const marginMultiplier = 1 + (targetMargin / 100);

  const handleIssueQuote = () => {
    if (!selectedQuote) {
      alert("Please add and select a supplier quote from the Sourcing tab before issuing a quote to the customer.");
      return;
    }
    createCustomerQuote(request.id, {
      sellPrice: basePartCost * marginMultiplier,
      airFreightCost: selectedFreight === "air" ? defaultAir * marginMultiplier : selectedFreight === "custom" ? freightCost * marginMultiplier : 0,
      seaFreightCost: selectedFreight === "ocean" ? defaultOcean * marginMultiplier : 0,
      notes: advisoryNote,
      terms: "Standard terms apply.",
      estimatedTransitDays: selectedFreight === "air" ? 10 : selectedFreight === "ocean" ? 40 : 10,
    });
    setShowSuccessModal(true);
    
    // Show Action Details Modal instead of alert
    setTimeout(() => {
      setShowActionDetailsModal(true);
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      {/* LEFT COLUMN: Vehicle, Part, Account Info */}
      <div className="lg:col-span-1 space-y-6">

        {/* VEHICLE SPECIFICATIONS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]">
          <h3 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2 mb-5 tracking-wider">
            <Car className="w-4 h-4 text-slate-400" />
            VEHICLE SPECIFICATIONS
          </h3>
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Make</span>
              <span className="font-bold text-slate-900">{request.vehicle.make}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Model</span>
              <span className="font-bold text-slate-900">{request.vehicle.model}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Model Year</span>
              <span className="font-bold text-slate-900">{request.vehicle.year}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">VIN / Chassis Number (Mandatory)</span>
              <span className="font-bold text-slate-900 font-mono tracking-wide">{request.vehicle.vin}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">NZ Registration Plate (Optional)</span>
              <span className="font-bold text-slate-900">{request.vehicle.registration || "N/A"}</span>
            </div>
            {request.vehicle.engine && (
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Engine Code / Displacement</span>
                <span className="font-bold text-slate-900">{request.vehicle.engine}</span>
              </div>
            )}
            {request.vehicle.transmission && (
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Transmission</span>
                <span className="font-bold text-slate-900">{request.vehicle.transmission}</span>
              </div>
            )}
            {request.vehicle.driveConfig && (
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Drive Configuration</span>
                <span className="font-bold text-slate-900">{request.vehicle.driveConfig}</span>
              </div>
            )}
          </div>
        </div>

        {/* PART DETAILS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]">
          <h3 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2 mb-5 tracking-wider">
            <Package className="w-4 h-4 text-slate-400" />
            PART DETAILS
          </h3>

          <div className="mb-5">
            <div className="text-[11px] text-slate-500 mb-1">Part Name</div>
            <div className="font-bold text-slate-900 text-[15px] leading-tight">{request.part.name}</div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-slate-500">OEM Part Number:</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded font-mono">{request.part.partNumber || "To be sourced by Autohub"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-slate-500">Condition Requirement:</span>
              <span className="font-bold text-slate-900">{request.part.condition}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-slate-500">Preference:</span>
              <span className="font-bold text-slate-900">{request.part.preference}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-slate-500">Freight Preference:</span>
              <span className="font-bold text-[#ED2025] bg-red-50 px-2 py-0.5 rounded border border-red-100">
                {request.supporting?.freightPreference === "Sea Freight" ? "Ocean Freight" : (request.supporting?.freightPreference || "Not Specified")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Quantity:</span>
              <span className="font-bold text-slate-900">{request.part.quantity || 1} unit(s)</span>
            </div>
          </div>

          <div className="mt-5 bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="text-[13px] font-bold text-slate-700 mb-1">Customer Workshop Notes:</div>
            <div className="text-xs text-slate-600 leading-relaxed">{request.supporting?.notes || "No additional notes provided."}</div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Quotation & Admin Tools */}
      <div className="lg:col-span-2 space-y-6">

        {/* AUDIT TRAIL: SHOWN IF ACCEPTED */}
        {request.quoteAcceptance && (
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-emerald-900 uppercase flex items-center gap-2 mb-4 tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Customer Acceptance Audit Trail
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-emerald-700/80 block text-[10px] font-bold uppercase mb-1">Accepted By</span>
                <span className="font-bold text-emerald-950">{request.quoteAcceptance.acceptedBy}</span>
                <span className="block text-[10px] text-emerald-700">{request.quoteAcceptance.userRole}</span>
              </div>
              <div>
                <span className="text-emerald-700/80 block text-[10px] font-bold uppercase mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Timestamp</span>
                <span className="font-bold text-emerald-950">{request.quoteAcceptance.acceptedAt}</span>
              </div>
              <div>
                <span className="text-emerald-700/80 block text-[10px] font-bold uppercase mb-1 flex items-center gap-1"><Globe className="w-3 h-3"/> IP Address</span>
                <span className="font-bold text-emerald-950 font-mono">{request.quoteAcceptance.ipAddress || "Not Recorded"}</span>
              </div>
              <div>
                <span className="text-emerald-700/80 block text-[10px] font-bold uppercase mb-1">Terms & Conditions</span>
                <span className="font-bold text-emerald-950">
                  {request.quoteAcceptance.termsAccepted ? "Explicitly Accepted" : "Not Recorded"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SUPPLIER QUOTES RECORDED (Admin Context) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2 tracking-wider">
              <Box className="w-4 h-4 text-slate-400" />
              SUPPLIER QUOTES RECORDED ({supplierQuotations.length})
            </h3>
            <button
              onClick={() => onNavigateToTab?.('sourcing')}
              className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Add Quote
            </button>
          </div>
          <div className="space-y-3">
            {supplierQuotations.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No quotes available. Add from sourcing tab.</p>
            ) : (
              supplierQuotations.map(quote => {
                const isSelected = quote.id === selectedQuote?.id;
                const numericCost = parseFloat(quote.supplierCost.toString()) || 0;
                const totalCost = numericCost + (quote.airFreightCost || quote.supplierFreight);
                const jpyEstimate = (numericCost * 80).toLocaleString();

                return (
                  <div
                    key={quote.id}
                    onClick={() => selectSupplierQuotation(request.id, quote.id)}
                    className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${isSelected
                      ? "border-blue-600 ring-1 ring-blue-600 bg-blue-50/10 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-sm">{quote.supplierName}</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 font-medium">
                          {quote.supplierCountry || "Japan"}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-full">
                            SELECTED
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`font-bold text-[15px] font-mono ${isSelected ? "text-blue-700" : "text-slate-900"}`}>
                          ${totalCost.toFixed(2)} NZD
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${quote.condition === 'Genuine' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                        {quote.condition}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${quote.availability === 'In Stock' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {quote.availability}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Cost: JPY {jpyEstimate} (Est.) • Freight (Air): ${(quote.airFreightCost || quote.supplierFreight).toFixed(2)} NZD • Lead Time: {quote.leadTimeDays} days
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* The Beautiful Landed Cost Schedule */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)] relative overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-start mb-5 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md uppercase tracking-widest">
                  FORMAL QUOTATION
                </span>
                <span className="text-xs text-slate-400 font-mono">QTE-2026-00138</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Total Landed Cost Schedule (NZD)</h2>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400 uppercase tracking-widest mb-1">Valid Until</div>
              <div className="font-bold text-slate-800 text-sm">7 Sept 2026</div>
            </div>
          </div>

          {/* Admin Controls (Manual Input) */}
          <div className="bg-slate-50 rounded-xl p-5 mb-8 border border-slate-100 grid grid-cols-1 gap-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase block">Target Margin</label>
              <div className="relative">
                <input
                  type="number"
                  min="0" max="100"
                  value={targetMargin}
                  onChange={e => setTargetMargin(Number(e.target.value))}
                  className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-lg p-2.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 shadow-sm transition-all"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-slate-400 font-bold">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Freight Selection */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-widest">SELECT YOUR FREIGHT TRANSIT OPTION:</div>
              {request.supporting?.freightPreference && (
                <div className="text-[11px] font-bold text-[#ED2025] bg-red-50 px-2 py-1 rounded border border-red-100">
                  Customer Preference: {request.supporting.freightPreference === "Sea Freight" ? "Ocean Freight" : request.supporting.freightPreference}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Air Freight */}
              <div
                onClick={() => {
                  setSelectedFreight('air');
                  setFreightCost(defaultAir);
                }}
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${selectedFreight === 'air' ? 'border-blue-700 bg-blue-50/30 shadow-md' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-xl ${selectedFreight === 'air' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                    <Plane className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-[15px] text-slate-900">Air Express</div>
                </div>
                <div className="flex justify-between items-center text-xs font-medium ml-1">
                  <span className="text-slate-600">Transit: 7 - 10 business days</span>
                  <span className="font-bold text-blue-800 tracking-wide">+${defaultAir.toFixed(2)} NZD</span>
                </div>
                {/* Radio Circle */}
                <div className={`absolute top-5 right-5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedFreight === 'air' ? 'border-blue-700' : 'border-slate-300'}`}>
                  {selectedFreight === 'air' && <div className="w-2.5 h-2.5 bg-blue-700 rounded-full" />}
                </div>
              </div>

              {/* Ocean Freight */}
              <div
                onClick={() => {
                  setSelectedFreight('ocean');
                  setFreightCost(defaultOcean);
                }}
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${selectedFreight === 'ocean' ? 'border-blue-700 bg-blue-50/30 shadow-md' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-xl ${selectedFreight === 'ocean' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                    <Anchor className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-[15px] text-slate-900">Ocean Freight</div>
                </div>
                <div className="flex justify-between items-center text-xs font-medium ml-1">
                  <span className="text-slate-600">Transit: 25 - 40 business days</span>
                  <span className="font-bold text-blue-800 tracking-wide">+${defaultOcean.toFixed(2)} NZD</span>
                </div>
                {/* Radio Circle */}
                <div className={`absolute top-5 right-5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedFreight === 'ocean' ? 'border-blue-700' : 'border-slate-300'}`}>
                  {selectedFreight === 'ocean' && <div className="w-2.5 h-2.5 bg-blue-700 rounded-full" />}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown Table */}
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border-2 border-slate-200">
            <div className="space-y-3.5 text-[13px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Part Cost & Supplier Acquisition:</span>
                <span className="font-bold text-slate-900">{selectedQuote && isNaN(parseFloat(selectedQuote.supplierCost.toString())) ? selectedQuote.supplierCost : `$${basePartCost.toFixed(2)} NZD`}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Selected International Freight ({selectedFreight === 'air' ? 'Air' : selectedFreight === 'ocean' ? 'Ocean' : 'Custom'}):</span>
                <span className="font-bold text-slate-900">${freightCost.toFixed(2)} NZD</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-200/80 mt-1">
                <span className="text-slate-600 font-medium">Combined Cost:</span>
                <span className="font-bold text-slate-900">${combinedCost.toFixed(2)} NZD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Margin Applied ({targetMargin}%):</span>
                <span className="font-bold text-slate-900">${marginAmount.toFixed(2)} NZD</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-200/80 mt-1">
                <span className="text-slate-600 font-medium">Subtotal:</span>
                <span className="font-bold text-slate-900">${subtotal.toFixed(2)} NZD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">New Zealand GST (15%):</span>
                <span className="font-bold text-slate-900">${gstAmount.toFixed(2)} NZD</span>
              </div>
              <div className="flex justify-between items-center pt-5 mt-2 border-t-2 border-slate-200">
                <span className="font-bold text-slate-900 text-base">Total Landed Price (Door-to-Door):</span>
                <span className="font-bold text-blue-700 text-base tracking-tight">${totalCustomerQuote.toFixed(2)} NZD</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex w-100 sm:flex-row items-center gap-3">
            <button
              onClick={handleIssueQuote}
              disabled={!selectedQuote}
              className={`w-full sm:w-full font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md text-sm ${
                !selectedQuote
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-300'
                  : 'bg-[#E61932] hover:bg-[#CC162C] text-white shadow-red-500/20'
              }`}
            >
              <Check className="w-4 h-4" />
              {selectedQuote ? "Issue Quote to Customer" : "Add a Supplier Quote First"}
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 text-center">
            <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Quote Issued Successfully!</h3>
            <p className="text-sm text-slate-500 mb-6">
              The formal quotation has been sent to the customer for review.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-sm"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ACTION DETAILS MODAL */}
      {showActionDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-xl">📧</span> Action Details: Email Notification
                </h3>
                <p className="text-xs text-slate-500 mt-1">A simulated notification sent to the customer.</p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">To</span>
                <div className="font-medium text-sm text-slate-900">{request.customerName} (Customer)</div>
              </div>
              
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subject</span>
                <div className="font-bold text-sm text-slate-900">Updated Quote Available</div>
              </div>
              
              <div className="border-t border-slate-200 pt-4">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Message Body</span>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  An updated quotation for your requested part ({request.part.name}) is now available for review and approval in your portal.
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowActionDetailsModal(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
