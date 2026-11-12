import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Scale, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions | MAA LAXMI Sarees",
  description:
    "Read the Terms of Service and Conditions governing the use of MAA LAXMI website, purchasing of sarees, payment terms, and user agreements.",
};

export default function TermsPage() {
  const lastUpdated = "October 30, 2026";

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-transparent border-b border-border/60 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Scale className="h-3.5 w-3.5" />
            Legal Agreement
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Terms of Service & Conditions
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
              1. Introduction & Acceptance of Terms
            </h2>
            <p>
              Welcome to <strong>MAA LAXMI</strong> (&quot;we,&quot; &quot;us,&quot; &quot;our,&quot; or the &quot;Store&quot;), accessible via our website at maalaxmi.store. By accessing, browsing, or purchasing from our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions (&quot;Terms&quot;), along with our{" "}
              <Link href="/privacy-policy" className="text-primary underline">Privacy Policy</Link>,{" "}
              <Link href="/shipping-policy" className="text-primary underline">Shipping Policy</Link>, and{" "}
              <Link href="/return-policy" className="text-primary underline">Return & Refund Policy</Link>.
            </p>
            <p>
              If you do not agree with any part of these Terms, you must discontinue the use of our services immediately.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              2. User Eligibility
            </h2>
            <p>
              Use of the website is available only to persons who can form legally binding contracts under the <strong>Indian Contract Act, 1872</strong>. Persons who are &quot;incompetent to contract&quot; within the meaning of the Indian Contract Act, including un-discharged insolvents or minors below 18 years of age, are not eligible to use the website without parental or legal guardian supervision.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              3. Handcrafted Saree Characteristics & Disclaimers
            </h2>
            <p>
              MAA LAXMI specializes in traditional handloom, powerloom, and artisanal Indian sarees (including Banarasi, Kanjeevaram, Chanderi, Silk, Georgette, and Cotton sarees).
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>
                <strong>Handcrafted Nuances:</strong> Handwoven textiles may have minor irregular weaves, natural fiber slubs, or minute variations in zari brocade. These are not manufacturing defects but the hallmark of authentic handloom craftsmanship.
              </li>
              <li>
                <strong>Color Variations:</strong> While we endeavor to display product colors as accurately as possible, actual shades may vary slightly due to device screen calibrations and photography lighting.
              </li>
              <li>
                <strong>Fabric Care:</strong> Sarees containing pure silk, real zari, or delicate embroidery should strictly be dry-cleaned only.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              4. Pricing, Orders & Invoicing
            </h2>
            <p>
              All prices displayed on MAA LAXMI are in <strong>Indian Rupees (INR / ₹)</strong> and are inclusive of applicable Goods and Services Tax (GST) unless explicitly stated otherwise.
            </p>
            <p>
              We reserve the right to modify prices without prior notice. Placement of an order represents an offer to purchase, which is subject to acceptance and product availability. In the rare event that an item is out of stock or incorrectly priced due to a typographical error, we reserve the right to cancel the order and provide a 100% refund.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              5. Payment Terms & Security
            </h2>
            <p>
              We provide secure online payment processing powered by <strong>Razorpay Software Private Limited</strong> (&quot;Razorpay&quot;), an RBI-authorized payment aggregator.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>
                <strong>Accepted Methods:</strong> Unified Payments Interface (UPI via Google Pay, PhonePe, Paytm, BHIM, CRED), Credit Cards, Debit Cards (Visa, MasterCard, RuPay, Maestro), Net Banking (50+ Indian banks), and Cash on Delivery (COD) where available.
              </li>
              <li>
                <strong>PCI-DSS Compliance:</strong> All credit card and banking details are encrypted and transmitted directly through Razorpay&apos;s 128-bit/256-bit encrypted channels. MAA LAXMI does not store your full card numbers, CVV, or banking passwords on our servers.
              </li>
              <li>
                <strong>Payment Authorization:</strong> Orders will be processed only after successful authorization from the bank or payment gateway. In case of payment debits where an order fails, the funds are automatically reversed by Razorpay/your bank within 3 to 5 business days.
              </li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              6. Shipping, Delivery & Tracking
            </h2>
            <p>
              Products are dispatched within 24 to 48 hours of order confirmation. Estimated delivery across India is 3 to 7 business days depending on location. Complete details are outlined in our{" "}
              <Link href="/shipping-policy" className="text-primary underline">Shipping Policy</Link>.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              7. Cancellation, Returns & Refunds
            </h2>
            <p>
              We offer a transparent 7-day return policy for unused, unwashed sarees with original tags intact. Please refer to our{" "}
              <Link href="/return-policy" className="text-primary underline">Return & Refund Policy</Link> for complete steps and timelines.
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              8. Intellectual Property Rights
            </h2>
            <p>
              All content on this website, including logos, trademarks, text, product imagery, design graphics, and digital code, is the property of MAA LAXMI and is protected under the Copyright Act, 1957, and Trademarks Act, 1999 of India. No part of this site may be duplicated, modified, or reproduced without written consent.
            </p>
          </div>

          {/* Section 9 */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              9. Limitation of Liability
            </h2>
            <p>
              In no event shall MAA LAXMI, its owners, partners, employees, or affiliates be liable for any indirect, incidental, punitive, or consequential damages resulting from the use or inability to use the products or website services. Our aggregate liability shall not exceed the amount actually paid by you for the product in dispute.
            </p>
          </div>

          {/* Section 10 */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              10. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of <strong>India</strong>. Any disputes arising out of or in connection with transactions on this website shall be subject to the exclusive jurisdiction of the competent courts in <strong>Surat, Gujarat, India</strong>.
            </p>
          </div>

          {/* Section 11 */}
          <div className="space-y-2 pt-4 border-t border-border">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              11. Contact & Grievance Redressal
            </h2>
            <p>
              In accordance with Information Technology Act, 2000, and rules made thereunder, for any queries or grievances regarding these terms, please contact:
            </p>
            <div className="bg-secondary/60 p-4 rounded-xl space-y-1 text-xs text-foreground">
              <p><strong>Grievance Officer:</strong> Customer Redressal Cell</p>
              <p><strong>Brand:</strong> MAA LAXMI Sarees & Handlooms</p>
              <p><strong>Address:</strong> Radha Krishna Textile Market, Ring Road, Surat, Gujarat — 395002</p>
              <p><strong>Email:</strong> support@maalaxmi.store</p>
              <p><strong>Helpline / WhatsApp:</strong> +91 94615 00924</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
