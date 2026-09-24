"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CheckSquare, Truck, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { usePortal } from "@/context/portal-context";

export function OrdersView() {
  const router = useRouter();
  const { requests, setSelectedRequest, setActiveTab, setIsNewRequestModalOpen } = usePortal();

  // Orders in procurement, placed, or fulfilled
  const orderRequests = requests.filter(
    (r) =>
      r.status === "Ordered" ||
      r.status === "Shipped" ||
      r.status === "Delivered" ||
      r.status === "Completed" ||
      r.status === "Approved" ||
      r.status === "Invoicing" ||
      r.status === "Awaiting Payment" ||
      r.status === "Sourcing" ||
      r.supplierOrder !== undefined
  );

  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(orderRequests.length / ITEMS_PER_PAGE);
  const paginatedOrders = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return orderRequests.slice(start, start + ITEMS_PER_PAGE);
  }, [orderRequests, currentPage]);

  const getStatusColors = (status: string) => {
    switch (status) {
      // In-Process States
      case "Submitted":
      case "Sourcing":
      case "Quoted":
      case "Approved":
      case "Invoicing":
      case "Ordered":
      case "Subadmin Review":
      case "Ready for Dispatch":
      case "Shipped":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      
      // Waiting / Attention States
      case "Awaiting Payment":
      case "Subadmin Pending":
      case "Subadmin Hold":
        return "bg-red-50 text-red-700 border border-red-200";
      
      // Completed States
      case "Subadmin Approved":
      case "Delivered":
      case "Completed":
        return "bg-green-50 text-green-700 border border-green-200";
        
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
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
            Active purchase orders released to international manufacturers & suppliers across the 9-stage lifecycle
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
          <Link
            href="/customer/requests/new"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-[#B30D12] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
          >
            New Parts Request →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Order / Req ID</th>
                  <th className="py-3.5 px-4">PO Reference</th>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Part Description</th>
                  <th className="py-3.5 px-4">Supplier</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Order Value</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedOrders.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <td className="py-4 px-6 font-mono font-bold text-slate-900 group-hover:text-[#B30D12]">
                      {req.requestNumber}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                      {req.supplierOrder?.supplierRef || (
                        <span className="text-slate-400 font-normal">Awaiting PO</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                    </td>
                    <td className="py-4 px-4 max-w-[200px]">
                      <p className="font-medium text-slate-700 truncate" title={req.part.name}>
                        {req.part.name}
                      </p>
                      {req.supporting?.freightPreference && (
                        <p className="text-[11px] text-[#0ea5e9] font-medium mt-0.5">
                          Freight: {req.supporting.freightPreference === "Sea Freight" ? "Ocean Freight" : req.supporting.freightPreference}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-600 whitespace-nowrap">
                      {req.supplierOrder?.supplierName ||
                        req.supplierQuotations?.find((q) => q.isSelected)?.supplierName ||
                        "Autohub Network"}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${getStatusColors(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      ${(req.quotedValue || req.customerQuote?.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      {req.shipment ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/customer/shipments?id=${req.id}`);
                          }}
                          className="px-3 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Truck className="w-3 h-3" />
                          Track →
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(req);
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          Details →
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, orderRequests.length)} of {orderRequests.length} orders
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-[11px] font-bold text-slate-600 px-3 uppercase tracking-wider">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
