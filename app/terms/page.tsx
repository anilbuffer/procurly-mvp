import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft, Shield, CheckCircle2, Printer } from "lucide-react";

export const metadata: Metadata = {
  title: "Particular Terms of Trade | Procurly B2B Platform",
  description:
    "Official Particular Terms of Trade governing commercial procurement, parts quotation, and logistics through the Procurly platform.",
};

export default function TermsOfTradePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Return to Registration"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FE0000] text-white flex items-center justify-center font-black text-sm">
                A
              </div>
              <span className="font-black italic text-lg tracking-tight text-slate-900 uppercase font-sans">
                PROCUR<span className="not-italic font-bold text-slate-700">LY</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/privacy"
              className="text-xs font-semibold text-slate-600 hover:text-[#FE0000] transition-colors"
            >
              Privacy Policy →
            </Link>
            <Link
              href="/register"
              className="px-3.5 py-1.5 rounded-xl bg-[#FE0000] hover:bg-[#9B0A0F] text-white text-xs font-bold transition-all shadow-xs"
            >
              Apply for Trade Account
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 flex-1 w-full space-y-8">
        {/* Document Header */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3 text-[#FE0000]">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FE0000] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                Official Commercial Document
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Particular Terms of Trade
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
            Governing all commercial procurement orders, quotation releases, vehicle parts supply, and cross-border logistics facilitated through the Procurly platform by Autohub Procurement NZ Ltd.
          </p>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <span><strong>Version:</strong> v2.4 (2026 Commercial Standard)</span>
            <span><strong>Jurisdiction:</strong> New Zealand Commercial Sales Guidelines</span>
            <span><strong>Last Updated:</strong> January 2026</span>
          </div>
        </div>

        {/* Notice Banner */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs leading-relaxed">
          <strong>Important Notice to Trade Customers:</strong> These Particular Terms of Trade govern all commercial procurement orders, quotation releases, vehicle parts supply, and cross-border logistics facilitated through the Procurly platform by Autohub Procurement NZ Ltd. Please review all 9 clauses below before registration.
        </div>

        {/* 9 Clauses */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm">
              1. Acceptance of Terms
            </h2>
            <p>
              By creating a trade account, submitting parts procurement inquiries, or proceeding with an order, the Trade Customer agrees unconditionally to the Procurly Particular Terms of Trade and statutory New Zealand commercial sales guidelines.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm">
              2. Quotation Validity
            </h2>
            <p>
              All quotations generated by Procurly sourced via our Japanese (Nagoya/Tokyo) and global supplier network are valid for 48 hours from issuance, strictly subject to real-time supplier inventory confirmation and prevailing international shipping tariffs.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm">
              3. Landed Cost &amp; Currency
            </h2>
            <p>
              The displayed Total Landed Price is in New Zealand Dollars (NZD) and inclusive of 15% statutory GST and chosen freight (Air Express or Consolidated Ocean). Any unforeseen customs tariff variances are absorbed by Procurly.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm">
              4. Returns &amp; Warranty
            </h2>
            <p>
              Parts procured specifically on behalf of the customer are non-returnable unless demonstrably defective or non-compliant with manufacturer OEM specifications. Defective parts or transit damage must be documented and reported via the portal within 7 business days of bay delivery.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm">
              5. Limitation of Liability
            </h2>
            <p>
              Procurly acts as a dedicated commercial procurement agent and is not liable for secondary damages, workshop vehicle downtime, loss of profits, or workshop labor costs resulting from international carrier delays, port congestion, or component defects.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm">
              6. Estimated Delivery Timeframes
            </h2>
            <p>
              Delivery timeframes (e.g. 7–10 business days for Priority Air Express, 25–40 business days for Consolidated Sea Freight) are reasonable commercial estimates. Procurly and Autohub Logistics are not liable for transit delays caused by customs hold-ups, severe weather events, or global logistics disruptions.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm">
              7. Risk of Loss &amp; Title
            </h2>
            <p>
              The risk of loss or damage to the parts passes to the customer upon successful delivery and sign-off at the nominated Workshop Bay address. Title remains with Autohub Procurement NZ Ltd until full payment of the issued tax invoice.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm">
              8. Dangerous Goods (DG) Protocols
            </h2>
            <p>
              If the ordered part contains hazardous or restricted materials (e.g., lithium traction batteries, airbags, pyrotechnic pretensioners), it is subject to special international maritime/air DG handling and documentation. The customer explicitly consents to these mandatory compliance safety protocols.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm">
              9. Order Cancellation &amp; Lock-in
            </h2>
            <p>
              Once the customer accepts the quotation and initiates the procurement workflow, the order is locked and international logistics are initiated. The order cannot be canceled, refunded, or redirected while in international transit under any circumstances.
            </p>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>End of Particular Terms of Trade documentation.</span>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/register"
            className="text-xs font-bold text-[#FE0000] hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Registration Form</span>
          </Link>
          <Link
            href="/privacy"
            className="text-xs font-bold text-slate-700 hover:text-slate-900 underline"
          >
            View Privacy Policy →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>© 2026 Procurly Ltd &amp; Autohub Procurement NZ Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
