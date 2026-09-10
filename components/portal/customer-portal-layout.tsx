"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePortal } from "@/context/portal-context";
import { PortalTab } from "@/types/portal";
import { PortalSidebar } from "./portal-sidebar";
import { PortalHeader } from "./portal-header";
import { DashboardView } from "./dashboard-view";
import { RequestsView } from "./requests-view";
import { OrdersView } from "./orders-view";
import { ShipmentsView } from "./shipments-view";
import { PaymentsView } from "./payments-view";
import { DocumentsView } from "./documents-view";
import { SettingsView } from "./settings-view";
import { NewRequestModal } from "./new-request-modal";
import { RequestDetailsModal } from "./request-details-modal";
import { PaymentModal } from "./payment-modal";

const VALID_TABS: PortalTab[] = [
  "dashboard",
  "requests",
  "orders",
  "shipments",
  "payments",
  "documents",
  "settings",
];

export function CustomerPortalLayout() {
  const { activeTab, setActiveTab } = usePortal();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // On mount / URL change: sync URL → context
  useEffect(() => {
    const tabParam = searchParams?.get("tab") as PortalTab | null;
    if (tabParam && VALID_TABS.includes(tabParam)) {
      if (tabParam !== activeTab) {
        setActiveTab(tabParam);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // When activeTab changes in context: sync context → URL
  useEffect(() => {
    const currentTab = searchParams?.get("tab") as PortalTab | null;
    if (currentTab !== activeTab) {
      const params = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
      if (activeTab === "dashboard") {
        params.delete("tab");
      } else {
        params.set("tab", activeTab);
      }
      const queryString = params.toString();
      router.replace(`/dashboard${queryString ? `?${queryString}` : ""}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      {/* Dark Sidebar */}
      <PortalSidebar
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-h-screen ${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Top Sticky Header */}
        <PortalHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "requests" && <RequestsView />}
          {activeTab === "orders" && <OrdersView />}
          {activeTab === "shipments" && <ShipmentsView />}
          {activeTab === "payments" && <PaymentsView />}
          {activeTab === "documents" && <DocumentsView />}
          {activeTab === "settings" && <SettingsView />}
        </main>
      </div>

      {/* Interactive Global Modals */}
      <NewRequestModal />
      <RequestDetailsModal />
      <PaymentModal />
    </div>
  );
}
