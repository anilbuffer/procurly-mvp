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
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 text-amber-900 text-xs">
                <strong>Important Notice to Trade Customers:</strong> These Particular Terms of Trade govern all commercial procurement orders, quotation releases, vehicle parts supply, and cross-border logistics facilitated through the Procurly platform by Autohub Procurement NZ Ltd. Please review all 9 clauses below.
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">
                  1. Acceptance of Terms
                </h4>
                <p className="text-slate-700">
                  By creating a trade account, submitting parts procurement inquiries, or proceeding with an order, the Trade Customer agrees unconditionally to the Procurly Particular Terms of Trade and statutory New Zealand commercial sales guidelines.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">
                  2. Quotation Validity
                </h4>
                <p className="text-slate-700">
                  All quotations generated by Procurly sourced via our Japanese (Nagoya/Tokyo) and global supplier network are valid for 48 hours from issuance, strictly subject to real-time supplier inventory confirmation and prevailing international shipping tariffs.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">
                  3. Landed Cost &amp; Currency
                </h4>
                <p className="text-slate-700">
                  The displayed Total Landed Price is in New Zealand Dollars (NZD) and inclusive of 15% statutory GST and chosen freight (Air Express or Consolidated Ocean). Any unforeseen customs tariff variances are absorbed by Procurly.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">
                  4. Returns &amp; Warranty
                </h4>
                <p className="text-slate-700">
                  Parts procured specifically on behalf of the customer are non-returnable unless demonstrably defective or non-compliant with manufacturer OEM specifications. Defective parts or transit damage must be documented and reported via the portal within 7 business days of bay delivery.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">
                  5. Limitation of Liability
                </h4>
                <p className="text-slate-700">
                  Procurly acts as a dedicated commercial procurement agent and is not liable for secondary damages, workshop vehicle downtime, loss of profits, or workshop labor costs resulting from international carrier delays, port congestion, or component defects.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">
                  6. Estimated Delivery Timeframes
                </h4>
                <p className="text-slate-700">
                  Delivery timeframes (e.g. 7–10 business days for Priority Air Express, 25–40 business days for Consolidated Sea Freight) are reasonable commercial estimates. Procurly and Autohub Logistics are not liable for transit delays caused by customs hold-ups, severe weather events, or global logistics disruptions.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">
                  7. Risk of Loss &amp; Title
                </h4>
                <p className="text-slate-700">
                  The risk of loss or damage to the parts passes to the customer upon successful delivery and sign-off at the nominated Workshop Bay address. Title remains with Autohub Procurement NZ Ltd until full payment of the issued tax invoice.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">
                  8. Dangerous Goods (DG) Protocols
                </h4>
                <p className="text-slate-700">
                  If the ordered part contains hazardous or restricted materials (e.g., lithium traction batteries, airbags, pyrotechnic pretensioners), it is subject to special international maritime/air DG handling and documentation. The customer explicitly consents to these mandatory compliance safety protocols.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">
                  9. Order Cancellation &amp; Lock-in
                </h4>
                <p className="text-slate-700">
                  Once the customer accepts the quotation and initiates the procurement workflow, the order is locked and international logistics are initiated. The order cannot be canceled, refunded, or redirected while in international transit under any circumstances.
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
            <span className="font-mono font-bold text-[11px] bg-white px-2 py-0.5 rounded border border-amber-200 shrink-0">
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
