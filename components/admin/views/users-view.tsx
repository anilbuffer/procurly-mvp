"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Users,
  User,
  Mail,
  Phone,
  Shield,
  Building,
  Briefcase
} from "lucide-react";
import { StaffUser, StaffRole } from "@/types/shared";
import { useUnifiedData } from "@/context/unified-data-context";

export function UsersView() {
  const { staffUsers, addStaffUser, updateStaffUser } = useUnifiedData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<StaffRole>("Procurement");
  const [department, setDepartment] = useState("Strategic Sourcing");
  const [title, setTitle] = useState("Sourcing Specialist");

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setPhone("");
    setRole("Procurement");
    setDepartment("Strategic Sourcing");
    setTitle("Sourcing Specialist");
    setShowAddModal(true);
  };

  const handleOpenEdit = (user: StaffUser) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || "");
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
        phone,
        role,
        department,
        title,
      });
    } else {
      const newUser: StaffUser = {
        id: `user-staff-${Date.now()}`,
        name,
        email,
        phone,
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
          className="px-3.5 py-2 bg-[#B30D12] hover:bg-[#C8101E] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Internal User
        </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowAddModal(false)}
          />

          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 relative z-10 flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0 border border-rose-100 shadow-inner">
                <Users className="w-6 h-6 text-[#B30D12]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {editingUser ? "Edit Internal User" : "Add Internal Autohub Staff"}
                </h3>
                <p className="text-sm text-slate-500">
                  Assign roles and operational permissions.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Liam Cooper"
                    required
                    className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#B30D12]/10 focus:border-[#B30D12] transition-all bg-white placeholder:text-slate-400 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. liam.cooper@procurly.io"
                      required
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#B30D12]/10 focus:border-[#B30D12] transition-all bg-white placeholder:text-slate-400 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +64 21 000 0000"
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#B30D12]/10 focus:border-[#B30D12] transition-all bg-white placeholder:text-slate-400 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Assigned Role <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Shield className="w-4 h-4 text-slate-400" />
                    </div>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as StaffRole)}
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#B30D12]/10 focus:border-[#B30D12] transition-all bg-white shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="Administrator">Administrator</option>
                      <option value="Procurement">Procurement</option>
                      <option value="Operations">Operations</option>
                      <option value="Finance">Finance</option>
                    </select>
                    {/* Custom chevron for select */}
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Building className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Strategic Sourcing"
                      required
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#B30D12]/10 focus:border-[#B30D12] transition-all bg-white placeholder:text-slate-400 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Job Title <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sourcing Specialist"
                    required
                    className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-[#B30D12]/10 focus:border-[#B30D12] transition-all bg-white placeholder:text-slate-400 shadow-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold bg-[#B30D12] hover:bg-[#C8101E] text-white rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 group"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
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
