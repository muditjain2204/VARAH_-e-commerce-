import { Metadata } from "next";
import Link from "next/link";
import { Lock, ShieldCheck, Eye, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | MAA LAXMI Sarees",
  description:
    "Learn how MAA LAXMI collects, protects, and handles your personal information, payment security via Razorpay, and data privacy rights.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 30, 2026";

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-transparent border-b border-border/60 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Lock className="h-3.5 w-3.5" />
            Data Protection & Security
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Privacy Policy
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
              1. Overview & Commitment
            </h2>
            <p>
              At <strong>MAA LAXMI</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to safeguarding the privacy and security of our customers and visitors. This Privacy Policy describes how we collect, use, store, process, and protect your personal information when you visit or make a purchase from our website (maalaxmi.store).
            </p>
            <p>
              By accessing our store, creating an account, or placing an order, you agree to the collection and use of information in accordance with this policy and Indian data protection regulations (including the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000).
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              2. Information We Collect
            </h2>
            <p>We collect information to provide seamless order fulfillment and shopping experiences:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>
                <strong>Customer Profile Information:</strong> Name, email address, telephone/mobile number, billing and shipping address (including pin code and landmark).
              </li>
              <li>
                <strong>Account Credentials:</strong> Securely authenticated via Clerk (we do not store raw passwords in plain text).
              </li>
              <li>
                <strong>Order & Transaction Records:</strong> Sarees purchased, order values, discount coupon codes used, delivery status, and order identifiers.
              </li>
              <li>
                <strong>Device & Browser Data:</strong> IP address, browser type, operating system, and interaction timestamps collected automatically via standard server logs and cookies.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 bg-secondary/50 p-6 rounded-2xl border border-border">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <h2 className="font-playfair text-lg sm:text-xl font-bold">
                3. Payment Information Security (Razorpay)
              </h2>
            </div>
            <p>
              We treat your payment security with the highest standards of industry compliance:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>
                <strong>Zero Storage of Sensitive Card Credentials:</strong> MAA LAXMI <strong>never</strong> collects, sees, or stores your credit/debit card numbers, CVV, OTPs, or Net Banking credentials on our servers.
              </li>
              <li>
                <strong>Authorized Payment Aggregator:</strong> All payment transactions are securely routed through <strong>Razorpay</strong>, an RBI-licensed payment gateway certified under <strong>PCI-DSS Level 1</strong> (the highest global security certification for payment processing).
              </li>
              <li>
                <strong>End-to-End Encryption:</strong> All transactions are transmitted through bank-grade 256-bit Secure Socket Layer (SSL) encryption.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              4. How We Use Your Information
            </h2>
            <p>We use your information solely for legitimate business operations:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Processing your saree orders, invoices, and payment authorizations.</li>
              <li>Handing over shipping parcels and tracking milestones to logistics carriers (Shiprocket, Bluedart, Delhivery).</li>
              <li>Sending transactional notifications (SMS/Email updates on order confirmation, dispatch, and delivery).</li>
              <li>Assisting with customer support inquiries, returns, or refunds.</li>
              <li>Detecting and preventing fraudulent transactions or unauthorized website access.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              5. Third-Party Service Providers
            </h2>
            <p>
              We share minimal necessary data with trusted third-party providers solely to operate our e-commerce platform:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li><strong>Razorpay:</strong> To process payments, verify transaction signatures, and manage refunds.</li>
              <li><strong>Shiprocket & Couriers:</strong> Name, phone number, and physical shipping address to execute doorstep delivery.</li>
              <li><strong>Clerk Authentication:</strong> Secure user authentication and session management.</li>
              <li><strong>Cloudinary:</strong> High-speed content delivery for saree catalog imagery.</li>
            </ul>
            <p className="mt-2 text-foreground font-medium">
              We do not sell, rent, or trade your personal information to third parties for independent marketing.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              6. Cookies & Tracking
            </h2>
            <p>
              Our website uses essential cookies to remember items in your shopping bag, maintain active user sessions, and optimize web performance. You may modify your browser settings to decline cookies, although doing so may impair cart checkout functionality.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-2">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              7. Your Rights & Data Retention
            </h2>
            <p>
              You have the right to access, review, update, or request deletion of your personal account information at any time by logging into your account dashboard or contacting our support team at{" "}
              <a href="mailto:support@maalaxmi.store" className="text-primary underline">support@maalaxmi.store</a>.
            </p>
            <p>
              We retain transaction records only for as long as necessary to comply with statutory legal, tax, and auditing obligations under Indian laws.
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-2 pt-4 border-t border-border">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
              8. Grievance Officer
            </h2>
            <p>
              If you have any questions, feedback, or complaints regarding data privacy, you may write to our appointed Grievance Officer:
            </p>
            <div className="bg-secondary/60 p-4 rounded-xl space-y-1 text-xs text-foreground">
              <p><strong>Name:</strong> Privacy & Compliance Desk</p>
              <p><strong>Company:</strong> MAA LAXMI Sarees & Handlooms</p>
              <p><strong>Address:</strong> Radha Krishna Textile Market, Ring Road, Surat, Gujarat — 395002, India</p>
              <p><strong>Email:</strong> privacy@maalaxmi.store / support@maalaxmi.store</p>
              <p><strong>Phone:</strong> +91 98765 43210</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
