"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  PartRequest,
  CustomerRecord,
  StaffUser,
  Supplier,
  PortalNotification,
  StaffRole,
  RequestStatus,
  PaymentStatus,
  ShipmentMilestone,
  SupplierQuotation,
  CostCalculation,
  CustomerQuoteVersion,
  Quotation,
  CustomerStatus,
} from "@/types/shared";
import { AdminMetrics } from "@/types/admin";
import {
  INITIAL_SHARED_REQUESTS,
  MOCK_CUSTOMERS,
  MOCK_STAFF_USERS,
  MOCK_SUPPLIERS,
  INITIAL_NOTIFICATIONS,
} from "@/lib/shared-mock-data";

// ─── Storage Keys ──────────────────────────────────────────
const STORAGE_REQUESTS = "procurly_shared_requests_v2";
const STORAGE_CUSTOMERS = "procurly_shared_customers_v2";
const STORAGE_SUPPLIERS = "procurly_shared_suppliers_v2";
const STORAGE_STAFF = "procurly_shared_staff_v2";
const STORAGE_NOTIFICATIONS = "procurly_shared_notifications_v2";
const STORAGE_ACTIVE_ROLE = "procurly_active_staff_role_v2";

interface UnifiedDataContextType {
  // State
  requests: PartRequest[];
  customers: CustomerRecord[];
  suppliers: Supplier[];
  staffUsers: StaffUser[];
  notifications: PortalNotification[];
  unreadNotificationsCount: number;
  activeStaffRole: StaffRole;
  currentStaffUser: StaffUser;
  adminMetrics: AdminMetrics;

  // Actions - Requests
  getRequestById: (idOrNumber: string) => PartRequest | undefined;
  submitCustomerRequest: (data: Partial<PartRequest>) => PartRequest;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  assignStaff: (requestId: string, staffName: string, staffRole: string) => void;

  // Actions - Sourcing & Quotes
  addSupplierQuotation: (requestId: string, quote: Omit<SupplierQuotation, "id" | "createdAt">) => void;
  editSupplierQuotation: (requestId: string, quoteId: string, updated: Partial<SupplierQuotation>) => void;
  deleteSupplierQuotation: (requestId: string, quoteId: string) => void;
  selectSupplierQuotation: (requestId: string, quoteId: string) => void;
  createCustomerQuote: (
    requestId: string,
    params: {
      sellPrice: number;
      freight: number;
      notes: string;
      terms?: string;
      estimatedTransitDays?: number;
    }
  ) => void;
  acceptCustomerQuote: (requestId: string, acceptedByName?: string) => void;
  rejectCustomerQuote: (requestId: string, reason: string) => void;
  requestMoreInfo: (requestId: string, query: string) => void;

  // Actions - Payment
  markPaymentPaid: (requestId: string, paymentRef?: string) => void;
  markPaymentUnpaid: (requestId: string) => void;

  // Actions - Order Management (Gated by Payment = Paid)
  placeSupplierOrder: (
    requestId: string,
    order: {
      supplierName: string;
      supplierRef: string;
      cost: number;
      freight: number;
      notes: string;
    }
  ) => boolean;

  // Actions - Shipments & Internal Milestones
  createShipment: (
    requestId: string,
    shipment: {
      carrier: string;
      trackingNumber: string;
      estimatedDelivery: string;
      origin?: string;
      destination?: string;
    }
  ) => void;
  updateShipmentMilestone: (requestId: string, nextMilestone: ShipmentMilestone, note?: string) => void;
  recordDelivery: (requestId: string, confirmationNotes?: string) => void;
  completeRequest: (requestId: string) => void;

  // Actions - Notes & Documents
  addInternalNote: (requestId: string, text: string, isCustomerVisible?: boolean) => void;
  addDocument: (requestId: string, doc: { name: string; type: "Customer" | "Supplier" | "Shipment" | "General"; size: string }) => void;

  // Actions - Management
  addCustomer: (customer: CustomerRecord) => void;
  updateCustomerStatus: (customerId: string, status: CustomerStatus) => void;
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (supplierId: string, updated: Partial<Supplier>) => void;
  addStaffUser: (user: StaffUser) => void;
  updateStaffUser: (userId: string, updated: Partial<StaffUser>) => void;
  switchStaffRole: (role: StaffRole) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Reset
  resetToMockDefaults: () => void;
}

const UnifiedDataContext = createContext<UnifiedDataContextType | undefined>(undefined);

export function UnifiedDataProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with canonical mock data (identical on server and client initial render)
  const [requests, setRequests] = useState<PartRequest[]>(INITIAL_SHARED_REQUESTS);
  const [customers, setCustomers] = useState<CustomerRecord[]>(MOCK_CUSTOMERS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(MOCK_STAFF_USERS);
  const [notifications, setNotifications] = useState<PortalNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeStaffRole, setActiveStaffRole] = useState<StaffRole>("Administrator");
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate state from localStorage after mount to eliminate SSR hydration mismatches
  useEffect(() => {
    try {
      const savedRequests = localStorage.getItem(STORAGE_REQUESTS);
      if (savedRequests) {
        const parsed = JSON.parse(savedRequests);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRequests(parsed);
        }
      }
      const savedCustomers = localStorage.getItem(STORAGE_CUSTOMERS);
      if (savedCustomers) {
        const parsed = JSON.parse(savedCustomers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomers(parsed);
        }
      }
      const savedSuppliers = localStorage.getItem(STORAGE_SUPPLIERS);
      if (savedSuppliers) {
        const parsed = JSON.parse(savedSuppliers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSuppliers(parsed);
        }
      }
      const savedStaff = localStorage.getItem(STORAGE_STAFF);
      if (savedStaff) {
        const parsed = JSON.parse(savedStaff);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStaffUsers(parsed);
        }
      }
      const savedNotifications = localStorage.getItem(STORAGE_NOTIFICATIONS);
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
        }
      }
      localStorage.removeItem(STORAGE_ACTIVE_ROLE);
      localStorage.removeItem("procurly_active_staff_role");
      setActiveStaffRole("Administrator");
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Current logged in staff (always Administrator by default)
  const currentStaffUser = useMemo(() => {
    const adminUser = staffUsers.find((u) => u.role === "Administrator");
    return adminUser || staffUsers[0] || MOCK_STAFF_USERS[0];
  }, [staffUsers]);

  // Sync state changes to localStorage, broadcast CustomEvent and post to BroadcastChannel
  const persistState = useCallback(
    (key: string, data: any) => {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(key, JSON.stringify(data));
          window.dispatchEvent(new CustomEvent("procurly_state_sync", { detail: { key, data } }));
          if ("BroadcastChannel" in window) {
            const channel = new BroadcastChannel("procurly_sync_channel");
            channel.postMessage({ type: "SYNC_STATE", key, data });
            channel.close();
          }
        } catch (e) {}
      }
    },
    []
  );

  useEffect(() => {
    if (!isHydrated) return;
    persistState(STORAGE_REQUESTS, requests);
  }, [requests, isHydrated, persistState]);

  useEffect(() => {
    if (!isHydrated) return;
    persistState(STORAGE_CUSTOMERS, customers);
  }, [customers, isHydrated, persistState]);

  useEffect(() => {
    if (!isHydrated) return;
    persistState(STORAGE_SUPPLIERS, suppliers);
  }, [suppliers, isHydrated, persistState]);

  useEffect(() => {
    if (!isHydrated) return;
    persistState(STORAGE_STAFF, staffUsers);
  }, [staffUsers, isHydrated, persistState]);

  useEffect(() => {
    if (!isHydrated) return;
    persistState(STORAGE_NOTIFICATIONS, notifications);
  }, [notifications, isHydrated, persistState]);

  // Listen to external window/tab storage events and BroadcastChannel for instant live sync
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_REQUESTS && e.newValue) {
        setRequests(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_CUSTOMERS && e.newValue) {
        setCustomers(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_SUPPLIERS && e.newValue) {
        setSuppliers(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_STAFF && e.newValue) {
        setStaffUsers(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_NOTIFICATIONS && e.newValue) {
        setNotifications(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorage);

    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel("procurly_sync_channel");
      channel.onmessage = (event) => {
        const { type, key, data } = event.data || {};
        if (type === "SYNC_STATE") {
          if (key === STORAGE_REQUESTS && data) setRequests(data);
          else if (key === STORAGE_CUSTOMERS && data) setCustomers(data);
          else if (key === STORAGE_SUPPLIERS && data) setSuppliers(data);
          else if (key === STORAGE_STAFF && data) setStaffUsers(data);
          else if (key === STORAGE_NOTIFICATIONS && data) setNotifications(data);
        } else if (type === "RESET_ALL") {
          setRequests(INITIAL_SHARED_REQUESTS);
          setCustomers(MOCK_CUSTOMERS);
          setSuppliers(MOCK_SUPPLIERS);
          setStaffUsers(MOCK_STAFF_USERS);
          setNotifications(INITIAL_NOTIFICATIONS);
          setActiveStaffRole("Administrator");
        }
      };
    }

    return () => {
      window.removeEventListener("storage", handleStorage);
      if (channel) channel.close();
    };
  }, []);

  // ─── Computed Admin Metrics ─────────────────────────────
  const adminMetrics: AdminMetrics = useMemo(() => {
    return {
      newRequests: requests.filter((r) => r.status === "Submitted").length,
      sourcing: requests.filter((r) => r.status === "Sourcing").length,
      quoted: requests.filter((r) => r.status === "Quoted").length,
      awaitingPayment: requests.filter((r) => r.status === "Awaiting Payment" || (r.status === "Approved" && r.payment?.status !== "Paid")).length,
      readyToOrder: requests.filter((r) => (r.status === "Approved" || r.status === "Awaiting Payment") && r.payment?.status === "Paid" && !r.supplierOrder).length,
      shipped: requests.filter((r) => r.status === "Shipped").length,
      delivered: requests.filter((r) => r.status === "Delivered").length,
      totalActive: requests.filter((r) => r.status !== "Completed").length,
    };
  }, [requests]);

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // ─── Lookup Helper ──────────────────────────────────────
  const getRequestById = useCallback(
    (idOrNumber: string) => {
      const normalized = (idOrNumber || "").toLowerCase().trim();
      return requests.find(
        (r) =>
          r.id.toLowerCase() === normalized ||
          r.requestNumber.toLowerCase() === normalized
      );
    },
    [requests]
  );

  // ─── Actions: Submit Request (Customer Side) ────────────
  const submitCustomerRequest = useCallback(
    (data: Partial<PartRequest>): PartRequest => {
      const nextCount = requests.length + 124;
      const requestNumber = `AH-P-${String(nextCount).padStart(6, "0")}`;
      const newId = `req-${Date.now()}`;

      const newRequest: PartRequest = {
        id: newId,
        requestNumber,
        customerId: data.customerId || "cust-01",
        customerName: data.customerName || "AutoCare Auckland",
        contactName: data.contactName || "Dave Miller",
        customerEmail: data.customerEmail || "dave@autocare.co.nz",
        customerPhone: data.customerPhone || "+64 9 525 1122",
        vehicle: data.vehicle || {
          make: "Toyota",
          model: "Hiace",
          year: 2020,
          vin: "TRH200-009912",
        },
        part: data.part || {
          name: "Front Brake Pads",
          quantity: 1,
          preference: "Genuine OEM",
          condition: "Brand New OEM",
        },
        supporting: data.supporting || { photos: [], documents: [] },
        deliveryAddress: data.deliveryAddress || {
          id: "addr-01",
          label: "Workshop Delivery",
          recipientName: "Dave Miller",
          businessName: "AutoCare Auckland",
          streetAddress: "142 Great South Road",
          suburb: "Penrose",
          city: "Auckland",
          postalCode: "1061",
          phone: "+64 9 525 1122",
        },
        dateSubmitted: new Date().toISOString().split("T")[0],
        lastUpdated: "Just now",
        status: "Submitted",
        supplierQuotations: [],
        customerQuoteVersions: [],
        documents: [],
        internalNotes: [],
        activity: [
          {
            id: `act-${Date.now()}`,
            timestamp: new Date().toISOString(),
            timeLabel: "Just now",
            title: "Request submitted",
            description: `Request ${requestNumber} submitted by ${data.contactName || "Customer"}.`,
            actor: data.contactName || "Customer",
            type: "status",
          },
        ],
        actionRequired: "Waiting for Autohub specialist sourcing review",
        actionType: "none",
      };

      setRequests((prev) => [newRequest, ...prev]);

      // Trigger admin notification
      const newNotif: PortalNotification = {
        id: `notif-${Date.now()}`,
        type: "New Request",
        title: `New Request: ${requestNumber}`,
        description: `${newRequest.customerName} submitted request for ${newRequest.vehicle.make} ${newRequest.vehicle.model} - ${newRequest.part.name}`,
        timestamp: "Just now",
        read: false,
        requestId: newId,
      };
      setNotifications((prev) => [newNotif, ...prev]);

      return newRequest;
    },
    [requests]
  );

  // ─── Actions: Update Status & Assignment ────────────────
  const updateRequestStatus = useCallback(
    (requestId: string, status: RequestStatus) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              status,
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: `Status changed to ${status}`,
                  description: `Status manually updated to ${status} by ${currentStaffUser.name}.`,
                  actor: currentStaffUser.name,
                  type: "status",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );
    },
    [currentStaffUser]
  );

  const assignStaff = useCallback(
    (requestId: string, staffName: string, staffRole: string) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              assignedStaff: staffName,
              assignedStaffRole: staffRole,
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Request assigned",
                  description: `Assigned to ${staffName} (${staffRole}).`,
                  actor: currentStaffUser.name,
                  type: "status",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );
    },
    [currentStaffUser]
  );

  // ─── Actions: Sourcing (Supplier Quotes) ─────────────────
  const addSupplierQuotation = useCallback(
    (requestId: string, quote: Omit<SupplierQuotation, "id" | "createdAt">) => {
      const newQuote: SupplierQuotation = {
        ...quote,
        id: `sq-${Date.now()}`,
        createdAt: "Just now",
      };

      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            const quotations = [...(r.supplierQuotations || []), newQuote];
            return {
              ...r,
              status: r.status === "Submitted" ? "Sourcing" : r.status,
              supplierQuotations: quotations,
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Supplier quote added",
                  description: `Quote from ${quote.supplierName} added (NZ$${quote.supplierCost.toFixed(2)} + NZ$${quote.supplierFreight.toFixed(2)} freight).`,
                  actor: currentStaffUser.name,
                  type: "quote",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );
    },
    [currentStaffUser]
  );

  const editSupplierQuotation = useCallback(
    (requestId: string, quoteId: string, updated: Partial<SupplierQuotation>) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              supplierQuotations: (r.supplierQuotations || []).map((sq) =>
                sq.id === quoteId ? { ...sq, ...updated } : sq
              ),
              lastUpdated: "Just now",
            };
          }
          return r;
        })
      );
    },
    []
  );

  const deleteSupplierQuotation = useCallback(
    (requestId: string, quoteId: string) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              supplierQuotations: (r.supplierQuotations || []).filter((sq) => sq.id !== quoteId),
              selectedQuotationId: r.selectedQuotationId === quoteId ? undefined : r.selectedQuotationId,
              lastUpdated: "Just now",
            };
          }
          return r;
        })
      );
    },
    []
  );

  const selectSupplierQuotation = useCallback(
    (requestId: string, quoteId: string) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            const currentQuotes = r.supplierQuotations || [];
            const selected = currentQuotes.find((sq) => sq.id === quoteId);
            const updatedQuotes = currentQuotes.map((sq) => ({
              ...sq,
              isSelected: sq.id === quoteId,
            }));

            // Calculate suggestion: 20% margin + flat freight
            let costCalc: CostCalculation | undefined = undefined;
            if (selected) {
              const baseCost = selected.supplierCost + selected.supplierFreight;
              const marginAmount = Math.round(baseCost * 0.2);
              const sellPrice = baseCost + marginAmount;
              costCalc = {
                supplierCost: selected.supplierCost,
                supplierFreight: selected.supplierFreight,
                autohubMarginPercent: 20,
                autohubMarginAmount: marginAmount,
                customerSellPrice: sellPrice,
                customerFreight: 85.0, // default ONE flat freight
                totalCustomerQuote: sellPrice + 85.0,
              };
            }

            return {
              ...r,
              supplierQuotations: updatedQuotes,
              selectedQuotationId: quoteId,
              costCalculation: costCalc,
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Supplier selected",
                  description: `Selected ${selected?.supplierName || "supplier"} for customer quotation calculation.`,
                  actor: currentStaffUser.name,
                  type: "quote",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );
    },
    [currentStaffUser]
  );

  // ─── Actions: Customer Quote ─────────────────────────────
  // Enforces ONE manual flat freight value (No comparison engine)
  const createCustomerQuote = useCallback(
    (
      requestId: string,
      params: {
        sellPrice: number;
        freight: number;
        notes: string;
        terms?: string;
        estimatedTransitDays?: number;
      }
    ) => {
      const totalAmount = params.sellPrice + params.freight;
      const gstAmount = Number(((totalAmount * 15) / 115).toFixed(2));

      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            const nextVer = (r.customerQuoteVersions?.length || 0) + 1;
            const newVersion: CustomerQuoteVersion = {
              version: nextVer,
              date: new Date().toISOString().split("T")[0],
              sellPrice: params.sellPrice,
              freight: params.freight,
              totalAmount,
              estimatedTransitDays: params.estimatedTransitDays || 5,
              notes: params.notes,
              terms: params.terms || "Standard Autohub B2B Trade Warranty. 12-month replacement cover.",
              sentAt: "Just now",
              status: "Sent",
              createdBy: currentStaffUser.name,
            };

            const newQuotation: Quotation = {
              id: `quote-${r.requestNumber}-${nextVer}`,
              requestId: r.id,
              version: nextVer,
              itemDescription: `${r.vehicle.make} ${r.vehicle.model} ${r.part.name}`,
              oemNumber: r.part.partNumber,
              quantity: r.part.quantity,
              unitPrice: params.sellPrice,
              subtotal: params.sellPrice,
              freightCost: params.freight, // Single flat freight value
              freightNote: "Standard consolidated delivery to workshop",
              gstAmount,
              totalAmount,
              currency: "NZD",
              estimatedTransitDays: params.estimatedTransitDays || 5,
              validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              termsAccepted: false,
              procurementTerms: params.terms || "Autohub 12-month replacement guarantee.",
              notes: params.notes,
            };

            return {
              ...r,
              status: "Quoted",
              quotedValue: totalAmount,
              customerQuote: newQuotation,
              customerQuoteVersions: [newVersion, ...(r.customerQuoteVersions || [])],
              customerResponse: undefined,
              actionRequired: "Review & approve quote to proceed to fulfillment",
              actionType: "review_quote",
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: `Customer quote v${nextVer} created`,
                  description: `Quote created for NZ$${totalAmount.toFixed(2)} (Part: $${params.sellPrice}, Freight: $${params.freight}) and sent to ${r.customerName}.`,
                  actor: currentStaffUser.name,
                  type: "quote",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      // Notification
      const target = getRequestById(requestId);
      if (target) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            type: "Quote Sent",
            title: `Quote Ready: ${target.requestNumber}`,
            description: `Quote for NZ$${totalAmount.toFixed(2)} dispatched to ${target.customerName}.`,
            timestamp: "Just now",
            read: false,
            requestId: target.id,
          },
          ...prev,
        ]);
      }
    },
    [currentStaffUser, getRequestById]
  );

  // ─── Actions: Customer Approval ──────────────────────────
  // Sets Customer Response = Accepted and moves status to Approved (Stage 4)
  const acceptCustomerQuote = useCallback(
    (requestId: string, acceptedByName?: string) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            const amount = r.quotedValue || r.customerQuote?.totalAmount || 410.0;
            const actor = acceptedByName || r.contactName || "Customer";

            return {
              ...r,
              status: "Approved", // Status moves to Approved (Stage 4: Approval)
              customerResponse: "Accepted", // Admin sees: Customer Response = Accepted
              actionRequired: "Settle invoice via Bank Transfer or Card",
              actionType: "pay_now",
              lastUpdated: "Just now",
              quoteAcceptance: {
                acceptedAt: "Just now",
                acceptedBy: actor,
                userRole: "Customer",
                termsAccepted: true,
                vehicleVerified: true,
                partVerified: true,
                addressVerified: true,
                freightCost: r.customerQuote?.freightCost,
              },
              payment: {
                id: `pay-${r.requestNumber}`,
                requestId: r.id,
                invoiceNumber: `INV-2026-${r.requestNumber.replace("AH-P-", "")}`,
                amount,
                currency: "NZD",
                status: "Unpaid", // Payment is Unpaid
                paymentReference: r.requestNumber,
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                lastUpdated: "Just now",
                bankDetails: {
                  bankName: "ANZ New Zealand",
                  accountName: "Autohub Procurement NZ Ltd",
                  accountNumber: "01-0288-0349821-00",
                  swiftBic: "ANZBNZ22",
                },
              },
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Customer accepted quote",
                  description: `Quote accepted by ${actor}. Status: Approved. Invoice generated (Unpaid).`,
                  actor,
                  type: "quote",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      const target = getRequestById(requestId);
      const reqNum = target?.requestNumber || "Request";
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: "Quote Accepted",
          title: `Quote Accepted: ${reqNum}`,
          description: `Customer response recorded as Accepted. Status moved to Approved. Invoice generated.`,
          timestamp: "Just now",
          read: false,
          requestId,
        },
        ...prev,
      ]);
    },
    [getRequestById]
  );

  const rejectCustomerQuote = useCallback(
    (requestId: string, reason: string) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              customerResponse: "Rejected",
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Customer declined quote",
                  description: `Quote declined. Customer reason: ${reason}.`,
                  actor: r.contactName || "Customer",
                  type: "quote",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );
    },
    []
  );

  const requestMoreInfo = useCallback(
    (requestId: string, query: string) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              customerResponse: "Request More Information",
              lastUpdated: "Just now",
              internalNotes: [
                {
                  id: `in-${Date.now()}`,
                  author: r.contactName || "Customer",
                  role: "Customer",
                  text: `Information requested: ${query}`,
                  timestamp: "Just now",
                  isCustomerVisible: true,
                },
                ...(r.internalNotes || []),
              ],
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Customer requested more info",
                  description: `Customer inquiry: "${query}". Contact via Email / Teams / Phone.`,
                  actor: r.contactName || "Customer",
                  type: "note",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );
    },
    []
  );

  // ─── Actions: Payment & Payment Gate ─────────────────────
  // Supplier ordering is BLOCKED until Payment = PAID
  const markPaymentPaid = useCallback(
    (requestId: string, paymentRef?: string) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            const currentPay = r.payment || {
              id: `pay-${r.requestNumber}`,
              requestId: r.id,
              invoiceNumber: `INV-2026-${r.requestNumber.replace("AH-P-", "")}`,
              amount: r.quotedValue || 410.0,
              currency: "NZD",
              status: "Paid",
              paymentReference: paymentRef || `${r.requestNumber}-PAID`,
              dueDate: "2026-09-30",
            };

            return {
              ...r,
              paymentStatus: "Paid",
              payment: {
                ...currentPay,
                status: "Paid",
                paidAt: "Today",
                paymentReference: paymentRef || currentPay.paymentReference || `${r.requestNumber}-PAID`,
                lastUpdated: "Just now",
              },
              actionRequired: "Payment received in full. Ready for supplier ordering.",
              actionType: "none",
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Payment marked Paid",
                  description: `Payment marked as Paid by ${currentStaffUser.name}. Supplier Order Gate UNLOCKED.`,
                  actor: currentStaffUser.name,
                  type: "payment",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      const target = getRequestById(requestId);
      if (target) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            type: "Payment Received",
            title: `Payment Received: ${target.requestNumber}`,
            description: `Payment marked as Paid. Supplier order is now available to place.`,
            timestamp: "Just now",
            read: false,
            requestId: target.id,
          },
          ...prev,
        ]);
      }
    },
    [currentStaffUser, getRequestById]
  );

  const markPaymentUnpaid = useCallback(
    (requestId: string) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            if (!r.payment) return r;
            return {
              ...r,
              paymentStatus: "Unpaid",
              payment: {
                ...r.payment,
                status: "Unpaid",
                paidAt: undefined,
                lastUpdated: "Just now",
              },
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Payment marked Unpaid",
                  description: `Payment reverted to Unpaid by ${currentStaffUser.name}.`,
                  actor: currentStaffUser.name,
                  type: "payment",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );
    },
    [currentStaffUser]
  );

  // ─── Actions: Supplier Order ─────────────────────────────
  // Enforces payment gate check: only allowed if payment?.status === "Paid" or paymentStatus === "Paid"
  const placeSupplierOrder = useCallback(
    (
      requestId: string,
      order: {
        supplierName: string;
        supplierRef: string;
        cost: number;
        freight: number;
        notes: string;
      }
    ): boolean => {
      const target = getRequestById(requestId);
      if (!target || target.payment?.status !== "Paid") {
        return false; // BLOCKED by Payment Gate!
      }

      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              status: "Ordered", // Status moves to ORDERED
              supplierOrder: {
                id: `ord-${Date.now()}`,
                supplierId: r.selectedQuotationId || "sup-01",
                supplierName: order.supplierName,
                supplierRef: order.supplierRef,
                orderDate: new Date().toISOString().split("T")[0],
                cost: order.cost,
                freight: order.freight,
                total: order.cost + order.freight,
                notes: order.notes,
                documents: [],
              },
              actionRequired: "Supplier order placed. Awaiting dispatch & shipment tracking.",
              actionType: "none",
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Supplier order placed",
                  description: `PO ${order.supplierRef} placed with ${order.supplierName} (Total: NZ$${(order.cost + order.freight).toFixed(2)}). Status: ORDERED.`,
                  actor: currentStaffUser.name,
                  type: "order",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: "Order Placed",
          title: `Supplier Order Placed: ${target.requestNumber}`,
          description: `Order placed with ${order.supplierName}. Ref: ${order.supplierRef}.`,
          timestamp: "Just now",
          read: false,
          requestId: target.id,
        },
        ...prev,
      ]);

      return true;
    },
    [getRequestById, currentStaffUser]
  );

  // ─── Actions: Shipments & Internal Milestones ────────────
  // Customer-facing top-level status remains SHIPPED.
  // Internal milestones: Received At Shipping Facility -> In Transit -> Arrived in NZ -> Customs Clearance -> Out For Delivery -> Delivered
  const createShipment = useCallback(
    (
      requestId: string,
      shipmentData: {
        carrier: string;
        trackingNumber: string;
        estimatedDelivery: string;
        origin?: string;
        destination?: string;
      }
    ) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            const initialMilestone: ShipmentMilestone = "Received At Shipping Facility";
            return {
              ...r,
              status: "Shipped", // Top-level status is SHIPPED
              shipment: {
                id: `ship-${Date.now()}`,
                trackingNumber: shipmentData.trackingNumber,
                carrier: shipmentData.carrier,
                currentMilestone: initialMilestone,
                origin: shipmentData.origin || "Nagoya Consolidation Hub, Japan",
                destination: shipmentData.destination || r.deliveryAddress.label,
                estimatedDelivery: shipmentData.estimatedDelivery,
                dispatchedAt: new Date().toISOString(),
                lastUpdated: "Just now",
                milestonesHistory: [
                  {
                    milestone: initialMilestone,
                    location: shipmentData.origin || "Nagoya Hub, Japan",
                    timestamp: new Date().toISOString(),
                    description: "Package received, scanned, and allocated for airfreight consolidation.",
                    isCompleted: true,
                  },
                  {
                    milestone: "In Transit",
                    location: "International Air Transit",
                    timestamp: "Pending departure",
                    description: "Scheduled flight cargo transit.",
                    isCompleted: false,
                  },
                  {
                    milestone: "Arrived in NZ",
                    location: "Auckland International Cargo Terminal",
                    timestamp: "Pending arrival",
                    description: "Flight discharge and ground handling.",
                    isCompleted: false,
                  },
                  {
                    milestone: "Customs Clearance",
                    location: "Auckland Customs & MPI",
                    timestamp: "Pending clearance",
                    description: "Autohub customs clearance inspection.",
                    isCompleted: false,
                  },
                  {
                    milestone: "Out For Delivery",
                    location: "Auckland Metro Courier Hub",
                    timestamp: "Pending courier load",
                    description: "Final mile courier delivery dispatch.",
                    isCompleted: false,
                  },
                  {
                    milestone: "Delivered",
                    location: r.deliveryAddress.label,
                    timestamp: "Pending signature",
                    description: "Proof of delivery signature.",
                    isCompleted: false,
                  },
                ],
              },
              actionRequired: `Shipment created: ${shipmentData.carrier} (${shipmentData.trackingNumber})`,
              actionType: "view_details",
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Shipment created",
                  description: `Consignment created with ${shipmentData.carrier} (Tracking: ${shipmentData.trackingNumber}). Status: SHIPPED.`,
                  actor: currentStaffUser.name,
                  type: "shipment",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      const target = getRequestById(requestId);
      if (target) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            type: "Shipment Updated",
            title: `Shipment Created: ${target.requestNumber}`,
            description: `${shipmentData.carrier} tracking #${shipmentData.trackingNumber} generated.`,
            timestamp: "Just now",
            read: false,
            requestId: target.id,
          },
          ...prev,
        ]);
      }
    },
    [currentStaffUser, getRequestById]
  );

  const updateShipmentMilestone = useCallback(
    (requestId: string, nextMilestone: ShipmentMilestone, note?: string) => {
      const MILESTONE_ORDER: ShipmentMilestone[] = [
        "Received At Shipping Facility",
        "In Transit",
        "Arrived in NZ",
        "Customs Clearance",
        "Out For Delivery",
        "Delivered",
      ];
      const targetIndex = MILESTONE_ORDER.indexOf(nextMilestone);

      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            if (!r.shipment) return r;

            const updatedHistory = r.shipment.milestonesHistory.map((m) => {
              const mIndex = MILESTONE_ORDER.indexOf(m.milestone);
              if (mIndex <= targetIndex) {
                return {
                  ...m,
                  isCompleted: true,
                  timestamp: m.isCompleted ? m.timestamp : new Date().toISOString(),
                  description: m.milestone === nextMilestone && note ? note : m.description,
                };
              }
              return { ...m, isCompleted: false };
            });

            const isFinalDelivery = nextMilestone === "Delivered";

            return {
              ...r,
              status: isFinalDelivery ? "Delivered" : r.status,
              shipment: {
                ...r.shipment,
                currentMilestone: nextMilestone,
                lastUpdated: "Just now",
                milestonesHistory: updatedHistory,
                deliveredAt: isFinalDelivery ? new Date().toISOString() : r.shipment.deliveredAt,
              },
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: `Shipment milestone: ${nextMilestone}`,
                  description: note || `Internal milestone advanced to ${nextMilestone}.`,
                  actor: currentStaffUser.name,
                  type: "shipment",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );
    },
    [currentStaffUser]
  );

  const recordDelivery = useCallback(
    (requestId: string, confirmationNotes?: string) => {
      updateShipmentMilestone(requestId, "Delivered", confirmationNotes || "Delivery confirmed by workshop.");
    },
    [updateShipmentMilestone]
  );

  const completeRequest = useCallback(
    (requestId: string) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              status: "Completed",
              actionRequired: "Request completed & archived",
              actionType: "none",
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Request Completed",
                  description: `Request closed and marked as Completed by ${currentStaffUser.name}.`,
                  actor: currentStaffUser.name,
                  type: "status",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );
    },
    [currentStaffUser]
  );

  // ─── Actions: Notes & Documents ──────────────────────────
  const addInternalNote = useCallback(
    (requestId: string, text: string, isCustomerVisible: boolean = false) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              lastUpdated: "Just now",
              internalNotes: [
                {
                  id: `note-${Date.now()}`,
                  author: currentStaffUser.name,
                  role: currentStaffUser.role,
                  text,
                  timestamp: "Just now",
                  isCustomerVisible,
                },
                ...(r.internalNotes || []),
              ],
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: isCustomerVisible ? "Customer Note added" : "Internal Note added",
                  description: text,
                  actor: currentStaffUser.name,
                  type: "note",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );
    },
    [currentStaffUser]
  );

  const addDocument = useCallback(
    (requestId: string, doc: { name: string; type: "Customer" | "Supplier" | "Shipment" | "General"; size: string }) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              documents: [
                {
                  id: `doc-${Date.now()}`,
                  name: doc.name,
                  type: doc.type,
                  size: doc.size,
                  uploadedAt: "Just now",
                  uploadedBy: currentStaffUser.name,
                },
                ...(r.documents || []),
              ],
              lastUpdated: "Just now",
            };
          }
          return r;
        })
      );
    },
    [currentStaffUser]
  );

  // ─── Customer Management ─────────────────────────────────
  const addCustomer = useCallback((customer: CustomerRecord) => {
    setCustomers((prev) => [customer, ...prev]);
  }, []);

  const updateCustomerStatus = useCallback(
    (customerId: string, status: CustomerStatus) => {
      setCustomers((prev) =>
        prev.map((c) => (c.id === customerId ? { ...c, status } : c))
      );
    },
    []
  );

  // ─── Supplier Management ─────────────────────────────────
  const addSupplier = useCallback((supplier: Supplier) => {
    setSuppliers((prev) => [supplier, ...prev]);
  }, []);

  const updateSupplier = useCallback(
    (supplierId: string, updated: Partial<Supplier>) => {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === supplierId ? { ...s, ...updated } : s))
      );
    },
    []
  );

  // ─── User Management & RBAC ──────────────────────────────
  const addStaffUser = useCallback((user: StaffUser) => {
    setStaffUsers((prev) => [user, ...prev]);
  }, []);

  const updateStaffUser = useCallback(
    (userId: string, updated: Partial<StaffUser>) => {
      setStaffUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updated } : u))
      );
    },
    []
  );

  const switchStaffRole = useCallback((role: StaffRole) => {
    setActiveStaffRole("Administrator");
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_ACTIVE_ROLE);
      } catch (e) {}
    }
  }, []);

  // ─── Notifications ───────────────────────────────────────
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // ─── Reset Data ──────────────────────────────────────────
  const resetToMockDefaults = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_REQUESTS);
        localStorage.removeItem(STORAGE_CUSTOMERS);
        localStorage.removeItem(STORAGE_SUPPLIERS);
        localStorage.removeItem(STORAGE_STAFF);
        localStorage.removeItem(STORAGE_NOTIFICATIONS);
        window.dispatchEvent(new CustomEvent("procurly_state_sync", { detail: { key: "RESET_ALL" } }));
        if ("BroadcastChannel" in window) {
          const channel = new BroadcastChannel("procurly_sync_channel");
          channel.postMessage({ type: "RESET_ALL" });
          channel.close();
        }
      } catch (e) {}
    }
    setRequests(INITIAL_SHARED_REQUESTS);
    setCustomers(MOCK_CUSTOMERS);
    setSuppliers(MOCK_SUPPLIERS);
    setStaffUsers(MOCK_STAFF_USERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveStaffRole("Administrator");
  }, []);

  return (
    <UnifiedDataContext.Provider
      value={{
        requests,
        customers,
        suppliers,
        staffUsers,
        notifications,
        unreadNotificationsCount,
        activeStaffRole,
        currentStaffUser,
        adminMetrics,
        getRequestById,
        submitCustomerRequest,
        updateRequestStatus,
        assignStaff,
        addSupplierQuotation,
        editSupplierQuotation,
        deleteSupplierQuotation,
        selectSupplierQuotation,
        createCustomerQuote,
        acceptCustomerQuote,
        rejectCustomerQuote,
        requestMoreInfo,
        markPaymentPaid,
        markPaymentUnpaid,
        placeSupplierOrder,
        createShipment,
        updateShipmentMilestone,
        recordDelivery,
        completeRequest,
        addInternalNote,
        addDocument,
        addCustomer,
        updateCustomerStatus,
        addSupplier,
        updateSupplier,
        addStaffUser,
        updateStaffUser,
        switchStaffRole,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetToMockDefaults,
      }}
    >
      {children}
    </UnifiedDataContext.Provider>
  );
}

export function useUnifiedData() {
  const context = useContext(UnifiedDataContext);
  if (!context) {
    throw new Error("useUnifiedData must be used within a UnifiedDataProvider");
  }
  return context;
}
