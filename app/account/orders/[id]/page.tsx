import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Package,
  Truck,
  CreditCard,
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { getOrderById } from "@/lib/services/order.service";
import { formatPrice } from "@/lib/utils";

import { RealtimeTracking } from "@/components/store/realtime-tracking";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Order Details | Varah Store" };

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    return (
      <div className="space-y-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground">Order Not Found</h1>
        <p className="text-muted-foreground text-sm">We couldn't locate order #{id}.</p>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Orders</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Orders</span>
          </Link>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
            Order {order.orderNumber}
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> Placed on{" "}
            {new Intl.DateTimeFormat("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(order.createdAt))}
          </p>
        </div>

        <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
          {order.status}
        </span>
      </div>

      {/* Real-Time Logistics Tracking Component */}
      <RealtimeTracking
        orderId={order.id}
        orderNumber={order.orderNumber}
        initialAwb={order.shipping?.awbCode}
        courierName={order.shipping?.courierName}
        initialStatus={order.shipping?.status || order.status}
        estimatedDelivery={order.shipping?.estimatedDelivery}
      />

      {/* Grid of Items + Shipping / Payment info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Items List */}
        <div className="md:col-span-8 p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <h2 className="font-semibold text-base text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Package className="h-4 w-4 text-primary" />
            <span>Items in this Order ({order.items.length})</span>
          </h2>

          <div className="divide-y divide-border">
            {order.items.map((item: any) => (
              <div key={item.id} className="py-4 flex gap-4 items-center">
                <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-secondary flex-shrink-0 border border-border">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-foreground">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quantity: {item.quantity} × {formatPrice(Number(item.price))}
                  </p>
                </div>

                <div className="text-sm font-bold text-foreground">
                  {formatPrice(Number(item.total))}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing summary */}
          <div className="pt-4 border-t border-border space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground font-medium">{formatPrice(Number(order.subtotal))}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount</span>
                <span>-{formatPrice(Number(order.discount))}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>
                {Number(order.shippingCharge) === 0 ? "FREE" : formatPrice(Number(order.shippingCharge))}
              </span>
            </div>
            <div className="flex justify-between items-baseline text-sm font-bold text-foreground pt-2 border-t border-border">
              <span>Total Paid</span>
              <span className="text-primary text-base">{formatPrice(Number(order.total))}</span>
            </div>
          </div>
        </div>

        {/* Delivery & Payment details */}
        <div className="md:col-span-4 space-y-6">
          {/* Shipping Address */}
          {order.address && (
            <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2.5">
              <h2 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>Delivery Address</span>
              </h2>
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground text-sm">{order.address.fullName}</p>
                <p>{order.address.addressLine1}</p>
                {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                <p>
                  {order.address.city}, {order.address.state} - {order.address.pincode}
                </p>
                <p className="text-foreground pt-1">Phone: +91 {order.address.phone}</p>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2.5">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              <span>Payment Info</span>
            </h2>
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">
                Method: {order.payment?.method || "Online / UPI"}
              </p>
              <p>Status: {order.payment?.status || "Confirmed"}</p>
              {order.payment?.razorpayPaymentId && (
                <p className="font-mono text-[10px] text-muted-foreground">
                  Ref: {order.payment.razorpayPaymentId}
                </p>
              )}
            </div>
          </div>

          {/* Help & Support Card */}
          <div className="p-5 rounded-2xl border border-border bg-muted/10 space-y-2 text-xs">
            <h3 className="font-semibold text-foreground flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-primary" />
              <span>Need help with this order?</span>
            </h3>
            <p className="text-muted-foreground text-[11px]">
              Reach our saree customer concierge for dispatch queries, returns, or order modifications.
            </p>
            <Link
              href="/contact"
              className="inline-block text-xs font-semibold text-primary hover:underline pt-1"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
