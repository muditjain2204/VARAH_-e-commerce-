import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { getOrderById } from "@/lib/services/order.service";
import { formatPrice } from "@/lib/utils";

interface OrderConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  // Fallback for simulation / mock order
  const displayOrderNumber = order?.orderNumber || `VRH-${id.slice(0, 10).toUpperCase()}`;
  const displayTotal = order ? Number(order.total) : 2499;
  const displaySubtotal = order ? Number(order.subtotal) : 2499;
  const displayShipping = order ? Number(order.shippingCharge) : 0;
  const displayDiscount = order ? Number(order.discount) : 0;

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
      {/* Success Badge */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 animate-in zoom-in">
          <CheckCircle2 className="w-12 h-12 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Order Placed & Confirmed
          </span>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
            Thank You for Your Order!
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Your handcrafted saree order has been received. Our weavers and artisans are
            preparing it with utmost care.
          </p>
        </div>

        {/* Order Details Highlight */}
        <div className="p-4 rounded-2xl border border-border bg-card shadow-sm inline-flex flex-wrap items-center justify-center gap-6 text-xs text-foreground">
          <div>
            <span className="text-muted-foreground block text-[11px]">Order Number</span>
            <strong className="text-sm text-primary font-mono">{displayOrderNumber}</strong>
          </div>
          <div className="hidden sm:block w-px h-8 bg-border" />
          <div>
            <span className="text-muted-foreground block text-[11px]">Delivery Timeline</span>
            <strong className="text-sm font-semibold flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-primary" /> 3-5 Business Days
            </strong>
          </div>
          <div className="hidden sm:block w-px h-8 bg-border" />
          <div>
            <span className="text-muted-foreground block text-[11px]">Total Paid</span>
            <strong className="text-sm font-bold text-foreground">{formatPrice(displayTotal)}</strong>
          </div>
        </div>
      </div>

      {/* Order Summary & Details */}
      <div className="mt-10 space-y-6">
        {/* Ordered Items */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <h2 className="font-semibold text-base text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Package className="h-4 w-4 text-primary" />
            <span>Ordered Items</span>
          </h2>

          {order && order.items.length > 0 ? (
            <div className="divide-y divide-border">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {order.items.map((item: any) => (
                <div key={item.id} className="py-3 flex items-center gap-4">
                  <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-secondary flex-shrink-0 border border-border">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground truncate">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {formatPrice(Number(item.total))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Items confirmed and reserved.</p>
          )}

          {/* Pricing breakdown */}
          <div className="pt-3 border-t border-border space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground font-medium">{formatPrice(displaySubtotal)}</span>
            </div>
            {displayDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon Discount</span>
                <span>-{formatPrice(displayDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{displayShipping === 0 ? "FREE" : formatPrice(displayShipping)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border">
              <span>Grand Total</span>
              <span className="text-primary text-base">{formatPrice(displayTotal)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order?.address && (
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
            <h2 className="font-semibold text-base text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Truck className="h-4 w-4 text-primary" />
              <span>Shipping Address</span>
            </h2>
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground text-sm">{order.address.fullName}</p>
              <p>{order.address.addressLine1}</p>
              {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
              <p>
                {order.address.city}, {order.address.state} - {order.address.pincode}
              </p>
              <p className="pt-1 text-foreground">Phone: +91 {order.address.phone}</p>
            </div>
          </div>
        )}

        {/* Next Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            href="/account/orders"
            className="flex-1 h-12 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-colors shadow-sm"
          >
            <span>View All Orders</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/products"
            className="flex-1 h-12 flex items-center justify-center gap-2 border border-border hover:bg-accent text-foreground font-semibold rounded-xl transition-colors"
          >
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
