"use client";

import React, { useState } from "react";
import { useProcurement } from "@/context/procurement-context";
import { ProcurementSidebar } from "./procurement-sidebar";
import { ProcurementHeader } from "./procurement-header";
import { ProcurementDashboardView } from "./dashboard-view";
import { SourcingQueueView } from "./sourcing-queue-view";
import { ProcurementRequestsView } from "./requests-view";
import { SuppliersView } from "./suppliers-view";
import { QuotesView } from "./quotes-view";
import { ProcurementOrdersView } from "./orders-view";
import { ProcurementSettingsView } from "./settings-view";
import { RequestDetailView } from "./request-detail-view";

export function ProcurementLayout() {
  const { activeTab, selectedRequest } = useProcurement();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderContent = () => {
    // If a request is selected, show the detail workspace
    if (selectedRequest) {
      return <RequestDetailView />;
    }

    switch (activeTab) {
      case "dashboard":
        return <ProcurementDashboardView />;
      case "sourcing":
        return <SourcingQueueView />;
      case "requests":
        return <ProcurementRequestsView />;
      case "suppliers":
        return <SuppliersView />;
      case "quotes":
        return <QuotesView />;
      case "orders":
        return <ProcurementOrdersView />;
      case "settings":
        return <ProcurementSettingsView />;
      default:
        return <ProcurementDashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      {/* Dark Sidebar */}
      <ProcurementSidebar
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
        <ProcurementHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
