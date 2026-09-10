"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { MfaQrCode } from "@/components/auth/mfa-qr-code";
import { MfaCodeInput } from "@/components/auth/mfa-code-input";
import { MfaHelpAccordion } from "@/components/auth/mfa-help-accordion";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { AuthStateType } from "@/components/auth/auth-state-simulator";
import {
  ShieldAlert,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

export function LoginView() {
  const router = useRouter();

  // State machine
  const [authState, setAuthState] = useState<AuthStateType>("initial");
  const [code, setCode] = useState("");
  const [qrSeconds, setQrSeconds] = useState(300);
  const [attemptsCount, setAttemptsCount] = useState(0);

  // Timer countdown for QR security
  useEffect(() => {
    if (authState === "qr_expired") return;
    const interval = setInterval(() => {
      setQrSeconds((prev) => {
        if (prev <= 1) {
          setAuthState("qr_expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [authState]);

  // Reset QR
  const handleRegenerateQr = () => {
    setQrSeconds(300);
    if (authState === "qr_expired") {
      setAuthState("initial");
    }
  };

  // Verification submission logic
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (code.length < 6) return;

    setAuthState("loading");

    // Simulate enterprise authentication network roundtrip
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo code routing:
    if (code === "000000") {
      setAuthState("expired_code");
      return;
    }

    if (code === "999999") {
      setAuthState("account_locked");
      return;
    }

    if (code === "123456" || attemptsCount < 2) {
      setAuthState("success");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1400);
    } else {
      const newAttempts = attemptsCount + 1;
      setAttemptsCount(newAttempts);
      if (newAttempts >= 3) {
        setAuthState("too_many_attempts");
      } else {
        setAuthState("invalid_code");
      }
    }
  };

  // Auto-verify when all 6 digits are typed
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (authState === "invalid_code" || authState === "expired_code") {
      setAuthState("initial");
    }
    if (
      newCode.length === 6 &&
      authState !== "too_many_attempts" &&
      authState !== "account_locked"
    ) {
      setTimeout(() => {
        handleVerify();
      }, 200);
    }
  };

  const isFormLocked =
    authState === "too_many_attempts" ||
    authState === "account_locked" ||
    authState === "session_expired";

  return (
    <AuthLayout>
      <div className="w-full flex flex-col justify-center text-left">
        {/* Top Eyebrow: SECURE ACCOUNT ACCESS matching reference */}
        <div className="mb-2">
          <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#C40E14] antialiased">
            SECURE ACCOUNT ACCESS
          </span>
        </div>

        {/* Main Heading: Protect your account */}
        <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#0F172A] tracking-tight leading-[1.15] mb-3 font-sans">
          Protect your account
        </h1>

        {/* Supporting Copy matching exact wording from reference */}
        <p className="text-sm sm:text-[14px] text-slate-600 leading-relaxed max-w-sm mb-6">
          Scan this QR code with an authenticator app, then enter its six-digit code.
        </p>

        {/* QR Code Section: Centered */}
        <div className="w-full flex flex-col items-center mb-4">
          <MfaQrCode
            isExpired={authState === "qr_expired"}
            onRefresh={handleRegenerateQr}
            secondsRemaining={qrSeconds}
          />
        </div>

        {/* Cannot scan the code? Accordion */}
        <div className="w-full mb-3">
          <MfaHelpAccordion defaultOpen={authState === "cannot_scan"} />
        </div>

        {/* Error / Alert Feedback */}
        {authState !== "initial" && authState !== "cannot_scan" && authState !== "loading" && (
          <div className="w-full mb-3">
            {authState === "invalid_code" && (
              <Alert
                variant="error"
                title="Invalid authentication code"
                description="Please check your authenticator app and try again."
                onDismiss={() => setAuthState("initial")}
              />
            )}

            {authState === "expired_code" && (
              <Alert
                variant="warning"
                title="Authentication code expired"
                description="Authenticator codes refresh every 30 seconds. Please enter the current code."
                onDismiss={() => setAuthState("initial")}
              />
            )}

            {authState === "too_many_attempts" && (
              <Alert
                variant="warning"
                title="Too many failed attempts"
                description="Access has been restricted for 15 minutes to protect your account."
                action={
                  <button
                    type="button"
                    onClick={() => {
                      setAttemptsCount(0);
                      setAuthState("initial");
                    }}
                    className="text-xs font-semibold underline text-amber-800 hover:text-amber-950"
                  >
                    Reset demo attempts
                  </button>
                }
              />
            )}

            {authState === "account_locked" && (
              <Alert
                variant="error"
                icon={<ShieldAlert className="w-4 h-4 text-[#DC2626]" />}
                title="Security lockout initiated"
                description="Your account has been temporarily locked. Please contact it-support@autohub.com."
                action={
                  <button
                    type="button"
                    onClick={() => setAuthState("initial")}
                    className="text-xs font-semibold underline text-red-800 hover:text-red-950"
                  >
                    Unlock demo account
                  </button>
                }
              />
            )}

            {authState === "session_expired" && (
              <Alert
                variant="warning"
                title="Session expired"
                description="Your security session timed out due to inactivity."
                action={
                  <button
                    type="button"
                    onClick={() => {
                      setCode("");
                      setAuthState("initial");
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 underline mt-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restart Session</span>
                  </button>
                }
              />
            )}

            {authState === "success" && (
              <Alert
                variant="success"
                icon={<CheckCircle2 className="w-4 h-4 text-[#059669]" />}
                title="Identity verified"
                description="Authentication successful. Redirecting to procurement workspace..."
              />
            )}
          </div>
        )}

        {/* Input & CTA Form */}
        <form onSubmit={handleVerify} className="w-full space-y-4">
          <MfaCodeInput
            value={code}
            onChange={handleCodeChange}
            disabled={isFormLocked || authState === "loading" || authState === "success"}
            hasError={authState === "invalid_code" || authState === "expired_code"}
          />

          {/* Primary CTA Button matching reference image */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-sm font-bold bg-[#B30D12] hover:bg-[#9B0A0F] active:bg-[#85080C] text-white rounded-lg transition-all shadow-xs"
            isLoading={authState === "loading"}
            loadingText="Verifying..."
            disabled={
              code.length < 6 ||
              isFormLocked ||
              authState === "qr_expired" ||
              authState === "success"
            }
          >
            {authState === "success" ? (
              <span className="inline-flex items-center gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Verified • Redirecting...
              </span>
            ) : (
              <span>Verify and finish</span>
            )}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
