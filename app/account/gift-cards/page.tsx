"use client";

import { useState } from "react";
import { Gift, Sparkles, CreditCard, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AccountGiftCardsPage() {
  const [giftCardCode, setGiftCardCode] = useState("");
  const [checkedBalance, setCheckedBalance] = useState<number | null>(null);

  const handleCheckBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCardCode.trim()) {
      toast.error("Please enter a gift card code");
      return;
    }
    // Simulation / check
    toast.success("Gift Card checked!");
    setCheckedBalance(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
            Gift Cards & Store Balance
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            Redeem digital vouchers or gift a handcrafted saree experience to family and friends.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Check balance card */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <CreditCard className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-bold text-base text-foreground">
                Check Voucher Balance
              </h2>
              <p className="text-xs text-muted-foreground">
                Enter your 16-digit card code to view current balance
              </p>
            </div>
          </div>

          <form onSubmit={handleCheckBalance} className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Gift Card Code
              </label>
              <input
                type="text"
                placeholder="e.g. ML-GIFT-XXXX-XXXX"
                value={giftCardCode}
                onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-xs"
            >
              Check Balance
            </button>
          </form>

          {checkedBalance !== null && (
            <div className="p-3.5 rounded-xl border border-border bg-muted/30 text-center">
              <span className="text-xs text-muted-foreground block">Available Balance</span>
              <span className="text-xl font-bold text-foreground mt-0.5 block">
                ₹{checkedBalance}
              </span>
            </div>
          )}
        </div>

        {/* Brand gift card showcase */}
        <div className="relative overflow-hidden p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-primary/10 space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Festive Saree Gifting
              </span>
            </div>
            <h3 className="font-playfair text-xl font-bold text-foreground">
              MAA LAXMI Luxury Gift Voucher
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Give the timeless gift of authentic Banarasi silks, Kanjivaram zari drapes, and heritage handlooms. Redeemable online anytime with zero expiry.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-border/60">
            <span className="text-xs text-muted-foreground">Denominations from ₹2,000</span>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs"
            >
              <span>Explore Collection</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
