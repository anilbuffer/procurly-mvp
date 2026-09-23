"use client";

import React, { useState } from "react";
import { PartRequest } from "@/types/shared";
import { Camera, Image as ImageIcon, UploadCloud, CheckCircle2, X } from "lucide-react";
import { useUnifiedData } from "@/context/unified-data-context";

interface QAMediaTabProps {
  request: PartRequest;
}

export function QAMediaTab({ request }: QAMediaTabProps) {
  // In a real app, you would upload to a server. Here we just fake state.
  const [qaMedia, setQaMedia] = useState<string[]>(request.supporting.photos || []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Fake adding a placeholder image on drop for MVP
    setQaMedia([...qaMedia, "https://images.unsplash.com/photo-1600705607991-382de92b0c48?w=800&auto=format&fit=crop&q=60"]);
  };

  const handleRemove = (idx: number) => {
    setQaMedia(qaMedia.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <Camera className="w-5 h-5 text-[#B30D12]" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Supplier QA Media (Photos / Videos)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Drag and drop media files provided by the supplier. These will be required before confirming dispatch.
            </p>
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-200 hover:border-[#B30D12]/60 rounded-xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 mb-6"
        >
          <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-600 font-medium">
            Drag photos/videos here or <span className="text-[#B30D12] font-bold">browse files</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
            Supports JPG, PNG, MP4 up to 50MB
          </p>
        </div>

        {/* Media Gallery */}
        {qaMedia.length > 0 ? (
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-500" />
              Uploaded QA Evidence
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {qaMedia.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200">
                  <img src={url} alt={`QA Media ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleRemove(idx)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-md"
                      title="Remove Media"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
            No QA media uploaded yet.
          </div>
        )}
      </div>

      <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            Dispatch Prerequisite
          </h4>
          <p className="text-xs text-emerald-700 mt-1">
            Supplier photos must be uploaded and verified before the part can be marked as dispatched. Customers will be able to review these in their portal.
          </p>
        </div>
      </div>
    </div>
  );
}
