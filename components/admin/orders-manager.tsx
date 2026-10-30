"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Ban,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  AdminOrderListItem,
  updateOrderStatusAction,
} from "@/actions/admin-order.actions";
import { formatPrice } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import { toast } from "sonner";

interface OrdersManagerProps {
  initialOrders: AdminOrderListItem[];
}

export function OrdersManager({ initialOrders }: OrdersManagerProps) {
  const [orders, setOrders] = useState<AdminOrderListItem[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customerPhone && o.customerPhone.includes(searchQuery)) ||
      (o.awbCode && o.awbCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === "ALL" || o.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (res.success) {
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error(res.error || "Failed to update order status");
      }
    } catch {
      toast.error("Error updating order status");
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
      case "SHIPPED":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30";
      case "CONFIRMED":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "CANCELLED":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30";
      default:
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-playfair tracking-tight text-foreground">
            Customer Orders & Fulfillment
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Dispatch orders, assign Shiprocket couriers, print labels, and monitor shipment milestones.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
          <p className="text-xs text-muted-foreground font-medium">Total Orders</p>
          <p className="text-2xl font-bold text-foreground mt-1">{orders.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 shadow-sm">
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> To Dispatch
          </p>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1">
            {orders.filter((o) => o.status === "CONFIRMED").length}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 shadow-sm">
          <p className="text-xs text-blue-700 dark:text-blue-400 font-medium flex items-center gap-1">
            <Truck className="h-3.5 w-3.5" /> Shipped / Transit
          </p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-1">
            {orders.filter((o) => o.status === "SHIPPED").length}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 shadow-sm">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Delivered
          </p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
            {orders.filter((o) => o.status === "DELIVERED").length}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by order #, customer name, phone, or AWB..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3.5 px-4">Order Details</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Shipping / AWB</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p>No orders found.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                    {/* Order Number & Items */}
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <span>{order.orderNumber}</span>
                        <ChevronRight className="h-3 w-3 opacity-60" />
                      </Link>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {order.itemCount} items ·{" "}
                        {new Intl.DateTimeFormat("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(order.createdAt))}
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-foreground text-xs">
                        {order.customerName}
                      </p>
                      {order.customerPhone && (
                        <p className="text-[11px] font-mono text-muted-foreground">
                          +91 {order.customerPhone}
                        </p>
                      )}
                    </td>

                    {/* Total & Payment */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground">
                        {formatPrice(order.total)}
                      </div>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                        {order.paymentMethod || "Prepaid"}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateStatus(order.id, e.target.value as OrderStatus)
                        }
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    {/* Shipping Status & AWB */}
                    <td className="py-3.5 px-4">
                      {order.awbCode ? (
                        <div>
                          <div className="flex items-center gap-1 text-xs font-mono font-bold text-foreground">
                            <Truck className="h-3 w-3 text-primary" />
                            <span>{order.awbCode}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {order.courierName || "Shiprocket Express"}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Not Dispatched
                        </span>
                      )}
                    </td>

                    {/* Quick Link to Fulfill */}
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
                      >
                        <span>Fulfill</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
