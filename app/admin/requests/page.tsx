import { Suspense } from "react";
import { RequestsTableView } from "@/components/admin/views/requests-table-view";

export default function AdminRequestsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-slate-400">
          Loading Requests Workspace...
        </div>
      }
    >
      <RequestsTableView />
    </Suspense>
  );
}
