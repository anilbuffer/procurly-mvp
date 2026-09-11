"use client";

import React, { useState } from "react";
import {
  Package,
  Plus,
  Check,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  Truck,
  ArrowRight,
} from "lucide-react";
import {
  PartRequest,
  SupplierQuotation,
  SupplierAvailability,
  SupplierCondition,
} from "@/types/shared";
import { useUnifiedData } from "@/context/unified-data-context";

interface SourcingTabProps {
  request: PartRequest;
}

export function SourcingTab({ request }: SourcingTabProps) {
  const {
    suppliers,
    addSupplierQuotation,
    editSupplierQuotation,
    deleteSupplierQuotation,
    selectSupplierQuotation,
  } = useUnifiedData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);

  // Form State
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || "");
  const [supplierPartRef, setSupplierPartRef] = useState("");
  const [availability, setAvailability] = useState<SupplierAvailability>("In Stock");
  const [supplierCost, setSupplierCost] = useState<number>(250);
  const [supplierFreight, setSupplierFreight] = useState<number>(35);
  const [leadTimeDays, setLeadTimeDays] = useState<number>(5);
  const [condition, setCondition] = useState<SupplierCondition>("Genuine");
  const [notes, setNotes] = useState("");

  const handleOpenAdd = () => {
    setEditingQuoteId(null);
    setSupplierId(suppliers[0]?.id || "");
    setSupplierPartRef("");
    setAvailability("In Stock");
    setSupplierCost(250);
    setSupplierFreight(35);
    setLeadTimeDays(5);
    setCondition("Genuine");
    setNotes("");
    setShowAddModal(true);
  };

  const handleOpenEdit = (quote: SupplierQuotation) => {
    setEditingQuoteId(quote.id);
    setSupplierId(quote.supplierId);
    setSupplierPartRef(quote.supplierPartRef);
    setAvailability(quote.availability);
    setSupplierCost(quote.supplierCost);
    setSupplierFreight(quote.supplierFreight);
    setLeadTimeDays(quote.leadTimeDays);
    setCondition(quote.condition);
    setNotes(quote.notes);
    setShowAddModal(true);
  };

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === supplierId) || suppliers[0];

    if (editingQuoteId) {
      editSupplierQuotation(request.id, editingQuoteId, {
        supplierId: sup.id,
        supplierName: sup.name,
        supplierContact: sup.contact,
        supplierCountry: sup.country,
        supplierPartRef: supplierPartRef || "REF-" + Math.floor(1000 + Math.random() * 9000),
        availability,
        supplierCost: Number(supplierCost),
        supplierFreight: Number(supplierFreight),
        leadTimeDays: Number(leadTimeDays),
        condition,
        notes,
      });
    } else {
      addSupplierQuotation(request.id, {
        supplierId: sup.id,
        supplierName: sup.name,
        supplierContact: sup.contact,
        supplierCountry: sup.country,
        supplierPartRef: supplierPartRef || "REF-" + Math.floor(1000 + Math.random() * 9000),
        availability,
        supplierCost: Number(supplierCost),
        supplierFreight: Number(supplierFreight),
        leadTimeDays: Number(leadTimeDays),
        condition,
        notes,
        isSelected: (request.supplierQuotations?.length || 0) === 0,
      });
    }

    setShowAddModal(false);
  };

  const supplierQuotations = request.supplierQuotations || [];
  const selectedQuote = supplierQuotations.find((q) => q.isSelected);

  return (
    <div className="space-y-6">
      {/* Top Banner with Action */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Supplier Quotations ({supplierQuotations.length})
          </h3>
          <p className="text-xs text-slate-500">
            Compare international quotations and select the preferred supplier to build the Customer Quote.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-3.5 py-2 bg-[#ED2025] hover:bg-[#C8101E] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Supplier Quote
        </button>
      </div>

      {/* Supplier Quotations Table */}
      {supplierQuotations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center shadow-xs">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700">No Supplier Quotes Yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Request quotes from Japanese or regional parts suppliers to begin procurement cost calculation.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#ED2025] text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Add First Supplier Quote
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Selection</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Part Ref</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Lead Time</th>
                  <th className="py-3 px-4 text-right">Supplier Cost</th>
                  <th className="py-3 px-4 text-right">Supplier Freight</th>
                  <th className="py-3 px-4 text-right">Total (NZD)</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supplierQuotations.map((quote) => {
                  const total = quote.supplierCost + quote.supplierFreight;
                  const isSelected = quote.isSelected;

                  return (
                    <tr
                      key={quote.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isSelected ? "bg-red-50/20 font-medium" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => selectSupplierQuotation(request.id, quote.id)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all ${
                            isSelected
                              ? "bg-[#ED2025] text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3 h-3" /> Selected
                            </>
                          ) : (
                            "Select"
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{quote.supplierName}</span>
                        <span className="text-[10px] text-slate-400">
                          {quote.supplierCountry} • {quote.supplierContact}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                        {quote.supplierPartRef}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            quote.condition === "Genuine"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {quote.condition}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            quote.availability === "In Stock"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {quote.availability}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {quote.leadTimeDays} Days
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-900">
                        NZ${quote.supplierCost.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        NZ${quote.supplierFreight.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        NZ${total.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(quote)}
                            title="Edit Quote"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSupplierQuotation(request.id, quote.id)}
                            title="Delete Quote"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Selected Quote Information Box */}
          {selectedQuote && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Active Selection: {selectedQuote.supplierName} ({selectedQuote.supplierPartRef})
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Landed cost NZ${(selectedQuote.supplierCost + selectedQuote.supplierFreight).toFixed(2)} • {selectedQuote.leadTimeDays} Days Lead Time. Ready to configure Customer Quote.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-800 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                Base Cost: NZ${(selectedQuote.supplierCost + selectedQuote.supplierFreight).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* MODAL: Add/Edit Supplier Quote */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {editingQuoteId ? "Edit Supplier Quotation" : "Add Supplier Quotation"}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter quote information received from parts vendor.
            </p>

            <form onSubmit={handleSaveQuote} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Supplier
                  </label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.country})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Supplier Part Ref #
                  </label>
                  <input
                    type="text"
                    value={supplierPartRef}
                    onChange={(e) => setSupplierPartRef(e.target.value)}
                    placeholder="e.g. NAP-48069-TY"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as SupplierCondition)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  >
                    <option value="Genuine">Genuine OEM</option>
                    <option value="Aftermarket">Tier 1 Aftermarket</option>
                    <option value="Remanufactured">Remanufactured</option>
                    <option value="Used">Used Grade A</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Supplier Cost (NZD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={supplierCost}
                    onChange={(e) => setSupplierCost(Number(e.target.value))}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Supplier Freight (NZD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={supplierFreight}
                    onChange={(e) => setSupplierFreight(Number(e.target.value))}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Availability
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as SupplierAvailability)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Available">Available (1-2 days)</option>
                    <option value="Back Order">Back Order</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lead Time (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={leadTimeDays}
                    onChange={(e) => setLeadTimeDays(Number(e.target.value))}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Supplier Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Packaging details, warranty cover, warehouse location..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-[#ED2025] hover:bg-[#C8101E] text-white rounded-xl shadow-xs"
                >
                  {editingQuoteId ? "Save Changes" : "Add Supplier Quote"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
