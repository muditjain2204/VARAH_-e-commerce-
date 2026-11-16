"use client";

import { useState } from "react";
import { Ticket, Copy, Check, Sparkles, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Coupon {
  code: string;
  title: string;
  description: string;
  discount: string;
  minOrder: string;
  validTill: string;
  badge?: string;
}

const STORE_COUPONS: Coupon[] = [
  {
    code: "MAALAXMI",
    title: "Maa Laxmi Special Welcome Offer",
    description: "Flat ₹500 discount on your pure handcrafted silk or banarasi saree purchase.",
    discount: "Flat ₹500 OFF",
    minOrder: "Min order ₹4,999",
    validTill: "Valid till 31 Dec 2026",
    badge: "Most Popular",
  },
  {
    code: "FESTIVE10",
    title: "Festive Season Discount",
    description: "Enjoy 10% extra discount across our entire festive and wedding collection.",
    discount: "10% OFF",
    minOrder: "Min order ₹2,999",
    validTill: "Valid for next 14 days",
    badge: "Trending",
  },
  {
    code: "FIRST500",
    title: "First Order Privilege",
    description: "Special ₹500 instant discount on your very first order at Maa Laxmi.",
    discount: "₹500 OFF",
    minOrder: "No minimum purchase",
    validTill: "Valid on 1st Order",
  },
  {
    code: "FREESHIP",
    title: "Complimentary Express Delivery",
    description: "Free door-to-door insured courier across 28 Indian States & UTs.",
    discount: "FREE SHIPPING",
    minOrder: "All Prepaid & COD Orders",
    validTill: "Ongoing Offer",
  },
];

export default function AccountCouponsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
    setTimeout(() => {
      setCopiedCode((prev) => (prev === code ? null : prev));
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
            Available Coupons & Offers
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            Apply these exclusive discount codes during checkout to save on handcrafted sarees.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STORE_COUPONS.map((coupon) => (
          <div
            key={coupon.code}
            className="relative flex flex-col justify-between p-5 rounded-2xl border border-dashed border-primary/30 bg-card hover:border-primary transition-all shadow-xs"
          >
            {coupon.badge && (
              <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground shadow-xs">
                {coupon.badge}
              </span>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Ticket className="h-5 w-5" />
                </span>
                <div>
                  <span className="text-sm font-bold text-foreground block">
                    {coupon.title}
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    {coupon.discount}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {coupon.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-3">
              <div className="text-[11px] text-muted-foreground">
                <span className="block font-medium text-foreground/80">{coupon.minOrder}</span>
                <span>{coupon.validTill}</span>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(coupon.code)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-primary text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-xs"
              >
                {copiedCode === coupon.code ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>{coupon.code}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl border border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Have an exclusive code? Enter it directly in the shopping cart or checkout screen.</span>
        </div>
        <Link
          href="/products"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <span>Use on Sarees</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
