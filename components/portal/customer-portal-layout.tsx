"use client";

import React, { useState, useEffect } from "react";
import { PortalSidebar } from "./portal-sidebar";
import { PortalHeader } from "./portal-header";
import { NewRequestModal } from "./new-request-modal";
import { RequestDetailsModal } from "./request-details-modal";
import { PaymentModal } from "./payment-modal";
import { usePortal } from "@/context/portal-context";
import { useUnifiedData } from "@/context/unified-data-context";

interface CustomerPortalLayoutProps {
  children?: React.ReactNode;
}

export function CustomerPortalLayout({ children }: CustomerPortalLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { selectedRequest, setSelectedRequest, setSelectedRequestDetailsTab, setActiveTab } = usePortal();
  const { getRequestById } = useUnifiedData();

  // Listen for search item selection in customer portal
  useEffect(() => {
    const handleOpenCustomerRequest = (e: Event) => {
      const customEvent = e as CustomEvent<{ requestId: string; tab?: string }>;
      if (!customEvent.detail?.requestId) return;
      const req = getRequestById(customEvent.detail.requestId);
      if (req) {
        setSelectedRequest(req as any);
        if (customEvent.detail.tab) {
          setSelectedRequestDetailsTab(customEvent.detail.tab);
        }
        setActiveTab("requests");
      }
    };

    window.addEventListener("procurly:open-customer-request", handleOpenCustomerRequest);
    return () => window.removeEventListener("procurly:open-customer-request", handleOpenCustomerRequest);
  }, [getRequestById, setSelectedRequest, setSelectedRequestDetailsTab, setActiveTab]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex  text-slate-900">
      {/* Dark Sidebar */}
      <PortalSidebar
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-h-screen ${isSidebarCollapsed ? "ml-20" : "ml-64"
          }`}
      >
        {/* Top Sticky Header */}
        <PortalHeader
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full flex flex-col">
          {selectedRequest ? <RequestDetailsModal /> : children}
        </main>
      </div>

      {/* Interactive Global Modals */}
      <NewRequestModal />
      <PaymentModal />
    </div>
  );
}
