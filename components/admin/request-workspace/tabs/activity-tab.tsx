"use client";

import React from "react";
import {
  Clock,
  CheckCircle2,
  FileText,
  DollarSign,
  Truck,
  ShoppingBag,
  MessageSquare,
  AlertCircle,
  User,
} from "lucide-react";
import { PartRequest, RequestActivity } from "@/types/shared";

interface ActivityTabProps {
  request: PartRequest;
}

export function ActivityTab({ request }: ActivityTabProps) {
  const activities: RequestActivity[] = request.activity || [];

  const getIcon = (type: RequestActivity["type"]) => {
    switch (type) {
      case "quote":
        return <FileText className="w-3.5 h-3.5 text-amber-600" />;
      case "payment":
        return <DollarSign className="w-3.5 h-3.5 text-emerald-600" />;
      case "order":
        return <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />;
      case "shipment":
        return <Truck className="w-3.5 h-3.5 text-cyan-600" />;
      case "note":
        return <MessageSquare className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900">
          Request Activity Log ({activities.length})
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Chronological record of status changes, quotes, customer approval, payment recording, and fulfillment.
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          No activity records logged for this request yet.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {activities.map((item) => (
              <div key={item.id} className="relative flex items-start gap-4">
                {/* Timeline node */}
                <div className="absolute -left-6 mt-1 w-5 h-5 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center shadow-xs">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {item.actor}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.timeLabel || item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
