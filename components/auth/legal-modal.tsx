"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Shield, FileText, CheckCircle2, ArrowDown, AlertCircle } from "lucide-react";

export type LegalDocType = "terms" | "privacy";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoc?: LegalDocType;
  onAccept?: () => void;
  showAcceptButton?: boolean;
  title?: string;
}

export function LegalModal({
  isOpen,
  onClose,
  initialDoc = "terms",
  onAccept,
  showAcceptButton = true,
  title,
}: LegalModalProps) {
  const [activeDoc, setActiveDoc] = useState<LegalDocType>(initialDoc);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveDoc(initialDoc);
      setHasScrolledToBottom(false);
      setScrollProgress(0);
      // Reset scroll position
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      }, 50);
    }
  }, [isOpen, initialDoc]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 15) {
      setHasScrolledToBottom(true);
      setScrollProgress(100);
      return;
    }

    const currentPercent = Math.min(100, Math.round((scrollTop / maxScroll) * 100));
    setScrollProgress(currentPercent);

    if (scrollTop + clientHeight >= scrollHeight - 35) {
      setHasScrolledToBottom(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FE0000]/10 border border-[#FE0000]/20 flex items-center justify-center text-[#FE0000]">
              {activeDoc === "terms" ? (
                <FileText className="w-4 h-4" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
            </div>
            <div>
              <h2
                id="legal-modal-title"
                className="text-base font-bold text-slate-900 leading-tight"
              >
                {title || (activeDoc === "terms" ? "Particular Terms of Trade" : "Procurly Privacy Policy")}
              </h2>
              <p className="text-[11px] text-slate-500">
                Official Autohub Procurement Network Documentation • v2.4 (2026)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveDoc("terms");
              setHasScrolledToBottom(false);
              setScrollProgress(0);
              if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
            }}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${activeDoc === "terms"
              ? "border-[#FE0000] text-[#FE0000]"
              : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Particular Terms of Trade
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveDoc("privacy");
              setHasScrolledToBottom(false);
              setScrollProgress(0);
              if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
            }}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${activeDoc === "privacy"
              ? "border-[#FE0000] text-[#FE0000]"
              : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Privacy Policy
          </button>
        </div>

        {/* Content Body with Scroll Listener */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-xs text-slate-700 leading-relaxed custom-scrollbar"
        >
          {activeDoc === "terms" ? (
            <div className="space-y-5 text-slate-800  text-xs leading-relaxed">
              {/* Document Header */}
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">
                  Procurly Particular Terms of Trade
                </h3>
                <p className="font-bold text-slate-900 text-xs">
                  Trade Customers Only
                </p>
              </div>

              {/* Introductory Paragraphs */}
              <div className="space-y-3 text-slate-800">
                <p>
                  These Particular Terms of Trade apply to commercial parts procurement and associated logistics services arranged through the Procurly platform by <strong>Autohub New Zealand Ltd</strong> (&quot;Autohub&quot;, &quot;we&quot;, &quot;us&quot; or &quot;our&quot;).
                </p>
                <p>
                  &quot;Procurly&quot; refers to Autohub&apos;s procurement platform and service and is not a separate contracting entity.
                </p>
                <p>
                  By opening a Procurly trade account, requesting a quotation or accepting an order, the customer confirms that it is acquiring the relevant goods and services <strong>in trade and for business purposes</strong>.
                </p>
              </div>

              {/* 1. Acceptance of Terms */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">
                  1. Acceptance of Terms
                </h4>
                <p>
                  By creating a trade account, submitting a procurement request, accepting a quotation or otherwise instructing us to proceed with an order, the customer agrees to these Terms of Trade.
                </p>
                <p>
                  The customer warrants that the person accepting a quotation or placing an order has authority to bind the customer.
                </p>
                <p>
                  These terms apply together with the accepted quotation and any specific conditions stated on that quotation.
                </p>
              </div>

              {/* 2. Procurly's Role */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">
                  2. Procurly&apos;s Role
                </h4>
                <p>
                  Procurly provides a commercial procurement and logistics coordination service.
                </p>
                <p>
                  Unless expressly stated otherwise in a quotation, parts may be sourced from independent third-party suppliers overseas. Autohub does not manufacture those parts and does not independently warrant their manufacture, quality or conformity beyond any warranty expressly provided by Autohub or passed through from the relevant supplier.
                </p>
                <p>
                  We will use reasonable commercial efforts to source parts matching the information and requirements supplied by the customer.
                </p>
              </div>

              {/* 3. Quotations and Pricing */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">
                  3. Quotations and Pricing
                </h4>
                <p>
                  Unless otherwise stated, quotations are valid for <strong>48 hours</strong> and remain subject to supplier availability and final supplier confirmation.
                </p>
                <p>
                  Prices are stated in New Zealand Dollars (NZD) and will specify whether GST, freight, customs charges and other applicable costs are included.
                </p>
                <p>
                  Where a quotation is stated as a <strong>Total Landed Door-to-Door Price</strong>, that price includes the items expressly identified in the quotation.
                </p>
                <p>
                  If an exceptional cost arises after acceptance that could not reasonably have been identified when the quotation was issued — including changes in government duties, taxes, regulatory charges or customer-requested changes — we will notify the customer before charging any additional amount wherever reasonably practicable.
                </p>
              </div>

              {/* 4. Part Identification and Fitment */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">
                  4. Part Identification and Fitment
                </h4>
                <p>
                  The customer is responsible for providing accurate information required to identify the requested part, including where applicable the VIN, registration, model, year, engine specification, OEM part number, photographs and any other requested information.
                </p>
                <p>
                  Autohub will use reasonable commercial efforts to verify part compatibility using the information available to it and its suppliers.
                </p>
                <p>
                  Unless expressly confirmed in writing, <strong>fitment and compatibility are not guaranteed</strong>. The customer acknowledges that international parts sourcing may involve differences in vehicle specification, market configuration, superseded part numbers or supplier information.
                </p>
                <p>
                  The customer must review the description, photographs, part numbers and other information contained in the quotation before accepting the order.
                </p>
              </div>

              {/* 5. Inspection, and Installation */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">
                  5. Inspection, and Installation
                </h4>
                <p>
                  The customer is responsible for ensuring that parts are inspected before installation and are installed, programmed, calibrated or commissioned by suitably qualified personnel in accordance with applicable manufacturer procedures.
                </p>
                <p>
                  Autohub is not responsible for loss, damage or failure arising from incorrect installation, modification, programming, calibration, misuse or failure to follow applicable installation procedures.
                </p>
                <p>
                  Where reasonably practicable, any apparent defect, damage or discrepancy should be reported before the part is installed or modified.
                </p>
              </div>

              {/* 6. Returns, Defects and Transit Damage */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">
                  6. Returns, Defects and Transit Damage
                </h4>
                <p>
                  Parts specifically procured for a customer are <strong>not returnable for change of mind or incorrect ordering information supplied by the customer</strong>.
                </p>
                <p>
                  If a part is materially different from the part confirmed in the accepted quotation, arrives materially damaged in transit, or is demonstrably defective, the customer must notify us through Procurly as soon as reasonably practicable and preferably within <strong>7 business days of delivery</strong>, together with photographs and other reasonable supporting evidence.
                </p>
                <p>
                  Where a valid claim is established, Autohub will use reasonable commercial efforts to obtain an appropriate remedy from the supplier or carrier, which may include repair, replacement, credit or refund depending on the circumstances.
                </p>
                <p>
                  Any manufacturer&apos;s or supplier&apos;s warranty available in relation to a part will, where reasonably possible, be passed through to the customer.
                </p>
                <p>
                  No additional warranty is given by Autohub unless expressly stated in writing.
                </p>
              </div>

              {/* 7. Delivery and Logistics */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">
                  7. Delivery and Logistics
                </h4>
                <p>
                  All delivery dates and transit times are <strong>estimates only</strong> unless expressly agreed otherwise in writing.
                </p>
                <p>
                  International freight may be affected by customs clearance, port congestion, carrier schedules, weather, regulatory inspections, dangerous-goods requirements and other circumstances outside Autohub&apos;s reasonable control.
                </p>
                <p>
                  Autohub will use reasonable commercial efforts to coordinate delivery and keep the customer informed of material delays but does not guarantee a particular arrival date.
                </p>
              </div>

              {/* 8. Risk and Title */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">
                  8. Risk and Title
                </h4>
                <p>
                  Risk in the goods passes to the customer upon delivery to the customer&apos;s nominated delivery address or collection point.
                </p>
                <p>
                  Where goods are delivered visibly damaged, the customer should note the damage on the delivery record where reasonably possible and promptly notify Autohub.
                </p>
                <p>
                  Title to goods supplied by Autohub does not pass to the customer until all amounts owing in respect of those goods have been paid in full.
                </p>
              </div>

              {/* 9. Dangerous and Restricted Goods */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">
                  9. Dangerous and Restricted Goods
                </h4>
                <p>
                  Certain automotive components — including batteries, airbags, pretensioners and other hazardous or regulated items — may be subject to dangerous-goods, aviation, maritime, customs or other regulatory requirements.
                </p>
                <p>
                  The customer authorises Autohub and its logistics providers to use the transport method, packaging, documentation and handling procedures reasonably required to comply with those requirements.
                </p>
                <p>
                  Additional costs or delays resulting from such requirements will be communicated where reasonably practicable.
                </p>
              </div>

              {/* 10. Cancellation */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">
                  10. Cancellation
                </h4>
                <p>
                  Once a quotation has been accepted and Autohub has committed to the supplier, purchased the goods or commenced international logistics, the order <strong>cannot ordinarily be cancelled or changed</strong>.
                </p>
                <p>
                  If the customer requests cancellation before shipment, Autohub may attempt to cancel the procurement but is not obliged to do so where supplier or logistics commitments cannot reasonably be reversed.
                </p>
                <p>
                  Any refund or credit will be limited to amounts actually recoverable after deducting supplier charges, freight commitments, currency costs, administrative costs and other non-recoverable expenses reasonably incurred in fulfilling the order.
                </p>
              </div>

              {/* 11. Limitation of Liability */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">
                  11. Limitation of Liability
                </h4>
                <p>
                  To the maximum extent permitted by law, Autohub is not liable for indirect, consequential or special loss arising from an order, including loss of profit, loss of revenue, loss of business opportunity, vehicle or workshop downtime, substitute vehicle costs or workshop labour costs.
                </p>
                <p>
                  Autohub is not responsible for loss resulting from inaccurate information supplied by the customer, reasonable reliance on information supplied by an overseas supplier, or delays or events outside Autohub&apos;s reasonable control.
                </p>
                <p>
                  Except where liability cannot lawfully be excluded or limited, Autohub&apos;s aggregate liability arising from an order will not exceed the amount paid by the customer to Autohub for the particular goods or services giving rise to the claim.
                </p>
                <p>
                  Nothing in these terms excludes liability that cannot lawfully be excluded.
                </p>
              </div>

              {/* 12. Business-to-Business Supply */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">
                  12. Business-to-Business Supply
                </h4>
                <p>
                  Procurly is intended exclusively for customers acquiring goods and services <strong>in trade</strong>.
                </p>
                <p>
                  Where the customer acquires goods or services from Autohub in trade for business purposes, the parties agree, to the maximum extent permitted by law and where it is fair and reasonable for them to be bound by this provision, that the <strong>Consumer Guarantees Act 1993 does not apply</strong>.
                </p>
                <p>
                  The customer acknowledges that these terms form part of a commercial business-to-business transaction.
                </p>
              </div>

              {/* 13. Governing Law */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">
                  13. Governing Law
                </h4>
                <p>
                  These terms and each Procurly order are governed by the laws of <strong>New Zealand</strong>.
                </p>
                <p>
                  The parties submit to the jurisdiction of the New Zealand courts.
                </p>
              </div>

              {/* Closing Acknowledgment */}
              <div className="pt-2">
                <p className="font-bold text-slate-900">
                  By accepting a Procurly quotation or placing an order, the customer confirms that it has read and accepted these Particular Terms of Trade.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You have reached the end of the Particular Terms of Trade.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-xs">
                <strong>Privacy Commitment:</strong> Procurly and Autohub are dedicated to safeguarding the privacy and commercial confidentiality of our automotive trade customers and workshops.
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">
                  1. Information We Collect
                </h4>
                <p>
                  We collect commercial details necessary to establish your trade account and process parts imports, including registered business legal names, NZBN/ABN identifiers, contact personnel names, workshop delivery bay addresses, direct telephone lines, and vehicle chassis/VIN search inquiries.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">
                  2. Purpose &amp; Use of Information
                </h4>
                <p>
                  Your information is utilized solely for:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-1 text-slate-600">
                  <li>Validating commercial trade eligibility with Autohub Operations.</li>
                  <li>Executing customs declarations, MPI biosecurity clearance, and shipping manifests.</li>
                  <li>Delivering real-time shipment milestones and dispatch notifications.</li>
                  <li>Administering trade credit accounts and generating compliant GST invoices.</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">
                  3. Data Protection &amp; Security Standards
                </h4>
                <p>
                  All credentials, session tokens, and commercial transaction records are secured using AES-256 encryption in transit (TLS 1.3) and at rest. Multi-Factor Authentication (MFA) is strictly enforced for all portal access.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">
                  4. Information Sharing &amp; Third Parties
                </h4>
                <p>
                  We never sell, rent, or lease trade customer data. Information is shared strictly on a need-to-know basis with verified transport logistics partners (Autohub Logistics Ltd, freight forwarders) and government customs bodies (NZ Customs Service, MPI).
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You have reached the end of the Privacy Policy.</span>
              </div>
            </div>
          )}
        </div>

        {/* Scroll Enforcement Guidance Banner */}
        {!hasScrolledToBottom && showAcceptButton && (
          <div className="flex items-center justify-between text-xs text-amber-900 bg-amber-50 px-6 py-2.5 border-t border-amber-200 shrink-0">
            <span className="flex items-center gap-2 font-medium">
              <ArrowDown className="w-4 h-4 animate-bounce text-[#FE0000] shrink-0" />
              <span>Please scroll through and view the entire terms to enable acceptance</span>
            </span>
            <span className=" font-bold text-[11px] bg-white px-2 py-0.5 rounded border border-amber-200 shrink-0">
              {scrollProgress}% viewed
            </span>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/90 shrink-0">
          <span className="text-[11px] text-slate-500">
            {hasScrolledToBottom ? "✓ Terms fully viewed. You may now accept." : "Scroll down to read all terms."}
          </span>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
            {showAcceptButton && onAccept && (
              <button
                type="button"
                disabled={!hasScrolledToBottom}
                onClick={() => {
                  if (hasScrolledToBottom) {
                    onAccept();
                    onClose();
                  }
                }}
                className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-xs inline-flex items-center gap-2 ${hasScrolledToBottom
                  ? "bg-[#FE0000] hover:bg-[#9B0A0F] text-white shadow-md shadow-red-500/20 active:scale-95 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                  }`}
                title={hasScrolledToBottom ? "Click to accept" : "Please scroll to bottom first"}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {hasScrolledToBottom ? "I Have Read & Agree to Terms" : "Scroll to Bottom to Agree (↓)"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
