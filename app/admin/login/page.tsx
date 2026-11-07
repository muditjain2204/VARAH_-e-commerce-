"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { verifyAdminPasscodeAction } from "@/actions/admin-auth.actions";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";

  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      toast.error("Please enter the admin secret code");
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyAdminPasscodeAction(passcode.trim());
      if (res.success) {
        toast.success("Admin Portal Unlocked!", {
          description: "Welcome back to Maa Laxmi Management Console.",
        });
        router.push(redirectPath);
        router.refresh();
      } else {
        toast.error(res.error || "Incorrect secret access code");
      }
    } catch {
      toast.error("Error unlocking admin portal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-background via-muted/20 to-background p-4 md:p-8">
      {/* Top Brand Header */}
      <div className="flex items-center justify-between max-w-md w-full mx-auto">
        <Link href="/" className="font-playfair text-xl font-bold text-foreground">
          MAA LAXMI <span className="text-xs font-sans font-normal text-muted-foreground">Admin Portal</span>
        </Link>
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Store</span>
        </Link>
      </div>

      {/* Main Lock Card */}
      <div className="w-full max-w-md mx-auto my-auto">
        <div className="bg-card border border-border/80 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur">
          {/* Security Icon & Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-2 shadow-inner">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground font-playfair tracking-tight">
              Store Owner Portal
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
              Restricted management area. Enter your secret passcode to access inventory, orders & product controls.
            </p>
          </div>

          {/* Passcode Form */}
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Secret Admin Passcode</span>
                <span className="text-[10px] text-muted-foreground">Encrypted Access</span>
              </label>

              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPasscode ? "text" : "password"}
                  required
                  autoFocus
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter secret code..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium tracking-wide transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground p-0.5"
                  tabIndex={-1}
                  aria-label={showPasscode ? "Hide code" : "Show code"}
                >
                  {showPasscode ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Secret Code Quick Assist Pill */}
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>Default Passcode: <strong className="font-mono">MAALAXMI@2026</strong></span>
              </span>
              <button
                type="button"
                onClick={() => setPasscode("MAALAXMI@2026")}
                className="font-bold underline text-[11px] bg-amber-200/80 dark:bg-amber-900/60 px-2 py-0.5 rounded transition-transform active:scale-95"
              >
                Auto-fill
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !passcode.trim()}
              className="w-full h-12 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 text-sm"
            >
              {isLoading ? (
                <span>Verifying Secret Code...</span>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Unlock Admin Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Privacy Note */}
          <div className="mt-6 pt-4 border-t border-border/60 text-center">
            <p className="text-[11px] text-muted-foreground">
              Only authorized personnel. Changes made here directly reflect on live store catalog and customer orders.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-muted-foreground py-2">
        <p>© {new Date().getFullYear()} Maa Laxmi Sarees — Administrative Security</p>
      </div>
    </div>
  );
}
