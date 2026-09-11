"use client";

import React, { useState } from "react";
import {
  UserCog,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Shield,
  User,
  X,
} from "lucide-react";
import { StaffUser, StaffRole } from "@/types/shared";
import { useUnifiedData } from "@/context/unified-data-context";

export function UsersView() {
  const { staffUsers, addStaffUser, updateStaffUser, switchStaffRole, activeStaffRole } =
    useUnifiedData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("Procurement");
  const [department, setDepartment] = useState("Strategic Sourcing");
  const [title, setTitle] = useState("Sourcing Specialist");

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setRole("Procurement");
    setDepartment("Strategic Sourcing");
    setTitle("Sourcing Specialist");
    setShowAddModal(true);
  };

  const handleOpenEdit = (user: StaffUser) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setDepartment(user.department);
    setTitle(user.title);
    setShowAddModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      updateStaffUser(editingUser.id, {
        name,
        email,
        role,
        department,
        title,
      });
    } else {
      const newUser: StaffUser = {
        id: `user-staff-${Date.now()}`,
        name,
        email,
        role,
        department,
        title,
        status: "Active",
        lastLogin: "Never",
      };
      addStaffUser(newUser);
    }

    setShowAddModal(false);
  };

  const roleDescriptions: Record<StaffRole, string> = {
    Administrator: "Full system administration access across all workflows, settings, and permissions.",
    Procurement: "Manages Requests, Supplier Sourcing, Quotations, and Supplier Purchase Orders.",
    Operations: "Manages Requests, Inbound/Outbound Shipments, Milestones, and Final Delivery.",
    Finance: "Manages Requests, Payments, Settlement verification, and Invoice status.",
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Autohub Staff &amp; RBAC Management ({staffUsers.length})
          </h2>
          <p className="text-xs text-slate-500">
            Internal Autohub personnel roles within the single unified Admin Portal.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-3.5 py-2 bg-[#ED2025] hover:bg-[#C8101E] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Internal User
        </button>
      </div>

      {/* RBAC Overview Cards (Section 29) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {(["Administrator", "Procurement", "Operations", "Finance"] as StaffRole[]).map((r) => {
          const isActive = activeStaffRole === r;
          const count = staffUsers.filter((u) => u.role === r).length;

          return (
            <div
              key={r}
              className={`p-4 rounded-2xl border transition-all ${
                isActive
                  ? "bg-slate-900 text-white border-slate-800 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  {r}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? "bg-red-500 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {count} Staff
                </span>
              </div>
              <p
                className={`text-[11px] leading-relaxed mb-3 ${
                  isActive ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {roleDescriptions[r]}
              </p>
              <button
                type="button"
                onClick={() => switchStaffRole(r)}
                className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-emerald-500 text-white cursor-default"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                }`}
              >
                {isActive ? "✓ Active Session Role" : "Test as " + r}
              </button>
            </div>
          );
        })}
      </div>

      {/* Staff Table (Section 28) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      {u.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-8 h-8 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                          {u.name[0]}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-slate-900 block">{u.name}</span>
                        <span className="text-[10px] text-slate-400">{u.title}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{u.department}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">{u.lastLogin}</td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
                        title="Edit User"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateStaffUser(u.id, {
                            status: u.status === "Active" ? "Inactive" : "Active",
                          })
                        }
                        className="px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-rose-600 rounded-lg"
                      >
                        {u.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Add / Edit User */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {editingUser ? "Edit Internal User" : "Add Internal Autohub Staff"}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Assign roles and operational permissions.
            </p>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Liam Cooper"
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. liam.cooper@procurly.io"
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assigned Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as StaffRole)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Operations">Operations</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ED2025]/30 focus:border-[#ED2025]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sourcing Specialist"
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
                  {editingUser ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
