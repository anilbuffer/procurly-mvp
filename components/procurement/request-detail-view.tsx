"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Car,
  Wrench,
  User,
  MapPin,
  FileText,
  Plus,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Send,
  Clock,
  ShieldAlert,
  DollarSign,
  Check,
  RotateCw,
  Copy,
  ExternalLink,
  MessageSquare,
  Lock,
  ChevronRight,
  Package,
} from "lucide-react";
import { useProcurement } from "@/context/procurement-context";
import { StatusBadge } from "./status-badge";
import { PaymentStatusBadge } from "./payment-status-badge";
import { SupplierQuoteTable } from "./supplier-quote-table";
import { SupplierQuoteModal } from "./supplier-quote-modal";
import { CustomerQuoteBuilder } from "./customer-quote-builder";
import { QuoteRevisionPanel } from "./quote-revision-panel";
import { ConfirmationModal } from "./confirmation-modal";
import {
  SupplierQuotation,
  CustomerQuoteVersion,
  CostCalculation,
  SupplierOrder,
  ProcurementNote,
  CustomerResponse,
} from "@/types/procurement";
import { RequestStatus } from "@/types/portal";
import { PROCUREMENT_STAFF } from "@/lib/mock-procurement-data";

export function RequestDetailView() {
  const {
    selectedRequest,
    backToList,
    suppliers,
    assignStaff,
    updateRequestStatus,
    addSupplierQuotation,
    editSupplierQuotation,
    deleteSupplierQuotation,
    selectSupplierQuotation,
    updateCostCalculation,
    sendCustomerQuote,
    reviseQuote,
    handleCustomerResponse,
    placeSupplierOrder,
    markPaymentPaid,
    markPaymentUnpaid,
    addInternalNote,
  } = useProcurement();

  // Modals state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<SupplierQuotation | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isConfirmSendOpen, setIsConfirmSendOpen] = useState(false);
  const [pendingQuoteVersion, setPendingQuoteVersion] = useState<CustomerQuoteVersion | null>(null);

  // Supplier Order Form state
  const [orderSupplierName, setOrderSupplierName] = useState("");
  const [orderSupplierRef, setOrderSupplierRef] = useState("");
  const [orderCost, setOrderCost] = useState<number>(0);
  const [orderNotes, setOrderNotes] = useState("");

  // Internal Note form state
  const [newNoteText, setNewNoteText] = useState("");
  const [noteAuthor, setNoteAuthor] = useState("Sarah Jenkins");

  // Copy feedback
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!selectedRequest) return null;

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleOpenAddQuote = () => {
    setEditingQuote(null);
    setIsQuoteModalOpen(true);
  };

  const handleOpenEditQuote = (quote: SupplierQuotation) => {
    setEditingQuote(quote);
    setIsQuoteModalOpen(true);
  };

  const handleSaveQuote = (quote: SupplierQuotation) => {
    if (editingQuote) {
      editSupplierQuotation(selectedRequest.id, quote.id, quote);
    } else {
      addSupplierQuotation(selectedRequest.id, quote);
    }
  };

  const handleSendQuoteClick = (version: CustomerQuoteVersion) => {
    setPendingQuoteVersion(version);
    setIsConfirmSendOpen(true);
  };

  const handleConfirmSendQuote = () => {
    if (pendingQuoteVersion) {
      if (selectedRequest.customerQuoteVersions.length > 0) {
        reviseQuote(selectedRequest.id, pendingQuoteVersion);
      } else {
        sendCustomerQuote(selectedRequest.id, pendingQuoteVersion);
      }
      setPendingQuoteVersion(null);
    }
  };

  const handleOpenOrderModal = () => {
    const selectedQuote = selectedRequest.supplierQuotations.find(
      (q) => q.id === selectedRequest.selectedQuotationId
    );
    setOrderSupplierName(selectedQuote?.supplierName || "Nagoya Auto Parts Co.");
    setOrderSupplierRef(
      selectedQuote?.supplierPartRef
        ? `PO-${selectedQuote.supplierPartRef}-${Math.floor(1000 + Math.random() * 9000)}`
        : `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`
    );
    setOrderCost(
      selectedQuote ? selectedQuote.supplierCost + selectedQuote.supplierFreight : 0
    );
    setOrderNotes("Standard procurement order. Air freight to Auckland distribution centre.");
    setIsOrderModalOpen(true);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const order: SupplierOrder = {
      id: `so-${Date.now()}`,
      supplierName: orderSupplierName,
      supplierRef: orderSupplierRef,
      orderDate: new Date().toISOString().split("T")[0],
      cost: orderCost,
      notes: orderNotes,
      documents: [`${orderSupplierRef}.pdf`],
    };
    placeSupplierOrder(selectedRequest.id, order);
    setIsOrderModalOpen(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const note: ProcurementNote = {
      id: `pn-${Date.now()}`,
      author: noteAuthor,
      text: newNoteText.trim(),
      timestamp: new Date().toLocaleString("en-NZ", {
        dateStyle: "short",
        timeStyle: "short",
      }),
    };
    addInternalNote(selectedRequest.id, note);
    setNewNoteText("");
  };

  const selectedSupplierQuote = selectedRequest.supplierQuotations.find(
    (q) => q.id === selectedRequest.selectedQuotationId
  );

  const isPaid = selectedRequest.payment?.status === "Paid";
  const canPlaceOrder =
    isPaid &&
    selectedRequest.status !== "Ordered" &&
    selectedRequest.status !== "Shipped" &&
    selectedRequest.status !== "Delivered" &&
    selectedRequest.status !== "Completed";

  return (
    <div className="space-y-6 pb-16">
      {/* ─── Top Bar Navigation & Header ───────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={backToList}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Queue</span>
          </button>

          <div className="h-4 w-px bg-slate-200" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono text-slate-900">
                {selectedRequest.requestNumber}
              </h1>
              <button
                onClick={() => handleCopy(selectedRequest.requestNumber, "req-num")}
                title="Copy Request Number"
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                {copiedField === "req-num" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Submitted on {selectedRequest.dateSubmitted} &bull; Customer:{" "}
              <span className="font-semibold text-slate-700">
                {selectedRequest.customerName}
              </span>
            </p>
          </div>
        </div>

        {/* Statuses & Staff Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <StatusBadge status={selectedRequest.status} size="md" />

          {selectedRequest.payment && (
            <PaymentStatusBadge status={selectedRequest.payment.status} />
          )}

          {/* Assigned Staff Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 text-[11px] font-medium">Staff:</span>
            <select
              value={selectedRequest.assignedStaff}
              onChange={(e) => assignStaff(selectedRequest.id, e.target.value)}
              className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer"
            >
              <option value="Unassigned">Unassigned</option>
              {PROCUREMENT_STAFF.map((staff) => (
                <option key={staff.id} value={staff.name}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Quick-Switch */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-500 text-[11px] font-medium">Status:</span>
            <select
              value={selectedRequest.status}
              onChange={(e) =>
                updateRequestStatus(selectedRequest.id, e.target.value as RequestStatus)
              }
              className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer"
            >
              <option value="Submitted">Submitted</option>
              <option value="Sourcing">Sourcing</option>
              <option value="Quoted">Quoted</option>
              <option value="Approved">Approved</option>
              <option value="Awaiting Payment">Awaiting Payment</option>
              <option value="Ordered">Ordered</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── Two-Column Desktop Layout ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ═══════════════════════════════════════════════════════
            LEFT COLUMN: Request & Fitment Context (5 cols)
            ═══════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card 1: Vehicle Information */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50/70 px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#2B4499]/10 text-[#2B4499] flex items-center justify-center">
                  <Car className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Vehicle Details
                </h2>
              </div>
              <span className="text-xs font-bold text-[#2B4499]">
                {selectedRequest.vehicle.year} {selectedRequest.vehicle.make}
              </span>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Model & Variant
                </p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">
                  {selectedRequest.vehicle.make} {selectedRequest.vehicle.model}
                  {selectedRequest.vehicle.variant ? ` — ${selectedRequest.vehicle.variant}` : ""}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Registration Plate
                  </p>
                  <p className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded inline-block mt-0.5">
                    {selectedRequest.vehicle.registration || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Chassis / VIN
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono font-bold text-slate-800 truncate">
                      {selectedRequest.vehicle.vin}
                    </span>
                    <button
                      onClick={() => handleCopy(selectedRequest.vehicle.vin, "vin")}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {copiedField === "vin" ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Engine
                  </p>
                  <p className="font-medium text-slate-700 mt-0.5">
                    {selectedRequest.vehicle.engine || "Standard"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Drive & Transmission
                  </p>
                  <p className="font-medium text-slate-700 mt-0.5">
                    {selectedRequest.vehicle.driveConfig || "4WD"} &bull;{" "}
                    {selectedRequest.vehicle.transmission || "Auto"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Part Requested */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50/70 px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#ED2025]/10 text-[#ED2025] flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Part Requested
                </h2>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Qty: {selectedRequest.part.quantity}
              </span>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Part Description
                </p>
                <p className="font-bold text-slate-900 text-sm mt-0.5 leading-snug">
                  {selectedRequest.part.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    OEM Part #
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono font-bold text-slate-900 bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200 truncate">
                      {selectedRequest.part.partNumber || "Not specified"}
                    </span>
                    {selectedRequest.part.partNumber && (
                      <button
                        onClick={() =>
                          handleCopy(selectedRequest.part.partNumber!, "part-num")
                        }
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {copiedField === "part-num" ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Preference
                  </p>
                  <p className="font-bold text-slate-800 mt-1">
                    {selectedRequest.part.preference}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Condition Requested
                </p>
                <span className="inline-block mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedRequest.part.condition}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Customer & Delivery Address */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50/70 px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Customer & Shipping
                </h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Trade Account
              </span>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Client Business
                </p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">
                  {selectedRequest.customerName}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Delivery Destination
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-slate-700 border border-slate-100 space-y-0.5">
                  <p className="font-bold text-slate-900">
                    {selectedRequest.deliveryAddress?.recipientName ||
                      selectedRequest.customerName}
                  </p>
                  <p>{selectedRequest.deliveryAddress?.streetAddress}</p>
                  <p>
                    {selectedRequest.deliveryAddress?.suburb},{" "}
                    {selectedRequest.deliveryAddress?.city}{" "}
                    {selectedRequest.deliveryAddress?.postalCode}
                  </p>
                  <p className="text-slate-500 pt-1 text-[11px]">
                    Phone: {selectedRequest.deliveryAddress?.phone || "+64 9 555 0100"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Customer Supporting Notes & Attachments */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50/70 px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Customer Notes & Fitment Photos
              </h2>
            </div>

            <div className="p-5 space-y-3 text-xs">
              {selectedRequest.supporting?.notes ? (
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-slate-700 leading-relaxed italic">
                  &ldquo;{selectedRequest.supporting.notes}&rdquo;
                </div>
              ) : (
                <p className="text-slate-400 italic">No notes provided by customer.</p>
              )}

              {selectedRequest.supporting?.photos &&
                selectedRequest.supporting.photos.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Attached Images ({selectedRequest.supporting.photos.length})
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedRequest.supporting.photos.map((photo, i) => (
                        <div
                          key={i}
                          className="relative rounded-lg overflow-hidden border border-slate-200 h-28 bg-slate-100 group"
                        >
                          <img
                            src={photo}
                            alt={`Part photo ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedRequest.supporting?.documents &&
                selectedRequest.supporting.documents.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Attached Documents
                    </p>
                    <div className="space-y-1">
                      {selectedRequest.supporting.documents.map((doc, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-slate-700"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate text-xs font-medium">{doc}</span>
                          </div>
                          <span className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer">
                            View
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            RIGHT COLUMN: Sourcing, Pricing, Orders & Notes (7 cols)
            ═══════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 space-y-6">
          {/* ─── SECTION A: Supplier Quotations Comparison ─── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50/70 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Supplier Sourcing & Quotes
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {selectedRequest.supplierQuotations.length} received
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Compare supplier offers and select the winning source
                </p>
              </div>

              <button
                onClick={handleOpenAddQuote}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2B4499] hover:bg-[#1d2e7e] text-white font-bold text-xs rounded-lg shadow-sm transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Supplier Quote</span>
              </button>
            </div>

            <div className="p-4">
              <SupplierQuoteTable
                quotations={selectedRequest.supplierQuotations}
                selectedId={selectedRequest.selectedQuotationId}
                onSelect={(id) => selectSupplierQuotation(selectedRequest.id, id)}
                onEdit={handleOpenEditQuote}
                onDelete={(id) => deleteSupplierQuotation(selectedRequest.id, id)}
              />

              {/* Highlight if quote is selected */}
              {selectedSupplierQuote && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold">
                        Selected Source: {selectedSupplierQuote.supplierName}
                      </span>{" "}
                      &bull; {selectedSupplierQuote.condition} &bull; Lead Time:{" "}
                      {selectedSupplierQuote.leadTimeDays} days
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-900 whitespace-nowrap">
                    Cost: NZ$
                    {(
                      selectedSupplierQuote.supplierCost +
                      selectedSupplierQuote.supplierFreight
                    ).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ─── SECTION B: Customer Quote Builder & Margin ─── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50/70 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Customer Quote Builder
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Apply Autohub margin and local freight to generate customer proposal
                </p>
              </div>

              {selectedRequest.quotedValue && (
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Active Quote Value
                  </span>
                  <p className="text-base font-black font-mono text-[#ED2025]">
                    NZ${selectedRequest.quotedValue.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <div className="p-5">
              <CustomerQuoteBuilder
                request={selectedRequest}
                onSendQuote={handleSendQuoteClick}
                onUpdateCost={(calc) =>
                  updateCostCalculation(selectedRequest.id, calc)
                }
              />
            </div>
          </div>

          {/* ─── SECTION C: Quote Revision History ─── */}
          {selectedRequest.customerQuoteVersions.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <QuoteRevisionPanel
                versions={selectedRequest.customerQuoteVersions}
                onRevise={() => {
                  if (selectedSupplierQuote) {
                    const nextVersion = selectedRequest.customerQuoteVersions.length + 1;
                    const calc = selectedRequest.costCalculation;
                    const version: CustomerQuoteVersion = {
                      version: nextVersion,
                      sellPrice: calc?.customerSellPrice || 0,
                      freight: calc?.customerFreight || 85,
                      totalAmount: calc?.totalCustomerQuote || 0,
                      estimatedTransitDays: selectedSupplierQuote.leadTimeDays,
                      notes: "Revised quote with updated supply terms.",
                      terms: "Standard Autohub Trade Terms. Valid for 5 business days.",
                      sentAt: new Date().toLocaleString("en-NZ", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }),
                      status: "Sent",
                    };
                    reviseQuote(selectedRequest.id, version);
                  }
                }}
                canRevise={true}
              />
            </div>
          )}

          {/* ─── SECTION D: Customer Decision / Response Simulation ─── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Customer Decision & Response
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Customer response status & quote progression
                </p>
              </div>

              {selectedRequest.customerResponse ? (
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                    selectedRequest.customerResponse === "Accepted"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : selectedRequest.customerResponse === "Rejected"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {selectedRequest.customerResponse}
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Pending Decision
                </span>
              )}
            </div>

            {/* If quote sent, display quick decision simulator */}
            {selectedRequest.customerQuoteVersions.length > 0 && (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                <p className="text-xs text-slate-700 font-medium">
                  Simulate or record customer response:
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleCustomerResponse(selectedRequest.id, "Accepted")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      selectedRequest.customerResponse === "Accepted"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Customer Accepted Quote</span>
                  </button>

                  <button
                    onClick={() => handleCustomerResponse(selectedRequest.id, "Rejected")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      selectedRequest.customerResponse === "Rejected"
                        ? "bg-red-600 text-white border-red-600 shadow-sm"
                        : "bg-white text-red-700 border-red-200 hover:bg-red-50"
                    }`}
                  >
                    <span>Customer Declined</span>
                  </button>

                  <button
                    onClick={() =>
                      handleCustomerResponse(
                        selectedRequest.id,
                        "Request More Information"
                      )
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      selectedRequest.customerResponse === "Request More Information"
                        ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                        : "bg-white text-amber-700 border-amber-200 hover:bg-amber-50"
                    }`}
                  >
                    <span>Requested More Info</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ─── SECTION E: Payment Gate & Place Supplier Order ─── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50/70 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>Payment Status & Supplier Order</span>
                  {isPaid ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Paid
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                      Unpaid
                    </span>
                  )}
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Invoice generation remains in existing Autohub process &bull; Portal records payment status only (Unpaid / Paid)
                </p>
              </div>

              {/* Staff Payment Status Toggle (Unpaid / Paid) */}
              <div className="flex items-center gap-2">
                {!isPaid ? (
                  <button
                    onClick={() => markPaymentPaid(selectedRequest.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all"
                    title="Set payment status to Paid"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Mark Payment Paid</span>
                  </button>
                ) : (
                  <button
                    onClick={() => markPaymentUnpaid(selectedRequest.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-all"
                    title="Revert payment status to Unpaid"
                  >
                    <span>Revert to Unpaid</span>
                  </button>
                )}
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* If Unpaid Warning */}
              {!isPaid && (
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">
                      Payment is required (Status: Unpaid) before placing supplier order.
                    </p>
                    <p className="text-amber-800 text-[11px] leading-relaxed">
                      Official tax invoices are generated via the existing Autohub operational workflow. Once settlement is received into ANZ NZ account, mark status as Paid to unlock supplier ordering.
                    </p>
                  </div>
                </div>
              )}

              {/* If Paid Notice */}
              {isPaid && !selectedRequest.supplierOrder && (
                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3 text-emerald-900 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">
                      Customer payment confirmed & verified. Ready to dispatch supplier order!
                    </p>
                    <p className="text-emerald-800 text-[11px]">
                      Invoice: {selectedRequest.payment?.invoiceNumber} &bull; Amount: NZ$
                      {selectedRequest.payment?.amount.toLocaleString()} &bull; Reference:{" "}
                      {selectedRequest.payment?.paymentReference}
                    </p>
                  </div>
                </div>
              )}

              {/* Existing Supplier Order Display */}
              {selectedRequest.supplierOrder && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                      Supplier Order Executed
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {selectedRequest.supplierOrder.supplierRef}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Supplier
                      </p>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {selectedRequest.supplierOrder.supplierName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Order Date
                      </p>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {selectedRequest.supplierOrder.orderDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Supplier Cost
                      </p>
                      <p className="font-mono font-bold text-slate-900 mt-0.5">
                        NZ${selectedRequest.supplierOrder.cost.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Lifecycle State
                      </p>
                      <p className="font-bold text-emerald-600 mt-0.5">
                        {selectedRequest.status}
                      </p>
                    </div>
                  </div>

                  {selectedRequest.supplierOrder.notes && (
                    <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded border border-slate-100">
                      &ldquo;{selectedRequest.supplierOrder.notes}&rdquo;
                    </p>
                  )}
                </div>
              )}

              {/* Action Button: Place Supplier Order */}
              {!selectedRequest.supplierOrder && (
                <div className="pt-2">
                  <button
                    onClick={handleOpenOrderModal}
                    disabled={!canPlaceOrder}
                    className={`w-full py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all ${
                      canPlaceOrder
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow hover:shadow-md active:scale-98 cursor-pointer"
                        : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                    }`}
                    title={
                      !isPaid
                        ? "Payment is required before the supplier order can be placed."
                        : "Execute PO and place order with supplier"
                    }
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Place Supplier Order</span>
                  </button>

                  {!canPlaceOrder && !isPaid && (
                    <p className="text-[11px] text-center text-slate-400 mt-2">
                      Disabled: Payment is required before the supplier order can be placed.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ─── SECTION F: Confidential Internal Notes ─── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50/70 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Internal Procurement Notes
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  Internal Only &bull; Staff Confidential
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {selectedRequest.internalNotes?.length || 0} notes
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* Notes Feed */}
              {selectedRequest.internalNotes && selectedRequest.internalNotes.length > 0 ? (
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {selectedRequest.internalNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span className="font-bold text-slate-900">{note.author}</span>
                        <span className="font-mono text-slate-400">{note.timestamp}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{note.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-2">
                  No internal notes recorded yet. Add operational notes below.
                </p>
              )}

              {/* Add Note Input */}
              <form onSubmit={handleAddNote} className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px]">
                  <label className="font-bold text-slate-500 uppercase tracking-wider">
                    Add Note as:
                  </label>
                  <select
                    value={noteAuthor}
                    onChange={(e) => setNoteAuthor(e.target.value)}
                    className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 focus:outline-none"
                  >
                    {PROCUREMENT_STAFF.map((staff) => (
                      <option key={staff.id} value={staff.name}>
                        {staff.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <textarea
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Enter confidential procurement note..."
                    rows={2}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4499]/20 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={!newNoteText.trim()}
                    className="px-4 py-2 bg-[#2B4499] hover:bg-[#1d2e7e] disabled:bg-slate-200 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all self-end"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MODAL 1: Supplier Quote Modal (Add / Edit) ─── */}
      <SupplierQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => {
          setIsQuoteModalOpen(false);
          setEditingQuote(null);
        }}
        onSave={handleSaveQuote}
        existingQuote={editingQuote}
        suppliers={suppliers}
      />

      {/* ─── MODAL 2: Place Supplier Order Modal ─── */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOrderModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <span>Place Supplier Order</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Execute purchase order for request {selectedRequest.requestNumber}
              </p>
            </div>

            <form onSubmit={handleConfirmOrder} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider">
                  Supplier Name
                </label>
                <input
                  type="text"
                  value={orderSupplierName}
                  onChange={(e) => setOrderSupplierName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider">
                    Supplier PO / Reference
                  </label>
                  <input
                    type="text"
                    value={orderSupplierRef}
                    onChange={(e) => setOrderSupplierRef(e.target.value)}
                    required
                    className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider">
                    Total Order Cost (NZD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={orderCost || ""}
                    onChange={(e) => setOrderCost(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider">
                  Order Dispatch Notes
                </label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm hover:shadow transition-all active:scale-95"
                >
                  Confirm & Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: Confirmation Modal for Send Quote ─── */}
      <ConfirmationModal
        isOpen={isConfirmSendOpen}
        onClose={() => setIsConfirmSendOpen(false)}
        onConfirm={handleConfirmSendQuote}
        title="Send Customer Quotation"
        description={`Are you ready to send Quote v${
          pendingQuoteVersion?.version || 1
        } for NZ$${
          pendingQuoteVersion?.totalAmount.toLocaleString() || 0
        } to ${selectedRequest.customerName}? This will advance request status to 'Quoted'.`}
        confirmLabel="Send Quote"
      />
    </div>
  );
}
