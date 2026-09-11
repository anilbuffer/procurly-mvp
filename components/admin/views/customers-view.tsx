"use client";

import React, { useState } from "react";
import {
  Building2,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  ArrowRight,
  Shield,
  Layers,
  X,
} from "lucide-react";
import { CustomerRecord, CustomerStatus, PartRequest } from "@/types/shared";
import { useUnifiedData } from "@/context/unified-data-context";
import { StatusBadge } from "../status-badge";

export function CustomersView() {
  const { customers, requests, updateCustomerStatus, addCustomer } = useUnifiedData();

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Customer Form (Matching Section 27)
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !email) return;

    const newCust: CustomerRecord = {
      id: `cust-${Date.now()}`,
      businessName,
      contactName,
      email,
      phone,
      status: "Active",
      registrationDate: new Date().toISOString().split("T")[0],
      requestCount: 0,
      notes: "Directly added by Autohub administration desk.",
    };

    addCustomer(newCust);
    setShowAddModal(false);
    setBusinessName("");
    setContactName("");
    setEmail("");
    setPhone("");
  };

  const getCustomerRequests = (customerId: string): PartRequest[] => {
    return requests.filter(
      (r) =>
        r.customerId === customerId ||
        r.customerName.toLowerCase() ===
          customers.find((c) => c.id === customerId)?.businessName.toLowerCase()
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Customer Trade Accounts ({customers.length})
          </h2>
          <p className="text-xs text-slate-500">
            Manage automotive workshops, fleet operators, and trade dealerships registered on Procurly.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-[#ED2025] hover:bg-[#C8101E] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Customer Accounts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Business Name</th>
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Requests</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((cust) => {
                const custReqs = getCustomerRequests(cust.id);
                const reqCount = custReqs.length || cust.requestCount || 0;

                return (
                  <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                          {cust.businessName[0]}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {cust.businessName}
                          </span>
                          {cust.notes && (
                            <span className="text-[10px] text-slate-400 line-clamp-1">
                              {cust.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {cust.contactName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <a href={`mailto:${cust.email}`} className="hover:underline">
                        {cust.email}
                      </a>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{cust.phone}</td>
                    <td className="py-3.5 px-4 text-slate-500">{cust.registrationDate}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          cust.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : cust.status === "Pending Approval"
                            ? "bg-amber-50 text-amber-800 border border-amber-200 animate-pulse"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {cust.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                      {reqCount}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomer(cust)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-xs"
                        >
                          View
                        </button>

                        {cust.status === "Pending Approval" && (
                          <button
                            type="button"
                            onClick={() => updateCustomerStatus(cust.id, "Active")}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                          >
                            Approve
                          </button>
                        )}

                        {cust.status === "Active" && (
                          <button
                            type="button"
                            onClick={() => updateCustomerStatus(cust.id, "Suspended")}
                            className="px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-rose-600 rounded-lg"
                          >
                            Suspend
                          </button>
                        )}

                        {cust.status === "Suspended" && (
                          <button
                            type="button"
                            onClick={() => updateCustomerStatus(cust.id, "Active")}
                            className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer / Modal (Section 27) */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                  {selectedCustomer.businessName[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedCustomer.businessName}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Registered on {selectedCustomer.registrationDate}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
              <div>
                <span className="text-slate-400 block text-[11px]">Contact Person</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedCustomer.contactName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Account Status</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                  {selectedCustomer.status}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Email</span>
                <span className="font-medium text-slate-800">{selectedCustomer.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Phone</span>
                <span className="font-medium text-slate-800">{selectedCustomer.phone}</span>
              </div>
            </div>

            {/* Customer's Associated Requests */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Customer Parts Requests ({getCustomerRequests(selectedCustomer.id).length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {getCustomerRequests(selectedCustomer.id).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No requests recorded yet.</p>
                ) : (
                  getCustomerRequests(selectedCustomer.id).map((req) => (
                    <div
                      key={req.id}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-[#ED2025] mr-2">
                          {req.requestNumber}
                        </span>
                        <span className="font-semibold text-slate-800">
                          {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                        </span>
                        <span className="text-slate-500 block text-[11px] mt-0.5">
                          {req.part.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={req.status} size="sm" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Customer */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Customer Account</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter trade registration details (matching customer registration schema).
            </p>

            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Business / Workshop Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Mechanical Ltd"
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Craig Watson"
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. craig@apexmech.co.nz"
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +64 9 489 1234"
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#ED2025] hover:bg-[#C8101E] text-white rounded-xl shadow-xs"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
