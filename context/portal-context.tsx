"use client";

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  PartRequest,
  PortalTab,
  PortalNotification,
  ProcurementActivity,
  SavedAddress,
  QuoteAcceptanceAudit,
} from "@/types/portal";
import { CustomerRecord } from "@/types/shared";
import {
  INITIAL_ACTIVITIES,
  SAVED_ADDRESSES,
} from "@/lib/mock-portal-data";
import { useUnifiedData } from "@/context/unified-data-context";

interface PortalContextType {
  activeTab: PortalTab;
  setActiveTab: (tab: PortalTab) => void;
  requests: PartRequest[];
  selectedRequest: PartRequest | null;
  setSelectedRequest: (req: PartRequest | null) => void;
  isNewRequestModalOpen: boolean;
  setIsNewRequestModalOpen: (open: boolean) => void;
  isQuoteModalOpen: boolean;
  setIsQuoteModalOpen: (open: boolean) => void;
  quoteRequest: PartRequest | null;
  setQuoteRequest: (req: PartRequest | null) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  paymentRequest: PartRequest | null;
  setPaymentRequest: (req: PartRequest | null) => void;
  notifications: PortalNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  activities: ProcurementActivity[];
  savedAddresses: SavedAddress[];
  addSavedAddress: (address: SavedAddress) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  submitNewRequest: (reqData: Partial<PartRequest>) => PartRequest;
  acceptQuote: (requestId: string, acceptanceAudit: QuoteAcceptanceAudit) => void;
  rejectQuote: (requestId: string, reason: string) => void;
  submitPayment: (
    requestId: string,
    reference?: string
  ) => void;
  sendMessage: (requestId: string, text: string) => void;
  activeCustomer: CustomerRecord;
  setActiveCustomerId: (id: string) => void;
  availableCustomers: CustomerRecord[];
  metrics: {
    activeRequests: number;
    awaitingAction: number;
    inProcurement: number;
    inTransit: number;
  };
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    requests: sharedRequests,
    customers,
    notifications,
    submitCustomerRequest,
    acceptCustomerQuote,
    rejectCustomerQuote,
    markPaymentPaid,
    markNotificationAsRead: sharedMarkRead,
    markAllNotificationsAsRead: sharedMarkAllRead,
  } = useUnifiedData();

  // Active customer management (default SP Motors Ltd, customizable for testing)
  const [activeCustomerId, setActiveCustomerId] = useState<string>("cust-02");
  const activeCustomer = useMemo(() => {
    return customers.find((c) => c.id === activeCustomerId) || customers[1] || customers[0];
  }, [customers, activeCustomerId]);

  // Normalize shared requests for customer components (ensuring quotation alias is always present)
  const requests: PartRequest[] = useMemo(() => {
    return sharedRequests.map((r) => {
      const q = r.customerQuote || r.quotation;
      return {
        ...r,
        quotation: q,
        quotedValue: r.quotedValue || q?.totalAmount,
      } as PartRequest;
    });
  }, [sharedRequests]);

  // Derive active tab from URL pathname: /customer/[tab]
  const activeTab: PortalTab = useMemo(() => {
    if (!pathname) return "dashboard";
    const segments = pathname.split("/").filter(Boolean);
    const tabCandidate = segments[1] as PortalTab;
    if (
      tabCandidate &&
      ["dashboard", "requests", "orders", "shipments", "payments", "documents", "settings"].includes(tabCandidate)
    ) {
      return tabCandidate;
    }
    return "dashboard";
  }, [pathname]);

  const setActiveTab = useCallback(
    (tab: PortalTab) => {
      router.push(`/customer/${tab}`);
    },
    [router]
  );

  const [activities, setActivities] = useState<ProcurementActivity[]>(INITIAL_ACTIVITIES);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(SAVED_ADDRESSES);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedRequestState, setSelectedRequestState] = useState<PartRequest | null>(null);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteRequest, setQuoteRequest] = useState<PartRequest | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<PartRequest | null>(null);

  // Keep selectedRequest synchronized with updated shared request object
  const selectedRequest = useMemo(() => {
    if (!selectedRequestState) return null;
    const found = requests.find(
      (r) => r.id === selectedRequestState.id || r.requestNumber === selectedRequestState.requestNumber
    );
    return found || selectedRequestState;
  }, [requests, selectedRequestState]);

  const setSelectedRequest = useCallback((req: PartRequest | null) => {
    setSelectedRequestState(req);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (req) {
        url.searchParams.set("request", req.id);
      } else {
        url.searchParams.delete("request");
      }
      window.history.pushState({}, "", url.pathname + (url.search ? url.search : ""));
    }
  }, []);

  const addSavedAddress = useCallback((addr: SavedAddress) => {
    setSavedAddresses((prev) => {
      if (addr.isDefault) {
        return [addr, ...prev.map((a) => ({ ...a, isDefault: false }))];
      }
      return [...prev, addr];
    });
  }, []);

  // Sync request modal selection from URL query param on mount & popstate
  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const reqId = params.get("request");
      if (reqId) {
        const found = requests.find((r) => r.id === reqId || r.requestNumber === reqId);
        if (found) {
          setSelectedRequestState(found);
        }
      }
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [requests]);

  // Real dynamic counter metrics reflecting synchronized requests
  const metrics = useMemo(() => {
    const active = requests.filter((r) => r.status !== "Completed").length;
    const awaiting = requests.filter(
      (r) =>
        r.actionType === "review_quote" ||
        r.actionType === "pay_now" ||
        r.status === "Quoted" ||
        (r.status === "Approved" && r.payment?.status !== "Paid") ||
        (r.status === "Awaiting Payment" && r.payment?.status !== "Paid")
    ).length;
    const inProc = requests.filter(
      (r) =>
        r.status === "Sourcing" ||
        r.status === "Approved" ||
        r.status === "Awaiting Payment" ||
        r.status === "Ordered"
    ).length;
    const inTransit = requests.filter((r) => r.status === "Shipped").length;

    return {
      activeRequests: active,
      awaitingAction: awaiting,
      inProcurement: inProc,
      inTransit,
    };
  }, [requests]);

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markNotificationAsRead = (id: string) => {
    sharedMarkRead(id);
  };

  const markAllNotificationsAsRead = () => {
    sharedMarkAllRead();
  };

  const submitNewRequest = (reqData: Partial<PartRequest>): PartRequest => {
    return submitCustomerRequest({
      customerId: reqData.customerId || activeCustomer.id,
      customerName: reqData.customerName || activeCustomer.businessName,
      contactName: reqData.contactName || activeCustomer.contactName,
      customerEmail: reqData.customerEmail || activeCustomer.email,
      customerPhone: reqData.customerPhone || activeCustomer.phone,
      deliveryAddress: reqData.deliveryAddress || activeCustomer.deliveryAddress,
      ...reqData,
    }) as unknown as PartRequest;
  };

  const acceptQuote = (requestId: string, acceptanceAudit: QuoteAcceptanceAudit) => {
    acceptCustomerQuote(requestId, acceptanceAudit.acceptedBy);

    // Keep local activity log updated
    const target = requests.find((r) => r.id === requestId);
    const reqNum = target?.requestNumber || "Request";

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        timeLabel: "Just now",
        title: `Quote Accepted for ${reqNum}`,
        description: `Accepted by ${acceptanceAudit.acceptedBy}. Status moved to Approved. Invoice generated.`,
        type: "quote",
        requestId,
      },
      ...prev,
    ]);
  };

  const rejectQuote = (requestId: string, reason: string) => {
    rejectCustomerQuote(requestId, reason);

    const target = requests.find((r) => r.id === requestId);
    const reqNum = target?.requestNumber || "Request";

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        timeLabel: "Just now",
        title: `Quote Declined for ${reqNum}`,
        description: `Customer reason: ${reason}.`,
        type: "alert",
        requestId,
      },
      ...prev,
    ]);
  };

  const submitPayment = (
    requestId: string,
    reference?: string
  ) => {
    markPaymentPaid(requestId, reference);

    const target = requests.find((r) => r.id === requestId);
    const reqNum = target?.requestNumber || "Request";

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        timeLabel: "Just now",
        title: `Payment Recorded (Paid): ${reqNum}`,
        description: `Payment recorded as Paid (Ref: ${reference || reqNum}). Supplier order unlocked.`,
        type: "payment",
        requestId,
      },
      ...prev,
    ]);
  };

  const sendMessage = (requestId: string, text: string) => {
    console.log("External communication recorded for request", requestId, text);
  };

  return (
    <PortalContext.Provider
      value={{
        activeTab,
        setActiveTab,
        requests,
        selectedRequest,
        setSelectedRequest,
        isNewRequestModalOpen,
        setIsNewRequestModalOpen,
        isQuoteModalOpen,
        setIsQuoteModalOpen,
        quoteRequest,
        setQuoteRequest,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        paymentRequest,
        setPaymentRequest,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        activities,
        savedAddresses,
        addSavedAddress,
        searchQuery,
        setSearchQuery,
        submitNewRequest,
        acceptQuote,
        rejectQuote,
        submitPayment,
        sendMessage,
        activeCustomer,
        setActiveCustomerId,
        availableCustomers: customers,
        metrics,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error("usePortal must be used within a PortalProvider");
  }
  return context;
}
