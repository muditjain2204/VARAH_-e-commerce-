import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  ShoppingBag,
  Users,
  Ticket,
  BarChart3,
  Settings,
  ArrowRightLeft,
} from "lucide-react";

import { AdminHeader } from "@/components/admin/admin-header";

const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Inventory", href: "/admin/inventory", icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-muted/30">
      {/* Admin top bar */}
      <AdminHeader />

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-60 flex-col border-r border-border bg-background min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {adminLinks.map((link) => (
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
        <main className="flex-1 p-6 min-w-0">{children}</main>
      </div>
    </div>
  );
}
