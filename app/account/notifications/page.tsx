"use client";

import { useState } from "react";
import { Bell, Package, Sparkles, Check, CheckCheck, Truck, Clock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "ORDER" | "DISCOUNT" | "SYSTEM";
  read: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    title: "Order Placed Successfully",
    message: "Your Cash on Delivery order has been confirmed. Our artisans in Varanasi are hand-inspecting your saree.",
    time: "Recently",
    type: "ORDER",
    read: false,
    link: "/account/orders",
  },
  {
    id: "notif_2",
    title: "Festive Silk Arrivals Live!",
    message: "New Kanjivaram and Organza silk sarees have arrived for wedding celebrations. Check out our curated catalog.",
    time: "2 hours ago",
    type: "DISCOUNT",
    read: false,
    link: "/products",
  },
  {
    id: "notif_3",
    title: "Free Express Shipping Across India",
    message: "Enjoy guaranteed free delivery across all 28 Indian States & UTs with real-time tracking.",
    time: "Yesterday",
    type: "SYSTEM",
    read: true,
    link: "/shipping-policy",
  },
];

export default function AccountNotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
            Notifications & Updates
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            Stay updated with your saree orders, courier dispatches, and festive announcements.
          </p>
        </div>
        <button
          type="button"
          onClick={handleMarkAllRead}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5"
        >
          <CheckCheck className="h-4 w-4" />
          <span>Mark all as read</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border transition-all ${
              n.read
                ? "border-border bg-card/60 opacity-80"
                : "border-primary/30 bg-card shadow-xs"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <span
                className={`p-2.5 rounded-xl flex-shrink-0 ${
                  n.type === "ORDER"
                    ? "bg-blue-500/10 text-blue-600"
                    : n.type === "DISCOUNT"
                    ? "bg-amber-500/10 text-amber-600"
                    : "bg-emerald-500/10 text-emerald-600"
                }`}
              >
                {n.type === "ORDER" ? (
                  <Package className="h-4 w-4" />
                ) : n.type === "DISCOUNT" ? (
                  <Sparkles className="h-4 w-4" />
                ) : (
                  <Bell className="h-4 w-4" />
                )}
              </span>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <span>{n.title}</span>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </h3>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {n.time}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {n.message}
                </p>

                {n.link && (
                  <div className="pt-1.5">
                    <Link
                      href={n.link}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      View details →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
