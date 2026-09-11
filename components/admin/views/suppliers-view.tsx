"use client";

import React, { useState } from "react";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Building,
  Mail,
  Phone,
  Globe,
  Star,
  CheckCircle2,
  X,
} from "lucide-react";
import { Supplier, SupplierQuotation } from "@/types/shared";
import { useUnifiedData } from "@/context/unified-data-context";

export function SuppliersView() {
  const { suppliers, requests, addSupplier, updateSupplier } = useUnifiedData();

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Japan");
  const [category, setCategory] = useState("Genuine OEM");
  const [specializations, setSpecializations] = useState("Toyota, Lexus");

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setName("");
    setContact("");
    setEmail("");
    setPhone("");
    setCountry("Japan");
    setCategory("Genuine OEM");
    setSpecializations("Toyota, Lexus");
    setShowAddModal(true);
  };

  const handleOpenEdit = (s: Supplier) => {
    setEditingSupplier(s);
    setName(s.name);
    setContact(s.contact);
    setEmail(s.email);
    setPhone(s.phone);
    setCountry(s.country);
    setCategory(s.category);
    setSpecializations(s.specializations.join(", "));
    setShowAddModal(true);
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const specs = specializations.split(",").map((s) => s.trim()).filter(Boolean);

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, {
        name,
        contact,
        email,
        phone,
        country,
        category,
        specializations: specs,
      });
    } else {
      const newSup: Supplier = {
        id: `sup-${Date.now()}`,
        name,
        contact,
        email,
        phone,
        country,
        category,
        specializations: specs,
        rating: 5,
        status: "Active",
      };
      addSupplier(newSup);
    }

    setShowAddModal(false);
  };

  // Extract quotation history across requests for this supplier
  const getSupplierQuotationHistory = (supId: string): { reqNum: string; quote: SupplierQuotation }[] => {
    const list: { reqNum: string; quote: SupplierQuotation }[] = [];
    requests.forEach((r) => {
      r.supplierQuotations?.forEach((q) => {
        if (q.supplierId === supId) {
          list.push({ reqNum: r.requestNumber, quote: q });
        }
      });
    });
    return list;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Approved Supplier Directory ({suppliers.length})
          </h2>
          <p className="text-xs text-slate-500">
            Authorized overseas and domestic automotive parts distribution partners.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-3.5 py-2 bg-[#ED2025] hover:bg-[#C8101E] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Supplier
        </button>
      </div>

      {/* Supplier Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Supplier Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Specializations</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                        {s.name[0]}
                      </div>
                      <div>
                        <span>{s.name}</span>
                        {s.rating && (
                          <div className="flex items-center gap-0.5 text-amber-500 text-[10px] mt-0.5">
                            {Array.from({ length: s.rating }).map((_, idx) => (
                              <Star key={idx} className="w-2.5 h-2.5 fill-amber-400" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <span className="font-semibold block">{s.contact}</span>
                    <span className="text-[10px] text-slate-400">{s.email}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{s.country}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{s.category}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {s.specializations.map((spec) => (
                        <span
                          key={spec}
                          className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedSupplier(s)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-xs"
                      >
                        History
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateSupplier(s.id, {
                            status: s.status === "Active" ? "Inactive" : "Active",
                          })
                        }
                        className="px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-rose-600 rounded-lg"
                      >
                        {s.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supplier Detail & Quotation History Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2B4499] text-white flex items-center justify-center font-bold text-lg">
                  {selectedSupplier.name[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedSupplier.name}</h3>
                  <span className="text-xs text-slate-500">
                    {selectedSupplier.country} • {selectedSupplier.category}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSupplier(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Supplier Contact info */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
              <div>
                <span className="text-slate-400 block text-[11px]">Contact Representative</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedSupplier.contact}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Email</span>
                <span className="font-medium text-slate-800">{selectedSupplier.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Phone</span>
                <span className="font-medium text-slate-800">{selectedSupplier.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Country</span>
                <span className="font-medium text-slate-800">{selectedSupplier.country}</span>
              </div>
            </div>

            {/* Quotation History (Section 12) */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Quotation History on Procurly (
                {getSupplierQuotationHistory(selectedSupplier.id).length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {getSupplierQuotationHistory(selectedSupplier.id).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    No quotations registered for this supplier yet.
                  </p>
                ) : (
                  getSupplierQuotationHistory(selectedSupplier.id).map(({ reqNum, quote }) => (
                    <div
                      key={quote.id}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-[#ED2025] mr-2">{reqNum}</span>
                        <span className="font-semibold text-slate-800">
                          {quote.supplierPartRef}
                        </span>
                        <span className="text-slate-500 block text-[11px] mt-0.5">
                          {quote.condition} • {quote.leadTimeDays} Days Lead Time
                        </span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-bold text-slate-900 block">
                          NZ${quote.supplierCost.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          +NZ${quote.supplierFreight.toFixed(2)} freight
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedSupplier(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Supplier */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {editingSupplier ? "Edit Supplier" : "Add Supplier Directory Record"}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter supplier details for procurement sourcing.
            </p>

            <form onSubmit={handleSaveSupplier} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Supplier Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Osaka Auto Spares Ltd"
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Genuine Japanese OEM"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Specializations (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={specializations}
                    onChange={(e) => setSpecializations(e.target.value)}
                    placeholder="e.g. Toyota, Nissan, Brake Rotors"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  />
                </div>
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
                  className="px-4 py-2 text-xs font-bold bg-[#ED2025] hover:bg-[#C8101E] text-white rounded-xl shadow-xs"
                >
                  {editingSupplier ? "Save Changes" : "Create Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
