"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ShoppingBag,
  Trash2,
  Heart,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Check,
  Percent,
} from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/constants";

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    shipping,
    total,
    freeShippingRemaining,
    freeShippingProgress,
    appliedCoupon,
    isCouponLoading,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { toggleWishlist, isInWishlist } = useWishlist();
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponCode.trim()) return;
    const res = await applyCoupon(couponCode);
    if (res.success) {
      setCouponCode("");
    }
  };

  const handleSaveForLater = (item: (typeof items)[0]) => {
    toggleWishlist({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      fabric: item.fabric,
      inStock: true,
    });
    removeItem(item.id);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ShoppingBag className="w-12 h-12 stroke-1" />
          </div>
          <div className="space-y-2">
            <h1 className="font-playfair text-3xl font-bold text-foreground">
              Your Shopping Bag is Empty
            </h1>
            <p className="text-muted-foreground text-sm">
              Looks like you haven't added any sarees to your bag yet. Explore our handcrafted
              collection and discover timeless drape perfection.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95"
            >
              <span>Explore Sarees</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
            Shopping Bag
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full self-start sm:self-auto">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>100% Safe & Secure Checkout</span>
        </div>
      </div>

      {/* Free shipping progress alert */}
      <div className="mt-6 p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Truck className="h-4 w-4 text-primary" />
            {freeShippingRemaining > 0 ? (
              <span>
                Add{" "}
                <strong className="text-primary">{formatPrice(freeShippingRemaining)}</strong>{" "}
                more to get <strong className="text-emerald-600">FREE Delivery</strong>!
              </span>
            ) : (
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <Check className="h-4 w-4" /> You've unlocked FREE Delivery across India!
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            Goal: {formatPrice(FREE_SHIPPING_THRESHOLD)}
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const itemWishlisted = isInWishlist(item.productId);
            const lineTotal = item.price * item.quantity;

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl border border-border bg-card hover:border-primary/20 transition-all flex gap-4 sm:gap-6 relative"
              >
                {/* Thumbnail */}
                <Link
                  href={`/products/${item.slug}`}
                  className="relative w-24 sm:w-28 aspect-[3/4] flex-shrink-0 rounded-xl overflow-hidden bg-secondary border border-border"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                    sizes="112px"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors -mr-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {item.fabric && (
                        <span className="bg-muted px-2 py-0.5 rounded-md font-medium">
                          {item.fabric}
                        </span>
                      )}
                      {item.color && (
                        <span className="bg-muted px-2 py-0.5 rounded-md font-medium">
                          Color: {item.color}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Quantity stepper */}
                  <div className="pt-3 flex flex-wrap items-end justify-between gap-3 border-t border-border/50 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-border rounded-lg bg-background">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors rounded-l-lg"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-foreground select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors rounded-r-lg"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSaveForLater(item)}
                        className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 ml-2"
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${itemWishlisted ? "fill-current text-destructive" : ""}`}
                        />
                        <span className="hidden sm:inline">Save for Later</span>
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-base sm:text-lg font-bold text-foreground">
                        {formatPrice(lineTotal)}
                      </div>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <div className="text-xs text-muted-foreground line-through">
                          {formatPrice(item.originalPrice * item.quantity)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary sidebar */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
            <h2 className="font-semibold text-lg text-foreground border-b border-border pb-4">
              Order Summary
            </h2>

            {/* Coupon Code Section */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-primary" />
                <span>Apply Coupon</span>
              </label>

              {appliedCoupon ? (
                <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" />
                      {appliedCoupon.code}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      {appliedCoupon.description || `Saved ${formatPrice(discount)}`}
                    </p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-destructive hover:underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary uppercase"
                  />
                  <button
                    type="submit"
                    disabled={isCouponLoading || !couponCode.trim()}
                    className="px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isCouponLoading ? "..." : "Apply"}
                  </button>
                </form>
              )}

              {/* Quick Coupon Suggestions */}
              {!appliedCoupon && (
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCouponCode("VARAH10");
                      applyCoupon("VARAH10");
                    }}
                    className="text-[11px] font-medium border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
                  >
                    <Percent className="h-3 w-3" />
                    VARAH10 (10% OFF)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCouponCode("WELCOME500");
                      applyCoupon("WELCOME500");
                    }}
                    className="text-[11px] font-medium border border-dashed border-border hover:border-primary/40 bg-muted/30 px-2.5 py-1 rounded-md transition-colors"
                  >
                    WELCOME500 (₹500 OFF)
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 pt-4 border-t border-border text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-semibold uppercase text-xs">FREE</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground text-xs">
                <span>Taxes & GST</span>
                <span>Included</span>
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t border-border text-base font-bold text-foreground">
                <span>Total</span>
                <span className="text-2xl text-primary font-bold">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <div className="space-y-3 pt-2">
              <Link
                href="/checkout"
                className="w-full h-12 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/products"
                className="w-full text-center block text-xs text-muted-foreground hover:text-foreground transition-colors font-medium py-1"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-border grid grid-cols-2 gap-3 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-primary" />
                <span>Pan-India Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="h-3.5 w-3.5 text-primary" />
                <span>7-Day Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
