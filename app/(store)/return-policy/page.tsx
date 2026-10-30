import { Metadata } from "next";
import Link from "next/link";
import { RotateCcw, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Return & Refund Policy | MAA LAXMI Sarees",
  description:
    "Learn about our 7-day hassle-free return window, easy exchange process, cancellation policy, and quick refunds via Razorpay at MAA LAXMI.",
};

export default function ReturnPolicyPage() {
  const lastUpdated = "October 30, 2026";

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-transparent border-b border-border/60 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <RotateCcw className="h-3.5 w-3.5" />
            7-Day Easy Returns & Refunds
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Return, Refund & Cancellation Policy
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto max-w-4xl px-4 py-12">
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 text-sm leading-relaxed text-muted-foreground">
          {/* Section 1 */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              1. Customer Satisfaction Promise
            </h2>
            <p>
              At <strong>MAA LAXMI</strong>, we take immense pride in the authenticity and weaving quality of our sarees. We want you to be completely delighted with your purchase. If for any reason you are not satisfied with your order, we offer a straightforward <strong>7-Day Return and Replacement Policy</strong> from the date of parcel delivery.
            </p>
          </div>

          {/* Section 2: Eligibility */}
          <div className="space-y-3">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              2. Eligibility Criteria for Returns & Exchanges
            </h2>
            <p>To be eligible for a return or replacement, the item must meet the following criteria:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-secondary/70 border border-border space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Items Eligible for Return</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-5">
                  <li>Unworn, unwashed, and unpleated sarees.</li>
                  <li>Original brand tags, folding, and packaging intact.</li>
                  <li>Attached running blouse piece is unstitched and uncut.</li>
                  <li>Request initiated within 7 calendar days of delivery.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-destructive text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Non-Returnable Items</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-5">
                  <li>Sarees with stitched, cut, or tailored blouse pieces.</li>
                  <li>Sarees with fall/pico customized upon customer request.</li>
                  <li>Items damaged due to perfume sprays, makeup, or misuse.</li>
                  <li>Products returned without original tags and outer packaging.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Step-by-Step Return Process */}
          <div className="space-y-3">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              3. How to Initiate a Return or Exchange
            </h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Submit Request:</strong> Email us at{" "}
                <a href="mailto:support@maalaxmi.store" className="text-primary underline font-medium">support@maalaxmi.store</a>{" "}
                or message our WhatsApp care desk at <strong>+91 98765 43210</strong> with your <strong>Order Number (e.g. VRH-XXXXXXXX-XXXX)</strong>, product photos, and reason for return.
              </li>
              <li>
                <strong>Pickup Scheduling:</strong> Once verified (typically within 24 hours), our courier partner will arrange a doorstep reverse pickup from your original delivery address.
              </li>
              <li>
                <strong>Quality Inspection:</strong> When the returned saree reaches our fulfillment warehouse in Surat, our team verifies that tags, folding, and fabric condition comply with our policy.
              </li>
              <li>
                <strong>Refund / Exchange Issued:</strong> Upon quality clearance, your refund or replacement saree is dispatched immediately.
              </li>
            </ol>
          </div>

          {/* Section 4: Refund Process & Timelines (Razorpay) */}
          <div className="space-y-3 bg-secondary/50 p-6 rounded-2xl border border-border">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              4. Refund Timelines & Settlement
            </h2>
            <p>
              All refunds are handled through secure authorized banking channels:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
              <li>
                <strong>Prepaid Online Orders (UPI, Cards, Net Banking):</strong> Refunds are processed directly back to the original source of payment via <strong>Razorpay</strong>. The amount typically reflects in your bank account / card statement within <strong>5 to 7 business days</strong> depending on your issuing bank.
              </li>
              <li>
                <strong>Cash on Delivery (COD) Orders:</strong> Our customer support desk will request your verified Bank Account details (Account Number & IFSC Code) or UPI ID. The refund will be credited via direct NEFT/IMPS transfer within <strong>3 to 5 business days</strong> of product verification.
              </li>
              <li>
                <strong>Store Credit Option:</strong> Customers may also opt for instant Store Credit coupon with 1-year validity for faster re-ordering.
              </li>
            </ul>
          </div>

          {/* Section 5: Order Cancellation */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              5. Order Cancellation Policy
            </h2>
            <p>
              You can cancel your order free of charge at any time <strong>before the parcel is dispatched</strong> from our facility.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>
                To cancel an order before dispatch, visit your{" "}
                <Link href="/account/orders" className="text-primary underline">Account Orders</Link>{" "}
                section or contact us via WhatsApp / Email immediately.
              </li>
              <li>
                For prepaid cancellations made prior to dispatch, a <strong>100% full refund</strong> will be initiated automatically to your source account within 24 hours.
              </li>
              <li>
                If the order has already been handed over to the courier, cancellation is not possible; you may simply refuse the package at delivery or initiate a return upon receipt.
              </li>
            </ul>
          </div>

          {/* Section 6: Defective / Damaged items */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              6. Damaged, Defective, or Wrong Product Received
            </h2>
            <p>
              In the rare event that you receive a saree with a manufacturing defect, physical damage during transit, or a wrong item, please notify us within <strong>48 hours of delivery</strong> along with unboxing photos or video.
            </p>
            <p>
              We will arrange a priority free reverse pickup and offer you the choice of a <strong>free replacement or a 100% immediate refund</strong> without any deduction.
            </p>
          </div>

          {/* Help box */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground text-sm">Need help with an ongoing return?</h3>
              <p className="text-xs text-muted-foreground">Our support representatives are active Mon–Sat, 10 AM to 7:30 PM IST.</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              Contact Support
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
