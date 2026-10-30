import { Metadata } from "next";
import Link from "next/link";
import { Truck, Clock, ShieldCheck, MapPin, PackageCheck, AlertCircle } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD, DEFAULT_SHIPPING_CHARGE } from "@/constants";

export const metadata: Metadata = {
  title: "Shipping Policy | MAA LAXMI Sarees",
  description:
    "Learn about our pan-India delivery timelines, free shipping thresholds, courier partners, and tracking procedures for MAA LAXMI saree orders.",
};

export default function ShippingPolicyPage() {
  const lastUpdated = "October 30, 2026";

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-transparent border-b border-border/60 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Truck className="h-3.5 w-3.5" />
            Pan-India Safe Delivery
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Shipping & Delivery Policy
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto max-w-4xl px-4 py-12">
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 text-sm leading-relaxed text-muted-foreground">
          {/* Section 1: Overview */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              1. Shipping Coverage & Partner Network
            </h2>
            <p>
              At <strong>MAA LAXMI</strong>, we understand that sarees are cherished garments often ordered for special celebrations, weddings, and festivals. We are committed to delivering every parcel with extreme care, tamper-proof packaging, and timely dispatch.
            </p>
            <p>
              We deliver to over <strong>26,000+ PIN codes across India</strong> covering all States and Union Territories. We partner with India&apos;s leading logistics networks via Shiprocket, including <strong>BlueDart, Delhivery, DTDC, Xpressbees</strong>, and <strong>India Post</strong>.
            </p>
          </div>

          {/* Section 2: Shipping Charges */}
          <div className="space-y-4">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              2. Shipping Charges
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-secondary/70 border border-border space-y-1.5">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Orders ₹{FREE_SHIPPING_THRESHOLD} & Above
                </span>
                <div className="text-2xl font-bold text-foreground">FREE SHIPPING</div>
                <p className="text-xs text-muted-foreground">
                  Enjoy zero delivery fees on all prepaid and COD orders totaling ₹{FREE_SHIPPING_THRESHOLD} or more anywhere in India.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-secondary/70 border border-border space-y-1.5">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Orders Below ₹{FREE_SHIPPING_THRESHOLD}
                </span>
                <div className="text-2xl font-bold text-foreground">₹{DEFAULT_SHIPPING_CHARGE} Flat Fee</div>
                <p className="text-xs text-muted-foreground">
                  A nominal flat fee of ₹{DEFAULT_SHIPPING_CHARGE} is applied at checkout to cover premium protective packaging and standard shipping.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Timelines */}
          <div className="space-y-4">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              3. Dispatch & Delivery Timelines
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Dispatch Timeline: 24 to 48 Hours</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Orders are processed and dispatched from our primary fulfillment center in Surat within 1–2 business days (excluding Sundays and national holidays).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Delivery Timelines: 3 to 7 Business Days</h3>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc pl-4">
                    <li><strong>Metro Cities (Delhi NCR, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad, Ahmedabad):</strong> 3 to 5 business days.</li>
                    <li><strong>Tier 2 & Tier 3 Cities:</strong> 4 to 6 business days.</li>
                    <li><strong>North-East, J&amp;K, and Remote Locations:</strong> 6 to 9 business days.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Packaging */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              4. Safe & Tamper-Evident Packaging
            </h2>
            <p>
              Each saree is folded with protective tissue paper, placed inside a sealed weather-proof polybag, and packaged in a rigid outer courier box or secure flyer. This protects the delicate zari, borders, and silk yarns from external moisture, dust, or handling during transit.
            </p>
          </div>

          {/* Section 5: Order Tracking */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              5. Order Tracking
            </h2>
            <p>
              Once your parcel is handed over to the courier partner, you will receive an automatic confirmation via <strong>SMS and Email</strong> containing your Air Waybill (AWB) number and a direct tracking link.
            </p>
            <p>
              You can also track your shipment live at any time by logging into your{" "}
              <Link href="/account/orders" className="text-primary underline font-medium">My Orders Dashboard</Link>.
            </p>
          </div>

          {/* Section 6: Important Guidelines */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-foreground space-y-2">
            <div className="flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>Inspection Upon Delivery</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If the outer courier parcel appears noticeably damaged, torn, or tampered with at the time of delivery, please <strong>refuse to accept the package</strong> and take a clear photograph. Notify our support desk immediately at <a href="mailto:support@maalaxmi.store" className="text-primary underline">support@maalaxmi.store</a> or call <span className="font-semibold">+91 98765 43210</span> with your Order Number so we can dispatch a replacement promptly.
            </p>
          </div>

          {/* Section 7: Address Accuracy */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              6. Address Accuracy & Failed Deliveries
            </h2>
            <p>
              Please ensure your complete delivery address, contact phone number, and 6-digit PIN code are accurate. Our courier partners will attempt delivery up to <strong>3 times</strong>. If the recipient is unavailable or unreachable across all attempts, the parcel will be returned to our warehouse (RTO).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
