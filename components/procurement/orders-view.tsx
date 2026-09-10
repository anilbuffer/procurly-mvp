"use client";

import React, { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { useProcurement } from "@/context/procurement-context";
import { StatusBadge } from "./status-badge";
import { PaymentStatusBadge } from "./payment-status-badge";
import { FilterBar } from "./filter-bar";
import { EmptyState } from "./empty-state";

export function ProcurementOrdersView() {
  const {
    requests,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    viewRequestDetail,
  } = useProcurement();

  // Orders: requests that have supplier orders or are in Ordered/Shipped/Delivered/Completed
  const orderRequests = useMemo(() => {
    let filtered = requests.filter(
      (r) =>
        r.supplierOrder ||
        r.status === "Ordered" ||
        r.status === "Shipped" ||
        r.status === "Delivered" ||
        r.status === "Completed"
    );

    if (statusFilter !== "All") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.requestNumber.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          (r.supplierOrder?.supplierName || "").toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [requests, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <FilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search orders..."
        filters={[
          {
            label: "Status",
            value: statusFilter,
            options: [
              { label: "All Orders", value: "All" },
              { label: "Ordered", value: "Ordered" },
              { label: "Shipped", value: "Shipped" },
              { label: "Delivered", value: "Delivered" },
              { label: "Completed", value: "Completed" },
            ],
            onChange: setStatusFilter,
          },
        ]}
      />

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 pb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Procurement Orders</h2>
          <p className="text-xs text-slate-500">
            {orderRequests.length} order{orderRequests.length !== 1 ? "s" : ""}
          </p>
        </div>

        {orderRequests.length === 0 ? (
          <EmptyState title="No orders yet" description="Orders will appear once supplier orders are placed." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Order #</th>
                  <th className="py-3 px-4">Request #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Part</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {orderRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    onClick={() => viewRequestDetail(req)}
                  >
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-900 group-hover:text-[#ED2025] transition-colors whitespace-nowrap">
                      {req.supplierOrder?.supplierRef || "—"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                      {req.requestNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                      {req.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {req.supplierOrder?.supplierName || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-[150px] truncate" title={req.part.name}>
                      {req.part.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {req.supplierOrder?.orderDate || "—"}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {req.payment ? (
                        <PaymentStatusBadge status={req.payment.status} />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {req.supplierOrder?.orderDate || req.dateSubmitted}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
