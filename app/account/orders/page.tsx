import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import {
  Package,
  ChevronRight,
  Clock,
  ArrowRight,
  Truck,
  CreditCard,
  Banknote,
  MapPin,
  LogIn,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = { title: "My Orders | MAA LAXMI" };

function getStatusBadge(status: string) {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200";
    case "SHIPPED":
    case "OUT_FOR_DELIVERY":
      return "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200";
    case "PROCESSING":
    case "CONFIRMED":
      return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200";
    case "CANCELLED":
    case "RETURNED":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200";
  }
}

export default async function OrdersPage() {
  const clerkUser = await currentUser();
  let orders: any[] = [];
  let userEmail = "";

  if (clerkUser) {
    userEmail =
      clerkUser.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ||
      clerkUser.emailAddresses[0]?.emailAddress?.trim().toLowerCase() ||
      "";

    const userEmails = clerkUser.emailAddresses.map((e) =>
      e.emailAddress.trim().toLowerCase()
    );

    try {
      // Find all DB users matching this Clerk account or any of its emails
      const matchingUsers = await prisma.user.findMany({
        where: {
          OR: [
            { clerkId: clerkUser.id },
            { email: { in: userEmails } },
          ],
        },
        select: { id: true },
      });

      const userIds = matchingUsers.map((u) => u.id);

      orders = await prisma.order.findMany({
        where: {
          OR: [
            ...(userIds.length > 0 ? [{ userId: { in: userIds } }] : []),
            { user: { email: { in: userEmails } } },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          payment: true,
          shipping: true,
          address: true,
        },
      });
    } catch (e) {
      console.warn("Could not fetch user orders from database:", e);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
            My Orders
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            Track and view your handcrafted saree purchases
          </p>
        </div>
        <Link
          href="/track"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5"
        >
          <Truck className="h-4 w-4" />
          <span>Track Any Order</span>
        </Link>
      </div>

      {!clerkUser ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl p-6 text-center space-y-4 bg-muted/20">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <LogIn className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h2 className="font-semibold text-lg text-foreground">
              Sign In to View Orders
            </h2>
            <p className="text-xs text-muted-foreground">
              Please sign in with your email or Google account to view your past purchases, invoices, and live delivery updates.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-3">
            <SignInButton mode="modal">
              <button
                type="button"
                className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm"
              >
                Sign In to Account
              </button>
            </SignInButton>
            <Link
              href="/track"
              className="px-5 py-2.5 border border-border text-xs font-semibold text-foreground hover:bg-accent rounded-xl transition-colors"
            >
              Track by Order ID
            </Link>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-2xl p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Package className="w-10 h-10 stroke-1" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h2 className="font-semibold text-lg text-foreground">No orders found</h2>
            <p className="text-xs text-muted-foreground">
              No orders found for {userEmail}. If you placed an order with a different email, you can track it anytime using our Track Delivery tool.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap gap-2 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm"
            >
              <span>Explore Sarees</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/track"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-border text-xs font-semibold text-foreground hover:bg-accent rounded-xl transition-colors"
            >
              <Truck className="h-4 w-4" />
              <span>Track with Order Number</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const formattedDate = new Intl.DateTimeFormat("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(order.createdAt));

            const isCod = order.payment?.method === "COD";

            return (
              <div
                key={order.id}
                className="p-5 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all space-y-4 shadow-xs"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-foreground">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Placed on {formattedDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-bold text-foreground text-base block">
                        {formatPrice(Number(order.total))}
                      </span>
                      <span className="text-[11px] text-muted-foreground flex items-center justify-end gap-1">
                        {isCod ? (
                          <>
                            <Banknote className="h-3 w-3 text-amber-600" />
                            <span>Cash on Delivery</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-3 w-3 text-emerald-600" />
                            <span>Online Payment</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping & Delivery Address note if available */}
                {order.address && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                    <span className="truncate">
                      Delivering to: <strong className="text-foreground">{order.address.fullName}</strong> — {order.address.city}, {order.address.state} ({order.address.pincode})
                    </span>
                  </div>
                )}

                {/* Items Thumbnails */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-3 overflow-x-auto py-1 max-w-full">
                    {order.items.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2.5 bg-muted/30 border border-border rounded-xl p-2 pr-3 flex-shrink-0"
                      >
                        <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-secondary flex-shrink-0 border border-border">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              Saree
                            </div>
                          )}
                        </div>
                        <div className="text-xs max-w-[160px]">
                          <p className="font-semibold text-foreground truncate" title={item.name}>
                            {item.name}
                          </p>
                          <p className="text-muted-foreground">
                            Qty: {item.quantity} × {formatPrice(Number(item.price))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Link
                      href={`/track?orderId=${encodeURIComponent(order.orderNumber)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-accent text-foreground transition-colors"
                    >
                      <Truck className="h-3.5 w-3.5 text-primary" />
                      <span>Track Delivery</span>
                    </Link>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
                    >
                      <span>Order Details</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
