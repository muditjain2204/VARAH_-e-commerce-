import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { MapPin, Phone, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = { title: "Saved Addresses | MAA LAXMI" };

export default async function AddressesPage() {
  const clerkUser = await currentUser();
  let addresses: any[] = [];

  if (clerkUser) {
    const userEmails = clerkUser.emailAddresses.map((e) =>
      e.emailAddress.trim().toLowerCase()
    );

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

    if (userIds.length > 0) {
      addresses = await prisma.address.findMany({
        where: {
          userId: { in: userIds },
        },
        orderBy: { createdAt: "desc" },
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
            Saved Addresses
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            Manage your delivery and shipping destinations
          </p>
        </div>
      </div>

      {!clerkUser ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl p-6 text-center space-y-4 bg-muted/20">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MapPin className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h2 className="font-semibold text-lg text-foreground">Sign In to View Addresses</h2>
            <p className="text-xs text-muted-foreground">
              Sign in to see saved delivery locations and addresses used for past saree orders.
            </p>
          </div>
          <div className="pt-2">
            <SignInButton mode="modal">
              <button
                type="button"
                className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm"
              >
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl p-6 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <MapPin className="w-8 h-8" />
          </div>
          <p className="text-foreground font-semibold text-base">No saved addresses yet</p>
          <p className="text-xs text-muted-foreground max-w-sm">
            When you complete an order on checkout, your delivery address is automatically saved here for quick re-ordering.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
            >
              Shop Sarees
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr, index) => (
            <div
              key={addr.id}
              className="p-5 rounded-2xl border border-border bg-card space-y-3 shadow-xs hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{index === 0 ? "Default Delivery" : "Saved Address"}</span>
                </span>
                <span className="text-[11px] text-muted-foreground">
                  PIN: {addr.pincode}
                </span>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  {addr.fullName}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  {addr.phone}
                </p>
                <p className="text-xs text-foreground/80 leading-relaxed pt-1">
                  {addr.addressLine1}
                  {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                  <br />
                  {addr.city}, {addr.state} - <span className="font-mono font-medium">{addr.pincode}</span>
                  {addr.landmark ? ` (Landmark: ${addr.landmark})` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
