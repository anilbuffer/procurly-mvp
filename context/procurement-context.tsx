"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import {
  ProcurementRequest,
  ProcurementTab,
  ProcurementNotification,
  ProcurementMetrics,
  Supplier,
  SupplierQuotation,
  CostCalculation,
  CustomerQuoteVersion,
  ProcurementNote,
  SupplierOrder,
  CustomerResponse,
} from "@/types/procurement";
import { RequestStatus } from "@/types/portal";
import {
  INITIAL_PROCUREMENT_REQUESTS,
  INITIAL_PROCUREMENT_NOTIFICATIONS,
  MOCK_SUPPLIERS,
} from "@/lib/mock-procurement-data";

// ─── Context Interface ─────────────────────────────────────

interface ProcurementContextType {
  // Navigation
  activeTab: ProcurementTab;
  setActiveTab: (tab: ProcurementTab) => void;

  // Requests
  requests: ProcurementRequest[];
  selectedRequest: ProcurementRequest | null;
  setSelectedRequest: (req: ProcurementRequest | null) => void;
  viewRequestDetail: (req: ProcurementRequest) => void;
  backToList: () => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  staffFilter: string;
  setStaffFilter: (s: string) => void;

  // Suppliers
  suppliers: Supplier[];

  // Notifications
  notifications: ProcurementNotification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Metrics
  metrics: ProcurementMetrics;

  // ─── Actions ────
  assignStaff: (requestId: string, staffName: string) => void;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  addSupplierQuotation: (requestId: string, quote: SupplierQuotation) => void;
  editSupplierQuotation: (requestId: string, quoteId: string, updated: SupplierQuotation) => void;
  deleteSupplierQuotation: (requestId: string, quoteId: string) => void;
  selectSupplierQuotation: (requestId: string, quoteId: string) => void;
  updateCostCalculation: (requestId: string, calc: CostCalculation) => void;
  sendCustomerQuote: (requestId: string, version: CustomerQuoteVersion) => void;
  reviseQuote: (requestId: string, version: CustomerQuoteVersion) => void;
  handleCustomerResponse: (requestId: string, response: CustomerResponse) => void;
  placeSupplierOrder: (requestId: string, order: SupplierOrder) => void;
  markPaymentPaid: (requestId: string) => void;
  markPaymentUnpaid: (requestId: string) => void;
  addInternalNote: (requestId: string, note: ProcurementNote) => void;
  addSupplier: (supplier: Supplier) => void;
}

const ProcurementContext = createContext<ProcurementContextType | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────

export function ProcurementProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTabState] = useState<ProcurementTab>("dashboard");
  const [requests, setRequests] = useState<ProcurementRequest[]>(INITIAL_PROCUREMENT_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<ProcurementRequest | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [notifications, setNotifications] = useState<ProcurementNotification[]>(
    INITIAL_PROCUREMENT_NOTIFICATIONS
  );

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [staffFilter, setStaffFilter] = useState("All");

  // ─── Metrics ───────────────────────────────────────────

  const metrics = useMemo<ProcurementMetrics>(() => {
    return {
      newRequests: requests.filter((r) => r.status === "Submitted").length,
      sourcing: requests.filter((r) => r.status === "Sourcing").length,
      quotesReady: requests.filter((r) => r.status === "Quoted").length,
      awaitingPayment: requests.filter((r) => r.status === "Awaiting Payment").length,
      readyToOrder: requests.filter(
        (r) => r.payment?.status === "Paid" && r.status === "Approved"
      ).length,
      ordersInProgress: requests.filter(
        (r) => r.status === "Ordered" || r.status === "Shipped"
      ).length,
    };
  }, [requests]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // ─── Navigation & URL Synchronization ──────────────────

  const updateUrl = useCallback((tab: ProcurementTab, reqId?: string | null) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    if (reqId) {
      url.searchParams.set("id", reqId);
    } else {
      url.searchParams.delete("id");
    }
    window.history.pushState({ tab, id: reqId }, "", url.pathname + url.search);
  }, []);

  const setActiveTab = useCallback(
    (tab: ProcurementTab) => {
      setActiveTabState(tab);
      setSelectedRequest(null);
      updateUrl(tab, null);
    },
    [updateUrl]
  );

  const viewRequestDetail = useCallback(
    (req: ProcurementRequest) => {
      setSelectedRequest(req);
      updateUrl(activeTab, req.id);
    },
    [activeTab, updateUrl]
  );

  const backToList = useCallback(() => {
    setSelectedRequest(null);
    updateUrl(activeTab, null);
  }, [activeTab, updateUrl]);

  // Sync on mount and handle browser back/forward (popstate)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab") as ProcurementTab | null;
      const id = params.get("id");
      if (
        tab &&
        ["dashboard", "sourcing", "requests", "suppliers", "quotes", "orders", "settings"].includes(tab)
      ) {
        setActiveTabState(tab);
      }
      if (id) {
        const found = requests.find((r) => r.id === id || r.requestNumber === id);
        if (found) {
          setSelectedRequest(found);
        }
      } else {
        setSelectedRequest(null);
      }
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [requests]);

  // ─── Notifications ─────────────────────────────────────

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // ─── Helper: update a request by ID ────────────────────

  const updateRequest = useCallback(
    (requestId: string, updater: (r: ProcurementRequest) => ProcurementRequest) => {
      setRequests((prev) => {
        const updated = prev.map((r) => (r.id === requestId ? updater(r) : r));
        // Also sync selectedRequest if it's the one being updated
        const selected = updated.find((r) => r.id === requestId);
        if (selected && selectedRequest?.id === requestId) {
          setSelectedRequest(selected);
        }
        return updated;
      });
    },
    [selectedRequest]
  );

  // ─── Actions ───────────────────────────────────────────

  const assignStaff = useCallback(
    (requestId: string, staffName: string) => {
      updateRequest(requestId, (r) => ({
        ...r,
        assignedStaff: staffName,
        status: r.status === "Submitted" ? "Sourcing" : r.status,
      }));
    },
    [updateRequest]
  );

  const updateRequestStatus = useCallback(
    (requestId: string, status: RequestStatus) => {
      updateRequest(requestId, (r) => ({ ...r, status }));
    },
    [updateRequest]
  );

  const addSupplierQuotation = useCallback(
    (requestId: string, quote: SupplierQuotation) => {
      updateRequest(requestId, (r) => ({
        ...r,
        supplierQuotations: [...r.supplierQuotations, quote],
      }));
    },
    [updateRequest]
  );

  const editSupplierQuotation = useCallback(
    (requestId: string, quoteId: string, updated: SupplierQuotation) => {
      updateRequest(requestId, (r) => ({
        ...r,
        supplierQuotations: r.supplierQuotations.map((q) =>
          q.id === quoteId ? updated : q
        ),
      }));
    },
    [updateRequest]
  );

  const deleteSupplierQuotation = useCallback(
    (requestId: string, quoteId: string) => {
      updateRequest(requestId, (r) => ({
        ...r,
        supplierQuotations: r.supplierQuotations.filter((q) => q.id !== quoteId),
        selectedQuotationId:
          r.selectedQuotationId === quoteId ? undefined : r.selectedQuotationId,
      }));
    },
    [updateRequest]
  );

  const selectSupplierQuotation = useCallback(
    (requestId: string, quoteId: string) => {
      updateRequest(requestId, (r) => ({
        ...r,
        selectedQuotationId: quoteId,
        supplierQuotations: r.supplierQuotations.map((q) => ({
          ...q,
          isSelected: q.id === quoteId,
        })),
      }));
    },
    [updateRequest]
  );

  const updateCostCalculation = useCallback(
    (requestId: string, calc: CostCalculation) => {
      updateRequest(requestId, (r) => ({
        ...r,
        costCalculation: calc,
      }));
    },
    [updateRequest]
  );

  const sendCustomerQuote = useCallback(
    (requestId: string, version: CustomerQuoteVersion) => {
      updateRequest(requestId, (r) => ({
        ...r,
        status: "Quoted" as RequestStatus,
        quotedValue: version.totalAmount,
        customerQuoteVersions: [...r.customerQuoteVersions, version],
      }));
      // Add notification
      const req = requests.find((r) => r.id === requestId);
      setNotifications((prev) => [
        {
          id: `pn-${Date.now()}`,
          type: "Quote Sent" as const,
          title: `Quote Sent: ${req?.requestNumber || "Request"}`,
          description: `Customer quote v${version.version} sent for NZ$${version.totalAmount.toFixed(2)}.`,
          timestamp: "Just now",
          read: false,
          requestId,
        },
        ...prev,
      ]);
    },
    [requests]
  );

  const reviseQuote = useCallback(
    (requestId: string, version: CustomerQuoteVersion) => {
      updateRequest(requestId, (r) => {
        // Mark previous version as "Revised"
        const updatedVersions = r.customerQuoteVersions.map((v) =>
          v.status === "Sent" ? { ...v, status: "Revised" as const } : v
        );
        return {
          ...r,
          status: "Quoted" as RequestStatus,
          quotedValue: version.totalAmount,
          customerQuoteVersions: [...updatedVersions, version],
        };
      });
    },
    [updateRequest]
  );

  const handleCustomerResponse = useCallback(
    (requestId: string, response: CustomerResponse) => {
      updateRequest(requestId, (r) => {
        let newStatus: RequestStatus = r.status;
        if (response === "Accepted") {
          newStatus = "Awaiting Payment";
        } else if (response === "Rejected") {
          newStatus = r.status; // keep current, can be reviewed
        }
        // Mark latest quote version status
        const updatedVersions = r.customerQuoteVersions.map((v, i) => {
          if (i === r.customerQuoteVersions.length - 1) {
            return {
              ...v,
              status: (response === "Accepted" ? "Accepted" : response === "Rejected" ? "Rejected" : v.status) as CustomerQuoteVersion["status"],
            };
          }
          return v;
        });
        return {
          ...r,
          status: newStatus,
          customerResponse: response,
          customerQuoteVersions: updatedVersions,
          ...(response === "Accepted"
            ? {
                payment: r.payment || {
                  id: `pay-${Date.now()}`,
                  requestId: r.id,
                  invoiceNumber: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
                  amount: r.quotedValue || 0,
                  currency: "NZD",
                  status: "Unpaid" as const,
                  paymentReference: r.requestNumber,
                  bankDetails: {
                    bankName: "ANZ New Zealand",
                    accountName: "Autohub Procurement NZ Ltd",
                    accountNumber: "01-0288-0349821-00",
                    swiftBic: "ANZBNZ22",
                  },
                  dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0],
                },
              }
            : {}),
        };
      });
    },
    [updateRequest]
  );

  const placeSupplierOrder = useCallback(
    (requestId: string, order: SupplierOrder) => {
      // Gate: check payment status
      const req = requests.find((r) => r.id === requestId);
      if (!req || req.payment?.status !== "Paid") {
        return; // Cannot place order without payment
      }
      updateRequest(requestId, (r) => ({
        ...r,
        status: "Ordered" as RequestStatus,
        supplierOrder: order,
      }));
      setNotifications((prev) => [
        {
          id: `pn-${Date.now()}`,
          type: "Order Placed" as const,
          title: `Supplier Order Placed: ${req.requestNumber}`,
          description: `Order placed with ${order.supplierName}. Ref: ${order.supplierRef}`,
          timestamp: "Just now",
          read: false,
          requestId,
        },
        ...prev,
      ]);
    },
    [requests, updateRequest]
  );

  const markPaymentPaid = useCallback(
    (requestId: string) => {
      const now = new Date().toISOString();
      updateRequest(requestId, (r) => ({
        ...r,
        status: "Approved" as RequestStatus,
        payment: r.payment
          ? {
              ...r.payment,
              status: "Paid" as const,
              paidAt: now,
            }
          : {
              id: `pay-${Date.now()}`,
              requestId: r.id,
              invoiceNumber: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
              amount: r.quotedValue || 0,
              currency: "NZD",
              status: "Paid" as const,
              paymentReference: r.requestNumber,
              bankDetails: {
                bankName: "ANZ New Zealand",
                accountName: "Autohub Procurement NZ Ltd",
                accountNumber: "01-0288-0349821-00",
                swiftBic: "ANZBNZ22",
              },
              dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              paidAt: now,
            },
      }));
      const req = requests.find((r) => r.id === requestId);
      setNotifications((prev) => [
        {
          id: `pn-${Date.now()}`,
          type: "Payment Received" as const,
          title: `Payment Received: ${req?.requestNumber || "Request"}`,
          description: `Payment confirmed for ${req?.customerName || "Customer"}. Ready to place supplier order.`,
          timestamp: "Just now",
          read: false,
          requestId,
        },
        ...prev,
      ]);
    },
    [requests, updateRequest]
  );

  const markPaymentUnpaid = useCallback(
    (requestId: string) => {
      updateRequest(requestId, (r) => ({
        ...r,
        status: "Awaiting Payment" as RequestStatus,
        payment: r.payment
          ? {
              ...r.payment,
              status: "Unpaid" as const,
              paidAt: undefined,
            }
          : {
              id: `pay-${Date.now()}`,
              requestId: r.id,
              invoiceNumber: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
              amount: r.quotedValue || 0,
              currency: "NZD",
              status: "Unpaid" as const,
              paymentReference: r.requestNumber,
              bankDetails: {
                bankName: "ANZ New Zealand",
                accountName: "Autohub Procurement NZ Ltd",
                accountNumber: "01-0288-0349821-00",
                swiftBic: "ANZBNZ22",
              },
              dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            },
      }));
    },
    [updateRequest]
  );

  const addInternalNote = useCallback(
    (requestId: string, note: ProcurementNote) => {
      updateRequest(requestId, (r) => ({
        ...r,
        internalNotes: [...r.internalNotes, note],
      }));
    },
    [updateRequest]
  );

  const addSupplier = useCallback((supplier: Supplier) => {
    setSuppliers((prev) => [supplier, ...prev]);
  }, []);

  // ─── Provider Value ────────────────────────────────────

  return (
    <ProcurementContext.Provider
      value={{
        activeTab,
        setActiveTab,
        requests,
        selectedRequest,
        setSelectedRequest,
        viewRequestDetail,
        backToList,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        staffFilter,
        setStaffFilter,
        suppliers,
        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        metrics,
        assignStaff,
        updateRequestStatus,
        addSupplierQuotation,
        editSupplierQuotation,
        deleteSupplierQuotation,
        selectSupplierQuotation,
        updateCostCalculation,
        sendCustomerQuote,
        reviseQuote,
        handleCustomerResponse,
        placeSupplierOrder,
        markPaymentPaid,
        markPaymentUnpaid,
        addInternalNote,
        addSupplier,
      }}
    >
      {children}
    </ProcurementContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────

export function useProcurement() {
  const context = useContext(ProcurementContext);
  if (!context) {
    throw new Error("useProcurement must be used within a ProcurementProvider");
  }
  return context;
}
