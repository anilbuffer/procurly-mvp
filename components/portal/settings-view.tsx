"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Building2,
  MapPin,
  Users,
  Bell,
  ShieldCheck,
  Plus,
  Check,
  KeyRound,
  Trash2,
  Star,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { NZAddressLookup, NZAddressSelected } from "./nz-address-lookup";

export function SettingsView() {
  const {
    savedAddresses,
    addSavedAddress,
    deleteSavedAddress,
    setDefaultAddress,
    setActiveTab,
  } = usePortal();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    label: "",
    businessName: "SP Motors Ltd",
    recipientName: "James Wilson",
    phone: "+64 21 890 1234",
    streetAddress: "",
    suburb: "",
    city: "Auckland",
    postalCode: "",
    isDefault: false,
    isVerified: false,
    verifiedSource: "NZ Post",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.streetAddress || !formData.city) return;

    addSavedAddress({
      id: `addr-${Date.now()}`,
      label: formData.label,
      businessName: formData.businessName || "SP Motors Ltd",
      recipientName: formData.recipientName,
      phone: formData.phone,
      streetAddress: formData.streetAddress,
      suburb: formData.suburb || "Central",
      city: formData.city,
      postalCode: formData.postalCode || "1010",
      isDefault: formData.isDefault,
      isVerified: formData.isVerified,
      verifiedSource: formData.verifiedSource,
    });

    setIsAddModalOpen(false);
    setFormData({
      label: "",
      businessName: "SP Motors Ltd",
      recipientName: "James Wilson",
      phone: "+64 21 890 1234",
      streetAddress: "",
      suburb: "",
      city: "Auckland",
      postalCode: "",
      isDefault: false,
      isVerified: false,
      verifiedSource: "NZ Post",
    });
    showToast(`Delivery depot "${formData.label}" added successfully.`);
  };

  const handleSelectNZAddress = (addr: NZAddressSelected) => {
    setFormData((prev) => ({
      ...prev,
      streetAddress: addr.streetAddress,
      suburb: addr.suburb,
      city: addr.city,
      postalCode: addr.postalCode,
      isVerified: addr.isVerified,
      verifiedSource: addr.source || "NZ Post",
      label: prev.label || `${addr.suburb || addr.city} Workshop Depot`,
    }));
  };

  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8 max-w-7xl mx-auto w-full">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl font-bold text-xs animate-in slide-in-from-top-3 fade-in duration-200">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" />
          <span>Trade Account Management</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Account & Preferences</h2>
        <p className="text-xs text-slate-500">
          Manage your trade credentials, delivery depots, team contacts, and notifications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trade Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#FE0000]" />
              <h3 className="font-bold text-slate-900">Trade Profile</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              APPROVED TIER 1
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Trading Name:</span>
              <span className="font-bold text-slate-900">SP Motors Ltd</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">NZBN Number:</span>
              <span className=" font-bold text-slate-900">
                9429049988776
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Primary Contact:</span>
              <span className="font-semibold text-slate-800">
                James Wilson (Service Manager)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Account Manager:</span>
              <span className="font-semibold text-slate-800">
                Marcus Chen (Autohub NZ)
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Procurement Terms:</span>
              <button
                onClick={() => setActiveTab("payments")}
                className="font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
              >
                <span>Standard 30-Day Payment Terms →</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Preference */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b pb-3 mb-3">
              <Bell className="w-4 h-4 text-[#FE0000]" />
              <h3 className="font-bold text-slate-900">Notification Channels</h3>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <p className="font-bold text-slate-800">Quote Alerts</p>
                  <p className="text-[11px] text-slate-500">
                    Instant alert when supplier price quote is ready
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#FE0000] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <p className="font-bold text-slate-800">Shipment Milestones</p>
                  <p className="text-[11px] text-slate-500">
                    Updates on Customs release & courier dispatch
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#FE0000] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <p className="font-bold text-slate-800">Invoice & Statement Due</p>
                  <p className="text-[11px] text-slate-500">
                    Monthly trade statement receipts
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#FE0000] rounded"
                />
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => showToast("Notification preferences updated successfully.")}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Save Notification Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Security & Access Credentials Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#FE0000]" />
            <h3 className="font-bold text-slate-900">Security & Account Credentials</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
            ACTIVE SESSION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Password & Authentication</span>
              <Link
                href="/login?mode=change_password"
                className="px-3 py-1 bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-1"
              >
                <span>Change Password →</span>
              </Link>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Last changed: 14 days ago. Strong password policy enforced across all trade procurement sessions.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Secure Account Access (MFA)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                Optional
              </span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Two-factor authenticator app verification is supported and optional during login.
            </p>
            <div className="pt-1">
              <Link
                href="/login?mode=mfa"
                className="text-xs font-bold text-[#FE0000] hover:underline inline-flex items-center gap-1"
              >
                <span>Configure Authenticator QR Code →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Delivery Addresses Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FE0000]" />
              <h3 className="font-bold text-slate-900 text-sm">Saved Workshop Delivery Depots</h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Addresses verified with NZ Post / LINZ database for swift parts dispatch.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Depot Address</span>
          </button>
        </div>

        {savedAddresses.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-2">
            <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-600">No saved depot addresses</p>
            <p className="text-slate-400 text-[11px]">
              Use the NZ Post autocomplete tool above to add your workshop bay.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${addr.isDefault
                  ? "border-[#FE0000]/30 bg-red-50/10 shadow-xs"
                  : "border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs"
                  }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900 leading-snug">{addr.label}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {addr.isDefault && (
                        <span className="text-[9px] font-bold bg-[#FE0000] text-white px-2 py-0.5 rounded-full uppercase">
                          Default
                        </span>
                      )}
                    </div>
                  </div>

                  {addr.businessName && (
                    <p className="text-[11px] font-semibold text-slate-700">
                      {addr.businessName}
                    </p>
                  )}
                  <p className="text-slate-600 text-xs">
                    {addr.streetAddress}{addr.suburb ? `, ${addr.suburb}` : ""}
                  </p>
                  <p className="text-slate-600 text-xs font-medium">
                    {addr.city} {addr.postalCode}
                  </p>

                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      NZ Post Verified
                    </span>
                  </div>

                  <p className="text-slate-500 text-[11px] pt-1">
                    Contact: {addr.recipientName} ({addr.phone})
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  {!addr.isDefault ? (
                    <button
                      type="button"
                      onClick={() => {
                        setDefaultAddress(addr.id);
                        showToast(`"${addr.label}" is now the default delivery depot.`);
                      }}
                      className="text-slate-600 hover:text-[#FE0000] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Star className="w-3 h-3" />
                      <span>Set as Default</span>
                    </button>
                  ) : (
                    <span className="text-slate-400 italic">Primary Depot</span>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove depot "${addr.label}"?`)) {
                        deleteSavedAddress(addr.id);
                        showToast(`Depot "${addr.label}" removed.`);
                      }
                    }}
                    className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                    title="Delete address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Depot Address Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FE0000]" />
                <h3 className="font-bold text-slate-900 text-sm">Add Workshop Delivery Depot</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-4 text-xs">
              {/* Integrated NZ Post / Address Autocomplete Service */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-2">
                <NZAddressLookup
                  onSelectAddress={handleSelectNZAddress}
                  label="Search NZ Address (NZ Post / LINZ / Google Autocomplete)"
                  placeholder="Type NZ street address, workshop bay or suburb..."
                />
                <p className="text-[10px] text-slate-500">
                  Selecting a validated address will automatically populate street, suburb, city, and 4-digit postcode.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Depot / Location Label *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. North Shore Workshop Bay 3"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#FE0000]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Company / Trade Entity
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SP Motors Ltd"
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#FE0000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) =>
                      setFormData({ ...formData, recipientName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#FE0000]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#FE0000]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">Street Address *</label>
                  {formData.isVerified && (
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified via {formData.verifiedSource}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. 88 Constellation Drive"
                  value={formData.streetAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, streetAddress: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#FE0000]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Suburb</label>
                  <input
                    type="text"
                    placeholder="Rosedale"
                    value={formData.suburb}
                    onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#FE0000]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#FE0000]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    placeholder="0632"
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#FE0000]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  className="w-4 h-4 text-[#FE0000] rounded"
                />
                <span className="font-semibold text-slate-700">
                  Set as default delivery address for new parts requests
                </span>
              </label>

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
                  className="px-4 py-2 rounded-xl bg-[#FE0000] hover:bg-[#9B0A0F] text-white font-bold shadow-md shadow-[#FE0000]/20"
                >
                  Save Depot Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
