"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      toast.error("Please enter a message with at least 10 characters.");
      return;
    }

    setIsSubmitting(true);

    // Simulate sending message
    await new Promise((res) => setTimeout(res, 800));

    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Thank you! Your message has been sent to our customer care team.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-transparent border-b border-border/60 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-4">
          <span className="text-primary text-xs font-semibold uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
            We are here to assist you
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Contact MAA LAXMI Care
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Have questions about saree orders, customized bridal inquiries, payments, or shipping? Reach out to our dedicated support team.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details (Compliance Information) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="font-playfair text-2xl font-bold text-foreground">
                Get in Touch
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Reach us via phone, email, WhatsApp, or visit our retail store.
              </p>
            </div>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-card border border-border">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Registered & Operating Address</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    MAA LAXMI Sarees & Handlooms<br />
                    Shop No. 42-45, Upper Ground Floor,<br />
                    Radha Krishna Textile Market, Ring Road,<br />
                    Surat, Gujarat — 395002, India
                  </p>
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-card border border-border">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Phone & WhatsApp Helpline</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    +91 98765 43210 (Toll Free / Support)<br />
                    +91 98765 43211 (WhatsApp Order Queries)
                  </p>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-medium mt-2 hover:underline"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Chat with us on WhatsApp
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-card border border-border">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Customer Support Email</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    support@maalaxmi.store<br />
                    care@maalaxmi.store
                  </p>
                  <p className="text-[11px] text-muted-foreground/80 mt-1">
                    Typical response time: Within 2 to 4 business hours.
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-card border border-border">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Support Hours</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Monday to Saturday: 10:00 AM – 7:30 PM IST<br />
                    Sunday: Closed (Orders placed online operate 24x7)
                  </p>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="p-4 rounded-2xl bg-secondary/80 border border-border flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
              <p className="text-xs text-muted-foreground">
                All transactions on MAA LAXMI are secured with 256-bit SSL encryption & official Razorpay payment gateway verification.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs">
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs text-muted-foreground mb-6">
                Fill out the form below and our customer relationship team will get back to you promptly.
              </p>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-playfair text-2xl font-bold text-foreground">
                    Message Sent Successfully
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Thank you for reaching out. We have logged your inquiry and our support executive will respond to <strong>{email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setEmail("");
                      setPhone("");
                      setSubject("");
                      setMessage("");
                    }}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-secondary text-foreground text-xs font-semibold hover:bg-secondary/70 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">
                        Your Full Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        required
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">
                        Email Address <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. priya@example.com"
                        required
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Order Tracking / Custom Saree Inquiry"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Your Message <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please share details of your query..."
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-xs"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
