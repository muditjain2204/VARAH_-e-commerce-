"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  CreditCard,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: typeof HelpCircle;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    title: "Payments & Transactions",
    icon: CreditCard,
    items: [
      {
        question: "What payment methods are supported on MAA LAXMI?",
        answer:
          "We support all major Indian payment methods through our secure Razorpay gateway: UPI (Google Pay, PhonePe, Paytm, BHIM, CRED), Credit Cards, Debit Cards (Visa, MasterCard, RuPay, Maestro), Net Banking with 50+ Indian banks, Wallets, and Cash on Delivery (COD) for eligible pin codes.",
      },
      {
        question: "Is it safe to pay online on MAA LAXMI?",
        answer:
          "Yes, completely safe. We use Razorpay, an RBI-licensed payment aggregator certified with PCI-DSS Level 1 compliance. All transactions are protected with 256-bit bank-grade SSL encryption. We never see or store your full card numbers, CVV, or banking passwords.",
      },
      {
        question: "My account was debited but the order shows pending or failed. What should I do?",
        answer:
          "Do not worry! In rare instances of network disconnection during checkout, banks automatically reverse unauthorized debits within 3 to 5 business days. If you do not see a confirmation email within 30 minutes, please send your transaction screenshot to support@maalaxmi.store with your name and phone number.",
      },
      {
        question: "Is Cash on Delivery (COD) available?",
        answer:
          "Yes, Cash on Delivery is available for most serviceable PIN codes across India. You can pay cash directly to the delivery agent upon receiving your package.",
      },
    ],
  },
  {
    title: "Orders & Shipping",
    icon: Truck,
    items: [
      {
        question: "How long does delivery take across India?",
        answer:
          "Orders are dispatched within 24 to 48 hours from our fulfillment hub in Surat. Delivery takes 3 to 5 business days for metro cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata) and 5 to 7 business days for rest of India.",
      },
      {
        question: "Do you offer Free Shipping?",
        answer:
          "Yes! We offer 100% Free Shipping across India on all orders of ₹1,999 and above. For orders below ₹1,999, a nominal flat shipping fee of ₹99 is added at checkout.",
      },
      {
        question: "How can I track my shipment?",
        answer:
          "As soon as your saree is dispatched, we send you an SMS and Email with your tracking link and AWB number. You can also track your live shipment directly in the 'My Account > Orders' section on our website.",
      },
      {
        question: "Can I change my delivery address after placing an order?",
        answer:
          "If your order has not been dispatched yet, contact us immediately via WhatsApp (+91 94615 00924) or email support@maalaxmi.store, and our team will update your shipping destination.",
      },
    ],
  },
  {
    title: "Returns, Refunds & Cancellations",
    icon: RotateCcw,
    items: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 7-day hassle-free return window from the date of parcel delivery. The saree must be unworn, unwashed, in its original fold with all brand tags and packaging intact, and any unstitched blouse piece intact.",
      },
      {
        question: "How do I initiate a return or exchange?",
        answer:
          "Simply email us at support@maalaxmi.store or WhatsApp us at +91 94615 00924 with your Order Number and photos of the saree. We will verify and arrange a doorstep reverse pickup for you.",
      },
      {
        question: "How long does it take to receive my refund?",
        answer:
          "Once the returned item is received and inspected at our warehouse (typically 24–48 hours), your refund is initiated immediately. For online prepaid orders, Razorpay credits the funds back to your original source (UPI, Card, Bank) within 5 to 7 business days. For COD orders, we transfer via direct NEFT/UPI.",
      },
      {
        question: "Can I cancel my order before it ships?",
        answer:
          "Yes! You can cancel anytime before dispatch for a 100% full instant refund. Once dispatched, you can either refuse delivery or initiate a return after receiving the parcel.",
      },
    ],
  },
  {
    title: "Saree Fabric, Care & Authenticity",
    icon: Sparkles,
    items: [
      {
        question: "Are your Banarasi and Silk sarees authentic?",
        answer:
          "Yes, absolutely. We source our sarees directly from certified weaver clusters and traditional handlooms across Varanasi, Kanchipuram, Chanderi, and Bengal. Every saree undergoes a 3-step hand inspection for fabric purity, weave consistency, and zari finish.",
      },
      {
        question: "Do the sarees come with a matching blouse piece?",
        answer:
          "Yes, most of our sarees (unless specifically marked otherwise) include an unstitched 0.8-meter matching running blouse fabric attached at the inner end of the saree, ready for custom tailoring.",
      },
      {
        question: "How should I wash and care for my pure silk sarees?",
        answer:
          "We strongly recommend Dry Clean Only for all pure silk, zari, Banarasi, and Kanjeevaram sarees to maintain their color vibrancy and metallic luster. Always store your silk sarees in a soft cotton bag or muslin cloth in a dry place.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "0-0": true, // First FAQ open by default
  });

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-transparent border-b border-border/60 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="h-3.5 w-3.5" />
            Knowledge Base
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Everything you need to know about payments, shipping, orders, authenticity, and returns at MAA LAXMI.
          </p>
        </div>
      </section>

      {/* Main FAQ list */}
      <section className="container mx-auto max-w-4xl px-4 py-12 space-y-12">
        {FAQ_DATA.map((category, catIdx) => {
          const Icon = category.icon;
          return (
            <div key={category.title} className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
                  {category.title}
                </h2>
              </div>

              <div className="space-y-3">
                {category.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = Boolean(openItems[key]);

                  return (
                    <div
                      key={item.question}
                      className="rounded-2xl border border-border bg-card overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => toggleItem(catIdx, itemIdx)}
                        className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-secondary/40 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span className="font-semibold text-sm sm:text-base text-foreground">
                          {item.question}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-primary" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Still have questions card */}
        <div className="bg-secondary/80 border border-border rounded-3xl p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h3 className="font-playfair text-2xl font-bold text-foreground">
            Still Have Questions?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Can&apos;t find the answer you&apos;re looking for? Please contact our friendly customer support team.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-colors shadow-xs"
            >
              Get in Touch with Care
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
