"use client";

import React, { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { useProcurement } from "@/context/procurement-context";
import { StatusBadge } from "./status-badge";
import { EmptyState } from "./empty-state";

export function QuotesView() {
  const { requests, viewRequestDetail, searchQuery, setSearchQuery } = useProcurement();

  // Requests that have customer quotes
  const quotedRequests = useMemo(() => {
    let filtered = requests.filter(
      (r) => r.customerQuoteVersions.length > 0
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.requestNumber.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [requests, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative w-full sm:w-80">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search quotes..."
          className="w-full pl-4 pr-4 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025] transition-all"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 pb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Customer Quotes</h2>
          <p className="text-xs text-slate-500">
            All customer-facing quotations and their statuses
          </p>
        </div>

        {quotedRequests.length === 0 ? (
          <EmptyState title="No quotes created yet" description="Quotes will appear here once supplier quotations are selected and customer quotes are built." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Request #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Part</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Quote Status</th>
                  <th className="py-3 px-4">Request Status</th>
                  <th className="py-3 px-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {quotedRequests.map((req) => {
                  const latestQuote = req.customerQuoteVersions[req.customerQuoteVersions.length - 1];
                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                      onClick={() => viewRequestDetail(req)}
                    >
                      <td className="py-3.5 px-5 font-mono font-bold text-slate-900 group-hover:text-[#ED2025] transition-colors whitespace-nowrap">
                        {req.requestNumber}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                        {req.customerName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[180px] truncate" title={req.part.name}>
                        {req.part.name}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        v{latestQuote.version}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        NZ${latestQuote.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            latestQuote.status === "Accepted"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : latestQuote.status === "Rejected"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : latestQuote.status === "Sent"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : latestQuote.status === "Draft"
                              ? "bg-slate-100 text-slate-600 border-slate-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {latestQuote.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="py-3.5 px-5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            viewRequestDetail(req);
                          }}
                          className="text-[11px] font-bold text-[#ED2025] hover:text-[#d11a1f] inline-flex items-center gap-1 transition-colors"
                        >
                          Open
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
