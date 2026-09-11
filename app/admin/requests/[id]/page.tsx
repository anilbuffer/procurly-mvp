"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useUnifiedData } from "@/context/unified-data-context";
import { RequestDetailWorkspace } from "@/components/admin/request-workspace/request-detail-workspace";

export default function AdminRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getRequestById } = useUnifiedData();

  const id = (params?.id as string) || "";
  const request = getRequestById(id);

  if (!request) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">Request Not Found</h3>
        <p className="text-xs text-slate-500 mb-4">
          No parts request could be found matching identifier &quot;{id}&quot;.
        </p>
        <button
          type="button"
          onClick={() => router.push("/admin/requests")}
          className="px-4 py-2 bg-[#ED2025] text-white rounded-xl text-xs font-semibold"
        >
          Return to All Requests
        </button>
      </div>
    );
  }

  return (
    <RequestDetailWorkspace
      request={request}
      onBack={() => router.push("/admin/requests")}
    />
  );
}
