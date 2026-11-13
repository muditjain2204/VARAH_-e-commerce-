"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AdminOrderDetailItem,
  updateOrderStatusAction,
} from "@/actions/admin-order.actions";
import {
  createShipmentAction,
  updateShippingMilestoneAction,
} from "@/actions/shipping.actions";
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
  Copy,
  MessageCircle,
  FileText,
  Calendar,
  Layers,
  Send,
  Check,
  X,
} from "lucide-react";
import { OrderStatus, ShippingStatus } from "@prisma/client";
import { toast } from "sonner";
import { RealtimeTracking } from "@/components/store/realtime-tracking";

interface OrderDetailViewProps {
  initialOrder: AdminOrderDetailItem;
}

const COURIER_OPTIONS = [
  "Delhivery Surface",
  "Delhivery Express",
  "BlueDart Air",
  "DTDC Express",
  "India Post Speed Post",
  "Ecom Express Surface",
  "Shadowfax",
  "Shree Tirupati Courier",
  "The Professional Couriers",
];

export function OrderDetailView({ initialOrder }: OrderDetailViewProps) {
  const [order, setOrder] = useState<AdminOrderDetailItem>(initialOrder);
  const [isShipping, setIsShipping] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingMilestone, setIsUpdatingMilestone] = useState(false);

  // Fulfillment Modal State
  const [isFulfillModalOpen, setIsFulfillModalOpen] = useState(false);
  const [courierName, setCourierName] = useState(COURIER_OPTIONS[0]);
  const [awbCode, setAwbCode] = useState("");
  const [isManual, setIsManual] = useState(false);
  const [weight, setWeight] = useState(
    (0.8 * Math.max(1, order.items.length)).toFixed(1)
  );
  const [estDeliveryDays, setEstDeliveryDays] = useState(4);

  const generateRandomAwb = () => {
    const randomAwb = `VRH${Math.floor(100000000 + Math.random() * 900000000)}IN`;
    setAwbCode(randomAwb);
    toast.info(`Generated AWB: ${randomAwb}`);
  };

  const handleShipOrder = async () => {
    setIsShipping(true);
    try {
      const estDate = new Date(Date.now() + estDeliveryDays * 24 * 60 * 60 * 1000);
      const res = await createShipmentAction(order.id, {
        isManual,
        courierName,
        awbCode: awbCode.trim() || undefined,
        weight: parseFloat(weight) || 0.8,
        estimatedDelivery: estDate,
      });

      if (res.success && res.data) {
        toast.success("Order Dispatched & Shipment Created!", {
          id: "admin-shipment-created",
          description: `AWB: ${res.data.awbCode} via ${res.data.courierName}`,
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
        setIsFulfillModalOpen(false);
      } else {
        toast.error(res.error || "Failed to create shipment", {
          id: "admin-shipment-error",
        });
      }
    } catch {
      toast.error("Error communicating with shipping service", {
        id: "admin-shipment-catch",
      });
    } finally {
      setIsShipping(false);
    }
  };

  const handleMilestoneChange = async (newStatus: ShippingStatus) => {
    setIsUpdatingMilestone(true);
    try {
      const res = await updateShippingMilestoneAction(order.id, newStatus);
      if (res.success) {
        let newOrderStatus = order.status;
        if (newStatus === ShippingStatus.DELIVERED) {
          newOrderStatus = OrderStatus.DELIVERED;
        } else if (newStatus === ShippingStatus.OUT_FOR_DELIVERY) {
          newOrderStatus = OrderStatus.OUT_FOR_DELIVERY;
        } else if (newStatus === ShippingStatus.CANCELLED) {
          newOrderStatus = OrderStatus.CANCELLED;
        }

        setOrder((prev) => ({
          ...prev,
          status: newOrderStatus,
          shipping: prev.shipping
            ? { ...prev.shipping, status: newStatus }
            : null,
        }));

        toast.success(`Milestone updated to ${newStatus.replace(/_/g, " ")}`, {
          id: "milestone-update",
        });
      } else {
        toast.error(res.error || "Failed to update milestone", {
          id: "milestone-error",
        });
      }
    } catch {
      toast.error("Error updating milestone", { id: "milestone-catch" });
    } finally {
      setIsUpdatingMilestone(false);
    }
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await updateOrderStatusAction(order.id, newStatus);
      if (res.success) {
        setOrder((prev) => ({ ...prev, status: newStatus }));
        toast.success(`Order status updated to ${newStatus}`, {
          id: "status-update",
        });
      } else {
        toast.error("Failed to update status", { id: "status-error" });
      }
    } catch {
      toast.error("Error updating status", { id: "status-catch" });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const copyAwb = () => {
    if (order.shipping?.awbCode) {
      navigator.clipboard.writeText(order.shipping.awbCode);
      toast.success("AWB Number copied to clipboard!", { id: "copy-awb" });
    }
  };

  // WhatsApp notification URL
  const customerPhone = order.address?.phone?.replace(/\D/g, "") || "";
  const publicTrackingUrl = `https://maalaxmistore.vercel.app/track?order=${order.orderNumber}`;

  const whatsappDispatchMessage = encodeURIComponent(
    `Namaste ${order.address?.fullName || "ji"}! 🙏\n\nYour handcrafted saree order #${order.orderNumber} has been dispatched with utmost care from our Varanasi workshop!\n\n🚚 Courier: ${order.shipping?.courierName || "Delhivery Surface"}\n📦 AWB Tracking No: ${order.shipping?.awbCode || "Assigned"}\n📍 Live Tracking: ${publicTrackingUrl}\n\nThank you for choosing MAA LAXMI Sarees. We hope you cherish every weave!`
  );

  const whatsappDeliveryMessage = encodeURIComponent(
    `Namaste ${order.address?.fullName || "ji"}! 🙏\n\nYour MAA LAXMI handcrafted saree order #${order.orderNumber} has been marked as DELIVERED to your address!\n\nWe hope you love your saree. If you have any feedback or questions, please reply directly to this chat.\n\nWarm regards,\nMAA LAXMI Sarees, Varanasi`
  );

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
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full ${
                order.status === "DELIVERED"
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : order.status === "SHIPPED"
                  ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                  : "bg-primary/10 text-primary border border-primary/20"
              }`}
            >
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
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
          >
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          {/* Fulfillment Button */}
          {!order.shipping?.awbCode ? (
            <button
              onClick={() => setIsFulfillModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95"
            >
              <Truck className="h-4 w-4" />
              <span>Fulfill & Dispatch Order</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href={`/api/shipping/label?orderId=${order.id}&type=label`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-foreground text-background text-xs font-bold rounded-xl hover:opacity-90 transition-all shadow-sm active:scale-95"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Shipping Label</span>
              </a>
              <a
                href={`/api/shipping/label?orderId=${order.id}&type=invoice`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-secondary text-secondary-foreground border border-border text-xs font-bold rounded-xl hover:bg-accent transition-all shadow-xs active:scale-95"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Packing Slip</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Shipment Status & Milestones Control Panel (When Shipped) */}
      {order.shipping?.awbCode && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card via-card to-muted/20 border border-border shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-foreground">
                    Dispatched via {order.shipping.courierName || "Delhivery Surface"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 border border-blue-500/20">
                    {order.shipping.status || "PICKUP_SCHEDULED"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground font-medium">AWB Tracking Code:</span>
                  <span className="font-mono text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded">
                    {order.shipping.awbCode}
                  </span>
                  <button
                    onClick={copyAwb}
                    className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy AWB"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Customer WhatsApp Notification Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {customerPhone && (
                <>
                  <a
                    href={`https://wa.me/91${customerPhone}?text=${whatsappDispatchMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp Dispatch Notice</span>
                  </a>
                  {order.shipping.status === "DELIVERED" && (
                    <a
                      href={`https://wa.me/91${customerPhone}?text=${whatsappDeliveryMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>WhatsApp Delivery Confirmation</span>
                    </a>
                  )}
                </>
              )}
              <a
                href={order.shipping.trackingUrl || `https://shiprocket.co/tracking/${order.shipping.awbCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-border text-xs font-semibold text-foreground rounded-lg hover:bg-accent transition-colors"
              >
                <span>Courier Portal</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Quick Milestone Stepper Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>Advance Delivery Milestones:</span>
              {isUpdatingMilestone && (
                <span className="text-primary flex items-center gap-1">
                  <RotateCw className="h-3 w-3 animate-spin" /> Updating...
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { label: "1. Scheduled", status: ShippingStatus.PICKUP_SCHEDULED },
                { label: "2. Picked Up", status: ShippingStatus.PICKED_UP },
                { label: "3. In Transit", status: ShippingStatus.IN_TRANSIT },
                { label: "4. Out For Delivery", status: ShippingStatus.OUT_FOR_DELIVERY },
                { label: "5. Delivered", status: ShippingStatus.DELIVERED },
              ].map((step) => {
                const isActive = order.shipping?.status === step.status;
                return (
                  <button
                    key={step.status}
                    type="button"
                    disabled={isUpdatingMilestone}
                    onClick={() => handleMilestoneChange(step.status)}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-xs ring-2 ring-primary/20"
                        : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-accent"
                    }`}
                  >
                    {step.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Live Courier Tracking Interactive Widget */}
      {order.shipping?.awbCode && (
        <RealtimeTracking
          orderId={order.id}
          orderNumber={order.orderNumber}
          initialAwb={order.shipping.awbCode}
          courierName={order.shipping.courierName}
          initialStatus={order.shipping.status || order.status}
          estimatedDelivery={order.shipping.estimatedDelivery}
        />
      )}

      {/* Order Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Items List */}
        <div className="md:col-span-8 p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <h2 className="font-semibold text-base text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Package className="h-4 w-4 text-primary" />
            <span>Ordered Handcrafted Items ({order.items.length})</span>
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

      {/* FULFILLMENT & DISPATCH MODAL */}
      {isFulfillModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsFulfillModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Truck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Fulfill & Dispatch Saree Order
                  </h3>
                  <p className="text-xs text-muted-foreground">Order #{order.orderNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setIsFulfillModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* Dispatch Mode Toggle */}
              <div>
                <label className="font-semibold text-foreground block mb-1.5">
                  Fulfillment Logistics Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsManual(false)}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                      !isManual
                        ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    🚀 Automated Shiprocket
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsManual(true)}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                      isManual
                        ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    📦 Partner / Direct Courier
                  </button>
                </div>
              </div>

              {/* Courier Selection */}
              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Courier Partner
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {COURIER_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* AWB Code */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-foreground">
                    AWB / Tracking Consignment Code
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomAwb}
                    className="text-[11px] text-primary hover:underline font-semibold"
                  >
                    + Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  value={awbCode}
                  onChange={(e) => setAwbCode(e.target.value)}
                  placeholder="e.g. DLV1094829104 or VRH102948201IN"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Weight & Estimated Days */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Package Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Est. Delivery
                  </label>
                  <select
                    value={estDeliveryDays}
                    onChange={(e) => setEstDeliveryDays(parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value={2}>2 Days (Air Express)</option>
                    <option value={3}>3 Days (Fast Delivery)</option>
                    <option value={4}>4 Days (Standard)</option>
                    <option value={5}>5 Days (Standard Surface)</option>
                    <option value={7}>7 Days (Remote Regions)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground">
                📍 <strong>Pickup Warehouse:</strong> Maa Laxmi Godowlia Workshop, Varanasi, UP - 221001. Box includes tamper-proof saree packaging and GST invoice.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-border bg-muted/20 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsFulfillModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isShipping}
                onClick={handleShipOrder}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {isShipping ? (
                  <>
                    <RotateCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Confirm Dispatch</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
