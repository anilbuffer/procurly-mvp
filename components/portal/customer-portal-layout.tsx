"use client";

import React, { useState } from "react";
import { usePortal } from "@/context/portal-context";
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

export function CustomerPortalLayout() {
  const { activeTab } = usePortal();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
