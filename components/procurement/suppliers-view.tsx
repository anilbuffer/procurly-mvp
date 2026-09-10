"use client";

import React, { useState, useMemo } from "react";
import {
  Building2,
  Star,
  Globe,
  Mail,
  Phone,
  Plus,
  Send,
  Check,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { useProcurement } from "@/context/procurement-context";
import { Supplier } from "@/types/procurement";
import { FilterBar } from "./filter-bar";
import { EmptyState } from "./empty-state";

export function SuppliersView() {
  const { suppliers, addSupplier, searchQuery, setSearchQuery, setActiveTab } =
    useProcurement();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contactModalSupplier, setContactModalSupplier] = useState<Supplier | null>(null);
  const [inquirySubject, setInquirySubject] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New supplier form
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    country: "Japan",
    contact: "",
    email: "",
    phone: "",
    specializations: "",
    rating: 5,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredSuppliers = useMemo(() => {
    if (!searchQuery.trim()) return suppliers;
    const q = searchQuery.toLowerCase();
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.contact.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.specializations.some((sp) => sp.toLowerCase().includes(q))
    );
  }, [suppliers, searchQuery]);

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name || !newSupplier.email) return;

    const specs = newSupplier.specializations
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    addSupplier({
      id: `sup-${Date.now()}`,
      name: newSupplier.name,
      country: newSupplier.country,
      contact: newSupplier.contact || "Parts Sales Desk",
      email: newSupplier.email,
      phone: newSupplier.phone || "+81 3 0000 0000",
      rating: Number(newSupplier.rating),
      specializations: specs.length > 0 ? specs : ["OEM Replacement Parts"],
    });

    setIsAddModalOpen(false);
    showToast(`Supplier "${newSupplier.name}" registered successfully.`);
    setNewSupplier({
      name: "",
      country: "Japan",
      contact: "",
      email: "",
      phone: "",
      specializations: "",
      rating: 5,
    });
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactModalSupplier) return;
    showToast(`Inquiry dispatched to ${contactModalSupplier.name} (${contactModalSupplier.email})`);
    setContactModalSupplier(null);
    setInquirySubject("");
    setInquiryMessage("");
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl font-bold text-xs animate-in slide-in-from-top-3 fade-in duration-200">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <FilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search suppliers by name, country, specialization..."
      />

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Supplier Directory</h2>
            <p className="text-xs text-slate-500">
              {filteredSuppliers.length} registered supplier{filteredSuppliers.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all self-start sm:self-auto active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Supplier</span>
          </button>
        </div>

        {filteredSuppliers.length === 0 ? (
          <EmptyState title="No suppliers found" description="Try adjusting your search." />
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="p-5 sm:p-6 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#2B4499]/10 text-[#2B4499] flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{supplier.name}</h3>
                        {supplier.rating && (
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < supplier.rating!
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Globe className="w-3 h-3 text-slate-400" />
                          {supplier.country}
                        </span>
                        <a
                          href={`mailto:${supplier.email}`}
                          className="inline-flex items-center gap-1 hover:text-[#ED2025] transition-colors"
                        >
                          <Mail className="w-3 h-3 text-slate-400" />
                          {supplier.email}
                        </a>
                        <a
                          href={`tel:${supplier.phone}`}
                          className="inline-flex items-center gap-1 hover:text-[#ED2025] transition-colors"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          {supplier.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <span className="font-medium text-slate-600">Contact:</span>
                        <span>{supplier.contact}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {supplier.specializations.map((spec) => (
                          <span
                            key={spec}
                            className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wider"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-start lg:self-auto shrink-0 pt-2 lg:pt-0">
                    <button
                      onClick={() => {
                        setContactModalSupplier(supplier);
                        setInquirySubject(`RFQ Inquiry for ${supplier.name}`);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>Contact / RFQ</span>
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery(supplier.name);
                        setActiveTab("sourcing");
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs inline-flex items-center gap-1.5 transition-all"
                    >
                      <span>Sourcing Queue</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Register Supplier Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#ED2025]" />
                <h3 className="font-bold text-slate-900 text-sm">Register New Supplier</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Supplier Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Osaka JDM Components Ltd"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#ED2025]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Country</label>
                  <select
                    value={newSupplier.country}
                    onChange={(e) => setNewSupplier({ ...newSupplier, country: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#ED2025]"
                  >
                    <option value="Japan">Japan</option>
                    <option value="Australia">Australia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Germany">Germany</option>
                    <option value="USA">USA</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Taiwan">Taiwan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Kenji Sato"
                    value={newSupplier.contact}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#ED2025]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sales@osakajdm.jp"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#ED2025]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+81 6 6200 1122"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#ED2025]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Specializations (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Toyota OEM, Suspension, Brake Calipers, JDM"
                  value={newSupplier.specializations}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, specializations: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#ED2025]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Supplier Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewSupplier({ ...newSupplier, rating: star })}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newSupplier.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {newSupplier.rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold shadow-md shadow-[#ED2025]/20"
                >
                  Register Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Supplier / RFQ Modal */}
      {contactModalSupplier && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#ED2025]" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Contact Supplier: {contactModalSupplier.name}
                </h3>
              </div>
              <button
                onClick={() => setContactModalSupplier(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ×
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient Email:</span>
                <span className="font-mono font-bold text-slate-900">{contactModalSupplier.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone / WhatsApp:</span>
                <span className="font-mono font-bold text-slate-900">{contactModalSupplier.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Representative:</span>
                <span className="font-bold text-slate-900">{contactModalSupplier.contact}</span>
              </div>
            </div>

            <form onSubmit={handleSendInquiry} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={inquirySubject}
                  onChange={(e) => setInquirySubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#ED2025]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">RFQ Inquiry Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter OEM part specifications, required quantities, target delivery window, and warehouse destination..."
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#ED2025] resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex gap-2">
                  <a
                    href={`mailto:${contactModalSupplier.email}?subject=${encodeURIComponent(
                      inquirySubject
                    )}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold inline-flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open Email Client</span>
                  </a>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setContactModalSupplier(null)}
                    className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold inline-flex items-center gap-1.5 shadow-md shadow-[#ED2025]/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch RFQ</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
