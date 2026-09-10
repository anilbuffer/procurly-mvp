"use client";

import React from "react";
import { Clock, Check, X as XIcon, RotateCw } from "lucide-react";
import { CustomerQuoteVersion } from "@/types/procurement";

interface QuoteRevisionPanelProps {
  versions: CustomerQuoteVersion[];
  onRevise?: () => void;
  canRevise?: boolean;
}

export function QuoteRevisionPanel({
  versions,
  onRevise,
  canRevise = false,
}: QuoteRevisionPanelProps) {
  if (versions.length === 0) {
    return null;
  }

  const getStatusIcon = (status: CustomerQuoteVersion["status"]) => {
    switch (status) {
      case "Accepted":
        return <Check className="w-3.5 h-3.5 text-emerald-500" />;
      case "Rejected":
        return <XIcon className="w-3.5 h-3.5 text-red-500" />;
      case "Revised":
        return <RotateCw className="w-3.5 h-3.5 text-amber-500" />;
      case "Sent":
        return <Clock className="w-3.5 h-3.5 text-blue-500" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: CustomerQuoteVersion["status"]) => {
    switch (status) {
      case "Accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "Revised":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Sent":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Quote History
        </h4>
        {canRevise && onRevise && (
          <button
            onClick={onRevise}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-all"
          >
            <RotateCw className="w-3 h-3" />
            Revise Quote
          </button>
        )}
      </div>

      <div className="space-y-2">
        {versions
          .slice()
          .reverse()
          .map((v) => (
            <div
              key={v.version}
              className={`p-4 rounded-xl border ${
                v.status === "Sent" || v.status === "Accepted"
                  ? "bg-white border-slate-200"
                  : "bg-slate-50 border-slate-200/70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getStatusIcon(v.status)}</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        Quote v{v.version}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusColor(
                          v.status
                        )}`}
                      >
                        {v.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Sent: {v.sentAt}
                    </p>
                    {v.notes && (
                      <p className="text-[11px] text-slate-600 mt-1">{v.notes}</p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-mono font-black text-slate-900">
                    NZ${v.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Part: NZ${v.sellPrice.toLocaleString()} + Freight: NZ${v.freight.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Est. {v.estimatedTransitDays} business days
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
