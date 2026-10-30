"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AdminOrderDetailItem,
  updateOrderStatusAction,
} from "@/actions/admin-order.actions";
import { createShipmentAction } from "@/actions/shipping.actions";
import { formatPrice } from "@/lib/utils";
import {
  Truck,
  Package,
  Printer,
  ArrowLeft,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  RotateCw,
} from "lucide-react";
import { OrderStatus, ShippingStatus } from "@prisma/client";
import { toast } from "sonner";

interface OrderDetailViewProps {
  initialOrder: AdminOrderDetailItem;
}

export function OrderDetailView({ initialOrder }: OrderDetailViewProps) {
  const [order, setOrder] = useState<AdminOrderDetailItem>(initialOrder);
  const [isShipping, setIsShipping] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleShipOrder = async () => {
    setIsShipping(true);
    try {
      const res = await createShipmentAction(order.id);
      if (res.success && res.data) {
        toast.success("Shipment Created via Shiprocket!", {
          description: `AWB: ${res.data.awbCode} assigned to ${res.data.courierName}`,
        });
        setOrder((prev) => ({
          ...prev,
          status: OrderStatus.SHIPPED,
          shipping: {
            id: res.data!.shippingId,
            awbCode: res.data!.awbCode,
            courierName: res.data!.courierName,
            status: res.data!.status,
            labelUrl: res.data!.labelUrl,
            trackingUrl: res.data!.trackingUrl,
            estimatedDelivery: res.data!.estimatedDelivery,
          },
        }));
      } else {
        toast.error(res.error || "Failed to create shipment");
      }
    } catch {
      toast.error("Error communicating with Shiprocket");
    } finally {
      setIsShipping(false);
    }
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await updateOrderStatusAction(order.id, newStatus);
      if (res.success) {
        setOrder((prev) => ({ ...prev, status: newStatus }));
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Error updating status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back and Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Orders</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold font-playfair text-foreground">
              Order {order.orderNumber}
            </h1>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
              {order.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
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

        {/* Fulfillment Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Selector */}
          <select
            value={order.status}
            disabled={isUpdatingStatus}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          {/* Shiprocket Ship Button */}
          {!order.shipping?.awbCode ? (
            <button
              onClick={handleShipOrder}
              disabled={isShipping}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <Truck className="h-4 w-4" />
              <span>{isShipping ? "Creating AWB..." : "Ship via Shiprocket"}</span>
            </button>
          ) : (
            <a
              href={order.shipping.labelUrl || `/api/shipping/label?order=${order.orderNumber}&awb=${order.shipping.awbCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-xs font-bold rounded-xl hover:opacity-90 transition-all shadow-md active:scale-95"
            >
              <Printer className="h-4 w-4" />
              <span>Print Shipping Label</span>
            </a>
          )}
        </div>
      </div>

      {/* Shipment Status Banner */}
      {order.shipping?.awbCode && (
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-600 flex items-center justify-center">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">
                Dispatched via {order.shipping.courierName || "Delhivery Surface"}
              </p>
              <p className="text-xs font-mono font-bold text-foreground mt-0.5">
                AWB Code: {order.shipping.awbCode}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://shiprocket.co/tracking/${order.shipping.awbCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>Track with Courier</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}

      {/* Order Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Items List */}
        <div className="md:col-span-8 p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <h2 className="font-semibold text-base text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Package className="h-4 w-4 text-primary" />
            <span>Ordered Items ({order.items.length})</span>
          </h2>

          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4 items-center">
                <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs">🪷</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground">{item.name}</h3>
                  <p className="font-mono text-xs text-muted-foreground mt-0.5">
                    SKU: {item.sku}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quantity: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>

                <div className="text-sm font-bold text-foreground">
                  {formatPrice(item.total)}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="pt-4 border-t border-border space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping Charge</span>
              <span>{order.shippingCharge === 0 ? "FREE" : formatPrice(order.shippingCharge)}</span>
            </div>
            <div className="flex justify-between items-baseline text-sm font-bold text-foreground pt-2 border-t border-border">
              <span>Total Order Value</span>
              <span className="text-primary text-base">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Customer & Delivery Sidebar */}
        <div className="md:col-span-4 space-y-6">
          {/* Shipping Address */}
          {order.address && (
            <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>Customer Shipping Address</span>
              </h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-bold text-foreground text-sm">{order.address.fullName}</p>
                <p>{order.address.addressLine1}</p>
                {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                <p>
                  {order.address.city}, {order.address.state} - {order.address.pincode}
                </p>
                <p className="font-mono text-foreground pt-1">Phone: +91 {order.address.phone}</p>
                <p className="text-muted-foreground">Email: {order.customerEmail}</p>
              </div>
            </div>
          )}

          {/* Payment Details */}
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              <span>Payment Details</span>
            </h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-semibold text-foreground">{order.payment?.method || "Prepaid"}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-semibold text-emerald-600">
                  {order.payment?.status || "CONFIRMED"}
                </span>
              </div>
              {order.payment?.razorpayPaymentId && (
                <div className="flex justify-between pt-1 border-t border-border/50 font-mono text-[10px]">
                  <span>Gateway Ref:</span>
                  <span className="text-foreground">{order.payment.razorpayPaymentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
