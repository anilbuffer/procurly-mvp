"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { MfaQrCode } from "@/components/auth/mfa-qr-code";
import { MfaCodeInput } from "@/components/auth/mfa-code-input";
import { MfaHelpAccordion } from "@/components/auth/mfa-help-accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  KeyRound,
  ShieldCheck,
  Check,
  ShieldAlert,
  Sparkles,
  User,
  ExternalLink,
  Shield,
  Building2,
  Phone,
  Clock,
  FileText,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { LegalModal, LegalDocType } from "@/components/auth/legal-modal";

export type AuthMode = "login" | "register" | "mfa" | "forgot_password" | "change_password";

/**
 * Route resolution based on account role:
 * - Autohub Admin Staff (Sarah, Marcus, Rachel, David / @procurly.io) -> /admin/dashboard
 * - Customer Trade Portal (James Wilson, Dave Miller / @spmotors.co.nz) -> /customer/dashboard
 */
export function getPortalRoute(targetEmail: string): string {
  const normalized = (targetEmail || "").toLowerCase().trim();
  if (normalized.includes("subadmin")) {
    return "/subadmin/dashboard";
  }
  if (
    normalized.includes("procurly.io") ||
    normalized.includes("sarah") ||
    normalized.includes("marcus") ||
    normalized.includes("rachel") ||
    normalized.includes("david") ||
    normalized.includes("admin") ||
    normalized.includes("procurement") ||
    normalized.includes("operations") ||
    normalized.includes("finance")
  ) {
    return "/admin/dashboard";
  }
  return "/customer/dashboard";
}

export function getPortalName(targetEmail: string): string {
  const route = getPortalRoute(targetEmail);
  if (route.includes("subadmin")) return "Subadmin Portal";
  if (route.includes("admin")) return "Unified Admin Portal";
  return "Customer Portal";
}

export function getShortPortalName(targetEmail: string): string {
  const route = getPortalRoute(targetEmail);
  if (route.includes("subadmin")) return "Subadmin";
  if (route.includes("admin")) return "Admin";
  return "Customer";
}

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login: authLogin } = useAuth();

  // Mode state: login | register | mfa | forgot_password | change_password
  const initialModeParam = searchParams?.get("mode") as AuthMode;
  const [authMode, setAuthMode] = useState<AuthMode>(
    initialModeParam && ["login", "register", "mfa", "forgot_password", "change_password"].includes(initialModeParam)
      ? initialModeParam
      : "login"
  );

  // Email + Password state
  const [email, setEmail] = useState("james.wilson@spmotors.co.nz");
  const [password, setPassword] = useState("Procurly2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberWorkstation, setRememberWorkstation] = useState(true);
  const [requireMfa, setRequireMfa] = useState(true); // "SECURE ACCOUNT ACCESS optional"

  // Login submission state
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Simplified Customer Registration state (Reduced strictly to 5 fields + static terms + manual approval)
  const [regBusinessName, setRegBusinessName] = useState("SP Motors Ltd");
  const [regContactName, setRegContactName] = useState("James Wilson");
  const [regEmail, setRegEmail] = useState("james.wilson@spmotors.co.nz");
  const [regPhone, setRegPhone] = useState("+64 21 555 0192");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regAcceptTerms, setRegAcceptTerms] = useState(false); // Explicit customer acceptance checkbox
  const [termsAttemptedError, setTermsAttemptedError] = useState(false);
  const [termsAcknowledgedAt, setTermsAcknowledgedAt] = useState<string | null>(null);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalDocType, setLegalDocType] = useState<LegalDocType>("terms");
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSubmitted, setRegSubmitted] = useState(false);

  // MFA state
  const [mfaCode, setMfaCode] = useState("");
  const [qrSeconds, setQrSeconds] = useState(300);
  const [mfaAttemptsCount, setMfaAttemptsCount] = useState(0);
  const [mfaStatus, setMfaStatus] = useState<
    "initial" | "loading" | "invalid" | "expired" | "success" | "qr_expired"
  >("initial");

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSentSuccess, setResetSentSuccess] = useState(false);
  const [generatedRecoveryPin, setGeneratedRecoveryPin] = useState("742918");

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

  // Redirect to dedicated /register page if mode is register
  useEffect(() => {
    if (initialModeParam === "register") {
      router.push("/register");
    }
  }, [initialModeParam, router]);

  // Countdown timer for MFA QR
  useEffect(() => {
    if (authMode !== "mfa" || mfaStatus === "qr_expired") return;
    const interval = setInterval(() => {
      setQrSeconds((prev) => {
        if (prev <= 1) {
          setMfaStatus("qr_expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [authMode, mfaStatus]);

  // Reset QR code
  const handleRegenerateQr = () => {
    setQrSeconds(300);
    setMfaStatus("initial");
  };

  // 1. Submit Email + Password Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!email || !password) {
      setLoginError("Please enter both your business email and password.");
      return;
    }

    setIsLoggingIn(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoggingIn(false);

    const targetRoute = getPortalRoute(email);
    authLogin(email);

    // If user has optional MFA enabled, transition to MFA step
    if (requireMfa) {
      setAuthMode("mfa");
    } else {
      // Direct access bypass without MFA
      setLoginSuccess(true);
      setTimeout(() => {
        router.push(targetRoute);
      }, 1000);
    }
  };

  // 1.5 Submit Simplified Customer Registration (5 fields + static terms + manual approval)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regBusinessName.trim()) {
      setRegError("Please enter your Business Name.");
      return;
    }
    if (!regContactName.trim()) {
      setRegError("Please enter the Contact Name.");
      return;
    }
    if (!regEmail.trim()) {
      setRegError("Please enter your Business Email.");
      return;
    }
    if (!regPhone.trim()) {
      setRegError("Please enter your Phone Number.");
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setRegError("Please enter a password with at least 6 characters.");
      return;
    }
    if (!regAcceptTerms) {
      setTermsAttemptedError(true);
      setRegError("You must explicitly acknowledge and agree to the Terms of Trade and Privacy Policy before registration submission.");
      return;
    }

    setIsRegistering(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsRegistering(false);
    setRegSubmitted(true);
  };

  // 2. Submit MFA Code
  const handleVerifyMfa = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (mfaCode.length < 6) return;

    setMfaStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Demo check
    if (mfaCode === "000000") {
      setMfaStatus("expired");
      return;
    }

    const targetRoute = getPortalRoute(email);
    authLogin(email);

    if (mfaCode === "123456" || mfaAttemptsCount < 2) {
      setMfaStatus("success");
      setTimeout(() => {
        router.push(targetRoute);
      }, 1200);
    } else {
      const newAttempts = mfaAttemptsCount + 1;
      setMfaAttemptsCount(newAttempts);
      setMfaStatus("invalid");
    }
  };

  // Auto verify MFA when 6 digits are typed
  const handleMfaCodeChange = (newCode: string) => {
    setMfaCode(newCode);
    if (mfaStatus === "invalid" || mfaStatus === "expired") {
      setMfaStatus("initial");
    }
    if (newCode.length === 6) {
      setTimeout(() => {
        handleVerifyMfa();
      }, 150);
    }
  };

  // 3. Submit Forgot Password Request
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = forgotEmail || email;
    if (!targetEmail) return;

    setIsSendingReset(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsSendingReset(false);
    setResetSentSuccess(true);
    setGeneratedRecoveryPin(String(Math.floor(100000 + Math.random() * 900000)));
  };

  // 4. Submit Password Change
  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError(null);

    if (newPassword.length < 8) {
      setPasswordChangeError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordChangeError("New passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsUpdatingPassword(false);
    setPasswordChangeSuccess(true);

    const targetRoute = getPortalRoute(email);
    setTimeout(() => {
      router.push(targetRoute);
    }, 1800);
  };

  // Quick fill helper for demo accounts
  const handleSelectDemoUser = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoginError(null);
  };

  // Direct 1-click launch helper for demo accounts
  const handleLaunchDemoUser = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoginError(null);
    authLogin(demoEmail);
    const targetRoute = getPortalRoute(demoEmail);
    router.push(targetRoute);
  };

  // Password requirements checker
  const isLengthValid = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  return (
    <AuthLayout>
      <div className="w-full flex flex-col justify-center text-left">

        {/* ------------------------------------------------------------- */}
        {/* MODE 1: EMAIL + PASSWORD SIGN IN                              */}
        {/* ------------------------------------------------------------- */}
        {authMode === "login" && (
          <div className="space-y-5 animate-in fade-in duration-200">


            {/* Heading */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#0F172A] tracking-tight leading-[1.2] mb-1.5">
                Sign in to your account
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Enter your trade credentials to access Autohub parts procurement.
              </p>
            </div>

            {/* Error or Success Alert */}
            {loginError && (
              <Alert
                variant="error"
                title="Sign in failed"
                description={loginError}
                onDismiss={() => setLoginError(null)}
              />
            )}

            {loginSuccess && (
              <Alert
                variant="success"
                icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                title="Credentials verified"
                description={`Secure direct session initialized. Redirecting to ${getPortalName(email)} workspace...`}
              />
            )}

            {/* Email + Password Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Business Email */}
              <Input
                label="Business Email Address"
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                leftIcon={<Mail className="w-4 h-4" />}
              />

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 select-none"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("forgot_password");
                      setForgotEmail(email);
                    }}
                    className="text-xs font-bold text-[#FE0000] hover:underline py-1 px-1 -mr-1"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full h-12 bg-white text-slate-900 text-base sm:text-sm font-medium placeholder:text-slate-400 border border-slate-300 rounded-lg transition-all pl-11 pr-12 focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Workstation Checkbox */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 font-medium py-1">
                  <input
                    type="checkbox"
                    checked={rememberWorkstation}
                    onChange={(e) => setRememberWorkstation(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FE0000] accent-[#FE0000] focus:ring-0 cursor-pointer"
                  />
                  <span>Remember this workstation for 30 days</span>
                </label>
              </div>

              {/* Primary Sign In Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-xs sm:text-sm font-bold bg-[#FE0000] hover:bg-[#9B0A0F] active:bg-[#85080C] text-white rounded-lg transition-all shadow-xs"
                isLoading={isLoggingIn}
                loadingText="Authenticating..."
              >
                <span className="hidden sm:inline">
                  {requireMfa
                    ? `Continue to ${getPortalName(email)} (MFA) →`
                    : `Sign In to ${getPortalName(email)} →`}
                </span>
                <span className="sm:hidden">
                  {requireMfa
                    ? `Continue (${getShortPortalName(email)} MFA) →`
                    : `Sign In to ${getShortPortalName(email)} →`}
                </span>
              </Button>
            </form>

            {/* Quick Demo Pre-fills & Direct Launch */}
            <div className="pt-2 border-t border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Quick Demo Sign-In:
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Tap to prefill credentials
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {/* 1. Customer Portal: James Wilson */}
                <div
                  onClick={() =>
                    handleSelectDemoUser(
                      "james.wilson@spmotors.co.nz",
                      "Procurly2026!"
                    )
                  }
                  className={`group relative p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 sm:block ${email === "james.wilson@spmotors.co.nz"
                    ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/30 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 sm:block">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0 sm:inline-block sm:mb-1.5">
                      Customer
                    </span>
                    <div className="min-w-0 text-left">
                      <p className="font-bold text-slate-900 truncate">
                        James Wilson
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        james.wilson@spmotors.co.nz
                      </p>
                    </div>
                  </div>
                  <div className="sm:hidden shrink-0 flex items-center">
                    {email === "james.wilson@spmotors.co.nz" ? (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 px-2 py-0.5 rounded bg-slate-100">
                        Select
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Unified Admin Portal: Sarah Jenkins */}
                <div
                  onClick={() =>
                    handleSelectDemoUser(
                      "sarah.jenkins@procurly.io",
                      "AdminSecure2026!"
                    )
                  }
                  className={`group relative p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 sm:block ${email === "sarah.jenkins@procurly.io"
                    ? "border-[#FE0000] bg-red-50/50 ring-1 ring-[#FE0000]/30 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 sm:block">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-100 text-[#FE0000] shrink-0 sm:inline-block sm:mb-1.5">
                      Admin
                    </span>
                    <div className="min-w-0 text-left">
                      <p className="font-bold text-slate-900 truncate">
                        Sarah Jenkins
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        sarah.jenkins@procurly.io
                      </p>
                    </div>
                  </div>
                  <div className="sm:hidden shrink-0 flex items-center">
                    {email === "sarah.jenkins@procurly.io" ? (
                      <span className="w-5 h-5 rounded-full bg-[#FE0000] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#FE0000] px-2 py-0.5 rounded bg-slate-100">
                        Select
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. Subadmin Portal: Subadmin Tester */}
                <div
                  onClick={() =>
                    handleSelectDemoUser(
                      "Subadmin@procurly.io",
                      "SubadminTesting2026!"
                    )
                  }
                  className={`group relative p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 sm:block ${email === "Subadmin@procurly.io"
                    ? "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500/30 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 sm:block">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0 sm:inline-block sm:mb-1.5">
                      Subadmin
                    </span>
                    <div className="min-w-0 text-left">
                      <p className="font-bold text-slate-900 truncate">
                        Subadmin Tester
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        Subadmin@procurly.io
                      </p>
                    </div>
                  </div>
                  <div className="sm:hidden shrink-0 flex items-center">
                    {email === "Subadmin@procurly.io" ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-700 px-2 py-0.5 rounded bg-slate-100">
                        Select
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* New Trade Customer - Register Account Action Button */}
            <div className="pt-3 text-center border-t border-slate-200/80 space-y-2">
              <p className="text-xs text-slate-600 font-medium">
                New trade customer?
              </p>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  router.push("/register");
                }}
                className="w-full h-12 border-slate-300 hover:border-[#FE0000] text-slate-800 hover:text-[#FE0000] bg-white hover:bg-red-50/40 transition-all font-bold text-xs sm:text-sm shadow-xs rounded-xl group flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                rightIcon={<ArrowRight className="w-4 h-4 text-[#FE0000] group-hover:translate-x-0.5 transition-transform shrink-0" />}
              >
                <span>Register your business account</span>
              </Button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE 1.5: SIMPLIFIED CUSTOMER REGISTRATION                     */}
        {/* Scope: 5 fields + static terms + manual customer approval      */}
        {/* ------------------------------------------------------------- */}
        {authMode === "register" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Eyebrow */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#FE0000] antialiased">
                TRADE CUSTOMER REGISTRATION
              </span>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#0F172A] tracking-tight leading-[1.2] mb-1.5">
                Register your business
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Create a trade account to access Autohub parts sourcing and wholesale procurement lines.
              </p>
            </div>

            {regSubmitted ? (
              /* Manual Customer Approval Confirmation Screen - Neutral Grey Palette */
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 border border-slate-300/80 space-y-3.5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 border border-slate-300 flex items-center justify-center font-bold shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-full border border-slate-300">
                        Pending Manual Approval
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        Registration Submitted
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Thank you! Your trade registration for <strong>{regBusinessName}</strong> has been received. Customer trade approvals are reviewed manually by the Procurly Autohub operations team for MVP.
                  </p>

                  {/* Registered Details Summary Card */}
                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs shadow-2xs">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Business Name:</span>
                      <span className="font-bold text-slate-900">{regBusinessName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Contact Person:</span>
                      <span className="font-semibold text-slate-900">{regContactName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Email Address:</span>
                      <span className="text-slate-800 truncate max-w-[200px]">{regEmail}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Phone Contact:</span>
                      <span className="text-slate-800">{regPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Terms of Trade:</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Explicitly acknowledged {termsAcknowledgedAt ? `(${termsAcknowledgedAt})` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-200/50 rounded-xl border border-slate-300/80 text-[11px] text-slate-700 space-y-1">
                    <p className="font-bold text-slate-900">Next Steps:</p>
                    <p>
                      Our trade desk will manually review your workshop registration and contact <strong>{regContactName}</strong> within 1 business day once your trade customer account is activated.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <Button
                    type="button"
                    onClick={() => {
                      setEmail(regEmail);
                      setAuthMode("login");
                      setRegSubmitted(false);
                    }}
                    className="w-full h-12 text-xs sm:text-sm font-bold bg-[#FE0000] hover:bg-[#9B0A0F] text-white rounded-xl shadow-xs"
                  >
                    Return to Sign In →
                  </Button>

                  <button
                    type="button"
                    onClick={() => router.push("/customer/dashboard")}
                    className="w-full text-center text-xs text-slate-600 hover:text-slate-900 font-bold py-2"
                  >
                    Explore Customer Portal with Demo Account →
                  </button>
                </div>
              </div>
            ) : (
              /* Simplified Registration Form: Strictly 5 fields + static terms */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {regError && (
                  <Alert
                    variant="error"
                    title="Registration incomplete"
                    description={regError}
                    onDismiss={() => setRegError(null)}
                  />
                )}

                {/* 1. Business Name */}
                <Input
                  label="Business Name"
                  type="text"
                  id="reg-business-name"
                  value={regBusinessName}
                  onChange={(e) => setRegBusinessName(e.target.value)}
                  placeholder="e.g. SP Motors Ltd"
                  required
                  leftIcon={<Building2 className="w-4 h-4" />}
                />

                {/* 2. Contact Name */}
                <Input
                  label="Contact Name"
                  type="text"
                  id="reg-contact-name"
                  value={regContactName}
                  onChange={(e) => setRegContactName(e.target.value)}
                  placeholder="e.g. James Wilson"
                  required
                  leftIcon={<User className="w-4 h-4" />}
                />

                {/* 3. Email */}
                <Input
                  label="Business Email Address"
                  type="email"
                  id="reg-email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  leftIcon={<Mail className="w-4 h-4" />}
                />

                {/* 4. Phone */}
                <Input
                  label="Phone Number"
                  type="tel"
                  id="reg-phone"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="e.g. +64 21 555 0192"
                  required
                  leftIcon={<Phone className="w-4 h-4" />}
                />

                {/* 5. Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="reg-password"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 select-none"
                  >
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-password"
                      type={showRegPassword ? "text" : "password"}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      className="w-full h-12 bg-white text-slate-900 text-base sm:text-sm font-medium placeholder:text-slate-400 border border-slate-300 rounded-lg transition-all pl-11 pr-12 focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95"
                      title={showRegPassword ? "Hide password" : "Show password"}
                    >
                      {showRegPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Explicit Terms of Trade & Privacy Policy Acceptance with Interactive Display Links */}
                <div className={`p-3 sm:p-3.5 rounded-xl border transition-all ${termsAttemptedError && !regAcceptTerms
                  ? "bg-red-50/70 border-red-300 ring-2 ring-red-400/20"
                  : regAcceptTerms
                    ? "bg-slate-50 border-slate-200"
                    : "bg-slate-50/50 border-slate-200/80 hover:border-slate-300"
                  }`}>
                  <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={regAcceptTerms}
                      onChange={(e) => {
                        if (!regAcceptTerms) {
                          e.preventDefault();
                          setLegalDocType("terms");
                          setLegalModalOpen(true);
                        } else {
                          setRegAcceptTerms(false);
                        }
                      }}
                      onClick={(e) => {
                        if (!regAcceptTerms) {
                          e.preventDefault();
                          setLegalDocType("terms");
                          setLegalModalOpen(true);
                        }
                      }}
                      className="mt-0.5 w-4 h-4 rounded text-[#FE0000] focus:ring-0 cursor-pointer accent-[#FE0000] shrink-0"
                      required
                    />
                    <span className="leading-snug">
                      I have read and explicitly agree to the{" "}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLegalDocType("terms");
                          setLegalModalOpen(true);
                        }}
                        className="font-bold text-[#FE0000] hover:text-[#9B0A0F] underline underline-offset-2 cursor-pointer"
                      >
                        Terms of Trade
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLegalDocType("privacy");
                          setLegalModalOpen(true);
                        }}
                        className="font-bold text-[#FE0000] hover:text-[#9B0A0F] underline underline-offset-2 cursor-pointer"
                      >
                        Privacy Policy
                      </button>
                    </span>
                  </label>

                  {termsAttemptedError && !regAcceptTerms && (
                    <p className="text-[11px] font-semibold text-red-600 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Explicit acknowledgement of the Terms of Trade is required to proceed.
                    </p>
                  )}

                  {regAcceptTerms && (
                    <p className="text-[11px] font-medium text-emerald-700 mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      Explicitly acknowledged {termsAcknowledgedAt ? `(${termsAcknowledgedAt})` : ""}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-xs sm:text-sm font-bold bg-[#FE0000] hover:bg-[#9B0A0F] active:bg-[#85080C] text-white rounded-lg transition-all shadow-xs"
                  isLoading={isRegistering}
                  loadingText="Submitting..."
                >
                  <span className="hidden sm:inline">Submit Registration (Pending Manual Approval) →</span>
                  <span className="sm:hidden">Submit Registration →</span>
                </Button>

                <div className="pt-2 text-center border-t border-slate-200/80">
                  <p className="text-xs text-slate-600">
                    Already registered?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className="font-bold text-[#FE0000] hover:underline"
                    >
                      Sign In to your account →
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE 2: MFA-READY AUTHENTICATION ("Protect your account")      */}
        {/* ------------------------------------------------------------- */}
        {authMode === "mfa" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#0F172A] tracking-tight leading-[1.2]">
              Protect your account
            </h1>

            {/* User identification pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 max-w-full">
              <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="font-semibold truncate max-w-[170px] sm:max-w-[220px]">{email}</span>
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="text-slate-400 hover:text-[#FE0000] text-[11px] underline font-bold shrink-0 ml-1"
              >
                Change
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Scan this QR code with an authenticator app, then enter its six-digit code.
            </p>

            {/* Centered QR Code */}
            <div className="w-full flex flex-col items-center my-1">
              <MfaQrCode
                isExpired={mfaStatus === "qr_expired"}
                onRefresh={handleRegenerateQr}
                secondsRemaining={qrSeconds}
              />
            </div>

            {/* Cannot scan accordion */}
            <div className="w-full">
              <MfaHelpAccordion defaultOpen={false} />
            </div>

            {/* Alerts */}
            {mfaStatus === "invalid" && (
              <Alert
                variant="error"
                title="Invalid authentication code"
                description="Please enter current 6 digits from your authenticator app (demo: 123456)."
                onDismiss={() => setMfaStatus("initial")}
              />
            )}

            {mfaStatus === "expired" && (
              <Alert
                variant="warning"
                title="Code expired"
                description="Authenticator codes refresh every 30 seconds. Please try the current code."
                onDismiss={() => setMfaStatus("initial")}
              />
            )}

            {mfaStatus === "success" && (
              <Alert
                variant="success"
                icon={<CheckCircle2 className="w-4 h-4 text-[#059669]" />}
                title="Identity verified"
                description={`Authentication successful. Redirecting to ${getPortalName(email)} workspace...`}
              />
            )}

            {/* Form */}
            <form onSubmit={handleVerifyMfa} className="w-full space-y-3">
              <MfaCodeInput
                value={mfaCode}
                onChange={handleMfaCodeChange}
                disabled={mfaStatus === "loading" || mfaStatus === "success"}
                hasError={mfaStatus === "invalid" || mfaStatus === "expired"}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-xs sm:text-sm font-bold bg-[#FE0000] hover:bg-[#9B0A0F] text-white rounded-lg transition-all shadow-xs"
                isLoading={mfaStatus === "loading"}
                loadingText="Verifying..."
                disabled={mfaCode.length < 6 || mfaStatus === "success"}
              >
                {mfaStatus === "success" ? "Verified • Redirecting..." : "Verify and finish"}
              </Button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 py-1"
                >
                  ← Back to Email Sign In
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE 3: FORGOT PASSWORD / RESET PASSWORD                      */}
        {/* ------------------------------------------------------------- */}
        {authMode === "forgot_password" && (
          <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
            {/* Eyebrow */}
            <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.06em] text-[#FE0000] antialiased block">
              SECURE ACCOUNT ACCESS
            </span>

            {/* Heading */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#0F172A] tracking-tight leading-[1.2] mb-1.5">
                Reset your password
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Enter your registered business email to receive an instant 6-digit recovery code and reset instructions.
              </p>
            </div>

            {/* Reset Sent Confirmation */}
            {resetSentSuccess ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">
                      Recovery PIN Dispatched
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Verification code sent to <strong>{forgotEmail || email}</strong>
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-emerald-200/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Demo Recovery PIN:
                  </span>
                  <span className="text-lg sm:text-xl font-black text-emerald-800 tracking-wider font-mono">
                    {generatedRecoveryPin}
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  <Button
                    type="button"
                    onClick={() => {
                      setCurrentPassword(generatedRecoveryPin);
                      setAuthMode("change_password");
                    }}
                    className="w-full h-12 text-xs sm:text-sm font-bold bg-[#FE0000] hover:bg-[#9B0A0F] text-white rounded-xl"
                  >
                    Enter Code & Set New Password →
                  </Button>

                  <button
                    type="button"
                    onClick={() => setResetSentSuccess(false)}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-medium py-1.5"
                  >
                    Didn&apos;t receive code? Resend
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <Input
                  label="Registered Email Address"
                  type="email"
                  id="forgot-email"
                  value={forgotEmail || email}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  leftIcon={<Mail className="w-4 h-4" />}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-xs sm:text-sm font-bold bg-[#FE0000] hover:bg-[#9B0A0F] text-white rounded-xl transition-all shadow-xs"
                  isLoading={isSendingReset}
                  loadingText="Sending Recovery Code..."
                >
                  <span>Send Recovery Instructions →</span>
                </Button>
              </form>
            )}

            <div className="pt-2 text-center border-t border-slate-200">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="text-xs font-bold text-slate-600 hover:text-[#FE0000] inline-flex items-center gap-1 py-1"
              >
                <span>← Back to Sign In</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE 4: PASSWORD CHANGE                                       */}
        {/* ------------------------------------------------------------- */}
        {authMode === "change_password" && (
          <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
            {/* Eyebrow */}
            <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.06em] text-[#FE0000] antialiased block">
              SECURE ACCOUNT ACCESS
            </span>

            {/* Heading */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#0F172A] tracking-tight leading-[1.2] mb-1.5">
                Change your password
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Create a strong new password that meets Autohub enterprise security policy.
              </p>
            </div>

            {/* Success state */}
            {passwordChangeSuccess && (
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <h4 className="text-sm font-bold text-emerald-950">
                    Password Successfully Updated!
                  </h4>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Your new credentials have been activated in the Autohub Identity System. Redirecting to your {getPortalName(email)}...
                </p>
                <div className="pt-1">
                  <Button
                    type="button"
                    onClick={() => router.push(getPortalRoute(email))}
                    className="w-full h-12 text-xs sm:text-sm font-bold bg-[#FE0000] hover:bg-[#9B0A0F] text-white rounded-xl"
                  >
                    Go to {getPortalName(email)} Now →
                  </Button>
                </div>
              </div>
            )}

            {passwordChangeError && (
              <Alert
                variant="error"
                title="Update Error"
                description={passwordChangeError}
                onDismiss={() => setPasswordChangeError(null)}
              />
            )}

            {!passwordChangeSuccess && (
              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                {/* Current Password or Recovery PIN */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="current-password"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 select-none"
                  >
                    Current Password / 6-Digit PIN
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current password or recovery PIN"
                      required
                      className="w-full h-12 bg-white text-slate-900 text-base sm:text-sm font-medium border border-slate-300 rounded-lg pl-11 pr-12 focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="new-password"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 select-none"
                  >
                    New Password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create new password"
                      required
                      className="w-full h-12 bg-white text-slate-900 text-base sm:text-sm font-medium border border-slate-300 rounded-lg pl-11 pr-12 focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="confirm-password"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 select-none"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      required
                      className="w-full h-12 bg-white text-slate-900 text-base sm:text-sm font-medium border border-slate-300 rounded-lg pl-11 pr-12 focus:outline-none focus:border-[#FE0000] focus:ring-2 focus:ring-[#FE0000]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Strength Checklist */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                    Password Security Criteria:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                    <span className={`flex items-center gap-1.5 ${isLengthValid ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isLengthValid ? "text-emerald-600" : "text-slate-300"}`} />
                      At least 8 characters
                    </span>
                    <span className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${hasUppercase ? "text-emerald-600" : "text-slate-300"}`} />
                      One uppercase letter
                    </span>
                    <span className={`flex items-center gap-1.5 ${hasNumberOrSymbol ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${hasNumberOrSymbol ? "text-emerald-600" : "text-slate-300"}`} />
                      One number or symbol
                    </span>
                    <span className={`flex items-center gap-1.5 ${isMatch ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isMatch ? "text-emerald-600" : "text-slate-300"}`} />
                      Passwords match
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-xs sm:text-sm font-bold bg-[#FE0000] hover:bg-[#9B0A0F] active:bg-[#85080C] text-white rounded-xl shadow-xs"
                  isLoading={isUpdatingPassword}
                  loadingText="Updating Password..."
                  disabled={!isLengthValid || !hasUppercase || !hasNumberOrSymbol || !isMatch}
                >
                  <span>Update Password & Enter Portal →</span>
                </Button>
              </form>
            )}

            <div className="pt-2 text-center border-t border-slate-200">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="text-xs font-bold text-slate-600 hover:text-[#FE0000] inline-flex items-center gap-1 py-1"
              >
                <span>← Back to Sign In</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Terms of Trade & Privacy Policy Legal Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialDoc={legalDocType}
        onAccept={() => {
          setRegAcceptTerms(true);
          setTermsAttemptedError(false);
          setTermsAcknowledgedAt(
            new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          );
        }}
      />
    </AuthLayout>
  );
}
