"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Truck,
  FileText,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Info,
  Check,
  Building,
  Briefcase,
  Globe,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LegalModal, LegalDocType } from "@/components/auth/legal-modal";
import { useUnifiedData } from "@/context/unified-data-context";
import { CustomerRecord, SavedAddress } from "@/types/shared";
import { MOCK_USERS } from "@/lib/mock-auth";
import { MOCK_STAFF_USERS } from "@/lib/shared-mock-data";

const NZ_REGIONS = [
  "Auckland",
  "Waikato / Hamilton",
  "Bay of Plenty / Tauranga",
  "Wellington / Hutt Valley",
  "Canterbury / Christchurch",
  "Otago / Dunedin / Queenstown",
  "Hawke's Bay / Napier-Hastings",
  "Manawatu / Palmerston North",
  "Northland / Whangarei",
  "Taranaki / New Plymouth",
  "Nelson / Marlborough",
  "Southland / Invercargill",
  "Other New Zealand Region",
];

const BUSINESS_CATEGORIES = [
  "Registered company",
  "Sole trader",
];

// ─── Wizard step definitions ─────────────────────────────────
const STEPS = [
  { id: 1, label: "Business", shortLabel: "Business", icon: Building2, description: "Company details" },
  { id: 2, label: "Contact", shortLabel: "Contact", icon: User, description: "Your credentials" },
  { id: 3, label: "Delivery", shortLabel: "Delivery", icon: Truck, description: "Workshop address" },
  { id: 4, label: "Review", shortLabel: "Review", icon: FileText, description: "Confirm & submit" },
] as const;


export function RegisterView() {
  const router = useRouter();
  const { customers, addCustomer } = useUnifiedData();

  // ─── Wizard Step State ───────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([1]));
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");

  // ─── Step 1: Business Details ──────────────────────────────
  const [businessName, setBusinessName] = useState("");
  const [tradingName, setTradingName] = useState("");
  const [nzbn, setNzbn] = useState("");
  const [businessType, setBusinessType] = useState(BUSINESS_CATEGORIES[0]);
  const [website, setWebsite] = useState("");

  // ─── Step 2: Contact Person & Credentials ──────────────────
  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("Workshop Owner / Director");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ─── Step 3: Delivery Address (Workshop Bay) ───────────────
  const [deliveryBayLabel, setDeliveryBayLabel] = useState("Main Workshop Bay 1");
  const [deliveryRecipient, setDeliveryRecipient] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [suburb, setSuburb] = useState("");
  const [city, setCity] = useState("Auckland");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [isDefaultDelivery, setIsDefaultDelivery] = useState(true);

  // ─── Step 4: Legal & Acknowledgement ───────────────────────
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsAttemptedError, setTermsAttemptedError] = useState(false);
  const [termsAcknowledgedAt, setTermsAcknowledgedAt] = useState<string | null>(null);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalDocType, setLegalDocType] = useState<LegalDocType>("terms");

  // ─── Submission State ─────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isRegisteredSuccess, setIsRegisteredSuccess] = useState(false);
  const [registeredRecord, setRegisteredRecord] = useState<CustomerRecord | null>(null);

  // ─── Real-time Duplicate Prevention Checks ────────────────
  const duplicateEmail = useMemo(() => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) return null;

    // Check against existing customers in context
    const customerMatch = customers.find(
      (c) => c.email.trim().toLowerCase() === cleanEmail
    );
    if (customerMatch) {
      return {
        matchedBusiness: customerMatch.businessName,
        reason: "Customer trade account already exists",
      };
    }

    // Check against mock auth users
    const mockUserMatch = MOCK_USERS.find(
      (u) => u.email.trim().toLowerCase() === cleanEmail
    );
    if (mockUserMatch) {
      return {
        matchedBusiness: mockUserMatch.organization || "Existing Account",
        reason: "User account already registered",
      };
    }

    // Check against staff users
    const staffMatch = MOCK_STAFF_USERS.find(
      (s) => s.email.trim().toLowerCase() === cleanEmail
    );
    if (staffMatch) {
      return {
        matchedBusiness: "Procurly Staff Account",
        reason: "This email is registered to internal staff",
      };
    }

    return null;
  }, [email, customers]);

  const duplicateCompany = useMemo(() => {
    const cleanName = businessName.trim().toLowerCase();
    if (!cleanName || cleanName.length < 3) return null;

    const match = customers.find(
      (c) => c.businessName.trim().toLowerCase() === cleanName
    );
    if (match) {
      return {
        existingId: match.id,
        existingContact: match.contactName,
        existingEmail: match.email,
        status: match.status,
      };
    }

    return null;
  }, [businessName, customers]);

  // Helper to copy contact details to delivery recipient
  const handleCopyContactToDelivery = () => {
    if (contactName) setDeliveryRecipient(contactName);
    if (phone) setDeliveryPhone(phone);
  };

  // ─── Open Legal Modal Helper ──────────────────────────────
  const handleOpenLegal = (doc: LegalDocType) => {
    setLegalDocType(doc);
    setLegalModalOpen(true);
  };

  // ─── Handle Legal Acceptance from Modal ───────────────────
  const handleLegalAcceptance = () => {
    setTermsAccepted(true);
    setTermsAttemptedError(false);
    const now = new Date();
    const formatted = `${now.toLocaleDateString("en-NZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}, ${now.toLocaleTimeString("en-NZ", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
    setTermsAcknowledgedAt(formatted);
  };

  // ─── Per-step validation ──────────────────────────────────
  const validateStep = useCallback(
    (step: number): string | null => {
      switch (step) {
        case 1:
          if (!businessName.trim()) return "Please enter your Company / Business Legal Name.";
          if (duplicateCompany)
            return `The company "${businessName.trim()}" is already registered in the Procurly trade network.`;
          return null;
        case 2:
          if (!contactName.trim()) return "Please enter the Primary Contact Person's name.";
          if (!email.trim() || !email.includes("@")) return "Please provide a valid Business Email Address.";
          if (duplicateEmail) return `The email "${email.trim()}" is already registered.`;
          if (!phone.trim()) return "Please enter your Direct / Mobile Phone Number.";
          if (!password || password.length < 6) return "Password must be at least 6 characters.";
          if (password !== confirmPassword) return "Passwords do not match.";
          return null;
        case 3:
          if (!streetAddress.trim()) return "Please enter the Street Address.";
          if (!suburb.trim()) return "Please enter the Suburb / District.";
          if (!city.trim()) return "Please select the City / Region.";
          if (!postalCode.trim()) return "Please enter the Postcode.";
          return null;
        case 4:
          if (!termsAccepted) {
            setTermsAttemptedError(true);
            return "You must review and acknowledge the Terms of Trade and Privacy Policy.";
          }
          return null;
        default:
          return null;
      }
    },
    [businessName, duplicateCompany, contactName, email, duplicateEmail, phone, password, confirmPassword, streetAddress, suburb, city, postalCode, termsAccepted]
  );

  // ─── Step completion check (no error messages) ────────────
  const isStepComplete = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return !!businessName.trim() && !duplicateCompany;
        case 2:
          return (
            !!contactName.trim() &&
            !!email.trim() &&
            email.includes("@") &&
            !duplicateEmail &&
            !!phone.trim() &&
            !!password &&
            password.length >= 6 &&
            password === confirmPassword
          );
        case 3:
          return !!streetAddress.trim() && !!suburb.trim() && !!city.trim() && !!postalCode.trim();
        case 4:
          return termsAccepted;
        default:
          return false;
      }
    },
    [businessName, duplicateCompany, contactName, email, duplicateEmail, phone, password, confirmPassword, streetAddress, suburb, city, postalCode, termsAccepted]
  );

  // ─── Navigation ───────────────────────────────────────────
  const goToStep = useCallback(
    (target: number) => {
      if (target === currentStep) return;
      // Can only go forward after validating current step, or backward freely
      if (target > currentStep) {
        const error = validateStep(currentStep);
        if (error) {
          setGeneralError(error);
          return;
        }
      }
      setGeneralError(null);
      setSlideDirection(target > currentStep ? "right" : "left");
      setVisitedSteps((prev) => { const arr = Array.from(prev); arr.push(target); return new Set(arr); });
      setCurrentStep(target);
    },
    [currentStep, validateStep]
  );

  const handleNext = () => {
    if (currentStep < 4) goToStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  };

  // ─── Form Submission ──────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // Final validation across all steps
    for (let s = 1; s <= 4; s++) {
      const error = validateStep(s);
      if (error) {
        setGeneralError(error);
        goToStep(s);
        return;
      }
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Construct SavedAddress
    const deliveryAddressObj: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: deliveryBayLabel.trim() || "Main Workshop Bay",
      recipientName: deliveryRecipient.trim() || contactName.trim(),
      businessName: businessName.trim(),
      streetAddress: streetAddress.trim(),
      suburb: suburb.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      phone: deliveryPhone.trim() || phone.trim(),
      isDefault: isDefaultDelivery,
      isVerified: true,
      verifiedSource: "Trade Registration Application",
      deliveryInstructions: deliveryInstructions.trim() || undefined,
    };

    // Construct New Customer Record
    const newCustomer: CustomerRecord = {
      id: `cust-${Date.now()}`,
      businessName: businessName.trim(),
      tradingName: tradingName.trim() || undefined,
      nzbn: nzbn.trim() || undefined,
      businessType,
      website: website.trim() || undefined,
      contactName: contactName.trim(),
      contactRole,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      status: "Pending Approval", // MVP Manual approval flow
      registrationDate: new Date().toISOString().split("T")[0],
      requestCount: 0,
      deliveryAddress: deliveryAddressObj,
      termsAcceptedAt: termsAcknowledgedAt || new Date().toISOString(),
      privacyAcceptedAt: termsAcknowledgedAt || new Date().toISOString(),
      notes: `Trade customer registration via portal. NZBN: ${nzbn.trim() || "N/A"}. Category: ${businessType}. Terms accepted: ${termsAcknowledgedAt}.`,
    };

    // Persist to unified context
    addCustomer(newCustomer);
    setRegisteredRecord(newCustomer);
    setIsSubmitting(false);
    setIsRegisteredSuccess(true);
  };

  // ─── Step indicator helpers ───────────────────────────────
  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep && isStepComplete(stepId)) return "completed";
    if (stepId === currentStep) return "active";
    if (visitedSteps.has(stepId) && isStepComplete(stepId)) return "completed";
    if (visitedSteps.has(stepId)) return "visited";
    return "upcoming";
  };

  return (
    <AuthLayout maxWidth="max-w-2xl">
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Top Eyebrow & Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-600 hover:text-[#FE0000] inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
          {!isRegisteredSuccess && (
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Step {currentStep} of 4
            </span>
          )}
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Register your business
          </h1>
          {!isRegisteredSuccess && (
            <p className="text-xs text-slate-500 mt-1">
              Complete each step below to apply for a Procurly trade account.
            </p>
          )}
        </div>


        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SUCCESS CONFIRMATION VIEW (Pending Manual Approval)               */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {isRegisteredSuccess && registeredRecord ? (
          <div className="space-y-6 animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4 sm:space-y-5">
              {/* Status Header */}
              <div className="flex items-start gap-3.5 sm:gap-4 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Pending Manual Approval
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">
                    Registration Application Submitted
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Thank you! Your commercial trade registration has been received and queued for review.
                  </p>
                </div>
              </div>

              {/* Review Process Notice */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Shield className="w-4 h-4 text-[#FE0000]" />
                  <span>Manual Business Verification Process</span>
                </div>
                <p className="leading-relaxed">
                  For platform security and trade wholesale pricing eligibility, all new workshop accounts are manually verified by the Procurly Autohub operations desk. We will review your NZBN and company credentials within <strong>1 business day</strong>.
                </p>
              </div>

              {/* Summary of Registered Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Registered Account Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Business Card */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Company &amp; Trade Details</span>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">
                      {registeredRecord.businessName}
                    </p>
                    {registeredRecord.tradingName && (
                      <p className="text-slate-600">Trading as: {registeredRecord.tradingName}</p>
                    )}
                    {registeredRecord.nzbn && (
                      <p className="text-slate-600 text-[11px]">
                        NZBN: {registeredRecord.nzbn}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500">{registeredRecord.businessType}</p>
                  </div>

                  {/* Contact Person Card */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                      <User className="w-3.5 h-3.5" />
                      <span>Primary Contact</span>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">
                      {registeredRecord.contactName}
                    </p>
                    <p className="text-slate-600">{registeredRecord.contactRole}</p>
                    <p className="text-slate-800 text-[11px]">{registeredRecord.email}</p>
                    <p className="text-slate-800 text-[11px]">{registeredRecord.phone}</p>
                  </div>
                </div>

                {/* Delivery Address Card */}
                {registeredRecord.deliveryAddress && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#FE0000]" />
                        <span>Nominated Workshop Bay Delivery Address</span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        Default Bay
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {registeredRecord.deliveryAddress.label} —{" "}
                        <span className="font-normal text-slate-600">
                          Attn: {registeredRecord.deliveryAddress.recipientName}
                        </span>
                      </p>
                      <p className="text-slate-700">
                        {registeredRecord.deliveryAddress.streetAddress},{" "}
                        {registeredRecord.deliveryAddress.suburb},{" "}
                        {registeredRecord.deliveryAddress.city} {registeredRecord.deliveryAddress.postalCode}
                      </p>
                      {registeredRecord.deliveryAddress.deliveryInstructions && (
                        <p className="text-[11px] text-slate-500 italic mt-1">
                          Access Notes: {registeredRecord.deliveryAddress.deliveryInstructions}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Terms of Trade Acceptance Card */}
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-950 block">
                        Particular Terms of Trade Acknowledged
                      </span>
                      <span className="text-[11px] text-emerald-800">
                        Digitally signed &amp; timestamped on {registeredRecord.termsAcceptedAt}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenLegal("terms")}
                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
                  >
                    View Terms
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="flex-1 h-12 rounded-xl bg-[#FE0000] hover:bg-[#9B0A0F] text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>Return to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/customer/dashboard")}
                  className="flex-1 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold border border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Demo Portal</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ═════════════════════════════════════════════════════════════════ */
          /* MULTI-STEP WIZARD REGISTRATION FORM                             */
          /* ═════════════════════════════════════════════════════════════════ */
          <>
            {/* ═════════════════════════════════════════════════════════════ */}
            {/* STEP PROGRESS INDICATOR                                      */}
            {/* ═════════════════════════════════════════════════════════════ */}
            <div className="relative">
              {/* Desktop Step Indicator */}
              <div className="hidden sm:flex items-center justify-between relative">
                {/* Progress connector bar (background) */}
                <div className="absolute top-5 left-[calc(12.5%+16px)] right-[calc(12.5%+16px)] h-[3px] bg-slate-200 rounded-full z-0" />
                {/* Active progress bar */}
                <div
                  className="absolute top-5 left-[calc(12.5%+16px)] h-[3px] bg-gradient-to-r from-[#FE0000] to-[#FF4444] rounded-full z-[1] transition-all duration-500 ease-out"
                  style={{
                    width: `${((Math.min(currentStep, 4) - 1) / 3) * (100 - 25)}%`,
                  }}
                />

                {STEPS.map((step) => {
                  const status = getStepStatus(step.id);
                  const StepIcon = step.icon;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => {
                        if (step.id < currentStep) goToStep(step.id);
                        else if (step.id === currentStep + 1) handleNext();
                      }}
                      className={`relative z-10 flex flex-col items-center gap-1.5 group transition-all duration-200 ${step.id <= currentStep || visitedSteps.has(step.id) ? "cursor-pointer" : "cursor-default"
                        }`}
                    >
                      {/* Circle */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${status === "completed"
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-200"
                          : status === "active"
                            ? "bg-[#FE0000] border-[#FE0000] text-white shadow-md shadow-red-200 scale-110"
                            : status === "visited"
                              ? "bg-white border-slate-300 text-slate-500"
                              : "bg-slate-100 border-slate-200 text-slate-400"
                          }`}
                      >
                        {status === "completed" ? (
                          <Check className="w-4.5 h-4.5" />
                        ) : (
                          <StepIcon className="w-4 h-4" />
                        )}
                      </div>

                      {/* Label */}
                      <div className="text-center">
                        <span
                          className={`block text-[11px] font-bold transition-colors ${status === "active"
                            ? "text-[#FE0000]"
                            : status === "completed"
                              ? "text-emerald-700"
                              : "text-slate-400"
                            }`}
                        >
                          {step.label}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-medium">
                          {step.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Mobile Step Indicator (tactile interactive pills + progress bar) */}
              <div className="sm:hidden space-y-2.5">
                {/* Progress bar */}
                <div className="relative h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FE0000] to-[#FF4444] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                  />
                </div>

                {/* 4 Interactive Step Pills */}
                <div className="grid grid-cols-4 gap-1.5">
                  {STEPS.map((step) => {
                    const status = getStepStatus(step.id);
                    const StepIcon = step.icon;
                    const canJump = step.id <= currentStep || visitedSteps.has(step.id);
                    return (
                      <button
                        key={step.id}
                        type="button"
                        disabled={!canJump}
                        onClick={() => {
                          if (step.id < currentStep) goToStep(step.id);
                          else if (step.id === currentStep + 1) handleNext();
                        }}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${status === "active"
                          ? "bg-[#FE0000] text-white shadow-xs font-bold ring-1 ring-[#FE0000]"
                          : status === "completed"
                            ? "bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold cursor-pointer active:scale-95"
                            : status === "visited"
                              ? "bg-white border border-slate-200 text-slate-600 font-medium cursor-pointer"
                              : "bg-slate-100/80 border border-transparent text-slate-400 cursor-default"
                          }`}
                      >
                        <div className="flex items-center gap-1">
                          {status === "completed" ? (
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          ) : (
                            <StepIcon className="w-3 h-3 shrink-0" />
                          )}
                          <span className="text-[10px] tracking-tight truncate">
                            {step.shortLabel}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* General Alert Message */}
              {generalError && (
                <div className="p-3.5 sm:p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold">Registration requirement missing</p>
                    <p className="text-[11px] text-rose-800 mt-0.5 leading-relaxed">{generalError}</p>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────────── */}
              {/* STEP 1: BUSINESS & COMPANY DETAILS                      */}
              {/* ──────────────────────────────────────────────────────── */}
              {currentStep === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-[#FE0000] flex items-center justify-center font-bold shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900">
                          Business
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-4 sm:space-y-5">
                      {/* Business Legal Name */}
                      <div>
                        <label
                          htmlFor="reg-business-name"
                          className="block text-xs font-bold text-slate-700 mb-1"
                        >
                          Company / Business Legal Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="reg-business-name"
                            type="text"
                            value={businessName}
                            onChange={(e) => {
                              setBusinessName(e.target.value);
                              setGeneralError(null);
                            }}
                            placeholder="e.g. SP Motors Ltd"
                            required
                            className={`w-full h-12 px-3.5 rounded-xl border text-base sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 ${duplicateCompany
                              ? "border-rose-400 bg-rose-50/40 focus:ring-rose-200 text-rose-900"
                              : "border-slate-300 bg-white focus:border-[#FE0000] focus:ring-[#FE0000]/15 text-slate-900"
                              }`}
                          />
                          {businessName && !duplicateCompany && (
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-600">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>

                        {/* Duplicate Company Warning */}
                        {duplicateCompany && (
                          <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-[11px] text-amber-900 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold">Company Already Registered</p>
                              <p className="text-amber-800">
                                A trade account for <strong>{businessName}</strong> is already registered
                                in Procurly (Contact: {duplicateCompany.existingContact}). To add
                                additional workshop staff or request access, please contact your account
                                administrator or{" "}
                                <a
                                  href="mailto:support@procurly.io"
                                  className="underline font-semibold"
                                >
                                  support@procurly.io
                                </a>
                                .
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Trading Name & NZBN Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Trading Name */}
                        <div>
                          <label
                            htmlFor="reg-trading-name"
                            className="block text-xs font-bold text-slate-700 mb-1"
                          >
                            Trading Name / DBA <span className="text-slate-400 font-normal">(Optional)</span>
                          </label>
                          <input
                            id="reg-trading-name"
                            type="text"
                            value={tradingName}
                            onChange={(e) => setTradingName(e.target.value)}
                            placeholder="e.g. SP Performance & Dyno"
                            className="w-full h-12 px-3.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-medium focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/15"
                          />
                        </div>

                        {/* NZBN */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label
                              htmlFor="reg-nzbn"
                              className="block text-xs font-bold text-slate-700"
                            >
                              NZBN / Company Number
                            </label>
                            <span className="text-[10px] text-slate-400">13 digits</span>
                          </div>
                          <input
                            id="reg-nzbn"
                            type="text"
                            value={nzbn}
                            onChange={(e) => setNzbn(e.target.value)}
                            placeholder="e.g. 9429041234567"
                            className="w-full h-12 px-3.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-medium focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/15"
                          />
                        </div>
                      </div>

                      {/* Business Category & Website */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Category */}
                        <div>
                          <label
                            htmlFor="reg-category"
                            className="block text-xs font-bold text-slate-700 mb-1"
                          >
                            Company Type <span className="text-rose-500">*</span>
                          </label>
                          <select
                            id="reg-category"
                            value={businessType}
                            onChange={(e) => setBusinessType(e.target.value)}
                            className="w-full h-12 px-3.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-medium focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/15"
                          >
                            {BUSINESS_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Website */}
                        <div>
                          <label
                            htmlFor="reg-website"
                            className="block text-xs font-bold text-slate-700 mb-1"
                          >
                            Website <span className="text-slate-400 font-normal">(Optional)</span>
                          </label>
                          <input
                            id="reg-website"
                            type="url"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://spmotors.co.nz"
                            className="w-full h-12 px-3.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-medium focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/15"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────────── */}
              {/* STEP 2: PRIMARY CONTACT PERSON & CREDENTIALS             */}
              {/* ──────────────────────────────────────────────────────── */}
              {currentStep === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-[#FE0000] flex items-center justify-center font-bold shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900">
                          Primary Contact &amp; Security Credentials
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-4 sm:space-y-5">
                      {/* Contact Name & Role */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label
                            htmlFor="reg-contact-name"
                            className="block text-xs font-bold text-slate-700 mb-1"
                          >
                            Contact Full Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id="reg-contact-name"
                            type="text"
                            value={contactName}
                            onChange={(e) => {
                              setContactName(e.target.value);
                              if (!deliveryRecipient) setDeliveryRecipient(e.target.value);
                            }}
                            placeholder="e.g. James Wilson"
                            required
                            className="w-full h-12 px-3.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-medium focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/15"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="reg-contact-role"
                            className="block text-xs font-bold text-slate-700 mb-1"
                          >
                            Job Title / Position <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id="reg-contact-role"
                            type="text"
                            value={contactRole}
                            onChange={(e) => setContactRole(e.target.value)}
                            placeholder="e.g. Workshop Director / Lead Tech"
                            required
                            className="w-full h-12 px-3.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-medium focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/15"
                          />
                        </div>
                      </div>

                      {/* Email & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Email */}
                        <div>
                          <label
                            htmlFor="reg-email"
                            className="block text-xs font-bold text-slate-700 mb-1"
                          >
                            Business Email Address <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              id="reg-email"
                              type="email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                setGeneralError(null);
                              }}
                              placeholder="james@spmotors.co.nz"
                              required
                              className={`w-full h-12 px-3.5 rounded-xl border text-base sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 ${duplicateEmail
                                ? "border-rose-400 bg-rose-50/40 focus:ring-rose-200 text-rose-900"
                                : "border-slate-300 bg-white focus:border-[#FE0000] focus:ring-[#FE0000]/15 text-slate-900"
                                }`}
                            />
                            {email && !duplicateEmail && email.includes("@") && (
                              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-600">
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          {/* Duplicate Email Warning */}
                          {duplicateEmail && (
                            <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-[11px] text-amber-900 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-bold">Email Already Registered</p>
                                <p className="text-amber-800">
                                  A trade account using <strong>{email}</strong> already exists in the
                                  system ({duplicateEmail.matchedBusiness}).
                                </p>
                                <Link
                                  href="/login"
                                  className="inline-flex items-center gap-1 font-bold text-[#FE0000] hover:underline mt-1"
                                >
                                  <span>Sign In to existing account</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Phone */}
                        <div>
                          <label
                            htmlFor="reg-phone"
                            className="block text-xs font-bold text-slate-700 mb-1"
                          >
                            Direct Phone / Mobile <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id="reg-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              if (!deliveryPhone) setDeliveryPhone(e.target.value);
                            }}
                            placeholder="+64 21 555 0192"
                            required
                            className="w-full h-12 px-3.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-medium focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/15"
                          />
                        </div>
                      </div>

                      {/* Password & Confirm Password */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Password */}
                        <div>
                          <label
                            htmlFor="reg-password"
                            className="block text-xs font-bold text-slate-700 mb-1"
                          >
                            Account Password <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              id="reg-password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Min. 6 characters"
                              required
                              className="w-full h-12 pl-3.5 pr-11 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-medium focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/15"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600"
                              title={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label
                            htmlFor="reg-confirm-password"
                            className="block text-xs font-bold text-slate-700 mb-1"
                          >
                            Confirm Password <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              id="reg-confirm-password"
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Re-enter password"
                              required
                              className={`w-full h-12 pl-3.5 pr-11 rounded-xl border text-base sm:text-sm font-medium focus:outline-none focus:ring-2 ${confirmPassword && password !== confirmPassword
                                ? "border-rose-400 bg-rose-50/30 focus:ring-rose-200"
                                : confirmPassword && password === confirmPassword
                                  ? "border-emerald-500 bg-emerald-50/20 focus:ring-emerald-200"
                                  : "border-slate-300 bg-white focus:border-[#FE0000] focus:ring-[#FE0000]/15"
                                }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600"
                              title={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          {confirmPassword && password !== confirmPassword && (
                            <p className="text-[11px] text-rose-600 mt-1">Passwords do not match.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────────── */}
              {/* STEP 3: WORKSHOP DELIVERY BAY ADDRESS                    */}
              {/* ──────────────────────────────────────────────────────── */}
              {currentStep === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-[#FE0000] flex items-center justify-center font-bold shrink-0">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-slate-900">
                            Workshop Delivery Bay Address
                          </h2>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyContactToDelivery}
                        className="text-xs font-semibold text-slate-600 hover:text-[#FE0000] bg-slate-100 hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all self-start sm:self-auto cursor-pointer active:scale-95"
                      >
                        Use Contact Details
                      </button>
                    </div>

                    <div className="space-y-4 sm:space-y-5">
                      {/* Bay Label & Delivery Recipient */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label
                            htmlFor="reg-bay-label"
                            className="block text-xs font-bold text-slate-700 mb-1"
                          >
                            Bay / Facility Label <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id="reg-bay-label"
                            type="text"
                            value={deliveryBayLabel}
                            onChange={(e) => setDeliveryBayLabel(e.target.value)}
                            placeholder="e.g. Main Workshop Bay 1"
                            required
                            className="w-full h-12 px-3.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-medium focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/15"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="reg-recipient"
                            className="block text-xs font-bold text-slate-700 mb-1"
                          >
                            Goods Receiver Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id="reg-recipient"
                            type="text"
                            value={deliveryRecipient}
                            onChange={(e) => setDeliveryRecipient(e.target.value)}
                            placeholder="e.g. James Wilson or Workshop Foreman"
                            required
                            className="w-full h-12 px-3.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-medium focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/15"
                          />
                        </div>
                      </div>

                      {/* Street Address */}
                      <div>
                        <label
                          htmlFor="reg-street"
                          className="block text-xs font-bold text-slate-700 mb-1"
                        >
                          Street Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="reg-street"
                          type="text"
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          placeholder="e.g. 14 Neilson Street"
                          required
                          className="w-full h-12 px-3.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-medium focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/15"
                        />
                      </div>

                      {/* Suburb, City, Postcode */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label
                            htmlFor="reg-suburb"
                            className="block text-xs font-bold text-slate-700 mb-1"
                          >
                            Suburb / District <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id="reg-suburb"
                            type="text"
                            value={suburb}
                            onChange={(e) => setSuburb(e.target.value)}
                            placeholder="e.g. Onehunga"
                            required
                            className="w-full h-12 px-3.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-medium focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/15"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="reg-city"
                            className="block text-xs font-bold text-slate-700 mb-1"
                          >
                            City / Region <span className="text-rose-500">*</span>
                          </label>
                          <select
                            id="reg-city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            className="w-full h-12 px-3.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-medium focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/15"
                          >
                            {NZ_REGIONS.map((region) => (
                              <option key={region} value={region}>
                                {region}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="reg-postcode"
                            className="block text-xs font-bold text-slate-700 mb-1"
                          >
                            Postcode <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id="reg-postcode"
                            type="text"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            placeholder="e.g. 1061"
                            required
                            className="w-full h-12 px-3.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-medium focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/15"
                          />
                        </div>
                      </div>

                      {/* Delivery Contact Phone & Access Notes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label
                            htmlFor="reg-delivery-phone"
                            className="block text-xs font-bold text-slate-700 mb-1"
                          >
                            Delivery Contact Phone <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id="reg-delivery-phone"
                            type="tel"
                            value={deliveryPhone}
                            onChange={(e) => setDeliveryPhone(e.target.value)}
                            placeholder="e.g. +64 9 525 1122"
                            required
                            className="w-full h-12 px-3.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-medium focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/15"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="reg-instructions"
                            className="block text-xs font-bold text-slate-700 mb-1"
                          >
                            Bay Delivery Instructions <span className="text-slate-400 font-normal">(Optional)</span>
                          </label>
                          <input
                            id="reg-instructions"
                            type="text"
                            value={deliveryInstructions}
                            onChange={(e) => setDeliveryInstructions(e.target.value)}
                            placeholder="Forklift on site, entry via Gate 2"
                            className="w-full h-12 px-3.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-medium focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/15"
                          />
                        </div>
                      </div>

                      {/* Default delivery bay checkbox */}
                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isDefaultDelivery}
                          onChange={(e) => setIsDefaultDelivery(e.target.checked)}
                          className="w-4 h-4 rounded text-[#FE0000] accent-[#FE0000] focus:ring-0 cursor-pointer shrink-0"
                        />
                        <span className="leading-snug">Designate this workshop bay as your primary delivery address</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────────── */}
              {/* STEP 4: REVIEW & TERMS ACKNOWLEDGEMENT                   */}
              {/* ──────────────────────────────────────────────────────── */}
              {currentStep === 4 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                  {/* ─── Review Summary Cards ─────────────────────────── */}
                  <div className="p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-[#FE0000] flex items-center justify-center font-bold shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900">
                          Review Your Application
                        </h2>
                      </div>
                    </div>

                    {/* Business Summary */}
                    <div className="p-3.5 sm:p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>Business Details</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => goToStep(1)}
                          className="px-2.5 py-1 text-xs font-bold text-[#FE0000] bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="font-bold text-slate-900 text-sm">{businessName}</p>
                      {tradingName && (
                        <p className="text-xs text-slate-600">Trading as: {tradingName}</p>
                      )}
                      {nzbn && (
                        <p className="text-xs text-slate-600">NZBN: {nzbn}</p>
                      )}
                      <p className="text-[11px] text-slate-500">{businessType}</p>
                      {website && <p className="text-[11px] text-slate-500">{website}</p>}
                    </div>

                    {/* Contact Summary */}
                    <div className="p-3.5 sm:p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                          <User className="w-3.5 h-3.5" />
                          <span>Primary Contact</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => goToStep(2)}
                          className="px-2.5 py-1 text-xs font-bold text-[#FE0000] bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="font-bold text-slate-900 text-sm">{contactName}</p>
                      <p className="text-xs text-slate-600">{contactRole}</p>
                      <p className="text-xs text-slate-800 break-all">{email}</p>
                      <p className="text-xs text-slate-800">{phone}</p>
                    </div>

                    {/* Delivery Summary */}
                    <div className="p-3.5 sm:p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                          <Truck className="w-3.5 h-3.5 text-[#FE0000]" />
                          <span>Delivery Address</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => goToStep(3)}
                          className="px-2.5 py-1 text-xs font-bold text-[#FE0000] bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="font-bold text-slate-900 text-sm">
                        {deliveryBayLabel} — <span className="font-normal text-slate-600">Attn: {deliveryRecipient || contactName}</span>
                      </p>
                      <p className="text-xs text-slate-700">
                        {streetAddress}, {suburb}, {city} {postalCode}
                      </p>
                      {deliveryInstructions && (
                        <p className="text-[11px] text-slate-500 italic">
                          Notes: {deliveryInstructions}
                        </p>
                      )}
                      {isDefaultDelivery && (
                        <span className="inline-block text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold mt-1">
                          Default Bay
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ─── Terms of Trade Section ───────────────────────── */}
                  <div
                    className={`p-4 sm:p-6 rounded-2xl border transition-all ${termsAttemptedError && !termsAccepted
                      ? "bg-rose-50/70 border-rose-300 ring-2 ring-rose-400/20"
                      : termsAccepted
                        ? "bg-emerald-50/40 border-emerald-300"
                        : "bg-white border-slate-200/90 shadow-sm"
                      }`}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-[#FE0000] flex items-center justify-center font-bold shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-slate-900">
                            Legal Acknowledgement &amp; Terms of Trade
                          </h2>
                          <p className="text-[11px] text-slate-500">
                            Official commercial trading terms governing parts supply and cross-border logistics.
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Explicit Acknowledgement Checkbox */}
                    <div
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all ${termsAccepted
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-slate-50 border-slate-200"
                        }`}
                    >
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => {
                            if (!termsAccepted) {
                              // Force modal scroll review
                              e.preventDefault();
                              handleOpenLegal("terms");
                            } else {
                              setTermsAccepted(false);
                            }
                          }}
                          onClick={(e) => {
                            if (!termsAccepted) {
                              e.preventDefault();
                              handleOpenLegal("terms");
                            }
                          }}
                          className="mt-0.5 w-4 h-4 rounded text-[#FE0000] accent-[#FE0000] focus:ring-0 cursor-pointer shrink-0"
                          required
                        />
                        <div className="text-xs text-slate-700 leading-snug">
                          <span className="font-semibold text-slate-900">
                            I have read, understood, and explicitly agree to the{" "}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleOpenLegal("terms");
                              }}
                              className="font-bold text-[#FE0000] hover:text-[#9B0A0F] underline underline-offset-2 cursor-pointer"
                            >
                              Particular Terms of Trade
                            </button>{" "}
                            and{" "}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleOpenLegal("privacy");
                              }}
                              className="font-bold text-[#FE0000] hover:text-[#9B0A0F] underline underline-offset-2 cursor-pointer"
                            >
                              Privacy Policy
                            </button>
                            .
                          </span>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Registration binds your commercial entity to Procurly procurement protocols, 48-hour quote validity, and international freight guidelines.
                          </p>
                        </div>
                      </label>

                      {/* Audit Confirmation Timestamp */}
                      {termsAccepted && (
                        <div className="mt-3 pt-2.5 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-800">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Explicitly acknowledged on {termsAcknowledgedAt}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenLegal("terms")}
                            className="text-[10px] underline font-bold hover:text-emerald-950 cursor-pointer"
                          >
                            Re-read terms
                          </button>
                        </div>
                      )}

                      {/* Error Banner when attempted without terms */}
                      {termsAttemptedError && !termsAccepted && (
                        <div className="mt-3 pt-2.5 border-t border-rose-200 text-[11px] text-rose-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 font-bold">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>You must scroll through and accept the Terms of Trade to proceed.</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenLegal("terms")}
                            className="px-3 py-1.5 bg-[#FE0000] text-white font-bold rounded-lg hover:bg-[#9B0A0F] transition-all text-xs shrink-0 cursor-pointer self-start sm:self-auto"
                          >
                            Review Terms Now →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────────── */}
              {/* WIZARD NAVIGATION BUTTONS                                */}
              {/* ──────────────────────────────────────────────────────── */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {/* Back Button */}
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="h-12 px-4 sm:px-5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold border border-slate-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99] shrink-0 shadow-2xs"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                  )}

                  {/* Next / Submit Button */}
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 h-12 rounded-xl bg-[#FE0000] hover:bg-[#9B0A0F] active:bg-[#85080C] text-white text-xs sm:text-sm font-bold transition-all shadow-sm shadow-red-600/20 hover:shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                    >
                      <span className="hidden sm:inline">Continue to {STEPS[currentStep]?.label || "Next"}</span>
                      <span className="sm:hidden">Next: {STEPS[currentStep]?.label || "Continue"}</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || Boolean(duplicateEmail) || Boolean(duplicateCompany)}
                      className={`flex-1 h-12 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${isSubmitting || duplicateEmail || duplicateCompany
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-[#FE0000] hover:bg-[#9B0A0F] active:bg-[#85080C] text-white shadow-red-600/20 hover:shadow-md cursor-pointer active:scale-[0.99]"
                        }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <span className="hidden sm:inline">Submit Trade Registration</span>
                          <span className="sm:hidden">Submit Registration</span>
                          <ArrowRight className="w-4 h-4 shrink-0" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="text-center pt-2 border-t border-slate-200/80">
                  <p className="text-xs text-slate-600">
                    Already have a registered account?{" "}
                    <Link
                      href="/login"
                      className="font-bold text-[#FE0000] hover:underline underline-offset-2"
                    >
                      Sign In here →
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Terms of Trade & Privacy Policy Legal Modal with Scroll Enforcement */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialDoc={legalDocType}
        onAccept={handleLegalAcceptance}
        showAcceptButton={true}
      />
    </AuthLayout>
  );
}
