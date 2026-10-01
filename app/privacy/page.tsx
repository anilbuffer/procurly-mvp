import type { Metadata } from "next";
import Link from "next/link";
import { Shield, ArrowLeft, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Procurly B2B Platform",
  description:
    "Official Procurly Trade Customer Privacy Policy covering commercial confidentiality, MPI/customs clearance, and AES-256 data protection.",
};

export default function PrivacyPolicyPage() {
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
              href="/terms"
              className="text-xs font-semibold text-slate-600 hover:text-[#FE0000] transition-colors"
            >
              Particular Terms of Trade →
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
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Data Protection Standard
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Procurly Privacy Policy
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
            Procurly and Autohub are dedicated to safeguarding the privacy and commercial confidentiality of our automotive trade customers, workshops, and dealerships.
          </p>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <span><strong>Standard:</strong> New Zealand Privacy Act 2020 Compliance</span>
            <span><strong>Encryption:</strong> AES-256 (At Rest &amp; Transit)</span>
            <span><strong>Last Updated:</strong> January 2026</span>
          </div>
        </div>

        {/* 4 Clauses */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm">
              1. Information We Collect
            </h2>
            <p>
              We collect commercial details necessary to establish your trade account and process parts imports, including registered business legal names, NZBN/ABN identifiers, contact personnel names, workshop delivery bay addresses, direct telephone lines, and vehicle chassis/VIN search inquiries.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h2 className="font-bold text-slate-900 text-sm">
              2. Purpose &amp; Use of Information
            </h2>
            <p>
              Your information is utilized solely for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Validating commercial trade eligibility with Autohub Operations.</li>
              <li>Executing customs declarations, MPI biosecurity clearance, and shipping manifests.</li>
              <li>Delivering real-time shipment milestones and dispatch notifications.</li>
              <li>Administering trade credit accounts and generating compliant GST invoices.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm">
              3. Data Protection &amp; Security Standards
            </h2>
            <p>
              All credentials, session tokens, and commercial transaction records are secured using AES-256 encryption in transit (TLS 1.3) and at rest. Multi-Factor Authentication (MFA) is strictly enforced for all portal access.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm">
              4. Information Sharing &amp; Third Parties
            </h2>
            <p>
              We never sell, rent, or lease trade customer data. Information is shared strictly on a need-to-know basis with verified transport logistics partners (Autohub Logistics Ltd, freight forwarders) and government customs bodies (NZ Customs Service, MPI).
            </p>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>End of Privacy Policy documentation.</span>
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
            href="/terms"
            className="text-xs font-bold text-slate-700 hover:text-slate-900 underline"
          >
            View Particular Terms of Trade →
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
