"use client";

import React from "react";
import { CheckSquare } from "lucide-react";
import { usePortal } from "@/context/portal-context";

export function OrdersView() {
  const { requests, setSelectedRequest, setActiveTab, setIsNewRequestModalOpen } = usePortal();

  // Orders in procurement or placed
  const orderRequests = requests.filter(
    (r) => r.status === "Ordered" || r.status === "Sourcing" || r.status === "Shipped" || r.status === "Approved"
  );

  const getStatusColors = (status: string) => {
    switch (status) {
      case "Ordered":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Sourcing":
        return "bg-indigo-50 text-indigo-700 border border-indigo-200";
      case "Shipped":
        return "bg-sky-100 text-sky-800 border border-sky-300";
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      default:
        return "bg-purple-50 text-purple-700 border border-purple-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>Supplier Fulfillment Queue</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Procurement Orders</h2>
          <p className="text-xs text-slate-500">
            Active purchase orders released to international manufacturers & suppliers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("shipments")}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Live Shipments →
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Invoices & Ledger →
          </button>
        </div>
      </div>

      {orderRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-500">No active procurement orders</p>
          <p className="text-xs text-slate-400 mt-1">Submit a new parts request to get started.</p>
          <button
            onClick={() => setIsNewRequestModalOpen(true)}
            className="mt-4 px-5 py-2 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
          >
            New Parts Request →
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Order / Req ID</th>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Part Description</th>
                  <th className="py-3.5 px-4">PO Status</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orderRequests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <td className="py-4 px-6 font-mono font-bold text-slate-900 group-hover:text-[#ED2025]">
                      {req.requestNumber}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-700 max-w-[220px] truncate" title={req.part.name}>
                      {req.part.name}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColors(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {req.quotedValue ? `$${req.quotedValue.toFixed(2)}` : "—"}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      {req.status === "Shipped" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab("shipments");
                          }}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          Track Shipment →
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(req);
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          View Details →
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
