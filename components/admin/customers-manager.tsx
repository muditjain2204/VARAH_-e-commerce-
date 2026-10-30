"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Mail, Phone, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { AdminCustomerItem } from "@/actions/admin-order.actions";

export function CustomersManager({ customers }: { customers: AdminCustomerItem[] }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const filtered = useMemo(() => customers.filter((customer) =>
    `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(query.toLowerCase())
  ), [customers, query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">Customer profiles, lifetime spending, and complete purchase history.</p>
      </div>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customers by name, email, or phone..." className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Orders</th><th className="px-4 py-3">Lifetime spent</th><th className="px-4 py-3">Last order</th><th className="px-4 py-3" /></tr></thead><tbody className="divide-y divide-border/60">
          {filtered.map((customer) => <tr key={customer.id} className="align-top"><td className="px-4 py-4"><div className="flex items-center gap-3">{customer.avatar ? <Image src={customer.avatar} alt="" width={40} height={40} className="rounded-full" /> : <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">{customer.name.charAt(0)}</div>}<div><p className="font-semibold">{customer.name}</p><p className="text-xs text-muted-foreground">Joined customer</p></div></div></td><td className="px-4 py-4 text-xs"><p className="flex items-center gap-1"><Mail className="h-3 w-3" />{customer.email}</p><p className="mt-1 flex items-center gap-1"><Phone className="h-3 w-3" />{customer.phone}</p></td><td className="px-4 py-4 font-semibold">{customer.orderCount}</td><td className="px-4 py-4 font-semibold">{formatPrice(customer.totalSpent)}</td><td className="px-4 py-4 text-xs text-muted-foreground">{customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleString("en-IN") : "No orders"}</td><td className="px-4 py-4 text-right"><button onClick={() => setExpanded(expanded === customer.id ? null : customer.id)} className="rounded-lg border border-border p-2 hover:bg-muted" aria-label="View purchase history">{expanded === customer.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button></td></tr>) }
          {filtered.map((customer) => expanded === customer.id && <tr key={`${customer.id}-history`}><td colSpan={6} className="bg-muted/20 px-6 py-5"><div className="space-y-4"><h2 className="flex items-center gap-2 text-sm font-semibold"><ShoppingBag className="h-4 w-4" />Recent purchases</h2>{customer.recentOrders.length === 0 ? <p className="text-sm text-muted-foreground">No purchases yet.</p> : customer.recentOrders.map((order) => <div key={order.id} className="rounded-xl border border-border bg-card p-4"><div className="flex flex-wrap items-center justify-between gap-2 text-xs"><span className="font-semibold">{order.orderNumber}</span><span>{new Date(order.createdAt).toLocaleString("en-IN")}</span><span className="rounded-full bg-primary/10 px-2 py-1 font-semibold text-primary">{order.status.replaceAll("_", " ")}</span><strong>{formatPrice(order.total)}</strong></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{order.items.map((item) => <div key={`${order.id}-${item.sku}`} className="flex items-center gap-3 rounded-lg border border-border/70 p-2">{item.image && <Image src={item.image} alt="" width={42} height={52} className="rounded object-cover" />}<div className="min-w-0 text-xs"><p className="truncate font-medium">{item.name}</p><p className="text-muted-foreground">SKU {item.sku} · Qty {item.quantity}</p><p className="mt-1 font-semibold">{formatPrice(item.total)} ({formatPrice(item.price)} each)</p></div></div>)}</div></div>)}</div></td></tr>)}
        </tbody></table></div>
      </div>
    </div>
  );
}
