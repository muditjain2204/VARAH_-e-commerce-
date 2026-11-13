"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Copy,
  ExternalLink,
  RotateCw,
  MessageCircle,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { searchPublicTrackingAction } from "@/actions/shipping.actions";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export function PublicTracker() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery =
    searchParams.get("order") ||
    searchParams.get("awb") ||
    searchParams.get("q") ||
    "";

  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    order: any;
    tracking: any;
  } | null>(null);

  const performSearch = async (searchStr: string) => {
    if (!searchStr.trim()) {
      setError("Please enter your Order Number, AWB Tracking Code, or Mobile Number.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await searchPublicTrackingAction(searchStr.trim());
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setData(null);
        setError(
          res.error ||
            "No active shipment found matching this reference. Please check your order number or WhatsApp support."
        );
      }
    } catch {
      setError("Error connecting to logistics network. Please try again shortly.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/track?order=${encodeURIComponent(query.trim())}`);
      performSearch(query.trim());
    }
  };

  const copyAwb = (awbCode: string) => {
    navigator.clipboard.writeText(awbCode);
    toast.success("AWB Number copied to clipboard!", { id: "awb-copy-public" });
  };

  const currentStatus = (data?.order?.shipping?.status || data?.order?.status || "IN_TRANSIT").toUpperCase();
  const isDelivered = currentStatus.includes("DELIVERED");
  const isOutForDelivery = isDelivered || currentStatus.includes("OUT");
  const isInTransit = isOutForDelivery || currentStatus.includes("TRANSIT") || currentStatus.includes("PICKED");
  const isPickedUp = isInTransit || currentStatus.includes("SCHEDULED");

  const milestones = [
    { label: "Order Confirmed", desc: "Crafting & Quality Check", done: true },
    { label: "Packed & Picked Up", desc: "Varanasi Workshop Hub", done: isPickedUp },
    { label: "In Transit", desc: "Logistics Hubs to City", done: isInTransit },
    { label: "Out For Delivery", desc: "With Delivery Executive", done: isOutForDelivery },
    { label: "Delivered", desc: "Safely Handed Over", done: isDelivered },
  ];

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Truck className="h-3.5 w-3.5" /> Maa Laxmi Live Logistics Network
        </span>
        <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
          Track Your Saree Delivery
        </h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Enter your Order Number, Courier AWB Code, or registered 10-digit Phone Number to view real-time shipping milestones.
        </p>

        {/* Search Bar Form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto flex gap-2 pt-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. VRH-20261113-9041 or DLV109482 or 9461500924"
              className="w-full pl-12 pr-4 h-13 rounded-2xl border border-border bg-card text-foreground shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="h-13 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2 text-sm flex-shrink-0"
          >
            {isLoading ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Searching...</span>
              </>
            ) : (
              <>
                <span>Track Order</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Sample chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-muted-foreground">
          <span>Quick Lookup Examples:</span>
          <button
            type="button"
            onClick={() => {
              setQuery("VRH-20260908-1042");
              performSearch("VRH-20260908-1042");
            }}
            className="underline hover:text-foreground font-mono"
          >
            VRH-20260908-1042
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setQuery("9461500924");
              performSearch("9461500924");
            }}
            className="underline hover:text-foreground font-mono"
          >
            9461500924
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Unable to locate shipment</p>
            <p className="text-xs opacity-90">{error}</p>
            <p className="text-xs pt-1">
              Need assistance? WhatsApp our Varanasi dispatch desk directly at{" "}
              <a
                href="https://wa.me/919461500924?text=Hello%20Maa%20Laxmi%2C%20I%20need%20help%20tracking%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold"
              >
                +91 94615 00924
              </a>
              .
            </p>
          </div>
        </div>
      )}

      {/* Tracking Result View */}
      {data && data.order && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Order Summary Card */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Verified Consignment
                </span>
                <h2 className="text-2xl font-bold font-playfair text-foreground mt-0.5">
                  Order #{data.order.orderNumber}
                </h2>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Booked on{" "}
                  {new Date(data.order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="text-right">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  {data.order.shipping?.status || data.order.status}
                </span>
                <p className="text-sm font-bold text-foreground mt-2">
                  Total: {formatPrice(data.order.total)}
                </p>
              </div>
            </div>

            {/* Visual Milestone Stepper */}
            <div className="py-2">
              <div className="relative">
                {/* Connecting track line */}
                <div className="absolute top-5 left-4 right-4 h-1 bg-muted -z-0 hidden md:block" />
                <div
                  className="absolute top-5 left-4 h-1 bg-primary transition-all duration-500 -z-0 hidden md:block"
                  style={{
                    width: isDelivered
                      ? "100%"
                      : isOutForDelivery
                      ? "75%"
                      : isInTransit
                      ? "50%"
                      : isPickedUp
                      ? "25%"
                      : "0%",
                  }}
                />

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                  {milestones.map((m, idx) => (
                    <div
                      key={m.label}
                      className={`flex md:flex-col items-center md:items-center gap-3 md:text-center p-3 md:p-0 rounded-xl transition-all ${
                        m.done ? "text-foreground" : "text-muted-foreground/60"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-all ${
                          m.done
                            ? "bg-primary text-primary-foreground shadow-md ring-4 ring-primary/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {m.done ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                      </div>
                      <div>
                        <p className="text-xs font-bold">{m.label}</p>
                        <p className="text-[11px] text-muted-foreground hidden md:block mt-0.5">
                          {m.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Courier & Delivery Meta Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-muted/30 border border-border">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Courier Partner
                </p>
                <p className="text-sm font-bold text-foreground mt-1 flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-primary" />
                  <span>{data.order.shipping?.courierName || "Delhivery Direct"}</span>
                </p>
                {data.order.shipping?.awbCode && (
                  <a
                    href={
                      data.order.shipping.courierName?.toLowerCase().includes("delhivery")
                        ? `https://www.delhivery.com/track/package/${data.order.shipping.awbCode}`
                        : data.order.shipping.trackingUrl || `https://shiprocket.co/tracking/${data.order.shipping.awbCode}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline mt-1"
                  >
                    <span>Check on Official Portal</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  AWB Tracking Number
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-sm font-bold text-foreground">
                    {data.order.shipping?.awbCode || "VRH102948201IN"}
                  </span>
                  {data.order.shipping?.awbCode && (
                    <button
                      onClick={() => copyAwb(data.order.shipping.awbCode)}
                      className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy AWB"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Estimated Delivery
                </p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>
                    {data.order.shipping?.estimatedDelivery
                      ? new Date(data.order.shipping.estimatedDelivery).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" }
                        )
                      : "Within 3-4 Business Days"}
                  </span>
                </p>
              </div>
            </div>

            {/* Destination Preview */}
            {data.order.destination && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-border/70 bg-card text-xs text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <div>
                  <span className="font-semibold text-foreground">
                    Delivering to {data.order.destination.fullName}:
                  </span>{" "}
                  {data.order.destination.city}, {data.order.destination.state} -{" "}
                  {data.order.destination.pincode}
                </div>
              </div>
            )}
          </div>

          {/* Detailed Scan Timeline & Package Contents */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Live Scan Timeline */}
            <div className="md:col-span-7 p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
                <Clock className="h-4 w-4 text-primary" />
                <span>Live Logistics Scan Activity</span>
              </h3>

              {data.tracking?.shipment_track_activities &&
              data.tracking.shipment_track_activities.length > 0 ? (
                <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {data.tracking.shipment_track_activities.map((act: any, i: number) => (
                    <div key={i} className="relative group">
                      <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-primary/20" />
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {act.activity}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          📍 {act.location} •{" "}
                          {new Date(act.date).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Package registered at Varanasi workshop. Initial courier pickup scan will be reflected shortly.
                </p>
              )}
            </div>

            {/* Package Contents & Support */}
            <div className="md:col-span-5 space-y-6">
              {/* Saree Items in Package */}
              <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
                  <Package className="h-4 w-4 text-primary" />
                  <span>Items in this Consignment</span>
                </h3>

                <div className="divide-y divide-border">
                  {data.order.items.map((item: any) => (
                    <div key={item.id} className="py-2.5 flex items-center gap-3 text-xs">
                      {item.image && (
                        <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-secondary border border-border flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{item.name}</p>
                        <p className="text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-foreground">{formatPrice(item.price)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct WhatsApp Support */}
              <div className="p-5 rounded-3xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                  <MessageCircle className="h-4 w-4" />
                  <span>Need Urgent Delivery Help?</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our Varanasi dispatch desk is available on WhatsApp to assist with address updates, courier coordination, or video previews.
                </p>
                <a
                  href={`https://wa.me/919461500924?text=${encodeURIComponent(
                    `Hello Maa Laxmi Sarees, I am inquiring about the delivery of Order #${data.order.orderNumber} (AWB: ${data.order.shipping?.awbCode || "Assigned"}). Could you please share the latest update?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat on WhatsApp (+91 94615 00924)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assurance Grid (Always visible for reassurance) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
        <div className="p-5 rounded-2xl bg-card border border-border text-center space-y-1.5">
          <Truck className="h-6 w-6 text-primary mx-auto" />
          <h4 className="text-xs font-bold text-foreground">Free Shipping &gt; ₹1,999</h4>
          <p className="text-[11px] text-muted-foreground">All-India express insured delivery across 27,000+ PIN codes.</p>
        </div>
        <div className="p-5 rounded-2xl bg-card border border-border text-center space-y-1.5">
          <ShieldCheck className="h-6 w-6 text-primary mx-auto" />
          <h4 className="text-xs font-bold text-foreground">Tamper-Proof Packaging</h4>
          <p className="text-[11px] text-muted-foreground">Handcrafted sarees are packed in moisture-resistant luxury boxes.</p>
        </div>
        <div className="p-5 rounded-2xl bg-card border border-border text-center space-y-1.5">
          <MessageCircle className="h-6 w-6 text-primary mx-auto" />
          <h4 className="text-xs font-bold text-foreground">WhatsApp Milestone Updates</h4>
          <p className="text-[11px] text-muted-foreground">Receive instant dispatch & out-for-delivery notifications.</p>
        </div>
      </div>
    </div>
  );
}

