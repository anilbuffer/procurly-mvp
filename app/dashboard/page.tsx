"use client";

import React from "react";
import { PortalProvider } from "@/context/portal-context";
import { CustomerPortalLayout } from "@/components/portal/customer-portal-layout";

export default function DashboardPage() {
  return (
    <PortalProvider>
      <CustomerPortalLayout />
    </PortalProvider>
  );
}
