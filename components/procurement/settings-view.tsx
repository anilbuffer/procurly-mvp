"use client";

import React, { useState } from "react";
import { Settings, Percent, Users, Check } from "lucide-react";
import { PROCUREMENT_STAFF } from "@/lib/mock-procurement-data";

export function ProcurementSettingsView() {
  const [standardMargin, setStandardMargin] = useState(25);
  const [tradeMargin, setTradeMargin] = useState(20);
  const [highValueMargin, setHighValueMargin] = useState(30);
  const [validityDays, setValidityDays] = useState(5);
  const [terms, setTerms] = useState(
    "Standard Autohub Trade Terms. Valid for 5 business days. All prices in NZD inclusive of GST where applicable."
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [marginSaved, setMarginSaved] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveMargins = () => {
    setMarginSaved(true);
    showToast(`Default margins saved: ${standardMargin}% Standard, ${tradeMargin}% Trade.`);
    setTimeout(() => setMarginSaved(false), 2500);
  };

  const handleSaveSettings = () => {
    setSettingsSaved(true);
    showToast("Procurement operational terms & quote validity updated.");
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl font-bold text-xs animate-in slide-in-from-top-3 fade-in duration-200">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Margin Defaults */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2B4499]/10 text-[#2B4499] flex items-center justify-center">
            <Percent className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Default Margin Settings</h2>
            <p className="text-xs text-slate-500">Configure default profit margin percentages</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Standard Margin
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={standardMargin}
                  onChange={(e) => setStandardMargin(Number(e.target.value))}
                  className="w-24 px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED2025]/20"
                />
                <span className="text-xs text-slate-500 font-bold">%</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Trade Account Margin
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tradeMargin}
                  onChange={(e) => setTradeMargin(Number(e.target.value))}
                  className="w-24 px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED2025]/20"
                />
                <span className="text-xs text-slate-500 font-bold">%</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                High-Value Margin (&gt;NZ$2,000)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={highValueMargin}
                  onChange={(e) => setHighValueMargin(Number(e.target.value))}
                  className="w-24 px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED2025]/20"
                />
                <span className="text-xs text-slate-500 font-bold">%</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleSaveMargins}
            className={`px-4 py-2 text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95 inline-flex items-center gap-1.5 ${
              marginSaved
                ? "bg-emerald-600 text-white"
                : "bg-[#ED2025] hover:bg-[#d11a1f] text-white"
            }`}
          >
            {marginSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Margin Settings</span>
            )}
          </button>
        </div>
      </div>

      {/* Staff Management */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Procurement Staff</h2>
            <p className="text-xs text-slate-500">Team members who can be assigned to requests</p>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {PROCUREMENT_STAFF.map((staff) => (
            <div key={staff.id} className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2B4499] to-[#1d2e7e] text-white font-bold text-xs flex items-center justify-center">
                  {staff.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{staff.name}</p>
                  <p className="text-[11px] text-slate-500">{staff.role}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Settings className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">General Settings</h2>
            <p className="text-xs text-slate-500">System preferences and defaults</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Default Quote Validity (Days)
            </label>
            <input
              type="number"
              value={validityDays}
              onChange={(e) => setValidityDays(Number(e.target.value))}
              className="w-24 px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED2025]/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Default Quote Terms
            </label>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED2025]/20 resize-none"
            />
          </div>
          <button
            onClick={handleSaveSettings}
            className={`px-4 py-2 text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95 inline-flex items-center gap-1.5 ${
              settingsSaved
                ? "bg-emerald-600 text-white"
                : "bg-[#ED2025] hover:bg-[#d11a1f] text-white"
            }`}
          >
            {settingsSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Settings</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
