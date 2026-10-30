import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { Package, ChevronRight, Clock, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "My Orders | Varah Store" };

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

  if (clerkUser) {
    try {
      const dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            { clerkId: clerkUser.id },
            { email: clerkUser.emailAddresses[0]?.emailAddress },
          ],
        },
      });

      if (dbUser) {
        orders = await prisma.order.findMany({
          where: { userId: dbUser.id },
          orderBy: { createdAt: "desc" },
          include: {
            items: true,
            payment: true,
            shipping: true,
          },
        });
      }
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
            Track and view your past purchases
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-2xl p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Package className="w-10 h-10 stroke-1" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h2 className="font-semibold text-lg text-foreground">No orders yet</h2>
            <p className="text-xs text-muted-foreground">
              When you place an order for our handcrafted sarees, your tracking details and
              invoices will appear here.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm"
            >
              <span>Start Shopping</span>
              <ArrowRight className="h-4 w-4" />
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
            }).format(new Date(order.createdAt));

            return (
              <div
                key={order.id}
                className="p-5 rounded-2xl border border-border bg-card hover:border-primary/20 transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
                  <div className="space-y-0.5">
                    <span className="font-mono text-sm font-bold text-foreground">
                      {order.orderNumber}
                    </span>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Placed on {formattedDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className="font-bold text-foreground text-base">
                      {formatPrice(Number(order.total))}
                    </span>
                  </div>
                </div>

                {/* Items Thumbnails */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-x-auto py-1">
                    {order.items.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2.5 bg-muted/20 border border-border rounded-xl p-1.5 pr-3 flex-shrink-0"
                      >
                        <div className="relative w-10 h-13 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          )}
                        </div>
                        <div className="text-xs max-w-[140px]">
                          <p className="font-medium text-foreground truncate">{item.name}</p>
                          <p className="text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <span>View Order Details</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
