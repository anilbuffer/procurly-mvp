"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  X,
  FileText,
  FileCheck2,
  Package,
  Hash,
  ArrowRight,
  ExternalLink,
  Car,
  User,
  Truck,
  Building2,
  Clock,
  CheckCircle2,
  DollarSign,
  Layers,
  Sparkles,
  CornerDownLeft,
} from "lucide-react";
import { useGlobalSearch, SearchCategory } from "@/context/global-search-context";
import { useUnifiedData } from "@/context/unified-data-context";
import { PartRequest } from "@/types/shared";

interface SearchItem {
  id: string;
  category: "invoices" | "quotes" | "parts" | "references";
  title: string;
  subtitle: string;
  categoryLabel: string;
  badgeText: string;
  badgeStyle: "paid" | "unpaid" | "quoted" | "status" | "info" | "neutral";
  amount?: string;
  partNumber?: string;
  referenceNumber?: string;
  customerName?: string;
  vehicleSummary?: string;
  searchableContent: string;
  requestId?: string;
  tab?: "overview" | "quote" | "invoice" | "shipment" | "sourcing";
  directUrl?: string;
}

// Helper to highlight matching text substrings
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;
  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return <span>{text}</span>;

  // Build regex matching any of the terms
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="text-[#FE0000] font-bold underline underline-offset-2 decoration-[#FE0000]/40">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export function GlobalSearchModal() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isOpen,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    closeSearch,
  } = useGlobalSearch();

  const { requests, customers, suppliers } = useUnifiedData();

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Index all platform data into search items
  const indexedItems = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [];

    requests.forEach((r) => {
      const formattedAmount = (amount?: number) =>
        amount != null ? `$${amount.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NZD` : "";

      const vehicleString = `${r.vehicle.year} ${r.vehicle.make} ${r.vehicle.model}${r.vehicle.variant ? ` ${r.vehicle.variant}` : ""}`;
      const customerStr = r.customerName || r.contactName || "Customer";

      // ── 1. INVOICES ──────────────────────────────────────────
      // Any request with an invoice, payment record, or invoicing status
      const generatedInvoiceNumber = `INV-2026-${r.requestNumber.replace(/[^0-9]/g, "").padStart(4, "0")}`;
      const invoiceNumber = r.payment?.invoiceNumber || (
        ["Invoicing", "Awaiting Payment", "Ordered", "Subadmin Pending", "Subadmin Review", "Subadmin Hold", "Subadmin Approved", "Ready for Dispatch", "Shipped", "Delivered", "Completed"].includes(r.status) ||
        r.customerQuote ||
        r.quotation ||
        r.payment
          ? generatedInvoiceNumber
          : null
      );

      if (invoiceNumber) {
        const isPaid = r.payment?.status === "Paid" || r.paymentStatus === "Paid";
        const invAmount = r.payment?.amount || r.quotedValue || r.customerQuote?.totalAmount || r.quotation?.totalAmount || 0;
        const paymentRef = r.payment?.paymentReference || r.requestNumber;

        items.push({
          id: `inv-${r.id}`,
          category: "invoices",
          categoryLabel: "Invoice",
          title: invoiceNumber,
          subtitle: `${customerStr} • ${vehicleString} — ${r.part.name}`,
          badgeText: isPaid ? "Paid in Full" : "Awaiting Settlement",
          badgeStyle: isPaid ? "paid" : "unpaid",
          amount: formattedAmount(invAmount),
          referenceNumber: paymentRef,
          customerName: customerStr,
          vehicleSummary: vehicleString,
          searchableContent: [
            invoiceNumber,
            generatedInvoiceNumber,
            paymentRef,
            customerStr,
            r.customerEmail,
            vehicleString,
            r.vehicle.vin,
            r.vehicle.registration,
            r.part.name,
            isPaid ? "paid" : "unpaid awaiting settlement",
            invAmount ? `$${invAmount}` : "",
          ].filter(Boolean).join(" ").toLowerCase(),
          requestId: r.id,
          tab: "invoice",
          directUrl: `/admin/invoice/${r.id}`,
        });
      }

      // ── 2. QUOTES ────────────────────────────────────────────
      const hasQuote = r.customerQuote || r.quotation || (r.supplierQuotations && r.supplierQuotations.length > 0) || r.quotedValue;
      if (hasQuote) {
        const quoteId = r.customerQuote?.id || r.quotation?.id || `quote-${r.id.replace("req-", "")}`;
        const quoteVersion = r.customerQuote?.version || 1;
        const quoteTotal = r.customerQuote?.totalAmount || r.quotation?.totalAmount || r.quotedValue || r.costCalculation?.totalCustomerQuote || 0;
        const supplierNames = r.supplierQuotations?.map((s) => s.supplierName).join(", ") || "";
        const supplierRefs = r.supplierQuotations?.map((s) => s.supplierPartRef).join(", ") || "";

        const quoteStatus = r.customerResponse === "Accepted"
          ? "Accepted"
          : r.customerResponse === "Rejected"
          ? "Rejected"
          : r.status === "Approved"
          ? "Approved"
          : r.status === "Quoted"
          ? "Awaiting Acceptance"
          : r.status;

        items.push({
          id: `quote-${r.id}`,
          category: "quotes",
          categoryLabel: "Quote",
          title: `Quote #${quoteId} (v${quoteVersion})`,
          subtitle: `${r.part.name} • ${customerStr} — ${vehicleString}`,
          badgeText: quoteStatus,
          badgeStyle: quoteStatus === "Accepted" || quoteStatus === "Approved" ? "paid" : "quoted",
          amount: formattedAmount(quoteTotal),
          referenceNumber: quoteId,
          customerName: customerStr,
          vehicleSummary: vehicleString,
          searchableContent: [
            quoteId,
            `v${quoteVersion}`,
            "quote",
            "quotation",
            r.requestNumber,
            r.part.name,
            r.part.partNumber,
            r.customerQuote?.oemNumber,
            r.quotation?.oemNumber,
            customerStr,
            vehicleString,
            supplierNames,
            supplierRefs,
            quoteStatus,
            quoteTotal ? `$${quoteTotal}` : "",
          ].filter(Boolean).join(" ").toLowerCase(),
          requestId: r.id,
          tab: "quote",
        });
      }

      // ── 3. PARTS & VEHICLES ──────────────────────────────────
      items.push({
        id: `part-${r.id}`,
        category: "parts",
        categoryLabel: "Part",
        title: r.part.name,
        subtitle: `${vehicleString} • VIN: ${r.vehicle.vin || "N/A"}${r.vehicle.registration ? ` • Plate: ${r.vehicle.registration}` : ""}`,
        badgeText: r.part.condition || "OEM",
        badgeStyle: "info",
        partNumber: r.part.partNumber || r.customerQuote?.oemNumber,
        referenceNumber: r.requestNumber,
        customerName: customerStr,
        vehicleSummary: vehicleString,
        searchableContent: [
          r.part.name,
          r.part.partNumber,
          r.customerQuote?.oemNumber,
          r.quotation?.oemNumber,
          r.part.condition,
          r.part.preference,
          r.vehicle.make,
          r.vehicle.model,
          String(r.vehicle.year),
          r.vehicle.vin,
          r.vehicle.registration,
          r.vehicle.engine,
          r.vehicle.variant,
          customerStr,
          r.requestNumber,
        ].filter(Boolean).join(" ").toLowerCase(),
        requestId: r.id,
        tab: "overview",
      });

      // ── 4. REFERENCES ────────────────────────────────────────
      // 4a. Request Number Reference
      items.push({
        id: `ref-req-${r.id}`,
        category: "references",
        categoryLabel: "Reference",
        title: `${r.requestNumber} (${r.id})`,
        subtitle: `${customerStr} • ${vehicleString} — ${r.part.name}`,
        badgeText: r.status,
        badgeStyle: "status",
        referenceNumber: r.requestNumber,
        customerName: customerStr,
        vehicleSummary: vehicleString,
        searchableContent: [
          r.requestNumber,
          r.id,
          customerStr,
          r.contactName,
          r.customerEmail,
          r.customerPhone,
          r.status,
          vehicleString,
          r.part.name,
        ].filter(Boolean).join(" ").toLowerCase(),
        requestId: r.id,
        tab: "overview",
      });

      // 4b. Supplier Order Reference (if exists)
      if (r.supplierOrder) {
        items.push({
          id: `ref-so-${r.id}`,
          category: "references",
          categoryLabel: "Reference",
          title: `Supplier Order: ${r.supplierOrder.supplierRef}`,
          subtitle: `${r.supplierOrder.supplierName} • Request: ${r.requestNumber} — ${r.part.name}`,
          badgeText: "Supplier Order",
          badgeStyle: "neutral",
          amount: formattedAmount(r.supplierOrder.total || r.supplierOrder.cost),
          referenceNumber: r.supplierOrder.supplierRef,
          searchableContent: [
            r.supplierOrder.supplierRef,
            r.supplierOrder.supplierName,
            r.requestNumber,
            r.part.name,
            "supplier order",
            "po",
          ].filter(Boolean).join(" ").toLowerCase(),
          requestId: r.id,
          tab: "sourcing",
        });
      }

      // 4c. Shipment Tracking Reference (if exists)
      if (r.shipment?.trackingNumber) {
        items.push({
          id: `ref-ship-${r.id}`,
          category: "references",
          categoryLabel: "Reference",
          title: `Tracking #${r.shipment.trackingNumber}`,
          subtitle: `${r.shipment.carrier} • Milestone: ${r.shipment.currentMilestone} • ETA: ${r.shipment.estimatedDelivery}`,
          badgeText: r.shipment.currentMilestone,
          badgeStyle: "info",
          referenceNumber: r.shipment.trackingNumber,
          searchableContent: [
            r.shipment.trackingNumber,
            r.shipment.carrier,
            r.shipment.currentMilestone,
            r.requestNumber,
            "tracking",
            "shipment",
          ].filter(Boolean).join(" ").toLowerCase(),
          requestId: r.id,
          tab: "shipment",
        });
      }
    });

    // 4d. Customers list records
    customers.forEach((c) => {
      items.push({
        id: `ref-cust-${c.id}`,
        category: "references",
        categoryLabel: "Reference",
        title: c.businessName,
        subtitle: `Contact: ${c.contactName} • ${c.email} • ${c.phone}`,
        badgeText: c.status,
        badgeStyle: c.status === "Active" ? "paid" : "neutral",
        referenceNumber: c.id,
        searchableContent: [
          c.businessName,
          c.contactName,
          c.email,
          c.phone,
          c.id,
          c.status,
          "customer trade account",
        ].filter(Boolean).join(" ").toLowerCase(),
        directUrl: "/admin/customers",
      });
    });

    // 4e. Suppliers list records
    suppliers.forEach((s) => {
      items.push({
        id: `ref-sup-${s.id}`,
        category: "references",
        categoryLabel: "Reference",
        title: s.name,
        subtitle: `${s.category} • ${s.country} • Contact: ${s.contact}`,
        badgeText: s.status,
        badgeStyle: s.status === "Active" || s.status === "Preferred" ? "paid" : "neutral",
        referenceNumber: s.id,
        searchableContent: [
          s.name,
          s.contact,
          s.country,
          s.category,
          s.specializations.join(" "),
          s.id,
          "supplier vendor",
        ].filter(Boolean).join(" ").toLowerCase(),
        directUrl: "/admin/suppliers",
      });
    });

    return items;
  }, [requests, customers, suppliers]);

  // Filter items based on active category & query
  const filteredResults = useMemo(() => {
    let list = indexedItems;

    // Filter by category tab if not 'all'
    if (activeCategory !== "all") {
      list = list.filter((item) => item.category === activeCategory);
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      // Default / empty query: return recent / top items
      return list.slice(0, 8);
    }

    const queryTokens = query.split(/\s+/).filter(Boolean);

    // Score & match items
    const scored = list
      .map((item) => {
        let score = 0;
        const allTokensMatch = queryTokens.every((token) => {
          const inContent = item.searchableContent.includes(token);
          if (inContent) {
            // Priority scoring
            if (item.title.toLowerCase().includes(token)) score += 50;
            if (item.partNumber?.toLowerCase().includes(token)) score += 60;
            if (item.referenceNumber?.toLowerCase().includes(token)) score += 60;
            if (item.subtitle.toLowerCase().includes(token)) score += 20;
            score += 10;
            return true;
          }
          return false;
        });

        if (!allTokensMatch) return null;

        // Exact match bonus
        if (item.title.toLowerCase() === query) score += 100;
        if (item.partNumber?.toLowerCase() === query) score += 120;
        if (item.referenceNumber?.toLowerCase() === query) score += 120;

        return { item, score };
      })
      .filter((x): x is { item: SearchItem; score: number } => x !== null)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.item);

    return scored.slice(0, 15);
  }, [indexedItems, activeCategory, searchQuery]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  // Keep selected item visible in scroll container
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector(
        `[data-result-index="${selectedIndex}"]`
      ) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  // Destination router handler
  const handleSelectItem = useCallback(
    (item: SearchItem) => {
      closeSearch();

      const isCustomerContext = pathname.startsWith("/customer");
      const isSubadminContext = pathname.startsWith("/subadmin");

      if (isCustomerContext && item.requestId) {
        if (item.category === "invoices") {
          router.push(`/customer/invoice/${item.requestId}`);
          return;
        }

        // Dispatch custom event to notify CustomerPortalLayout to open the request details modal
        window.dispatchEvent(
          new CustomEvent("procurly:open-customer-request", {
            detail: {
              requestId: item.requestId,
              tab: item.tab || "overview",
            },
          })
        );
        return;
      }

      if (isSubadminContext && item.requestId) {
        router.push(`/subadmin/dashboard?id=${item.requestId}`);
        return;
      }

      // Default Admin context handling
      if (item.category === "invoices" && item.requestId) {
        // Direct tax invoice viewer
        router.push(`/admin/invoice/${item.requestId}`);
        return;
      }

      if (item.requestId) {
        // Deep link to request workspace with the exact tab!
        const tabParam = item.tab ? `&tab=${item.tab}` : "";
        router.push(`/admin/requests?id=${item.requestId}${tabParam}`);
        return;
      }

      if (item.directUrl) {
        router.push(item.directUrl);
        return;
      }

      // Fallback
      router.push("/admin/requests");
    },
    [closeSearch, pathname, router]
  );

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredResults.length > 0 ? (prev + 1) % filteredResults.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredResults.length > 0 ? (prev - 1 + filteredResults.length) % filteredResults.length : 0
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelectItem(filteredResults[selectedIndex]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const categories: SearchCategory[] = ["all", "invoices", "quotes", "parts", "references"];
      const currentIdx = categories.indexOf(activeCategory);
      const nextIdx = e.shiftKey
        ? (currentIdx - 1 + categories.length) % categories.length
        : (currentIdx + 1) % categories.length;
      setActiveCategory(categories[nextIdx]);
    }
  };

  if (!isOpen) return null;

  // Category counts for badges
  const categoryCounts = {
    all: indexedItems.length,
    invoices: indexedItems.filter((i) => i.category === "invoices").length,
    quotes: indexedItems.filter((i) => i.category === "quotes").length,
    parts: indexedItems.filter((i) => i.category === "parts").length,
    references: indexedItems.filter((i) => i.category === "references").length,
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "invoices":
        return <FileText className="w-3.5 h-3.5 text-emerald-600" />;
      case "quotes":
        return <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />;
      case "parts":
        return <Package className="w-3.5 h-3.5 text-amber-600" />;
      case "references":
        return <Hash className="w-3.5 h-3.5 text-red-600" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getBadgeClasses = (style: SearchItem["badgeStyle"]) => {
    switch (style) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "unpaid":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      case "quoted":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      case "status":
        return "bg-red-50 text-[#FE0000] border-red-200/80";
      case "info":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/80";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Search Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/50 backdrop-blur-md transition-all duration-200 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSearch();
      }}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-950/25 overflow-hidden flex flex-col max-h-[82vh] animate-in zoom-in-95 duration-150 relative"
        onKeyDown={handleKeyDown}
      >
        {/* Top Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-100 bg-white">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#FE0000] flex items-center justify-center shrink-0 mr-3 border border-red-100">
            <Search className="w-5 h-5 stroke-[2.5]" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice #, quotes, parts, VIN, references..."
            className="flex-1 bg-transparent text-base sm:text-lg font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none"
          />

          <div className="flex items-center gap-2">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={closeSearch}
              className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200/80 cursor-pointer"
            >
              ESC
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 overflow-x-auto no-scrollbar">
          {(
            [
              { key: "all", label: "All Results", icon: Sparkles },
              { key: "invoices", label: "Invoices", icon: FileText },
              { key: "quotes", label: "Quotes", icon: FileCheck2 },
              { key: "parts", label: "Parts & Vehicles", icon: Package },
              { key: "references", label: "References", icon: Hash },
            ] as const
          ).map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[#FE0000] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-400"}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {categoryCounts[cat.key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Area */}
        <div
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 sm:p-3 focus:outline-none"
        >
          {filteredResults.length === 0 ? (
            <div className="py-14 px-6 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <Search className="w-6 h-6 stroke-1.5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">
                No matching results found
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                We couldn&apos;t find any invoice, quote, part, or reference matching &quot;
                <span className="font-semibold text-slate-700">{searchQuery}</span>&quot;.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-[11px] text-slate-400 font-medium">Try searching:</span>
                <button
                  onClick={() => setSearchQuery("INV-2026")}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] hover:bg-slate-200 transition-colors"
                >
                  INV-2026
                </button>
                <button
                  onClick={() => setSearchQuery("Hiace")}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] hover:bg-slate-200 transition-colors"
                >
                  Toyota Hiace
                </button>
                <button
                  onClick={() => setSearchQuery("Control Arm")}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] hover:bg-slate-200 transition-colors"
                >
                  Control Arm
                </button>
              </div>
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  data-result-index={index}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`group relative p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-red-50/70 border border-red-200/80 shadow-xs"
                      : "hover:bg-slate-50/80 border border-transparent"
                  }`}
                >
                  {/* Left: Icon & Details */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors border ${
                        isSelected
                          ? "bg-white text-[#FE0000] border-red-200 shadow-xs"
                          : "bg-slate-100/80 text-slate-500 border-slate-200/60"
                      }`}
                    >
                      {getCategoryIcon(item.category)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-slate-950 truncate">
                          <HighlightMatch text={item.title} query={searchQuery} />
                        </span>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${getBadgeClasses(
                            item.badgeStyle
                          )}`}
                        >
                          {item.badgeText}
                        </span>

                        {item.partNumber && (
                          <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                            OEM: <HighlightMatch text={item.partNumber} query={searchQuery} />
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-1 group-hover:text-slate-600">
                        <HighlightMatch text={item.subtitle} query={searchQuery} />
                      </p>
                    </div>
                  </div>

                  {/* Right: Meta & Navigation Arrow */}
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    {item.amount && (
                      <span className="text-xs sm:text-sm font-black text-slate-900">
                        {item.amount}
                      </span>
                    )}

                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-[#FE0000] text-white shadow-xs translate-x-0.5"
                          : "bg-slate-100 text-slate-400 group-hover:text-slate-700"
                      }`}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer with Keyboard Shortcuts Guide */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-600 font-bold shadow-2xs">
                ↑↓
              </kbd>
              <span>Navigate</span>
            </span>

            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-600 font-bold shadow-2xs flex items-center gap-0.5">
                <CornerDownLeft className="w-2.5 h-2.5" />
              </kbd>
              <span>Open</span>
            </span>

            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-600 font-bold shadow-2xs">
                Tab
              </kbd>
              <span>Filter Category</span>
            </span>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
            <span>Searching Procurly Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
