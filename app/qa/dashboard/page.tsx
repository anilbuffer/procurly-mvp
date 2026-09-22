"use client";

import React, { Suspense } from "react";
import { QADashboardView } from "@/components/qa/qa-dashboard-view";

export default function QADashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QADashboardView />
    </Suspense>
  );
}
