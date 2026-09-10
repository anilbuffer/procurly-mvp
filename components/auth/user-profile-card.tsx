"use client";

import React from "react";
import { useAuth } from "@/context/auth-context";
import {
  ShieldCheck,
  Briefcase,
  Eye,
  LogOut,
  LogIn,
  CheckCircle2,
  Building2,
  Mail,
  UserCheck,
} from "lucide-react";

export function UserProfileCard() {
  const { user, isAuthenticated, isLoading, availableUsers, switchUser, logout, login } = useAuth();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#ED2025]/10 text-[#ED2025] border border-[#ED2025]/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Administrator
          </span>
        );
      case "manager":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#263b9f]/10 text-[#263b9f] border border-[#263b9f]/20">
            <Briefcase className="w-3.5 h-3.5" />
            Procurement Manager
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <Eye className="w-3.5 h-3.5" />
            Viewer / Analyst
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 animate-pulse flex items-center justify-center min-h-[220px]">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-[#263b9f] border-t-transparent rounded-full animate-spin" />
          <span>Loading mock auth session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <LogOut className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">No Active Session</h3>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Select a mock user below to authenticate and simulate permissions.
        </p>
        <button
          onClick={() => login(availableUsers[0].id)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#263b9f] hover:bg-[#1d2e7e] rounded-lg transition-colors shadow-sm"
        >
          <LogIn className="w-4 h-4" />
          Login as {availableUsers[0].name}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden transition-all hover:shadow-md">
      {/* Top Banner with Brand Gradient */}
      <div className="h-16 bg-gradient-to-r from-[#263b9f] to-[#ED2025] relative" />

      <div className="px-6 pb-6 pt-0 relative">
        {/* Avatar & Header */}
        <div className="flex items-end justify-between -mt-9 mb-4">
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-18 h-18 rounded-full border-4 border-white shadow-sm object-cover bg-slate-100"
              style={{ width: "72px", height: "72px" }}
            />
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div>{getRoleBadge(user.role)}</div>
        </div>

        {/* User Details */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">{user.name}</h3>
          <p className="text-sm font-medium text-slate-600 mt-0.5">{user.title}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{user.organization}</span>
          </div>
        </div>

        {/* Quick Mock Role Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#263b9f]" />
              Switch Mock Persona
            </span>
            <button
              onClick={logout}
              className="text-xs text-slate-400 hover:text-[#ED2025] transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              Sign out
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {availableUsers.map((u) => {
              const isSelected = u.id === user.id;
              return (
                <button
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col ${
                    isSelected
                      ? "border-[#263b9f] bg-[#263b9f]/5 ring-1 ring-[#263b9f]/30"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-semibold text-slate-800 truncate">{u.name.split(" ")[0]}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#263b9f] shrink-0" />}
                  </div>
                  <span className="text-[10px] capitalize text-slate-500 font-medium">
                    {u.role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
