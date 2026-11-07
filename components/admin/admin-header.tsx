"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ShoppingBag,
  ArrowRightLeft,
  ShieldCheck,
  LogOut,
  Phone,
  Settings,
} from "lucide-react";
import { exitAdminModeAction } from "@/actions/admin-auth.actions";
import { toast } from "sonner";

interface AdminHeaderProps {
  adminPhone?: string;
}

export function AdminHeader({}: AdminHeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleExitAdmin = async () => {
    setIsLoggingOut(true);
    try {
      await exitAdminModeAction();
      toast.success("Admin Session Locked", {
        description: "Secret passcode will be required to re-enter.",
      });
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Failed to exit admin mode");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand & Admin Badge */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="font-playfair text-xl font-bold tracking-tight text-foreground"
          >
            MAA LAXMI
          </Link>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
            <span>Store Admin</span>
          </span>
        </div>

        {/* Right side: Profile viewer, Switch to Buyer, Lock session */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Profile Info */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-muted/60 border border-border text-xs">
            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-[10px]">
              ✓
            </div>
            <span className="font-medium text-foreground">Passcode Verified</span>
          </div>

          {/* Switch to Buyer Mode */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm active:scale-95"
            title="Switch to Buyer Mode / Customer Storefront"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Switch to Buyer Mode</span>
            <ArrowRightLeft className="h-3 w-3 opacity-75 hidden sm:inline" />
          </Link>

          {/* Exit / Lock Admin Mode */}
          <button
            onClick={handleExitAdmin}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/10 transition-colors active:scale-95 disabled:opacity-50"
            title="Lock Admin Mode (Requires OTP to re-enter)"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {isLoggingOut ? "Locking..." : "Exit Admin"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
