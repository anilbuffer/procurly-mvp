"use client";

import React, { Suspense } from "react";
import { SubadminDashboardView } from "@/components/subadmin/subadmin-dashboard-view";

export default function SubadminDashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubadminDashboardView />
    </Suspense>
  );
}
