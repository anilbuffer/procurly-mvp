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
              <span className="font-black italic text-lg tracking-tight text-slate-900 uppercase ">
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
          <strong>Important Notice to Trade Customers:</strong> These Particular Terms of Trade govern all commercial procurement orders, quotation releases, vehicle parts supply, and cross-border logistics facilitated through the Procurly platform by Autohub New Zealand Ltd. Please review all 13 clauses below before registration.
        </div>

        {/* Terms of Trade Document */}
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-800 leading-relaxed ">
          {/* Document Heading */}
          <div className="space-y-1 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">
              Procurly Particular Terms of Trade
            </h2>
            <p className="text-sm font-bold text-slate-900">
              Trade Customers Only
            </p>
          </div>

          {/* Intro Paragraphs */}
          <div className="space-y-3">
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
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              1. Acceptance of Terms
            </h3>
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
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              2. Procurly&apos;s Role
            </h3>
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
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              3. Quotations and Pricing
            </h3>
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
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              4. Part Identification and Fitment
            </h3>
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
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              5. Inspection, and Installation
            </h3>
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
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              6. Returns, Defects and Transit Damage
            </h3>
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
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              7. Delivery and Logistics
            </h3>
            <p>
              All delivery dates and transit times are <strong>estimates only</strong> unless expressly agreed otherwise in writing.
            </p>
            <p>
              International freight may be affected by port congestion, carrier schedules, weather, regulatory inspections, dangerous-goods requirements and other circumstances outside Autohub&apos;s reasonable control.
            </p>
            <p>
              Autohub will use reasonable commercial efforts to coordinate delivery and keep the customer informed of material delays but does not guarantee a particular arrival date.
            </p>
          </div>

          {/* 8. Risk and Title */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              8. Risk and Title
            </h3>
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
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              9. Dangerous and Restricted Goods
            </h3>
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
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              10. Cancellation
            </h3>
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
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              11. Limitation of Liability
            </h3>
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
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              12. Business-to-Business Supply
            </h3>
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
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              13. Governing Law
            </h3>
            <p>
              These terms and each Procurly order are governed by the laws of <strong>New Zealand</strong>.
            </p>
            <p>
              The parties submit to the jurisdiction of the New Zealand courts.
            </p>
          </div>

          {/* Closing Statement */}
          <div className="pt-3 border-t border-slate-200">
            <p className="font-bold text-slate-900 text-sm">
              By accepting a Procurly quotation or placing an order, the customer confirms that it has read and accepted these Particular Terms of Trade.
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
