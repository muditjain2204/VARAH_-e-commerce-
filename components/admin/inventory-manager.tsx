"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Package,
  Search,
  AlertTriangle,
  CheckCircle2,
  Ban,
  Plus,
  Minus,
  Save,
  RotateCcw,
} from "lucide-react";
import {
  AdminInventoryItem,
  updateInventoryStockAction,
} from "@/actions/admin-order.actions";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface InventoryManagerProps {
  initialItems: AdminInventoryItem[];
}

export function InventoryManager({ initialItems }: InventoryManagerProps) {
  const [items, setItems] = useState<AdminInventoryItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | "LOW_STOCK" | "OUT_OF_STOCK">("ALL");
  const [editingItem, setEditingItem] = useState<{ [key: string]: number }>({});
  const [savingVariantId, setSavingVariantId] = useState<string | null>(null);

  const lowStockCount = items.filter((i) => i.isLowStock).length;
  const outOfStockCount = items.filter((i) => i.isOutOfStock).length;

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === "LOW_STOCK") return matchesSearch && item.isLowStock;
    if (filter === "OUT_OF_STOCK") return matchesSearch && item.isOutOfStock;
    return matchesSearch;
  });

  const handleStockChange = (variantId: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.variantId === variantId) {
          const newQty = Math.max(0, item.quantity + delta);
          return {
            ...item,
            quantity: newQty,
            isLowStock: newQty > 0 && newQty <= item.lowStockThreshold,
            isOutOfStock: newQty <= 0,
          };
        }
        return item;
      })
    );
  };

  const handleSaveStock = async (item: AdminInventoryItem) => {
    setSavingVariantId(item.variantId);
    try {
      const res = await updateInventoryStockAction(
        item.variantId,
        item.quantity,
        item.lowStockThreshold
      );
      if (res.success) {
        toast.success(`Inventory updated for ${item.productName} (${item.quantity} units)`);
      } else {
        toast.error(res.error || "Failed to update inventory");
      }
    } catch {
      toast.error("Error saving inventory");
    } finally {
      setSavingVariantId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-playfair tracking-tight text-foreground">
          Inventory & Stock Management
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Monitor warehouse stock, prevent stockouts with automated low-stock warnings, and adjust quantities.
        </p>
      </div>

      {/* Low Stock Warning Alert Banner */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-xs">
                Low Stock Alert ({lowStockCount} items below safe threshold)
              </p>
              <p className="text-[11px] opacity-90">
                These sarees are selling fast and may run out of stock soon. Re-order or restock from Varanasi weavers.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilter("LOW_STOCK")}
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 transition-colors shadow-xs"
          >
            View Low Stock
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
          <p className="text-xs text-muted-foreground font-medium">Total SKU Items</p>
          <p className="text-2xl font-bold text-foreground mt-1">{items.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 shadow-sm">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Healthy Stock
          </p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
            {items.filter((i) => !i.isLowStock && !i.isOutOfStock).length}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 shadow-sm">
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" /> Low Stock Warning
          </p>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1">
            {lowStockCount}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 shadow-sm">
          <p className="text-xs text-rose-700 dark:text-rose-400 font-medium flex items-center gap-1">
            <Ban className="h-3.5 w-3.5" /> Out of Stock
          </p>
          <p className="text-2xl font-bold text-rose-700 dark:text-rose-400 mt-1">
            {outOfStockCount}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by saree title, SKU, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              filter === "ALL"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-foreground hover:bg-muted"
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setFilter("LOW_STOCK")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              filter === "LOW_STOCK"
                ? "bg-amber-500 text-white border-amber-500"
                : "border-border text-foreground hover:bg-muted"
            }`}
          >
            Low Stock ({lowStockCount})
          </button>
          <button
            onClick={() => setFilter("OUT_OF_STOCK")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              filter === "OUT_OF_STOCK"
                ? "bg-rose-500 text-white border-rose-500"
                : "border-border text-foreground hover:bg-muted"
            }`}
          >
            Out of Stock ({outOfStockCount})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3.5 px-4">Saree & SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Base Price</th>
                <th className="py-3.5 px-4">Current Stock Units</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p>No inventory items match your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.variantId} className="hover:bg-muted/20 transition-colors">
                    {/* Saree & SKU */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.productName}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center text-xs">
                              🪷
                            </div>
                          )}
                        </div>
                        <div className="max-w-xs">
                          <p className="font-semibold text-foreground text-xs line-clamp-1">
                            {item.productName}
                          </p>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {item.productSku}
                          </span>
                          {item.color && (
                            <span className="block text-[10px] text-muted-foreground">
                              Color: {item.color}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-secondary text-secondary-foreground">
                        {item.categoryName}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-foreground text-xs">
                        {formatPrice(item.basePrice)}
                      </span>
                    </td>

                    {/* Stock Adjustment Controls */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden">
                          <button
                            type="button"
                            onClick={() => handleStockChange(item.variantId, -1)}
                            className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                            title="Decrease 1"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-10 text-center font-bold text-xs text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStockChange(item.variantId, 1)}
                            className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                            title="Increase 1"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          (Safe threshold: {item.lowStockThreshold})
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {item.isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                          <Ban className="h-3 w-3" /> Out of Stock
                        </span>
                      ) : item.isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          <AlertTriangle className="h-3 w-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" /> In Stock
                        </span>
                      )}
                    </td>

                    {/* Save Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleSaveStock(item)}
                        disabled={savingVariantId === item.variantId}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs disabled:opacity-50"
                      >
                        <Save className="h-3 w-3" />
                        <span>{savingVariantId === item.variantId ? "Saving..." : "Save"}</span>
                      </button>
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
