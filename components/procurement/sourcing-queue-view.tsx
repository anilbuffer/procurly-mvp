"use client";

import React, { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { useProcurement } from "@/context/procurement-context";
import { StatusBadge } from "./status-badge";
import { FilterBar } from "./filter-bar";
import { EmptyState } from "./empty-state";
import { PROCUREMENT_STAFF } from "@/lib/mock-procurement-data";

export function SourcingQueueView() {
  const {
    requests,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    staffFilter,
    setStaffFilter,
    viewRequestDetail,
  } = useProcurement();

  // Default: show Submitted + Sourcing
  const filteredRequests = useMemo(() => {
    let filtered = requests;

    // Status filter (default = sourcing-relevant)
    if (statusFilter === "All") {
      filtered = filtered.filter(
        (r) => r.status === "Submitted" || r.status === "Sourcing"
      );
    } else {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    // Staff filter
    if (staffFilter !== "All") {
      filtered = filtered.filter((r) => r.assignedStaff === staffFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.requestNumber.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          `${r.vehicle.make} ${r.vehicle.model}`.toLowerCase().includes(q) ||
          r.part.name.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [requests, statusFilter, staffFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <FilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by request, customer, vehicle, part..."
        filters={[
          {
            label: "Status",
            value: statusFilter,
            options: [
              { label: "New & Sourcing", value: "All" },
              { label: "Submitted", value: "Submitted" },
              { label: "Sourcing", value: "Sourcing" },
              { label: "Quoted", value: "Quoted" },
            ],
            onChange: setStatusFilter,
          },
          {
            label: "Staff",
            value: staffFilter,
            options: [
              { label: "All Staff", value: "All" },
              ...PROCUREMENT_STAFF.map((s) => ({ label: s.name, value: s.name })),
              { label: "Unassigned", value: "Unassigned" },
            ],
            onChange: setStaffFilter,
          },
        ]}
      />

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 pb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Sourcing Queue</h2>
          <p className="text-xs text-slate-500">
            {filteredRequests.length} request{filteredRequests.length !== 1 ? "s" : ""} requiring procurement attention
          </p>
        </div>

        {filteredRequests.length === 0 ? (
          <EmptyState
            title="No requests in sourcing queue"
            description="All requests have been processed or no matches found for your filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Request #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Part Requested</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4">Date Submitted</th>
                  <th className="py-3 px-4">Assigned Staff</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredRequests.map((req) => (
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
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {req.vehicle.make} {req.vehicle.model} {req.vehicle.year}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate" title={req.part.name}>
                      {req.part.name}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                      {req.part.quantity}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {req.dateSubmitted}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {req.assignedStaff === "Unassigned" ? (
                        <span className="text-amber-600 font-semibold">Unassigned</span>
                      ) : (
                        <span className="text-slate-700 font-medium">{req.assignedStaff}</span>
                      )}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
