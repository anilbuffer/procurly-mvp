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
  Globe,
  MessageSquare,
  Mail,
  Sparkles,
  Send,
  Edit3,
  ImagePlus,
  X,
  Camera
} from "lucide-react";
import { PartRequest, SupplierQuotation } from "@/types/shared";
import { useUnifiedData } from "@/context/unified-data-context";
import { DEFAULT_PART_IMAGE, handleImageError } from "@/lib/default-images";

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

  const [targetMargin, setTargetMargin] = useState<string | number>("");
  const defaultAir = selectedQuote?.airFreightCost || adminSettings.defaultAirFreight || 185.00;
  const defaultOcean = selectedQuote?.seaFreightCost || adminSettings.defaultSeaFreight || 65.00;

  const [selectedFreight, setSelectedFreight] = useState<"air" | "ocean" | "custom">(
    request.supporting?.freightPreference === "Sea Freight" ? "ocean" : "air"
  );

  const [freightCost, setFreightCost] = useState<number>(
    request.supporting?.freightPreference === "Sea Freight" ? defaultOcean : defaultAir
  );

  const [advisoryNote, setAdvisoryNote] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showActionDetailsModal, setShowActionDetailsModal] = useState(false);
  const [isEmailPreviewOnly, setIsEmailPreviewOnly] = useState(false);
  const [isEditingNoteInEmail, setIsEditingNoteInEmail] = useState(false);
  const [quotePhotos, setQuotePhotos] = useState<string[]>([]);
  const [isDraggingPhotos, setIsDraggingPhotos] = useState(false);
  const [photoLightbox, setPhotoLightbox] = useState<string | null>(null);

  const numericMargin = targetMargin === "" ? 0 : parseFloat(targetMargin.toString()) || 0;
  const combinedCost = basePartCost + freightCost;
  const marginAmount = combinedCost * (numericMargin / 100);
  const subtotal = combinedCost + marginAmount;
  const gstAmount = subtotal * 0.15;
  const totalCustomerQuote = subtotal + gstAmount;
  const marginMultiplier = 1 + (numericMargin / 100);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        if (dataUrl) {
          setQuotePhotos((prev) => [...prev, dataUrl]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handlePhotoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingPhotos(false);
    const files = e.dataTransfer.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        if (dataUrl) {
          setQuotePhotos((prev) => [...prev, dataUrl]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setQuotePhotos((prev) => prev.filter((_, i) => i !== index));
  };

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
      quotePhotos: quotePhotos.length > 0 ? quotePhotos : undefined,
    });
    setIsEmailPreviewOnly(false);
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
              <span className="font-bold text-slate-900  tracking-wide">{request.vehicle.vin}</span>
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
              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded ">{request.part.partNumber || "To be sourced by Autohub"}</span>
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
              <span className="font-bold text-[#FE0000] bg-red-50 px-2 py-0.5 rounded border border-red-100">
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
          <div className="bg-[#f0f4f9] rounded-2xl border border-blue-200/80 p-6 shadow-xs">
            <h3 className="text-xs font-bold text-[#1e3a8a] uppercase flex items-center gap-2 mb-4 tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#2B4499]" />
              Customer Acceptance Audit Trail
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase mb-1">Accepted By</span>
                <span className="font-bold text-[#0f172a]">{request.quoteAcceptance.acceptedBy}</span>
                <span className="block text-[10px] text-[#2B4499] font-medium">{request.quoteAcceptance.userRole}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#2B4499]" /> Timestamp
                </span>
                <span className="font-bold text-[#0f172a]">{request.quoteAcceptance.acceptedAt}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-[#2B4499]" /> IP Address
                </span>
                <span className="font-bold text-[#0f172a] ">{request.quoteAcceptance.ipAddress || "Not Recorded"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase mb-1">Terms &amp; Conditions</span>
                <span className="font-bold text-[#0f172a]">
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
              className="text-[#FE0000] hover:text-[#9B0A0F] text-xs font-bold flex items-center gap-1 hover:underline"
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
                      ? "border-[#FE0000] ring-1 ring-[#FE0000] bg-red-50/10 shadow-sm"
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
                          <span className="text-[10px] text-[#FE0000] font-bold bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                            SELECTED
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`font-bold text-[15px]  ${isSelected ? "text-[#FE0000]" : "text-slate-900"}`}>
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
                <span className="text-[10px] font-bold text-[#FE0000] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-md uppercase tracking-widest">
                  FORMAL QUOTATION
                </span>
                <span className="text-xs text-slate-400 ">QTE-2026-00138</span>
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
                  min="0"
                  max="100"
                  value={targetMargin}
                  onChange={e => setTargetMargin(e.target.value)}
                  className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-lg p-2.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#FE0000]/30 focus:border-[#FE0000] shadow-sm transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                <div className="text-[11px] font-bold text-[#FE0000] bg-red-50 px-2 py-1 rounded border border-red-100">
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
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${selectedFreight === 'air' ? 'border-[#FE0000] bg-red-50/20 shadow-md' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-xl ${selectedFreight === 'air' ? 'bg-red-50 text-[#FE0000]' : 'bg-slate-100 text-slate-500'}`}>
                    <Plane className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-[15px] text-slate-900">Air Express</div>
                </div>
                <div className="flex justify-between items-center text-xs font-medium ml-1">
                  <span className="text-slate-600">Transit: 7 - 10 business days</span>
                  <span className="font-bold text-slate-900 tracking-wide">+${defaultAir.toFixed(2)} NZD</span>
                </div>
                {/* Radio Circle */}
                <div className={`absolute top-5 right-5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedFreight === 'air' ? 'border-[#FE0000]' : 'border-slate-300'}`}>
                  {selectedFreight === 'air' && <div className="w-2.5 h-2.5 bg-[#FE0000] rounded-full" />}
                </div>
              </div>

              {/* Ocean Freight */}
              <div
                onClick={() => {
                  setSelectedFreight('ocean');
                  setFreightCost(defaultOcean);
                }}
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${selectedFreight === 'ocean' ? 'border-[#FE0000] bg-red-50/20 shadow-md' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-xl ${selectedFreight === 'ocean' ? 'bg-red-50 text-[#FE0000]' : 'bg-slate-100 text-slate-500'}`}>
                    <Anchor className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-[15px] text-slate-900">Ocean Freight</div>
                </div>
                <div className="flex justify-between items-center text-xs font-medium ml-1">
                  <span className="text-slate-600">Transit: 25 - 40 business days</span>
                  <span className="font-bold text-slate-900 tracking-wide">+${defaultOcean.toFixed(2)} NZD</span>
                </div>
                {/* Radio Circle */}
                <div className={`absolute top-5 right-5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedFreight === 'ocean' ? 'border-[#FE0000]' : 'border-slate-300'}`}>
                  {selectedFreight === 'ocean' && <div className="w-2.5 h-2.5 bg-[#FE0000] rounded-full" />}
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
                <span className="text-slate-600 font-medium">Margin Applied ({numericMargin}%):</span>
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
                <span className="font-bold text-[#FE0000] text-base tracking-tight">${totalCustomerQuote.toFixed(2)} NZD</span>
              </div>
            </div>
          </div>

          {/* Admin Comments / Notes for Customer (Editable before Quote Issuance) */}
          <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#FE0000]" />
                Admin Comments &amp; Notes for Customer
              </label>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              This note will be prominently highlighted in the customer&apos;s email notification and displayed on their portal quote before acceptance.
            </p>
            <textarea
              rows={3}
              value={advisoryNote}
              onChange={(e) => setAdvisoryNote(e.target.value)}
              placeholder="e.g. Genuine OEM Japan direct stock. Includes 12-month Autohub warranty. Inspected before dispatch..."
              className="w-full text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FE0000]/30 focus:border-[#FE0000] shadow-sm transition-all resize-y"
            />
          </div>

          {/* QUOTE PHOTOS UPLOAD */}
          <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#FE0000]" />
                Part Photos for Customer Quote
              </label>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Upload photos of the part to include in the customer&apos;s quote. These will be shown on their portal and email notification.
            </p>

            {/* Drag-and-Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDraggingPhotos(true); }}
              onDragLeave={() => setIsDraggingPhotos(false)}
              onDrop={handlePhotoDrop}
              className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all duration-200 cursor-pointer ${isDraggingPhotos
                ? 'border-[#FE0000] bg-red-50/40 scale-[1.01]'
                : 'border-slate-300 hover:border-red-300 bg-white hover:bg-slate-100/50'
                }`}
              onClick={() => document.getElementById('quote-photo-input')?.click()}
            >
              <input
                id="quote-photo-input"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDraggingPhotos ? 'bg-red-50 text-[#FE0000]' : 'bg-slate-100 text-slate-400'
                  }`}>
                  <ImagePlus className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">
                    {isDraggingPhotos ? 'Drop photos here' : 'Click or drag photos here'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP • Max 10MB per file</p>
                </div>
              </div>
            </div>

            {/* Photo Preview Grid */}
            {quotePhotos.length > 0 && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {quotePhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-square bg-slate-100 cursor-pointer"
                    onClick={() => setPhotoLightbox(photo)}
                  >
                    <img
                      src={photo}
                      alt={`Quote photo ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removePhoto(idx); }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
                      title="Remove photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {idx + 1} of {quotePhotos.length}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">

            <button
              onClick={handleIssueQuote}
              disabled={!selectedQuote}
              className={`w-full sm:flex-1 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md text-sm ${!selectedQuote
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-300'
                : 'bg-[#FE0000] hover:bg-[#CC162C] text-white shadow-red-500/20'
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
              The formal quotation and email notification have been sent to the customer for review.
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

      {/* ACTION DETAILS / CUSTOMER EMAIL NOTIFICATION MODAL */}
      {showActionDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📧</span>
                  <h3 className="text-base font-bold text-slate-900">
                    {isEmailPreviewOnly ? "Customer Email Preview: Formal Landed Quotation" : "Customer Email Notification Dispatched"}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isEmailPreviewOnly
                    ? "Verify the outbound quotation email and admin comments before sending."
                    : "Automated quotation dispatch logged via Autohub Outbound Notification Service."}
                </p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${isEmailPreviewOnly ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                }`}>
                {isEmailPreviewOnly ? "Preview Mode" : "Sent & Logged"}
              </span>
            </div>

            {/* Email Container */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex-1 overflow-y-auto">
              {/* Email Envelope Metadata */}
              <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 text-xs space-y-1.5 ">
                <div className="flex">
                  <span className="w-16 font-bold text-slate-500">From:</span>
                  <span className="text-slate-800 font-medium">Procurely Trade Operations &lt;notifications@procurly.co.nz&gt;</span>
                </div>
                <div className="flex">
                  <span className="w-16 font-bold text-slate-500">To:</span>
                  <span className="text-slate-800 font-medium">
                    {request.customerName} &lt;{request.customerEmail || `${request.contactName ? request.contactName.toLowerCase().replace(/\s+/g, ".") : "workshop"}@trade.co.nz`}&gt;
                  </span>
                </div>
                <div className="flex">
                  <span className="w-16 font-bold text-slate-500">Subject:</span>
                  <span className="text-slate-900 font-bold">
                    Official Quotation Ready: {request.requestNumber} – {request.vehicle.year} {request.vehicle.make} {request.vehicle.model} ({request.part.name})
                  </span>
                </div>
              </div>

              {/* Rendered HTML Email Content */}
              <div className="p-5 bg-white space-y-4 text-xs text-slate-700">
                {/* Email Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black italic text-[#FE0000] text-sm tracking-tight">PROCUR<span className="not-italic text-slate-900">LY</span></span>
                    <span className="text-[10px] text-slate-400 ml-1">|</span>
                    <span className="text-[10px] text-slate-500 font-medium">Automotive B2B Procurement</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#FE0000] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    FORMAL QUOTE
                  </span>
                </div>

                {/* Salutation */}
                <p className="text-sm font-medium text-slate-900">
                  Kia ora {request.contactName || request.customerName},
                </p>
                <p className="leading-relaxed">
                  Great news! Our procurement specialists have sourced your requested part and prepared an official landed quotation delivered direct to your workshop.
                </p>

                {/* Part & Vehicle Specifications Summary */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500 font-medium">Requested Part:</span>
                    <span className="font-bold text-slate-900">{request.part.name} ({request.part.quantity || 1} Unit)</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500 font-medium">Vehicle:</span>
                    <span className="font-bold text-slate-800">{request.vehicle.year} {request.vehicle.make} {request.vehicle.model}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500 font-medium">VIN / Chassis:</span>
                    <span className=" text-slate-700 font-semibold">{request.vehicle.vin}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500 font-medium">Selected Freight:</span>
                    <span className="font-bold text-slate-800">{selectedFreight === "air" ? "Air Express (7-10 days)" : "Ocean Freight (25-40 days)"}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 text-sm font-bold">
                    <span className="text-slate-900">Total Landed Price (Door-to-Door):</span>
                    <span className="font-bold text-[#FE0000]  text-base">${totalCustomerQuote.toFixed(2)} NZD</span>
                  </div>
                  <div className="text-[10px] text-slate-500 text-right">Includes 15% NZ GST</div>
                </div>

                {/* ⭐ ADMIN COMMENTS IN EMAIL NOTIFICATION ⭐ */}
                <div className="bg-amber-50/70 border border-amber-300/80 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                      <span>Specialist Note from Procurely Admin</span>
                    </div>
                    {isEmailPreviewOnly && (
                      <button
                        type="button"
                        onClick={() => setIsEditingNoteInEmail(!isEditingNoteInEmail)}
                        className="text-[10px] text-amber-800 hover:text-amber-950 font-bold underline flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        {isEditingNoteInEmail ? "Done Editing" : "Edit Note"}
                      </button>
                    )}
                  </div>

                  {isEditingNoteInEmail ? (
                    <textarea
                      rows={3}
                      value={advisoryNote}
                      onChange={(e) => setAdvisoryNote(e.target.value)}
                      placeholder="Add custom admin note to be sent in email..."
                      className="w-full text-xs font-medium text-slate-900 bg-white border border-amber-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                    />
                  ) : (
                    <p className="text-xs text-amber-950 font-medium whitespace-pre-wrap leading-relaxed bg-white/70 p-2.5 rounded-lg border border-amber-200/50">
                      {advisoryNote || <span className="italic text-slate-400">No additional comment added.</span>}
                    </p>
                  )}
                  <p className="text-[10px] text-amber-800/80">
                    This note is delivered directly to the customer in their email notification and shown on their quotation sheet.
                  </p>
                </div>

                {/* ⭐ QUOTE PHOTOS IN EMAIL ⭐ */}
                {quotePhotos.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-[#FE0000]" />
                      <span>Part Photos ({quotePhotos.length})</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {quotePhotos.map((photo, idx) => (
                        <div key={idx} className="rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-50">
                          <img
                            src={photo}
                            alt={`Part photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Email Call To Action Button */}
                <div className="pt-2 text-center">
                  <div className="inline-block bg-[#FE0000] text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-sm">
                    Review &amp; Approve Quote in Customer Portal →
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">
                    Valid for 7 business days from date of issue.
                  </p>
                </div>

                {/* Email Footer */}
                <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400 space-y-1">
                  <p>Procurely / AutoHub New Zealand • 120 Quay Street, Auckland 1010</p>
                  <p>Support: support@procurly.co.nz • +64 9 303 3338</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-4 flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  setShowActionDetailsModal(false);
                  setIsEditingNoteInEmail(false);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-5 rounded-xl transition-colors text-xs"
              >
                {isEmailPreviewOnly ? "Close Preview" : "Close"}
              </button>

              {isEmailPreviewOnly && (
                <button
                  onClick={() => {
                    setShowActionDetailsModal(false);
                    setIsEditingNoteInEmail(false);
                    handleIssueQuote();
                  }}
                  disabled={!selectedQuote}
                  className="bg-[#FE0000] hover:bg-[#CC162C] text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm &amp; Issue Quote Now</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* PHOTO LIGHTBOX */}
      {photoLightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setPhotoLightbox(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] animate-in zoom-in-95">
            <img
              src={photoLightbox || DEFAULT_PART_IMAGE}
              alt="Part photo preview"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onError={handleImageError}
            />
            <button
              type="button"
              onClick={() => setPhotoLightbox(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
