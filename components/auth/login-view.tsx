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
  Building2,
  Phone,
  Clock,
} from "lucide-react";

export type AuthMode = "login" | "register" | "mfa" | "forgot_password" | "change_password";

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
  const [regAcceptTerms, setRegAcceptTerms] = useState(false); // Single static acceptance checkbox
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

    // If user has optional MFA enabled, transition to MFA step
    if (requireMfa) {
      setAuthMode("mfa");
    } else {
      // Direct access bypass without MFA
      setLoginSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
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
      setRegError("You must agree to the Terms of Trade and Privacy Policy.");
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

    if (mfaCode === "123456" || mfaAttemptsCount < 2) {
      setMfaStatus("success");
      setTimeout(() => {
        router.push("/dashboard");
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

    setTimeout(() => {
      router.push("/dashboard");
    }, 1800);
  };

  // Quick fill helper for demo accounts
  const handleSelectDemoUser = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoginError(null);
  };

  // Password requirements checker
  const isLengthValid = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  return (
    <AuthLayout>
      <div className="w-full flex flex-col justify-center text-left">
        {/* Top Navigation Pill Tabs (Quick switcher between authentication modes) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl mb-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setAuthMode("login");
              setLoginError(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              authMode === "login"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("register");
              setRegError(null);
              setRegSubmitted(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              authMode === "register"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Register Trade Account
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("mfa")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              authMode === "mfa"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>MFA</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 uppercase font-black">
              Opt
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("forgot_password");
              setForgotEmail(email);
              setResetSentSuccess(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              authMode === "forgot_password"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Forgot Password
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("change_password");
              setPasswordChangeSuccess(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              authMode === "change_password"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Change Password
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MODE 1: EMAIL + PASSWORD SIGN IN                              */}
        {/* ------------------------------------------------------------- */}
        {authMode === "login" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Eyebrow */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#C40E14] antialiased">
                SECURE ACCOUNT ACCESS
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200">
                PROCURly Portal
              </span>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-3xl sm:text-[36px] font-bold text-[#0F172A] tracking-tight leading-[1.15] mb-2 font-sans">
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
                description="Secure direct session initialized. Redirecting to workspace..."
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
                    className="text-xs font-bold text-[#B30D12] hover:underline"
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
                    className="w-full h-12 bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400 border border-slate-300 rounded-lg transition-all pl-11 pr-11 focus:outline-none focus:border-[#ED2025] focus:ring-2 focus:ring-[#ED2025]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1"
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
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberWorkstation}
                    onChange={(e) => setRememberWorkstation(e.target.checked)}
                    className="w-4 h-4 rounded text-[#B30D12] focus:ring-0 cursor-pointer"
                  />
                  <span>Remember this workstation for 30 days</span>
                </label>
              </div>

              {/* SECURE ACCOUNT ACCESS OPTIONAL TOGGLE CARD */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={requireMfa}
                    onChange={(e) => setRequireMfa(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#B30D12] focus:ring-0 cursor-pointer"
                  />
                  <div className="text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">
                        Secure Account Access (MFA Verification)
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                        Optional
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">
                      {requireMfa
                        ? "Enabled: You will be prompted for 6-digit authenticator code after signing in."
                        : "Disabled: Sign in directly with email and password without secondary MFA prompt."}
                    </p>
                  </div>
                </label>
              </div>

              {/* Primary Sign In Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-sm font-bold bg-[#B30D12] hover:bg-[#9B0A0F] active:bg-[#85080C] text-white rounded-lg transition-all shadow-xs"
                isLoading={isLoggingIn}
                loadingText="Authenticating..."
              >
                <span>
                  {requireMfa
                    ? "Continue to Secure Access (MFA) →"
                    : "Sign In Directly →"}
                </span>
              </Button>
            </form>

            {/* Quick Demo Pre-fills */}
            <div className="pt-2 border-t border-slate-200/80 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Demo Sign-In Credentials:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    handleSelectDemoUser(
                      "james.wilson@spmotors.co.nz",
                      "Procurly2026!"
                    )
                  }
                  className="p-2 text-left rounded-lg border border-slate-200 bg-white hover:border-[#B30D12] hover:bg-red-50/20 transition-all text-slate-700"
                >
                  <p className="font-bold text-slate-900 truncate">
                    James Wilson (SP Motors)
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    james.wilson@spmotors.co.nz
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSelectDemoUser(
                      "sarah.jenkins@procurly.io",
                      "AdminSecure2026!"
                    )
                  }
                  className="p-2 text-left rounded-lg border border-slate-200 bg-white hover:border-[#B30D12] hover:bg-red-50/20 transition-all text-slate-700"
                >
                  <p className="font-bold text-slate-900 truncate">
                    Sarah Jenkins (Admin)
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    sarah.jenkins@procurly.io
                  </p>
                </button>
              </div>
            </div>

            {/* Direct Portal Link & Register Trade Account Link */}
            <div className="pt-2 text-center border-t border-slate-200/80 space-y-2">
              <p className="text-xs text-slate-600">
                New trade customer?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setRegError(null);
                    setRegSubmitted(false);
                  }}
                  className="font-bold text-[#B30D12] hover:underline"
                >
                  Register your business account →
                </button>
              </p>

              <div>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="text-xs font-semibold text-slate-500 hover:text-[#B30D12] inline-flex items-center gap-1"
                >
                  <span>Direct Access to Customer Portal Workspace (Demo Mode) →</span>
                </button>
              </div>
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
              <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#C40E14] antialiased">
                TRADE CUSTOMER REGISTRATION
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200">
                MVP Simplified Scope
              </span>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-3xl sm:text-[36px] font-bold text-[#0F172A] tracking-tight leading-[1.15] mb-2 font-sans">
                Register your business
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Create a trade account to access Autohub parts sourcing and wholesale procurement lines.
              </p>
            </div>

            {regSubmitted ? (
              /* Manual Customer Approval Confirmation Screen */
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-300 space-y-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                        Pending Manual Approval
                      </span>
                      <h3 className="text-base font-bold text-amber-950 mt-1">
                        Registration Submitted
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-amber-900 leading-relaxed">
                    Thank you! Your trade registration for <strong>{regBusinessName}</strong> has been received. Customer trade approvals are reviewed manually by the Procurly Autohub operations team for MVP.
                  </p>

                  {/* Registered Details Summary Card */}
                  <div className="p-4 bg-white rounded-xl border border-amber-200 space-y-2 text-xs">
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
                      <span className="font-mono text-slate-800">{regEmail}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Phone Contact:</span>
                      <span className="font-mono text-slate-800">{regPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Procurement Terms:</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Static agreement verified
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-white/70 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
                    <p className="font-bold">Next Steps:</p>
                    <p>
                      Our trade desk will manually review your workshop registration and contact <strong>{regContactName}</strong> within 1 business day once your trade credit line is activated.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setEmail(regEmail);
                      setAuthMode("login");
                      setRegSubmitted(false);
                    }}
                    className="w-full h-11 text-xs font-bold bg-[#B30D12] hover:bg-[#9B0A0F] text-white rounded-lg"
                  >
                    Return to Sign In →
                  </Button>

                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
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
                      className="w-full h-12 bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400 border border-slate-300 rounded-lg transition-all pl-11 pr-11 focus:outline-none focus:border-[#ED2025] focus:ring-2 focus:ring-[#ED2025]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1"
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

                {/* Single Static Acceptance Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={regAcceptTerms}
                      onChange={(e) => setRegAcceptTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-[#B30D12] focus:ring-0 cursor-pointer"
                      required
                    />
                    <span className="leading-snug">
                      I agree to the Procurly Terms of Trade and Privacy Policy
                    </span>
                  </label>
                </div>

                {/* MVP Manual Approval Notice */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Manual Approval Policy</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Customer approval is manual for MVP. Complex automated verification (NZBN, GST, multiple contacts, multiple addresses) is streamlined.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-sm font-bold bg-[#B30D12] hover:bg-[#9B0A0F] active:bg-[#85080C] text-white rounded-lg transition-all shadow-xs"
                  isLoading={isRegistering}
                  loadingText="Submitting Application..."
                >
                  <span>Submit Registration (Pending Manual Approval) →</span>
                </Button>

                <div className="pt-2 text-center border-t border-slate-200/80">
                  <p className="text-xs text-slate-600">
                    Already registered?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className="font-bold text-[#B30D12] hover:underline"
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
            {/* Top Eyebrow with Optional Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#C40E14] antialiased">
                SECURE ACCOUNT ACCESS
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 uppercase px-2 py-0.5 rounded-full">
                OPTIONAL STEP
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-[36px] font-bold text-[#0F172A] tracking-tight leading-[1.15] font-sans">
              Protect your account
            </h1>

            {/* User identification pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold truncate max-w-[200px]">{email}</span>
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="text-slate-400 hover:text-[#B30D12] text-[11px] underline font-bold"
              >
                Change
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Scan this QR code with an authenticator app, then enter its six-digit code.
            </p>

            {/* Centered QR Code */}
            <div className="w-full flex flex-col items-center my-2">
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
                description="Authentication successful. Redirecting to procurement workspace..."
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
                className="w-full h-12 text-sm font-bold bg-[#B30D12] hover:bg-[#9B0A0F] text-white rounded-lg transition-all shadow-xs"
                isLoading={mfaStatus === "loading"}
                loadingText="Verifying..."
                disabled={mfaCode.length < 6 || mfaStatus === "success"}
              >
                {mfaStatus === "success" ? "Verified • Redirecting..." : "Verify and finish"}
              </Button>

              {/* SECURE ACCOUNT ACCESS OPTIONAL SKIP BUTTON */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="w-full py-2.5 px-4 rounded-lg border border-slate-300 hover:bg-white bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Skip Secure Account Access (Optional) →</span>
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-1">
                  MFA setup is optional for this session. You can activate it anytime in Account Settings.
                </p>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
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
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Eyebrow */}
            <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#C40E14] antialiased block">
              SECURE ACCOUNT ACCESS
            </span>

            {/* Heading */}
            <div>
              <h1 className="text-3xl sm:text-[36px] font-bold text-[#0F172A] tracking-tight leading-[1.15] mb-2 font-sans">
                Reset your password
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Enter your registered business email to receive an instant 6-digit recovery code and reset instructions.
              </p>
            </div>

            {/* Reset Sent Confirmation */}
            {resetSentSuccess ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
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

                <div className="p-3.5 bg-white rounded-xl border border-emerald-200/80 flex items-center justify-between font-mono">
                  <span className="text-xs text-slate-500 font-sans font-medium">
                    Demo Recovery PIN:
                  </span>
                  <span className="text-lg font-black text-emerald-800 tracking-wider">
                    {generatedRecoveryPin}
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setCurrentPassword(generatedRecoveryPin);
                      setAuthMode("change_password");
                    }}
                    className="w-full h-11 text-xs font-bold bg-[#B30D12] hover:bg-[#9B0A0F] text-white rounded-lg"
                  >
                    Enter Code & Set New Password →
                  </Button>

                  <button
                    type="button"
                    onClick={() => setResetSentSuccess(false)}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-medium py-1"
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
                  className="w-full h-12 text-sm font-bold bg-[#B30D12] hover:bg-[#9B0A0F] text-white rounded-lg transition-all"
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
                className="text-xs font-bold text-slate-600 hover:text-[#B30D12] inline-flex items-center gap-1"
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
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Eyebrow */}
            <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#C40E14] antialiased block">
              SECURE ACCOUNT ACCESS
            </span>

            {/* Heading */}
            <div>
              <h1 className="text-3xl sm:text-[36px] font-bold text-[#0F172A] tracking-tight leading-[1.15] mb-2 font-sans">
                Change your password
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Create a strong new password that meets Autohub enterprise security policy.
              </p>
            </div>

            {/* Success state */}
            {passwordChangeSuccess && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-sm font-bold text-emerald-950">
                    Password Successfully Updated!
                  </h4>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Your new credentials have been activated in the Autohub Identity System. Redirecting to your Customer Portal dashboard...
                </p>
                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="w-full h-11 text-xs font-bold bg-[#B30D12] hover:bg-[#9B0A0F] text-white rounded-lg"
                  >
                    Go to Customer Portal Now →
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
                      className="w-full h-12 bg-white text-slate-900 text-sm font-medium border border-slate-300 rounded-lg pl-11 pr-11 focus:outline-none focus:border-[#ED2025] focus:ring-2 focus:ring-[#ED2025]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1"
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
                      className="w-full h-12 bg-white text-slate-900 text-sm font-medium border border-slate-300 rounded-lg pl-11 pr-11 focus:outline-none focus:border-[#ED2025] focus:ring-2 focus:ring-[#ED2025]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1"
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
                      className="w-full h-12 bg-white text-slate-900 text-sm font-medium border border-slate-300 rounded-lg pl-11 pr-11 focus:outline-none focus:border-[#ED2025] focus:ring-2 focus:ring-[#ED2025]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Interactive Password Strength Checklist */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Security Checklist:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="flex items-center gap-1.5">
                      {isLengthValid ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                      )}
                      <span className={isLengthValid ? "text-slate-800 font-bold" : "text-slate-500"}>
                        8+ characters
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {hasUppercase ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                      )}
                      <span className={hasUppercase ? "text-slate-800 font-bold" : "text-slate-500"}>
                        1+ uppercase (A-Z)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {hasNumberOrSymbol ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                      )}
                      <span className={hasNumberOrSymbol ? "text-slate-800 font-bold" : "text-slate-500"}>
                        1+ number or symbol
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isMatch ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                      )}
                      <span className={isMatch ? "text-slate-800 font-bold" : "text-slate-500"}>
                        Passwords match
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-sm font-bold bg-[#B30D12] hover:bg-[#9B0A0F] text-white rounded-lg transition-all"
                  isLoading={isUpdatingPassword}
                  loadingText="Updating Password..."
                  disabled={!isLengthValid || !hasUppercase || !hasNumberOrSymbol || !isMatch}
                >
                  <span>Update Password & Save →</span>
                </Button>
              </form>
            )}

            <div className="pt-2 text-center border-t border-slate-200">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="text-xs font-bold text-slate-600 hover:text-[#B30D12] inline-flex items-center gap-1"
              >
                <span>← Return to Sign In</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
