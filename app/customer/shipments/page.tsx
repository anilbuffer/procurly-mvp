import { Suspense } from "react";
import { ShipmentsView } from "@/components/portal/shipments-view";

export default function CustomerShipmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center text-xs text-slate-400">
          Loading Active Freight Consignments...
        </div>
      }
    >
      <ShipmentsView />
    </Suspense>
  );
}
