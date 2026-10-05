"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { PortalSidebar } from "./portal-sidebar";
import { PortalHeader } from "./portal-header";
import { NewRequestModal } from "./new-request-modal";
import { RequestDetailsModal } from "./request-details-modal";
import { PaymentModal } from "./payment-modal";
import { AcceptQuoteModal } from "./accept-quote-modal";
import { usePortal } from "@/context/portal-context";
import { useUnifiedData } from "@/context/unified-data-context";

interface CustomerPortalLayoutProps {
  children?: React.ReactNode;
}

export function CustomerPortalLayout({ children }: CustomerPortalLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { selectedRequest, setSelectedRequest, setSelectedRequestDetailsTab, setActiveTab, activeTab } = usePortal();
  const { getRequestById } = useUnifiedData();

  // Close mobile drawer whenever pathname or activeTab changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, activeTab]);

  // Sync with ?request= search param (e.g. /customer/requests?request=req-000145)
  useEffect(() => {
    const requestId = searchParams?.get("request");
    if (!requestId) return;

    if (
      selectedRequest &&
      (selectedRequest.id.toLowerCase() === requestId.toLowerCase() ||
        selectedRequest.requestNumber.toLowerCase() === requestId.toLowerCase())
    ) {
      return;
    }

    const req = getRequestById(requestId);
    if (req) {
      setSelectedRequest(req as any);
      const tab = searchParams?.get("tab");
      if (tab) {
        setSelectedRequestDetailsTab(tab);
      } else if (req.status === "Quoted" || req.actionType === "review_quote") {
        setSelectedRequestDetailsTab("quote");
      }
      setActiveTab("requests");
    }
  }, [searchParams, getRequestById, selectedRequest, setSelectedRequest, setSelectedRequestDetailsTab, setActiveTab]);

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
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 w-full overflow-x-hidden">
      {/* Dark Sidebar with Mobile Drawer */}
      <PortalSidebar
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        mobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area - ml-0 on mobile/tablet, lg:ml-64/20 on desktop */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-h-screen min-w-0 max-w-full overflow-x-hidden ml-0 ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Top Sticky Header */}
        <PortalHeader
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleMobile={() => setIsMobileOpen(!isMobileOpen)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0 flex flex-col">
          {selectedRequest ? <RequestDetailsModal /> : children}
        </main>
      </div>

      {/* Interactive Global Modals */}
      <NewRequestModal />
      <PaymentModal />
      <AcceptQuoteModal />
    </div>
  );
}
