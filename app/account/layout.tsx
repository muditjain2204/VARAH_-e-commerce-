import Link from "next/link";
import { Navbar, Footer } from "@/components/layout";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Heart,
  User,
} from "lucide-react";

const accountLinks = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Profile", href: "/account/profile", icon: User },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
            {/* Sidebar */}
            <aside className="space-y-1">
              <h2 className="font-playfair text-xl font-bold text-foreground mb-4 px-3">
                My Account
              </h2>
              <nav className="space-y-0.5">
                {accountLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <div>{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
