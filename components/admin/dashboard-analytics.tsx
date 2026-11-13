"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CurateShowcaseModal } from "@/components/admin/curate-showcase-modal";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  IndianRupee,
  ArrowRight,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  Layers,
  Flame,
  ExternalLink,
} from "lucide-react";
import { AdminAnalyticsData } from "@/actions/admin-order.actions";
import { formatPrice } from "@/lib/utils";

interface DashboardAnalyticsProps {
  analytics: AdminAnalyticsData;
}

export function DashboardAnalytics({ analytics }: DashboardAnalyticsProps) {
  const [isCurateModalOpen, setIsCurateModalOpen] = useState(false);

  // Find maximum revenue for monthly bar chart normalization
  const maxRevenue = Math.max(...(analytics.monthlyRevenue || []).map((m) => m.revenue), 0);
  const hasRevenue = maxRevenue > 0;
  const totalStatusCount = (analytics.ordersByStatus || []).reduce((sum, s) => sum + s.count, 0);
  const hasOrders = totalStatusCount > 0;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-playfair tracking-tight text-foreground">
            Store Performance & Revenue
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time analytics for Varah handcrafted saree orders, fulfillment, and revenue growth.
          </p>
        </div>

        {/* Quick Jump Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCurateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Flame className="h-3.5 w-3.5" />
            <span>List / Curate Trending Sarees</span>
          </button>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold transition-all"
            title="Preview Live Home Page"
          >
            <span>View Home Page</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs"
          >
            <Truck className="h-3.5 w-3.5" />
            <span>Fulfill Orders</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">
            {formatPrice(analytics.totalRevenue)}
          </p>
          <p className="text-xs font-medium flex items-center gap-1">
            {analytics.totalRevenue > 0 ? (
              <span className="text-emerald-600 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> Real-time Store Revenue
              </span>
            ) : (
              <span className="text-muted-foreground">₹0 total revenue (Store ready)</span>
            )}
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">
            {analytics.totalOrders}
          </p>
          <p className="text-xs text-muted-foreground">
            {analytics.totalOrders > 0 ? (
              <>
                Avg. Order Value: <strong>{formatPrice(analytics.averageOrderValue)}</strong>
              </>
            ) : (
              <span>Awaiting customer orders</span>
            )}
          </p>
        </div>

        {/* Total Products */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Saree Catalog
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">
            {analytics.totalProducts} Designs
          </p>
          <p className="text-xs text-muted-foreground">
            {analytics.totalProducts > 0
              ? "Active handcrafted weaves"
              : "0 Sarees listed (Ready for today's listing)"}
          </p>
        </div>

        {/* Total Customers */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Customers
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">
            {analytics.totalCustomers}
          </p>
          <p className="text-xs text-muted-foreground">
            {analytics.totalCustomers === 1
              ? "1 Registered customer account"
              : `${analytics.totalCustomers} Registered customer accounts`}
          </p>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span>Monthly Revenue Trends</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {hasRevenue
                  ? "Consistent real-time revenue tracking across recent months"
                  : "Monthly sales graph will populate automatically as customer orders are placed"}
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-md ${
                hasRevenue
                  ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
                  : "text-muted-foreground bg-muted"
              }`}
            >
              {hasRevenue ? "Active Orders" : "Live Store Ready"}
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-4 space-y-2">
            <div className="h-48 flex items-end gap-3 sm:gap-6 pt-4 border-b border-border">
              {analytics.monthlyRevenue.map((item) => {
                const heightPercent = hasRevenue
                  ? Math.max(item.revenue > 0 ? 8 : 2, Math.round((item.revenue / maxRevenue) * 100))
                  : 2;
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    {/* Tooltip / Value on hover */}
                    <span className="text-[10px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatPrice(item.revenue)}
                    </span>
                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[38px] rounded-t-lg transition-all shadow-sm ${
                        item.revenue > 0
                          ? "bg-primary hover:bg-primary/80"
                          : "bg-muted hover:bg-muted-foreground/20"
                      }`}
                    />
                    <span className="text-xs font-semibold text-muted-foreground">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
              <span>₹0</span>
              <span>{hasRevenue ? formatPrice(Math.round(maxRevenue / 2)) : "₹25,000"}</span>
              <span>{hasRevenue ? formatPrice(maxRevenue) : "₹50,000+"}</span>
            </div>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="lg:col-span-4 p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <span>Fulfillment Breakdown</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {hasOrders
                ? "Live status distribution of active orders"
                : "Live status distribution of customer orders"}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {analytics.ordersByStatus.map((item) => {
              const percentage = hasOrders ? Math.round((item.count / totalStatusCount) * 100) : 0;
              return (
                <div key={item.status} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-foreground">{item.status}</span>
                    <span className="text-muted-foreground">
                      {item.count} orders {hasOrders ? `(${percentage}%)` : "(0%)"}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      style={{ width: `${percentage}%`, backgroundColor: item.color }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border">
            <Link
              href="/admin/orders"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted text-foreground transition-colors"
            >
              <span>Manage Pending Dispatches</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Top-Selling Sarees Leaderboard */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Top-Selling Handcrafted Sarees</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Best-performing designs ranked by volume and total customer revenue
            </p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All Products</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {analytics.topSellingSarees && analytics.topSellingSarees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {analytics.topSellingSarees.map((saree, idx) => (
              <div
                key={saree.name}
                className="p-4 rounded-xl border border-border bg-muted/20 flex gap-3.5 items-center hover:border-primary/40 transition-colors"
              >
                <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                  <Image
                    src={saree.image}
                    alt={saree.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                  <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-background/90 text-[10px] font-bold text-foreground flex items-center justify-center shadow-xs">
                    #{idx + 1}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                    {saree.category}
                  </span>
                  <p className="font-bold text-xs text-foreground line-clamp-1 mt-0.5">
                    {saree.name}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="text-muted-foreground">{saree.totalSold} sold</span>
                    <span className="font-bold text-foreground">{formatPrice(saree.revenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-xl border border-dashed border-border bg-muted/20 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-sm font-bold text-foreground">No Saree Sales Recorded Yet</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Once you list sarees and customers place orders, your best-performing weaves will appear here ranked by volume and revenue.
              </p>
            </div>
            <div className="pt-1">
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs"
              >
                <Package className="h-3.5 w-3.5" />
                <span>List First Saree</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      <CurateShowcaseModal
        isOpen={isCurateModalOpen}
        onClose={() => setIsCurateModalOpen(false)}
      />
    </div>
  );
}
