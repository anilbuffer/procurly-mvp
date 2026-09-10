"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { SupplierQuotation, SupplierAvailability, SupplierCondition, Supplier } from "@/types/procurement";

interface SupplierQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quote: SupplierQuotation) => void;
  existingQuote?: SupplierQuotation | null;
  suppliers: Supplier[];
}

const EMPTY_FORM: Omit<SupplierQuotation, "id" | "createdAt"> = {
  supplierId: "",
  supplierName: "",
  supplierContact: "",
  supplierCountry: "",
  supplierPartRef: "",
  availability: "Available",
  supplierCost: 0,
  supplierFreight: 0,
  leadTimeDays: 5,
  condition: "Genuine",
  notes: "",
  isSelected: false,
};

export function SupplierQuoteModal({
  isOpen,
  onClose,
  onSave,
  existingQuote,
  suppliers,
}: SupplierQuoteModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (existingQuote) {
      const { id, createdAt, ...rest } = existingQuote;
      setForm(rest);
    } else {
      setForm(EMPTY_FORM);
    }
  }, [existingQuote, isOpen]);

  const handleSupplierChange = (supplierId: string) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    if (supplier) {
      setForm((f) => ({
        ...f,
        supplierId: supplier.id,
        supplierName: supplier.name,
        supplierContact: supplier.contact,
        supplierCountry: supplier.country,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quote: SupplierQuotation = {
      ...form,
      id: existingQuote?.id || `sq-${Date.now()}`,
      createdAt: existingQuote?.createdAt || new Date().toISOString().split("T")[0],
    };
    onSave(quote);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 pb-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {existingQuote ? "Edit Supplier Quote" : "Add Supplier Quote"}
            </h3>
            <p className="text-xs text-slate-500">
              {existingQuote ? "Update the supplier quotation details" : "Enter supplier quotation details"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Supplier Selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Supplier
            </label>
            <select
              value={form.supplierId}
              onChange={(e) => handleSupplierChange(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED2025]/20 focus:border-[#ED2025]"
            >
              <option value="">Select a supplier...</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.country})
                </option>
              ))}
            </select>
          </div>

          {/* Part Reference */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Supplier Part Reference
            </label>
            <input
              type="text"
              value={form.supplierPartRef}
              onChange={(e) => setForm((f) => ({ ...f, supplierPartRef: e.target.value }))}
              placeholder="e.g. NAP-48069-ALT"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED2025]/20 focus:border-[#ED2025]"
            />
          </div>

          {/* Availability & Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Availability
              </label>
              <select
                value={form.availability}
                onChange={(e) => setForm((f) => ({ ...f, availability: e.target.value as SupplierAvailability }))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED2025]/20"
              >
                <option value="In Stock">In Stock</option>
                <option value="Available">Available</option>
                <option value="Back Order">Back Order</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Condition
              </label>
              <select
                value={form.condition}
                onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value as SupplierCondition }))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED2025]/20"
              >
                <option value="Genuine">Genuine</option>
                <option value="Aftermarket">Aftermarket</option>
                <option value="Remanufactured">Remanufactured</option>
                <option value="Used">Used</option>
              </select>
            </div>
          </div>

          {/* Cost & Freight */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Supplier Cost (NZD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.supplierCost || ""}
                onChange={(e) => setForm((f) => ({ ...f, supplierCost: parseFloat(e.target.value) || 0 }))}
                required
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED2025]/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Supplier Freight (NZD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.supplierFreight || ""}
                onChange={(e) => setForm((f) => ({ ...f, supplierFreight: parseFloat(e.target.value) || 0 }))}
                required
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED2025]/20"
              />
            </div>
          </div>

          {/* Lead Time */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Lead Time (Days)
            </label>
            <input
              type="number"
              min="1"
              value={form.leadTimeDays}
              onChange={(e) => setForm((f) => ({ ...f, leadTimeDays: parseInt(e.target.value) || 1 }))}
              required
              className="w-32 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED2025]/20"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Supplier Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              placeholder="Additional supplier notes..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED2025]/20 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-[#ED2025] hover:bg-[#d11a1f] rounded-lg shadow-sm hover:shadow transition-all active:scale-95"
            >
              {existingQuote ? "Update Quote" : "Add Quote"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
