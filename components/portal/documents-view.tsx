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
  const { requests, activeCustomer, setSelectedRequest, setActiveTab } = usePortal();
  const [docSearch, setDocSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const docs = React.useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      category: "Tax Invoice" | "Quotation" | "Customs & Compliance" | "Fitment Verification" | "Legal & Warranty";
      date: string;
      size: string;
      ref: string;
      vehicleInfo?: string;
      partInfo?: string;
      amount?: string;
    }> = [];

    // Official terms
    list.push({
      id: "policy-terms",
      title: "Autohub Trade Customer Procurement Terms v2.4",
      category: "Legal & Warranty",
      date: "01 Aug 2026",
      size: "520 KB",
      ref: "POLICY",
    });

    requests.forEach((req) => {
      const veh = `${req.vehicle?.year || ""} ${req.vehicle?.make || ""} ${req.vehicle?.model || ""}`.trim();
      const prt = req.part?.name || req.partName || "Component";
      const amt = req.pricing?.totalCustomerNZD || req.quotedValue || req.customerQuote?.totalAmount || 0;

      // 1. Tax Invoice if invoice exists or status >= Approved
      if (
        req.invoiceReference ||
        req.payment ||
        ["Approved", "Awaiting Payment", "Ordered", "Shipped", "Delivered", "Completed"].includes(req.status)
      ) {
        const invNum = req.invoiceReference || req.payment?.invoiceNumber || `INV-2026-${req.requestNumber.replace(/[^0-9]/g, "")}`;
        list.push({
          id: `inv-${req.id}`,
          title: `Tax Invoice ${invNum} (${veh} - ${prt})`,
          category: "Tax Invoice",
          date: req.createdAt ? req.createdAt.split("T")[0] : "08 Sep 2026",
          size: "188 KB",
          ref: req.requestNumber,
          vehicleInfo: veh,
          partInfo: prt,
          amount: amt ? `$${amt.toFixed(2)} NZD` : undefined,
        });
      }

      // 2. Quotation Spec Sheet if quoted or costCalculations exist
      if (
        req.quotedValue ||
        req.customerQuote ||
        (req.costCalculations && req.costCalculations.length > 0) ||
        ["Quoted", "Approved", "Awaiting Payment", "Ordered", "Shipped", "Delivered", "Completed"].includes(req.status)
      ) {
        list.push({
          id: `quote-${req.id}`,
          title: `Official Quotation Spec Sheet ${req.requestNumber} (${veh} OEM ${prt})`,
          category: "Quotation",
          date: req.createdAt ? req.createdAt.split("T")[0] : "08 Sep 2026",
          size: "245 KB",
          ref: req.requestNumber,
          vehicleInfo: veh,
          partInfo: prt,
          amount: amt ? `$${amt.toFixed(2)} NZD` : undefined,
        });
      }

      // 3. Customs / Waybill if Shipped / Delivered / Completed
      if (req.shipment || ["Shipped", "Delivered", "Completed"].includes(req.status)) {
        const carrier = req.shipment?.carrier || "DHL Express Airfreight";
        const tracking = req.shipment?.trackingNumber || `AWB-${req.requestNumber.replace(/[^0-9]/g, "")}`;
        list.push({
          id: `customs-${req.id}`,
          title: `NZ Customs MPI Clearance & Consignment (${carrier} - ${tracking})`,
          category: "Customs & Compliance",
          date: req.shipment?.dispatchedAt ? req.shipment.dispatchedAt.split("T")[0] : "07 Sep 2026",
          size: "412 KB",
          ref: req.requestNumber,
          vehicleInfo: veh,
          partInfo: prt,
        });
      }
    });

    return list;
  }, [requests]);

  const handleDownload = (doc: (typeof docs)[0]) => {
    const fileContent = `========================================================
AUTOHUB / PROCURly OFFICIAL PROCUREMENT RECORD
========================================================
Document Title : ${doc.title}
Category       : ${doc.category}
Reference      : ${doc.ref}
Date Issued    : ${doc.date}
Document Size  : ${doc.size}
Customer       : ${activeCustomer?.businessName || "SP Motors Ltd"} (${activeCustomer?.contactName || "Contact"})
Delivery Addr  : ${activeCustomer?.deliveryAddress || "Auckland, New Zealand"}
Vehicle        : ${doc.vehicleInfo || "Trade Vehicle Specified"}
Part / Scope   : ${doc.partInfo || "Procured Component"}
Financial Val  : ${doc.amount || "Refer to Schedule"}
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
