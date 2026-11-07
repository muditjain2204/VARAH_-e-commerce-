"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Phone,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { requestAdminOtpAction, verifyAdminOtpAction } from "@/actions/admin-auth.actions";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";

  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phone.replace(/\D/g, "");
    if (clean.length !== 10) {
      toast.error("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestAdminOtpAction(clean);
      if (res.success && res.data) {
        setGeneratedOtp(res.data.otp || null);
        setStep("OTP");
        setOtp(""); // Clear any previous entered OTP so user enters their real SMS code

        if (res.data.otp) {
          toast.success("Demo Code Generated", {
            description: `Demo OTP: ${res.data.otp} (or master: 999999)`,
          });
        } else {
          toast.success("SMS Code Sent!", {
            description: `Please check SMS on +91 ${clean} for your 6-digit verification code.`,
          });
        }
      } else {
        toast.error(res.error || "Failed to send OTP. Try again.");
      }
    } catch {
      toast.error("Network error sending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, "");
      const res = await verifyAdminOtpAction(cleanPhone, otp.trim());
      if (res.success) {
        toast.success("Admin Identity Verified!", {
          description: "Welcome to Varah Store Management Portal.",
        });
        router.push(redirectPath);
        router.refresh();
      } else {
        toast.error(res.error || "Invalid OTP code");
      }
    } catch {
      toast.error("Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-background via-muted/20 to-background p-4 md:p-8">
      {/* Top Brand */}
      <div className="flex items-center justify-between max-w-md w-full mx-auto">
        <Link href="/" className="font-playfair text-xl font-bold text-foreground">
          MAA LAXMI <span className="text-xs font-sans font-normal text-muted-foreground">Admin Portal</span>
        </Link>
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Store (Buyer Mode)</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="p-7 md:p-8 rounded-3xl border border-border bg-card shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-500/20 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="font-playfair text-2xl font-bold text-foreground">
              Admin Verification
            </h1>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Buyer accounts cannot access admin controls. Provide your registered phone number & OTP to verify store management access.
            </p>
          </div>

          {step === "PHONE" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Admin Mobile Number</span>
                  <span className="text-[10px] text-muted-foreground">OTP Protected</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-sm text-muted-foreground font-semibold flex items-center gap-1">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 10-digit mobile"
                    className="w-full pl-18 pr-4 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all"
                  />
                </div>
              </div>

              {/* Security Hint */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span>Authorized store manager access only</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">Master OTP: 999999</span>
              </div>

              <button
                type="submit"
                disabled={isLoading || phone.length !== 10}
                className="w-full h-12 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 text-sm"
              >
                {isLoading ? (
                  <span>Sending Code...</span>
                ) : (
                  <>
                    <span>Send Verification OTP</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Enter 6-Digit OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep("PHONE")}
                    className="text-[11px] text-primary hover:underline"
                  >
                    Change Number
                  </button>
                </div>

                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit code"
                    className="w-full pl-10 pr-4 py-2.5 text-center tracking-[0.4em] font-mono text-base font-bold rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* OTP Helper Banner */}
              {generatedOtp ? (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                  <span>Generated Test OTP: <strong className="font-mono">{generatedOtp}</strong></span>
                  <button
                    type="button"
                    onClick={() => setOtp(generatedOtp)}
                    className="font-bold underline text-[11px]"
                  >
                    Paste
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>Enter the 6-digit SMS code</span>
                  <span className="font-mono text-[10px] text-muted-foreground">Backup Code: <strong>999999</strong></span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full h-12 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 text-sm"
              >
                {isLoading ? (
                  <span>Verifying Admin...</span>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    <span>Verify & Unlock Admin Portal</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Resend OTP</span>
                </button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-border text-center text-[11px] text-muted-foreground">
            🔒 Protected Area • Restricted to authorized store staff and administrators only.
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div className="text-center text-xs text-muted-foreground">
        Varah Saree Store © 2026. Handcrafted in Varanasi.
      </div>
    </div>
  );
}
