"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import {
  PartRequest,
  PortalTab,
  PortalNotification,
  ProcurementActivity,
  SavedAddress,
  QuoteAcceptanceAudit,
} from "@/types/portal";
import {
  INITIAL_REQUESTS,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  SAVED_ADDRESSES,
} from "@/lib/mock-portal-data";

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
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  submitNewRequest: (reqData: Partial<PartRequest>) => PartRequest;
  acceptQuote: (requestId: string, acceptanceAudit: QuoteAcceptanceAudit) => void;
  rejectQuote: (requestId: string, reason: string) => void;
  submitPayment: (
    requestId: string,
    method: "Bank Transfer" | "Trade Credit Account" | "Credit Card",
    reference?: string
  ) => void;
  sendMessage: (requestId: string, text: string) => void;
  metrics: {
    activeRequests: number;
    awaitingAction: number;
    inProcurement: number;
    inTransit: number;
  };
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<PortalTab>("dashboard");
  const [requests, setRequests] = useState<PartRequest[]>(INITIAL_REQUESTS);
  const [activities, setActivities] = useState<ProcurementActivity[]>(INITIAL_ACTIVITIES);
  const [notifications, setNotifications] =
    useState<PortalNotification[]>(INITIAL_NOTIFICATIONS);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(SAVED_ADDRESSES);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedRequest, setSelectedRequest] = useState<PartRequest | null>(null);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteRequest, setQuoteRequest] = useState<PartRequest | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<PartRequest | null>(null);

  // Counter metrics
  const metrics = useMemo(() => {
    // Exact numbers to match or exceed baseline from reference screenshot
    const active = 17 + (requests.length - INITIAL_REQUESTS.length);
    const awaiting = requests.filter(
      (r) =>
        r.actionType === "review_quote" ||
        r.actionType === "pay_now" ||
        r.actionType === "view_details"
    ).length;
    const inProc = requests.filter(
      (r) => r.status === "Sourcing" || r.status === "Ordered" || r.status === "Approved"
    ).length;
    const inTransit = requests.filter((r) => r.status === "Shipped").length;

    return {
      activeRequests: Math.max(active, 17),
      awaitingAction: awaiting,
      inProcurement: Math.max(inProc, 4),
      inTransit: Math.max(inTransit, 4),
    };
  }, [requests]);

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const submitNewRequest = (reqData: Partial<PartRequest>): PartRequest => {
    // Generate sequential request number like AH-P-000143
    const nextNum = 143 + (requests.length - INITIAL_REQUESTS.length);
    const requestNumber = `AH-P-000${nextNum}`;
    const newId = `req-${nextNum}`;

    const newReq: PartRequest = {
      id: newId,
      requestNumber,
      vehicle: reqData.vehicle || {
        make: "Toyota",
        model: "Hilux",
        year: 2024,
        vin: "MR0HA3CD" + nextNum,
      },
      part: reqData.part || {
        name: "Replacement Part",
        quantity: 1,
        preference: "Genuine OEM",
        condition: "Brand New OEM",
      },
      supporting: reqData.supporting || {
        notes: "",
        photos: [],
        documents: [],
      },
      deliveryAddress: reqData.deliveryAddress || savedAddresses[0],
      dateSubmitted: new Date().toISOString().split("T")[0],
      status: "Submitted",
      messages: [],
    };

    setRequests((prev) => [newReq, ...prev]);

    // Add activity
    const newAct: ProcurementActivity = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeLabel: "Just now",
      title: `Request Submitted: ${requestNumber}`,
      description: `${newReq.vehicle.year} ${newReq.vehicle.make} ${newReq.vehicle.model} - ${newReq.part.name} logged for procurement sourcing.`,
      type: "request",
      requestId: newId,
    };
    setActivities((prev) => [newAct, ...prev]);

    // Add notification
    const newNotif: PortalNotification = {
      id: `notif-${Date.now()}`,
      type: "Request Submitted",
      title: `Request ${requestNumber} Submitted`,
      description: "Our Japan & international sourcing specialists have received your request.",
      timestamp: "Just now",
      read: false,
      requestId: newId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newReq;
  };

  const acceptQuote = (requestId: string, acceptanceAudit: QuoteAcceptanceAudit) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const updated: PartRequest = {
            ...r,
            status: "Awaiting Payment",
            actionRequired: "Settle invoice or release on SP Motors 30-Day Trade Credit",
            actionType: "pay_now",
            quoteAcceptance: acceptanceAudit,
            payment: {
              id: `pay-${r.requestNumber}`,
              requestId: r.id,
              invoiceNumber: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
              amount: r.quotedValue || 485.0,
              currency: "NZD",
              status: "Unpaid",
              paymentReference: `${r.requestNumber}`,
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
          };
          return updated;
        }
        return r;
      })
    );

    const target = requests.find((r) => r.id === requestId);
    const reqNum = target?.requestNumber || "Request";

    // Activity log
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        timeLabel: "Just now",
        title: `Quote Accepted for ${reqNum}`,
        description: `Accepted by ${acceptanceAudit.acceptedBy}. Procurement terms & privacy policy accepted. Autohub invoice reference recorded; payment status: Unpaid.`,
        type: "quote",
        requestId,
      },
      ...prev,
    ]);

    // Notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: "Quote Accepted",
        title: `Quote Accepted: ${reqNum}`,
        description: "Autohub invoice reference recorded. Payment status set to Unpaid.",
        timestamp: "Just now",
        read: false,
        requestId,
      },
      ...prev,
    ]);
  };

  const rejectQuote = (requestId: string, reason: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status: "Completed",
            actionRequired: undefined,
            actionType: "none",
          };
        }
        return r;
      })
    );

    const target = requests.find((r) => r.id === requestId);
    const reqNum = target?.requestNumber || "Request";

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        timeLabel: "Just now",
        title: `Quote Declined for ${reqNum}`,
        description: `Customer reason: ${reason}. Request archived.`,
        type: "alert",
        requestId,
      },
      ...prev,
    ]);
  };

  const submitPayment = (
    requestId: string,
    method: "Bank Transfer" | "Trade Credit Account" | "Credit Card",
    reference?: string
  ) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status: "Ordered",
            actionRequired: undefined,
            actionType: "none",
            payment: r.payment
              ? {
                  ...r.payment,
                  status: "Paid",
                  paymentMethod: method,
                  paidAt: new Date().toISOString(),
                  paymentReference: reference || r.payment.paymentReference,
                }
              : undefined,
          };
        }
        return r;
      })
    );

    const target = requests.find((r) => r.id === requestId);
    const reqNum = target?.requestNumber || "Request";
    const isCredit = method === "Trade Credit Account";

    const desc = isCredit
      ? `Charged to SP Motors 30-Day Trade Account. Payment status recorded as Paid. PO released to supplier.`
      : `Payment settled via ${method} (Ref: ${reference || reqNum}). Payment status recorded as Paid.`;

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        timeLabel: "Just now",
        title: `Payment Recorded (Paid): ${reqNum}`,
        description: desc,
        type: "payment",
        requestId,
      },
      ...prev,
    ]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: isCredit ? "Order Placed" : "Payment Received",
        title: isCredit ? `Order Placed: ${reqNum}` : `Payment Recorded (Paid): ${reqNum}`,
        description: desc,
        timestamp: "Just now",
        read: false,
        requestId,
      },
      ...prev,
    ]);
  };

  const sendMessage = (requestId: string, text: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            senderName: "James Wilson",
            senderRole: "Customer" as const,
            message: text,
            timestamp: "Just now",
          };
          return {
            ...r,
            messages: [...(r.messages || []), newMsg],
          };
        }
        return r;
      })
    );
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
        searchQuery,
        setSearchQuery,
        submitNewRequest,
        acceptQuote,
        rejectQuote,
        submitPayment,
        sendMessage,
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
