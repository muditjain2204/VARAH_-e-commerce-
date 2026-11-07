"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Plus,
  UploadCloud,
  Search,
  Tag,
  IndianRupee,
  Trash2,
  Edit3,
  Check,
  X,
  Sparkles,
  AlertCircle,
  Filter,
  CheckCircle2,
  Clock,
  Ban,
  Layers,
} from "lucide-react";
import {
  updateProductPriceAction,
  updateProductTagAction,
  deleteProductAction,
  createProductAction,
  CreateProductInput,
} from "@/actions/admin-product.actions";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { CurateShowcaseModal } from "@/components/admin/curate-showcase-modal";

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  fabric?: string | null;
  occasion?: string | null;
  color?: string | null;
  basePrice: number;
  salePrice?: number | null;
  availabilityTag: "IN_STOCK" | "OUT_OF_STOCK" | "UPCOMING" | string;
  isActive: boolean;
  totalSold: number;
  category: { id: string; name: string; slug: string };
  images: { url: string; isPrimary?: boolean }[];
  totalStock: number;
  createdAt: Date;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
}

interface ProductsManagerProps {
  initialProducts: AdminProduct[];
  categories: AdminCategory[];
}

const PRESET_IMAGES = [
  {
    label: "Red Kanjivaram",
    url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Gold Banarasi",
    url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Indigo Chanderi",
    url: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Emerald Organza",
    url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
  },
];

export function ProductsManager({
  initialProducts,
  categories,
}: ProductsManagerProps) {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>("ALL");

  // Price Editing Modal State
  const [editingPriceProduct, setEditingPriceProduct] = useState<AdminProduct | null>(null);
  const [newBasePrice, setNewBasePrice] = useState<string>("");
  const [newSalePrice, setNewSalePrice] = useState<string>("");
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);

  // Delete Confirmation State
  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Showcase / Trending Curation State
  const [isCurateModalOpen, setIsCurateModalOpen] = useState(false);
  const [selectedCurateId, setSelectedCurateId] = useState("");

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [newProductData, setNewProductData] = useState<CreateProductInput>({
    name: "Pure Banarasi Silk Zari Saree",
    description: "Exquisite handcrafted saree woven with pure silk threads and traditional gold zari motifs.",
    categoryId: categories[0]?.id || "",
    basePrice: 5999,
    salePrice: 4999,
    fabric: "Pure Silk",
    occasion: "Festive & Wedding",
    color: "Crimson Red",
    availabilityTag: "IN_STOCK",
    imageUrl: PRESET_IMAGES[0].url,
    stockQuantity: 15,
  });

  useEffect(() => {
    if (categories.length > 0 && !newProductData.categoryId) {
      setNewProductData((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, newProductData.categoryId]);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" || p.category.id === selectedCategory;

    const matchesTag =
      selectedTagFilter === "ALL" || p.availabilityTag === selectedTagFilter;

    return matchesSearch && matchesCategory && matchesTag;
  });

  // Handlers for Tag Update
  const handleUpdateTag = async (
    productId: string,
    newTag: "IN_STOCK" | "OUT_OF_STOCK" | "UPCOMING"
  ) => {
    // Optimistic Update
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              availabilityTag: newTag,
              isActive: newTag !== "OUT_OF_STOCK",
            }
          : p
      )
    );

    try {
      const res = await updateProductTagAction(productId, newTag);
      if (res.success) {
        toast.success(`Availability Updated: ${newTag.replace(/_/g, " ")}`);
      } else {
        toast.error(res.error || "Failed to update availability tag");
      }
    } catch {
      toast.error("Error updating availability tag");
    }
  };

  // Handlers for Price Edit
  const handleOpenPriceModal = (product: AdminProduct) => {
    setEditingPriceProduct(product);
    setNewBasePrice(product.basePrice.toString());
    setNewSalePrice(product.salePrice ? product.salePrice.toString() : "");
  };

  const handleSavePrice = async () => {
    if (!editingPriceProduct) return;
    const base = parseFloat(newBasePrice);
    const sale = newSalePrice.trim() ? parseFloat(newSalePrice) : null;

    if (isNaN(base) || base <= 0) {
      toast.error("Please enter a valid base price greater than 0");
      return;
    }
    if (sale !== null && (isNaN(sale) || sale >= base)) {
      toast.error("Sale price must be lower than base price");
      return;
    }

    setIsUpdatingPrice(true);
    try {
      const res = await updateProductPriceAction(
        editingPriceProduct.id,
        base,
        sale
      );
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingPriceProduct.id
              ? { ...p, basePrice: base, salePrice: sale }
              : p
          )
        );
        toast.success("Price updated successfully!");
        setEditingPriceProduct(null);
      } else {
        toast.error(res.error || "Failed to update price");
      }
    } catch {
      toast.error("Error saving price");
    } finally {
      setIsUpdatingPrice(false);
    }
  };

  // Handlers for Delete
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      const res = await deleteProductAction(deletingProduct.id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
        toast.success(`Deleted saree: ${deletingProduct.name}`);
        setDeletingProduct(null);
      } else {
        toast.error(res.error || "Failed to delete product");
      }
    } catch {
      toast.error("Error deleting product");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleProductImageUpload = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (PNG, JPG, WebP)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.84);
        setUploadedImagePreview(compressedDataUrl);
        setNewProductData((current) => ({ ...current, imageUrl: compressedDataUrl }));
        toast.success("Photo optimized and selected!");
      };
      img.src = String(e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  // Handlers for Create Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductData.name.trim()) {
      toast.error("Please enter saree name");
      return;
    }
    if (newProductData.basePrice <= 0) {
      toast.error("Base price must be greater than 0");
      return;
    }

    setIsCreating(true);
    try {
      const res = await createProductAction(newProductData);
      if (res.success) {
        toast.success("New saree product created and published!");
        // Add to local state
        const createdSaree: AdminProduct = {
          id: `new_${Date.now()}`,
          name: newProductData.name,
          slug: newProductData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          sku: `VRH-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
          description: newProductData.description,
          fabric: newProductData.fabric,
          occasion: newProductData.occasion,
          color: newProductData.color,
          basePrice: newProductData.basePrice,
          salePrice: newProductData.salePrice,
          availabilityTag: newProductData.availabilityTag,
          isActive: newProductData.availabilityTag !== "OUT_OF_STOCK",
          totalSold: 0,
          category:
            categories.find((c) => c.id === newProductData.categoryId) || {
              id: newProductData.categoryId,
              name: "Sarees",
              slug: "sarees",
            },
          images: [{ url: newProductData.imageUrl, isPrimary: true }],
          totalStock: newProductData.stockQuantity,
          createdAt: new Date(),
        };
        setProducts([createdSaree, ...products]);
        setIsAddModalOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to create product");
      }
    } catch {
      toast.error("Error creating product");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-playfair tracking-tight text-foreground">
            Saree Catalog & Inventory
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Admin controls: Update prices, manage availability tags (In Stock, Out of Stock, Upcoming), and list new sarees.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setSelectedCurateId("");
              setIsCurateModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md active:scale-95 flex-shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>Curate Trending / Showcase</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Saree</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
          <p className="text-xs text-muted-foreground font-medium">Total Sarees</p>
          <p className="text-2xl font-bold text-foreground mt-1">{products.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 shadow-sm">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> In Stock
          </p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
            {products.filter((p) => p.availabilityTag === "IN_STOCK").length}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 shadow-sm">
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> Upcoming
          </p>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1">
            {products.filter((p) => p.availabilityTag === "UPCOMING").length}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 shadow-sm">
          <p className="text-xs text-rose-700 dark:text-rose-400 font-medium flex items-center gap-1">
            <Ban className="h-3.5 w-3.5" /> Out of Stock
          </p>
          <p className="text-2xl font-bold text-rose-700 dark:text-rose-400 mt-1">
            {products.filter((p) => p.availabilityTag === "OUT_OF_STOCK").length}
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

        <div className="flex flex-wrap items-center gap-2">
          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Availability Tag Filter */}
          <select
            value={selectedTagFilter}
            onChange={(e) => setSelectedTagFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Availability Statuses</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3.5 px-4">Saree</th>
                <th className="py-3.5 px-4">Category & Details</th>
                <th className="py-3.5 px-4">Price (Base / Sale)</th>
                <th className="py-3.5 px-4">Availability Tag</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p>No sarees found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const hasDiscount =
                    product.salePrice && product.salePrice < product.basePrice;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-muted/20 transition-colors group"
                    >
                      {/* Saree & Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                            {product.images[0]?.url ? (
                              <Image
                                src={product.images[0].url}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs">
                                🪷
                              </div>
                            )}
                          </div>
                          <div className="max-w-xs">
                            <p className="font-semibold text-foreground leading-tight line-clamp-1">
                              {product.name}
                            </p>
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {product.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Attributes */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-secondary text-secondary-foreground mb-1">
                          {product.category.name}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {product.fabric || "Traditional Weave"}
                        </p>
                      </td>

                      {/* Price & Price Edit Button */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-bold text-foreground">
                              {formatPrice(product.salePrice || product.basePrice)}
                            </div>
                            {hasDiscount && (
                              <div className="text-xs text-muted-foreground line-through">
                                {formatPrice(product.basePrice)}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleOpenPriceModal(product)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Edit Price"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Availability Tag Switcher (IN_STOCK, OUT_OF_STOCK, UPCOMING) */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex rounded-lg border border-border p-0.5 bg-background shadow-sm text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => handleUpdateTag(product.id, "IN_STOCK")}
                            className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                              product.availabilityTag === "IN_STOCK"
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                            title="Set In Stock"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            <span>In Stock</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleUpdateTag(product.id, "UPCOMING")}
                            className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                              product.availabilityTag === "UPCOMING"
                                ? "bg-amber-500 text-white shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                            title="Set Upcoming Collection"
                          >
                            <Sparkles className="h-3 w-3" />
                            <span>Upcoming</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateTag(product.id, "OUT_OF_STOCK")
                            }
                            className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                              product.availabilityTag === "OUT_OF_STOCK"
                                ? "bg-rose-600 text-white shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                            title="Set Out of Stock"
                          >
                            <Ban className="h-3 w-3" />
                            <span>Out</span>
                          </button>
                        </div>
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-xs text-foreground">
                          {product.totalStock} units
                        </span>
                      </td>

                      {/* Actions: Curate Trending + Delete */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedCurateId(product.id);
                              setIsCurateModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200 dark:border-rose-900/50"
                            title="List / Curate for Trending & Home Showcase"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Curate</span>
                          </button>
                          <button
                            onClick={() => setDeletingProduct(product)}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Edit Price */}
      {editingPriceProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-bold font-playfair text-foreground">
                Edit Price
              </h2>
              <button
                onClick={() => setEditingPriceProduct(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-xs text-muted-foreground">
              Updating price for: <strong>{editingPriceProduct.name}</strong>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Base Price (₹) <span className="text-destructive">*</span>
                </label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={newBasePrice}
                    onChange={(e) => setNewBasePrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-sm rounded-lg border border-border bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Sale / Discounted Price (₹)</span>
                  <span className="text-[10px] text-muted-foreground">Optional</span>
                </label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Leave empty if no discount"
                    value={newSalePrice}
                    onChange={(e) => setNewSalePrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-sm rounded-lg border border-border bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setEditingPriceProduct(null)}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdatingPrice}
                onClick={handleSavePrice}
                className="px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-sm"
              >
                {isUpdatingPrice ? "Saving..." : "Save Price"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Delete Product Confirmation */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-6 w-6" />
              <h2 className="text-lg font-bold text-foreground">Delete Saree</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <strong>{deletingProduct.name}</strong>?
              This will remove the product from customer storefront searches and catalog listings.
            </p>
            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 shadow-sm"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Add New Saree */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-6 overflow-hidden animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header (Fixed at top) */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shrink-0">
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-playfair text-foreground">
                  Add New Handcrafted Saree
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Fill in the details below to list a new saree in your store catalog.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateProduct} className="flex flex-col flex-1 overflow-hidden">
              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Saree Title <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Maroon Velvet Zari Saree"
                    value={newProductData.name}
                    onChange={(e) =>
                      setNewProductData({ ...newProductData, name: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Category <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={newProductData.categoryId}
                      onChange={(e) =>
                        setNewProductData({
                          ...newProductData,
                          categoryId: e.target.value,
                        })
                      }
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Availability Tag
                    </label>
                    <select
                      value={newProductData.availabilityTag}
                      onChange={(e) =>
                        setNewProductData({
                          ...newProductData,
                          availabilityTag: e.target.value as any,
                        })
                      }
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="IN_STOCK">In Stock</option>
                      <option value="UPCOMING">Upcoming</option>
                      <option value="OUT_OF_STOCK">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Fabric</label>
                    <input
                      type="text"
                      value={newProductData.fabric || ""}
                      onChange={(e) =>
                        setNewProductData({ ...newProductData, fabric: e.target.value })
                      }
                      placeholder="e.g. Pure Silk"
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">Occasion</label>
                    <input
                      type="text"
                      value={newProductData.occasion || ""}
                      onChange={(e) =>
                        setNewProductData({
                          ...newProductData,
                          occasion: e.target.value,
                        })
                      }
                      placeholder="e.g. Wedding"
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">Color</label>
                    <input
                      type="text"
                      value={newProductData.color || ""}
                      onChange={(e) =>
                        setNewProductData({ ...newProductData, color: e.target.value })
                      }
                      placeholder="e.g. Maroon"
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Base Price (₹) <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newProductData.basePrice}
                      onChange={(e) =>
                        setNewProductData({
                          ...newProductData,
                          basePrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-background font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Sale Price (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Discounted"
                      value={newProductData.salePrice || ""}
                      onChange={(e) =>
                        setNewProductData({
                          ...newProductData,
                          salePrice: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-background font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Stock Units
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newProductData.stockQuantity}
                      onChange={(e) =>
                        setNewProductData({
                          ...newProductData,
                          stockQuantity: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-background font-mono"
                    />
                  </div>
                </div>

                {/* Preset Saree Photos */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Choose Photo (Preset or Upload Custom)
                  </label>
                  <div className="grid grid-cols-4 gap-2.5">
                    {PRESET_IMAGES.map((img) => {
                      const isSelected = newProductData.imageUrl === img.url;
                      return (
                        <button
                          key={img.label}
                          type="button"
                          onClick={() => {
                            setUploadedImagePreview(null);
                            setNewProductData({
                              ...newProductData,
                              imageUrl: img.url,
                            });
                          }}
                          className={`relative rounded-xl overflow-hidden border-2 aspect-[3/4] transition-all group ${
                            isSelected
                              ? "border-primary ring-2 ring-primary/30 scale-105 shadow-md"
                              : "border-border hover:border-foreground/40 opacity-75 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={img.url}
                            alt={img.label}
                            fill
                            className="object-cover"
                            sizes="120px"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-medium text-white py-1 text-center truncate px-1">
                            {img.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Photo Upload */}
                <div className="space-y-2 pt-1 border-t border-border/60">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">
                      Or Upload Saree Photo from Device
                    </label>
                    <span className="text-[10px] text-muted-foreground">Auto-compressed</span>
                  </div>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-3 text-xs font-medium hover:border-primary hover:bg-muted/30 transition-colors">
                    <UploadCloud className="h-4 w-4 text-primary" />
                    <span>Click to choose photo from computer or phone</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => handleProductImageUpload(event.target.files?.[0])}
                    />
                  </label>
                  {uploadedImagePreview && (
                    <div className="flex items-center gap-3 p-2 bg-muted/40 rounded-xl border border-border">
                      <Image
                        src={uploadedImagePreview}
                        alt="Uploaded saree preview"
                        width={60}
                        height={80}
                        className="rounded-lg border border-border object-cover"
                      />
                      <div className="text-xs">
                        <p className="font-semibold text-emerald-600">✓ Photo attached successfully</p>
                        <p className="text-[11px] text-muted-foreground">Ready to publish to store</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Saree Description */}
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Details regarding weave, zari type, craftsmanship..."
                    value={newProductData.description}
                    onChange={(e) =>
                      setNewProductData({
                        ...newProductData,
                        description: e.target.value,
                      })
                    }
                    className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Modal Footer (Fixed at bottom) */}
              <div className="flex items-center justify-between px-6 py-3.5 border-t border-border bg-muted/40 shrink-0">
                <Link
                  href="/admin/products/new"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Full Page View ↗
                </Link>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-6 py-2.5 text-xs font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {isCreating ? "Publishing Saree..." : "✓ Publish Saree to Store"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Curate Saree Showcase / Trending */}
      <CurateShowcaseModal
        isOpen={isCurateModalOpen}
        onClose={() => setIsCurateModalOpen(false)}
        prefillProductId={selectedCurateId}
      />
    </div>
  );
}
