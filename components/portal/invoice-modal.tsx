"use client";

import React, { useEffect } from "react";
import { usePortal } from "@/context/portal-context";
import { InvoiceDocument } from "@/components/shared/invoice-document";

export function InvoiceModal() {
  const {
    isInvoiceModalOpen,
    invoiceRequest,
    closeInvoiceModal,
    setIsPaymentModalOpen,
    setPaymentRequest,
  } = usePortal();

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isInvoiceModalOpen) {
        closeInvoiceModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isInvoiceModalOpen, closeInvoiceModal]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isInvoiceModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isInvoiceModalOpen]);

  if (!isInvoiceModalOpen || !invoiceRequest) {
    return null;
  }

  const handlePayNow = () => {
    closeInvoiceModal();
    setPaymentRequest(invoiceRequest);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 md:p-10 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl my-4 sm:my-8 bg-transparent transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <InvoiceDocument
          request={invoiceRequest}
          isModal={true}
          onClose={closeInvoiceModal}
          onPayNow={handlePayNow}
          standaloneUrl={`/customer/invoice/${invoiceRequest.id}`}
        />
      </div>
    </div>
  );
}
