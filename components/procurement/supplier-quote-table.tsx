"use client";

import React from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import { SupplierQuotation } from "@/types/procurement";

interface SupplierQuoteTableProps {
  quotations: SupplierQuotation[];
  selectedId?: string;
  onSelect: (quoteId: string) => void;
  onEdit: (quote: SupplierQuotation) => void;
  onDelete: (quoteId: string) => void;
  readOnly?: boolean;
}

export function SupplierQuoteTable({
  quotations,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  readOnly = false,
}: SupplierQuoteTableProps) {
  if (quotations.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-slate-500">
        No supplier quotations yet. Add one to begin sourcing.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <th className="py-2.5 px-4">Supplier</th>
            <th className="py-2.5 px-3">Country</th>
            <th className="py-2.5 px-3 text-right">Cost</th>
            <th className="py-2.5 px-3 text-right">Freight</th>
            <th className="py-2.5 px-3 text-right">Total</th>
            <th className="py-2.5 px-3 text-center">Lead Time</th>
            <th className="py-2.5 px-3">Condition</th>
            <th className="py-2.5 px-3">Availability</th>
            {!readOnly && <th className="py-2.5 px-3 text-center">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
          {quotations.map((q) => {
            const isSelected = q.id === selectedId;
            return (
              <tr
                key={q.id}
                className={`transition-colors ${
                  isSelected
                    ? "bg-emerald-50/50 border-l-2 border-l-emerald-500"
                    : "hover:bg-slate-50/80"
                }`}
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-bold text-slate-900 text-xs">{q.supplierName}</p>
                    <p className="text-[10px] text-slate-500">{q.supplierContact}</p>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{q.supplierCountry}</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                  NZ${q.supplierCost.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-700 whitespace-nowrap">
                  NZ${q.supplierFreight.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                  NZ${(q.supplierCost + q.supplierFreight).toLocaleString()}
                </td>
                <td className="py-3 px-3 text-center font-bold text-slate-700 whitespace-nowrap">
                  {q.leadTimeDays} day{q.leadTimeDays !== 1 ? "s" : ""}
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                      q.condition === "Genuine"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : q.condition === "Aftermarket"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : q.condition === "Remanufactured"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {q.condition}
                  </span>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      q.availability === "In Stock"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : q.availability === "Available"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : q.availability === "Back Order"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {q.availability}
                  </span>
                </td>
                {!readOnly && (
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onSelect(q.id)}
                        title={isSelected ? "Selected" : "Select this quote"}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-600"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEdit(q)}
                        title="Edit"
                        className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center transition-all"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDelete(q.id)}
                        title="Delete"
                        className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
