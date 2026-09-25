"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Building2,
  ShoppingBag,
  Hash,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Car,
  Truck,
  Info,
} from "lucide-react";
import { PartRequest } from "@/types/shared";
import { useUnifiedData } from "@/context/unified-data-context";
import { PaymentStatusBadge } from "../../status-badge";

interface PaymentTabProps {
  request: PartRequest;
  onNavigateToTab?: (tab: string) => void;
}

export function PaymentTab({ request: initialRequest, onNavigateToTab }: PaymentTabProps) {
  const { requests, markPaymentPaid, markPaymentUnpaid, placeSupplierOrder } = useUnifiedData();
  const request = requests.find((r) => r.id === initialRequest.id) || initialRequest;

  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [paymentRefInput, setPaymentRefInput] = useState(
    request.payment?.paymentReference || `${request.requestNumber}-PAID`
  );

  // Supplier Order Modal state (unlocked once paid)
  const [showOrderModal, setShowOrderModal] = useState(false);
  const selectedSupplierQuote = request.supplierQuotations?.find((q) => q.isSelected);
  const [orderSupplierName, setOrderSupplierName] = useState(
    selectedSupplierQuote?.supplierName || "Nagoya Auto Parts Co."
  );
  const [orderSupplierRef, setOrderSupplierRef] = useState(
    "PO-" + request.requestNumber.replace("AutoHub-P-", "")
  );
  const [orderCost, setOrderCost] = useState(
    selectedSupplierQuote?.supplierCost || 245
  );
  const [orderFreight, setOrderFreight] = useState(
    selectedSupplierQuote?.supplierFreight || 30
  );
  const [orderNotes, setOrderNotes] = useState(
    `Airfreight consolidation. Please affix Autohub barcoded consignment labels.\nRequester: ${request.customerName} (Ref: ${request.requestNumber})\nDestination: ${request.deliveryAddress.streetAddress}, ${request.deliveryAddress.city}\nAttn: ${request.contactName} (${request.customerPhone || request.deliveryAddress.phone})`
  );
  const [handoverMode, setHandoverMode] = useState<"Consolidated via Autohub Hub" | "Direct Drop-ship to Requester">(
    "Consolidated via Autohub Hub"
  );
  const [includeRequesterTag, setIncludeRequesterTag] = useState(true);

  const payment = request.payment;
  const isPaid = payment?.status === "Paid";
  const amount = payment?.amount || request.quotedValue || request.customerQuote?.totalAmount || request.costCalculation?.totalCustomerQuote || 410.0;

  const handleMarkPaid = (e: React.FormEvent) => {
    e.preventDefault();
    markPaymentPaid(request.id, paymentRefInput);
    setShowMarkPaidModal(false);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const success = placeSupplierOrder(request.id, {
      supplierName: orderSupplierName,
      supplierRef: orderSupplierRef,
      cost: Number(orderCost),
      freight: Number(orderFreight),
      notes: orderNotes,
      requesterName: request.customerName,
      requesterContact: request.contactName,
      requesterEmail: request.customerEmail,
      requesterPhone: request.customerPhone,
      deliveryAddress: `${request.deliveryAddress.streetAddress}, ${request.deliveryAddress.suburb ? `${request.deliveryAddress.suburb}, ` : ""}${request.deliveryAddress.city} ${request.deliveryAddress.postalCode}`,
      deliveryCity: request.deliveryAddress.city,
      vehicleSummary: `${request.vehicle.year} ${request.vehicle.make} ${request.vehicle.model}${request.vehicle.vin ? ` (VIN: ${request.vehicle.vin})` : ""}`,
      partSummary: `${request.part.name}${request.part.partNumber ? ` (OEM: ${request.part.partNumber})` : ""} - Qty: ${request.part.quantity || 1}`,
      handoverMode: handoverMode,
    });
    if (success) {
      setShowOrderModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-bold text-slate-900">Payment Status</h3>
              <PaymentStatusBadge status={payment?.status || "Unpaid"} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Records settlement before authorizing procurement supplier purchasing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isPaid ? (
              <button
                type="button"
                onClick={() => setShowMarkPaidModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark as Paid
              </button>
            ) : (
              <button
                type="button"
                onClick={() => markPaymentUnpaid(request.id)}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all shadow-xs"
              >
                Revert to Unpaid
              </button>
            )}
          </div>
        </div>

        {/* Payment Data Fields */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Payable Amount</span>
            <span className="font-mono text-lg font-bold text-slate-900">
              NZ${amount.toFixed(2)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Payment Reference</span>
            <span className="font-mono font-semibold text-slate-800">
              {payment?.paymentReference || request.requestNumber}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Autohub Invoice #</span>
            <span className="font-mono font-semibold text-slate-800">
              {payment?.invoiceNumber || `INV-2026-${request.requestNumber.replace("AutoHub-P-", "")}`}
            </span>
            <span className="text-[10px] text-slate-400 block">External accounting ref</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Settlement Date</span>
            <span className="font-semibold text-slate-800">
              {payment?.paidAt || (isPaid ? "Today" : "Awaiting Settlement")}
            </span>
          </div>
        </div>

        {/* Bank Account Reference Note */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50/70 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
          <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800 block">
              Direct Credit Deposit Details (ANZ NZ)
            </span>
            <span>
              Account Name: Autohub Procurement NZ Ltd • Account: 01-0288-0349821-00 • Swift: ANZBNZ22
            </span>
          </div>
        </div>
      </div>

      {/* THE PAYMENT GATE (Section 18) */}
      <div
        className={`rounded-2xl p-6 border shadow-xs transition-all ${isPaid
          ? "bg-gradient-to-r from-emerald-50/80 to-white border-emerald-200"
          : "bg-slate-50/80 border-slate-300"
          }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${isPaid
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/20"
                : "bg-slate-200 text-slate-500"
                }`}
            >
              {isPaid ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">
                  Supplier Order Gate: {isPaid ? "UNLOCKED" : "LOCKED"}
                </h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isPaid
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                    }`}
                >
                  {isPaid ? "Available" : "Order Blocked"}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                {!isPaid ? (
                  <span className="text-amber-800 font-medium">
                    &quot;Payment is required before placing the supplier order.&quot; Once payment is
                    marked as Paid, the purchasing button will unlock.
                  </span>
                ) : (
                  <span>
                    Payment is confirmed. Autohub procurement staff can now release the purchase
                    order to the selected overseas vendor.
                  </span>
                )}
              </p>
            </div>
          </div>

          <div>
            {!request.supplierOrder || !isPaid ? (
              <button
                type="button"
                disabled={!isPaid}
                onClick={() => setShowOrderModal(true)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 ${isPaid
                  ? "bg-[#B30D12] hover:bg-[#C8101E] text-white shadow-red-900/20"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
              >
                <ShoppingBag className="w-4 h-4" />
                PLACE SUPPLIER ORDER
              </button>
            ) : (
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full inline-block">
                  Order Placed ({request.supplierOrder.supplierRef})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Supplier Order Details Card (If order has already been placed) */}
      {request.supplierOrder && isPaid && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#B30D12]" />
              Active Supplier Order (PO)
            </h3>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {request.supplierOrder.supplierRef}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Supplier</span>
              <span className="font-bold text-slate-900">
                {request.supplierOrder.supplierName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Order Date</span>
              <span className="font-semibold text-slate-800">
                {request.supplierOrder.orderDate}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Procurement Cost</span>
              <span className="font-mono font-bold text-slate-900">
                NZ${request.supplierOrder.cost.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Inbound Freight</span>
              <span className="font-mono font-semibold text-slate-700">
                NZ${request.supplierOrder.freight.toFixed(2)}
              </span>
            </div>
          </div>
          {request.supplierOrder.notes && (
            <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 italic">
              &quot;{request.supplierOrder.notes}&quot;
            </p>
          )}

          {/* Supplier Handover: Requester Consignment Details */}
          <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 rounded-xl p-4 border border-slate-200 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#B30D12]" />
                <span>Supplier Handover: Requester Consignment Details</span>
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-800">
                {request.supplierOrder.handoverMode || "Consolidated via Autohub Hub"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Requester Organization</span>
                <span className="font-bold text-slate-900 block text-sm">{request.supplierOrder.requesterName || request.customerName}</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">Attn: {request.supplierOrder.requesterContact || request.contactName}</span>
                <span className="text-slate-500 text-[10px] block">{request.supplierOrder.requesterEmail || request.customerEmail}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Fulfillment Delivery Bay</span>
                <span className="font-semibold text-slate-800 block leading-relaxed">{request.supplierOrder.deliveryAddress || `${request.deliveryAddress.streetAddress}, ${request.deliveryAddress.city}`}</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">Phone: {request.supplierOrder.requesterPhone || request.customerPhone || request.deliveryAddress.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Target Vehicle & Part Scope</span>
                <span className="font-semibold text-slate-800 block">{request.supplierOrder.vehicleSummary || `${request.vehicle.year} ${request.vehicle.make} ${request.vehicle.model}`}</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">{request.supplierOrder.partSummary || `${request.part.name} (Qty: ${request.part.quantity || 1})`}</span>
                <span className="text-slate-400 font-mono text-[10px] block mt-0.5">Trade Ref: {request.requestNumber}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Mark Payment Paid */}
      {showMarkPaidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowMarkPaidModal(false)}
          />

          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 relative z-10 flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100 shadow-inner">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Record Payment Received</h3>
                <p className="text-xs text-slate-500">
                  Confirm bank remittance for {request.requestNumber} (NZ${amount.toFixed(2)}).
                </p>
              </div>
            </div>

            <form onSubmit={handleMarkPaid} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Payment Reference / Bank Trace ID <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Hash className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={paymentRefInput}
                    onChange={(e) => setPaymentRefInput(e.target.value)}
                    placeholder="e.g. ANZ-TRACE-98124"
                    required
                    className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-mono transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-sm flex items-center justify-between text-emerald-900 shadow-sm mt-2">
                <span className="font-medium">Amount Cleared:</span>
                <span className="font-mono font-black text-base">NZ${amount.toFixed(2)}</span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setShowMarkPaidModal(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 group"
                >
                  Confirm as Paid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Place Supplier Order */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowOrderModal(false)}
          />

          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 relative z-10 flex flex-col gap-5 max-h-[90vh] overflow-y-auto custom-scrollbar">

            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0 border border-rose-100 shadow-inner">
                <ShoppingBag className="w-5 h-5 text-[#B30D12]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Place Supplier Order (PO)</h3>
                <p className="text-xs text-slate-500">
                  Authorized release of overseas purchase order with customer handover details.
                </p>
              </div>
            </div>

            {/* Requester & Handover Details Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#B30D12]" />
                  <span>Supplier Handover: Requester & Consignment Details</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  Ref: {request.requestNumber}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Requester Organization</span>
                  <span className="font-bold text-slate-900 text-sm block">{request.customerName}</span>
                  <span className="text-slate-600 font-medium">Contact: {request.contactName}</span>
                  <div className="flex items-center gap-3 text-slate-500 mt-1">
                    {request.customerEmail && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {request.customerEmail}
                      </span>
                    )}
                    {request.customerPhone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {request.customerPhone}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Fulfillment Delivery Bay</span>
                  <span className="font-semibold text-slate-800 block">
                    {request.deliveryAddress.streetAddress}, {request.deliveryAddress.suburb}
                  </span>
                  <span className="text-slate-600">
                    {request.deliveryAddress.city} {request.deliveryAddress.postalCode}
                  </span>
                  <span className="text-slate-400 text-[10px] block mt-0.5">
                    Attn: {request.deliveryAddress.recipientName} ({request.deliveryAddress.phone})
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-3 text-[11px] text-slate-600">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Target Vehicle</span>
                  <span className="font-semibold text-slate-800">
                    {request.vehicle.year} {request.vehicle.make} {request.vehicle.model}
                  </span>
                  {request.vehicle.vin && (
                    <span className="text-slate-500 font-mono block text-[10px]">
                      VIN: {request.vehicle.vin}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Part / Scope</span>
                  <span className="font-semibold text-slate-800">
                    {request.part.name} (Qty: {request.part.quantity || 1})
                  </span>
                  {request.part.partNumber && (
                    <span className="text-slate-500 font-mono block text-[10px]">
                      OEM #: {request.part.partNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Handover Logistics Configuration */}
              <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap">Handover Route:</label>
                  <select
                    value={handoverMode}
                    onChange={(e) => setHandoverMode(e.target.value as any)}
                    className="text-xs py-1 px-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:border-[#B30D12]"
                  >
                    <option value="Consolidated via Autohub Hub">Consolidated via Autohub Auckland Hub (MPI Clearance First)</option>
                    <option value="Direct Drop-ship to Requester">Direct Drop-ship to Requester Workshop Bay</option>
                  </select>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={includeRequesterTag}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setIncludeRequesterTag(checked);
                      if (checked) {
                        setOrderNotes(
                          `Airfreight consolidation. Please affix Autohub barcoded consignment labels.\nRequester: ${request.customerName} (Ref: ${request.requestNumber})\nDestination: ${request.deliveryAddress.streetAddress}, ${request.deliveryAddress.city}\nAttn: ${request.contactName} (${request.customerPhone || request.deliveryAddress.phone})`
                        );
                      } else {
                        setOrderNotes("Airfreight consolidation. Please affix Autohub barcoded consignment labels.");
                      }
                    }}
                    className="w-3.5 h-3.5 text-[#B30D12] rounded border-slate-300 focus:ring-[#B30D12]"
                  />
                  <span>Include Requester in Dispatch Notes</span>
                </label>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Supplier Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Building2 className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={orderSupplierName}
                      onChange={(e) => setOrderSupplierName(e.target.value)}
                      required
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#B30D12]/10 focus:border-[#B30D12] transition-all bg-white shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Purchase Order Ref # <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Hash className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={orderSupplierRef}
                      onChange={(e) => setOrderSupplierRef(e.target.value)}
                      required
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#B30D12]/10 focus:border-[#B30D12] transition-all bg-white font-mono shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Supplier Cost (NZD) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      value={orderCost}
                      onChange={(e) => setOrderCost(Number(e.target.value))}
                      required
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#B30D12]/10 focus:border-[#B30D12] transition-all bg-white shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Procurement / Dispatch Instructions
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3.5 flex items-start pointer-events-none">
                    <FileText className="w-4 h-4 text-slate-400" />
                  </div>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    rows={4}
                    className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#B30D12]/10 focus:border-[#B30D12] transition-all bg-white shadow-sm resize-none custom-scrollbar"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold bg-[#B30D12] hover:bg-[#C8101E] text-white rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 group"
                >
                  <ShoppingBag className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  Confirm Order Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
