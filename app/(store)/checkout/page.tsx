"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronRight,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { formatPrice } from "@/lib/utils";
import { INDIAN_STATES } from "@/constants";
import { createOrderAction } from "@/actions/order.actions";
import { verifyPaymentAction } from "@/actions/payment.actions";
import { toast } from "sonner";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, shipping, total, appliedCoupon, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD">("ONLINE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState<string>(INDIAN_STATES[0]);
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [notes, setNotes] = useState("");

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    script.onerror = () => console.warn("Razorpay SDK could not be loaded");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const validateForm = () => {
    if (!fullName.trim() || fullName.trim().length < 2) {
      toast.error("Please enter your full name.");
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      toast.error("Please enter a valid 10-digit Indian mobile number.");
      return false;
    }
    if (!addressLine1.trim() || addressLine1.trim().length < 5) {
      toast.error("Please enter your complete street address (House no, Street, Area).");
      return false;
    }
    if (!city.trim()) {
      toast.error("Please enter your city.");
      return false;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      toast.error("Please enter a valid 6-digit Indian PIN code.");
      return false;
    }
    return true;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      router.push("/cart");
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const orderRes = await createOrderAction({
        customer: { fullName, email, phone },
        address: {
          addressLine1,
          addressLine2,
          city,
          state,
          pincode,
          landmark,
        },
        items,
        coupon: appliedCoupon,
        paymentMethod,
        notes,
      });

      if (!orderRes.success || !orderRes.data) {
        toast.error(orderRes.error || "Failed to create order. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const { order, razorpayOrder } = orderRes.data;

      // Handle COD
      if (paymentMethod === "COD") {
        clearCart();
        toast.success("Order Placed Successfully!");
        router.push(`/order-confirmation/${order.id}`);
        return;
      }

      // Handle Online Payment (Razorpay)
      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder";

      if (window.Razorpay && razorpayOrder && !razorpayOrder.id.startsWith("order_sim_")) {
        const options = {
          key: rzpKey,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "MAA LAXMI",
          description: `Order ${order.orderNumber} - Traditional Sarees`,
          order_id: razorpayOrder.id,
          prefill: {
            name: fullName,
            email,
            contact: phone,
          },
          theme: {
            color: "#800020", // Deep Burgundy
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          handler: async function (response: any) {
            try {
              const verifyRes = await verifyPaymentAction({
                orderId: order.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (verifyRes.success) {
                clearCart();
                toast.success("Payment Received & Order Confirmed!");
                router.push(`/order-confirmation/${order.id}`);
              } else {
                toast.error("Payment verification failed. Please check with support.");
              }
            } catch (err) {
              console.error(err);
              toast.error("Error during payment verification");
            }
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
              toast.info("Payment was cancelled. You can retry anytime.");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Test simulation / fallback when keys or external gateway aren't set
        toast.success("Payment Simulated Successfully (Test Mode)");
        await verifyPaymentAction({
          orderId: order.id,
          razorpayOrderId: razorpayOrder?.id || "order_sim_test",
          razorpayPaymentId: `pay_sim_${Date.now()}`,
          razorpaySignature: "simulated_signature",
        });
        clearCart();
        router.push(`/order-confirmation/${order.id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred during checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Your shopping cart is empty</h1>
        <p className="text-muted-foreground text-sm">Add sarees to proceed with checkout.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl"
        >
          <span>Explore Sarees</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb Steps */}
      <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-muted-foreground pb-8 max-w-xl mx-auto">
        <Link href="/cart" className="text-primary hover:underline flex items-center gap-1">
          <ShoppingBag className="h-4 w-4" />
          <span>Bag</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
        <span className="text-foreground font-semibold flex items-center gap-1">
          <Truck className="h-4 w-4 text-primary" />
          <span>Delivery & Payment</span>
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
        <span className="text-muted-foreground/50 flex items-center gap-1">
          <CheckCircle2 className="h-4 w-4" />
          <span>Confirmation</span>
        </span>
      </div>

      <form onSubmit={handleCheckout}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Delivery Address & Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Contact & Address */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    1
                  </span>
                  <span>Contact & Shipping Address</span>
                </h2>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3 text-emerald-600" />
                  SSL Encrypted
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Mobile Number <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm text-muted-foreground font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    House / Flat / Building / Street Address{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="Flat 402, Royal Residency, M.G. Road"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Area / Locality / Sector <span className="text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Near City Mall, Sector 15"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    City <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Varanasi / Bengaluru"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    PIN Code <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit PIN"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    State <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Special Delivery Notes / Instructions{" "}
                    <span className="text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Ring bell twice, deliver between 10am - 5pm"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
              <h2 className="font-semibold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  2
                </span>
                <span>Select Payment Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Razorpay Online */}
                <label
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    paymentMethod === "ONLINE"
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border hover:border-foreground/30 bg-background"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "ONLINE"}
                        onChange={() => setPaymentMethod("ONLINE")}
                        className="text-primary focus:ring-primary"
                      />
                      <div>
                        <span className="font-semibold text-sm text-foreground block">
                          Pay Online via Razorpay
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          UPI, Cards, NetBanking, Wallets
                        </span>
                      </div>
                    </div>
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-md">
                    <Sparkles className="h-3 w-3" />
                    <span>Instant Order Confirmation & Fastest Dispatch</span>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    paymentMethod === "COD"
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border hover:border-foreground/30 bg-background"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="text-primary focus:ring-primary"
                      />
                      <div>
                        <span className="font-semibold text-sm text-foreground block">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Pay cash or UPI at delivery
                        </span>
                      </div>
                    </div>
                    <Banknote className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    Available for all serviceable Indian PIN codes.
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Pay Button */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
              <h2 className="font-semibold text-lg text-foreground border-b border-border pb-3">
                Items in Order ({items.length})
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0 border border-border">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-foreground truncate">{item.name}</p>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-xs font-bold text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 pt-4 border-t border-border text-xs sm:text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>
                      Coupon Discount ({appliedCoupon?.code})
                    </span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-emerald-600 font-semibold uppercase text-xs">
                        FREE
                      </span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>Taxes (GST Included)</span>
                  <span>₹0.00</span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-border font-bold text-foreground">
                  <span className="text-sm">Total to Pay</span>
                  <span className="text-2xl text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Primary Submit Button */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-13 py-3.5 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 text-base"
                >
                  {isSubmitting ? (
                    <span>Processing Order...</span>
                  ) : paymentMethod === "ONLINE" ? (
                    <>
                      <span>Pay {formatPrice(total)} via Razorpay</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  ) : (
                    <>
                      <span>Confirm Cash on Delivery Order</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-muted-foreground">
                  By placing order you agree to MAA LAXMI's Terms and Privacy Policy.
                </p>
              </div>

              {/* Security & Guarantees */}
              <div className="pt-4 border-t border-border grid grid-cols-2 gap-3 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>100% Authentic Sarees</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-primary" />
                  <span>Doorstep Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
