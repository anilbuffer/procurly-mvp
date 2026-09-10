"use client";

import React, { useState } from "react";
import {
  FolderArchive,
  FileText,
  Download,
  Search,
  FileCheck2,
  ShieldCheck,
  Building2,
  ExternalLink,
  Check,
} from "lucide-react";
import { usePortal } from "@/context/portal-context";

export function DocumentsView() {
  const { requests, setSelectedRequest, setActiveTab } = usePortal();
  const [docSearch, setDocSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleDownload = (doc: (typeof docs)[0]) => {
    const fileContent = `========================================================
AUTOHUB / PROCURly OFFICIAL PROCUREMENT RECORD
========================================================
Document Title : ${doc.title}
Category       : ${doc.category}
Reference      : ${doc.ref}
Date Issued    : ${doc.date}
Document Size  : ${doc.size}
Customer       : SP Motors Ltd (NZBN 9429049988776)
Audited By     : Autohub Procurement Operations
Status         : Verified Official Record
========================================================
This document is generated from the Procurly Trade Portal.
For formal queries contact ops@procurly.autohub.co.nz
========================================================`;

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.title.replace(/[^a-zA-Z0-9-_]/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage(`Downloaded "${doc.title}"`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const docs = [
    {
      id: "doc-1",
      title: "Tax Invoice INV-2026-00892 (Toyota Hiace Control Arm)",
      category: "Tax Invoice",
      date: "08 Sep 2026",
      size: "184 KB",
      ref: "AH-P-000125",
    },
    {
      id: "doc-2",
      title: "Quotation Spec Sheet AH-P-000128 (Hiace OEM Arm)",
      category: "Quotation",
      date: "08 Sep 2026",
      size: "240 KB",
      ref: "AH-P-000128",
    },
    {
      id: "doc-3",
      title: "NZ Customs MPI Bio-security Release Notice (MF-NZ-98234812)",
      category: "Customs & Compliance",
      date: "07 Sep 2026",
      size: "412 KB",
      ref: "AH-P-000135",
    },
    {
      id: "doc-4",
      title: "Tax Invoice INV-2026-00810 (Honda Civic Brembo Calipers)",
      category: "Tax Invoice",
      date: "02 Sep 2026",
      size: "192 KB",
      ref: "AH-P-000120",
    },
    {
      id: "doc-5",
      title: "Autohub Trade Customer Procurement Terms v2.4",
      category: "Legal & Warranty",
      date: "01 Aug 2026",
      size: "520 KB",
      ref: "POLICY",
    },
  ];

  const filtered = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(docSearch.toLowerCase()) ||
      d.category.toLowerCase().includes(docSearch.toLowerCase()) ||
      d.ref.toLowerCase().includes(docSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl font-bold text-xs animate-in slide-in-from-top-3 fade-in duration-200">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <FolderArchive className="w-4 h-4" />
            <span>Compliance & Records</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Procurement Documents</h2>
          <p className="text-xs text-slate-500">
            Official GST tax invoices, supplier packing slips, and customs clearance certs
          </p>
        </div>

        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search documents or request ID..."
            value={docSearch}
            onChange={(e) => setDocSearch(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#ED2025]"
          />
        </div>
      </div>

      {/* Operational Invoicing Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-700">
        <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 block">Autohub Invoicing Notice</span>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Official GST tax invoices are generated outside this portal within Autohub's core operational system. The portal records invoice references and tracks payment status (<strong>Unpaid</strong> / <strong>Paid</strong>).
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 text-xs">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{d.title}</h4>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-slate-500 mt-1">
                  <button
                    onClick={() => {
                      if (d.category === "Tax Invoice") setActiveTab("payments");
                      else if (d.category === "Quotation") setActiveTab("requests");
                      else if (d.category === "Customs & Compliance") setActiveTab("shipments");
                    }}
                    className="bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded font-semibold text-slate-700 transition-colors"
                    title={`View in ${d.category} section`}
                  >
                    {d.category} →
                  </button>
                  <span>{d.date}</span>
                  <span>•</span>
                  <span>{d.size}</span>
                  <span>•</span>
                  {d.ref !== "POLICY" ? (
                    <button
                      onClick={() => {
                        const target = requests.find((r) => r.requestNumber === d.ref);
                        if (target) setSelectedRequest(target);
                        else setActiveTab("requests");
                      }}
                      className="font-mono text-[#ED2025] font-bold hover:underline"
                      title="Open linked request details"
                    >
                      {d.ref}
                    </button>
                  ) : (
                    <span className="font-mono text-slate-500 font-bold">{d.ref}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDownload(d)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
