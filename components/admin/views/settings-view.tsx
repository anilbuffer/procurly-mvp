"use client";

import React, { useState } from "react";
import {
  Settings,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Save,
  RotateCcw,
  Percent,
  Truck,
  Hash,
  FileText,
} from "lucide-react";
import { useUnifiedData } from "@/context/unified-data-context";

export function AdminSettingsView() {
  const { resetToMockDefaults } = useUnifiedData();

  // Settings State (Section 30)
  const [defaultMargin, setDefaultMargin] = useState(20);
  const [defaultFreight, setDefaultFreight] = useState(85);
  const [taxRate, setTaxRate] = useState(15);
  const [refPrefix, setRefPrefix] = useState("AH-P-");
  const [m365Connected, setM365Connected] = useState(true);
  const [m365Sender, setM365Sender] = useState("procurement@autohub.co.nz");
  const [termsVersion, setTermsVersion] = useState("v2026.1 (NZ Commercial Trade)");
  const [privacyVersion, setPrivacyVersion] = useState("v2026.1 (NZ Privacy Act 2020)");

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (confirm("Reset all shared requests, customers, and payments back to initial mock benchmark data?")) {
      resetToMockDefaults();
      alert("Mock data has been reset to initial state!");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            System Configuration &amp; Parameters
          </h2>
          <p className="text-xs text-slate-500">
            Configure default quotation rules, taxation, email gateways, and compliance versions.
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Settings saved successfully!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Pricing & Quotation Defaults */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Percent className="w-4 h-4 text-[#ED2025]" />
            Procurement &amp; Quotation Calculation Defaults
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Default Autohub Margin (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={defaultMargin}
                onChange={(e) => setDefaultMargin(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Applied automatically in the Quote Tab on supplier landed costs.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Default Manual Freight (NZD)
              </label>
              <input
                type="number"
                min="0"
                value={defaultFreight}
                onChange={(e) => setDefaultFreight(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Single flat freight rule for customer quotes (No comparison engine).
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                GST / Sales Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                New Zealand Goods &amp; Services Tax (Default 15%).
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Request Reference Prefix
              </label>
              <input
                type="text"
                value={refPrefix}
                onChange={(e) => setRefPrefix(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025] font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Format: <code className="font-bold text-slate-700">{refPrefix}000123</code>
              </span>
            </div>
          </div>
        </div>

        {/* 2. Microsoft 365 Email Integration */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#2B4499]" />
              Microsoft 365 Email Configuration
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Active &amp; Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Outbound Notification Sender Email
              </label>
              <input
                type="email"
                value={m365Sender}
                onChange={(e) => setM365Sender(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2B4499]/30 focus:border-[#2B4499]"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={m365Connected}
                  onChange={(e) => setM365Connected(e.target.checked)}
                  className="rounded border-slate-300 accent-[#2B4499]"
                />
                <span className="font-semibold text-slate-800">
                  Enable Microsoft 365 SMTP Gateway for quote dispatch
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* 3. Legal & Compliance Versions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            Terms &amp; Privacy Policy Versions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Terms &amp; Conditions Version
              </label>
              <input
                type="text"
                value={termsVersion}
                onChange={(e) => setTermsVersion(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Privacy Policy Version
              </label>
              <input
                type="text"
                value={privacyVersion}
                onChange={(e) => setPrivacyVersion(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handleResetData}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Mock Data to Initial State
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#ED2025] hover:bg-[#C8101E] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 self-end sm:self-auto"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
