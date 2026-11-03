"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles, UploadCloud, Check } from "lucide-react";
import { createProductAction, CreateProductInput } from "@/actions/admin-product.actions";
import { getAdminCategoriesAction } from "@/actions/admin-category.actions";
import { toast } from "sonner";

const PRESETS = [
  {
    name: "Royal Crimson Kanjivaram",
    url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Varanasi Antique Gold",
    url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Midnight Indigo Chanderi",
    url: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Heritage Emerald Organza",
    url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
  },
];

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState<CreateProductInput>({
    name: "",
    description: "",
    shortDescription: "",
    categoryId: "silk",
    basePrice: 12999,
    salePrice: 10999,
    fabric: "Pure Silk",
    occasion: "Bridal & Wedding",
    color: "Crimson Red",
    availabilityTag: "IN_STOCK",
    imageUrl: PRESETS[0].url,
    stockQuantity: 10,
  });

  useEffect(() => {
    getAdminCategoriesAction().then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        const catList = res.data;
        setCategories(catList.map((c) => ({ id: c.id, name: `${c.name} Sarees` })));
        setFormData((prev) => ({ ...prev, categoryId: catList[0].id }));
      }
    });
  }, []);

  const handleImageUpload = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setImagePreview(url);
      setFormData((current) => ({ ...current, imageUrl: url }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please provide saree title");
      return;
    }
    if (formData.basePrice <= 0) {
      toast.error("Base price must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createProductAction(formData);
      if (res.success) {
        toast.success("Saree product added to catalog successfully!");
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to create product");
      }
    } catch {
      toast.error("Error publishing saree product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Top Header */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Products</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold font-playfair tracking-tight text-foreground">
          Add New Handcrafted Saree
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Publish a new saree to the online store catalog with imagery, pricing, and availability tags.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <h2 className="font-semibold text-sm text-foreground uppercase tracking-wider">
            General Information
          </h2>

          <div>
            <label className="text-xs font-semibold text-foreground">
              Saree Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Maroon Velvet Zari Saree"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="silk">Silk Sarees</option>
                    <option value="banarasi">Banarasi Sarees</option>
                    <option value="kanjivaram">Kanjivaram Sarees</option>
                    <option value="cotton">Cotton Sarees</option>
                    <option value="chanderi">Chanderi Sarees</option>
                    <option value="organza">Organza Sarees</option>
                    <option value="chiffon">Chiffon Sarees</option>
                    <option value="georgette">Georgette Sarees</option>
                    <option value="net">Net Sarees</option>
                    <option value="designer">Designer Sarees</option>
                    <option value="bridal">Bridal Sarees</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Availability Tag</label>
              <select
                value={formData.availabilityTag}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availabilityTag: e.target.value as any,
                  })
                }
                className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="IN_STOCK">In Stock (Available)</option>
                <option value="UPCOMING">Upcoming Collection</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Initial Stock Units</label>
              <input
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) =>
                  setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })
                }
                className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground">Fabric</label>
              <input
                type="text"
                value={formData.fabric}
                onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-border bg-background"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Occasion</label>
              <input
                type="text"
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-border bg-background"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-border bg-background"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Handcrafted details, zari work, pallu design..."
              className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-border bg-background"
            />
          </div>
        </div>

        {/* Pricing & Images Card */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <h2 className="font-semibold text-sm text-foreground uppercase tracking-wider">
            Pricing & Saree Imagery
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground">
                Base Price (₹) <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })
                }
                className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-border bg-background"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Sale / Discounted Price (₹)
              </label>
              <input
                type="number"
                min="1"
                placeholder="Leave blank if no discount"
                value={formData.salePrice || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salePrice: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-border bg-background"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-2">
              Saree Photography (Select Preset or Provide Image URL)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESETS.map((p) => {
                const isSelected = formData.imageUrl === p.url;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: p.url })}
                    className={`relative rounded-xl overflow-hidden border-2 aspect-[3/4] transition-all text-left group ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 scale-[1.02]"
                        : "border-border hover:border-foreground/40 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={p.url}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                      <p className="text-[10px] text-white font-medium leading-tight line-clamp-1">
                        {p.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 space-y-3">
              <label className="text-[11px] text-muted-foreground block mb-1">Upload product image (PNG, JPG, WEBP; max 5MB)</label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background px-4 py-5 text-xs font-semibold hover:border-primary hover:bg-primary/5">
                <UploadCloud className="h-4 w-4" /> Choose image file
                <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => handleImageUpload(event.target.files?.[0])} />
              </label>
              {imagePreview && <Image src={imagePreview} alt="Uploaded saree preview" width={100} height={130} className="rounded-xl border border-border object-cover" />}
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">Or Custom Image URL</label>
                <input type="url" value={formData.imageUrl} onChange={(e) => { setImagePreview(null); setFormData({ ...formData, imageUrl: e.target.value }); }} className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-mono" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Publishing Saree..." : "Publish Saree to Catalog"}
          </button>
        </div>
      </form>
    </div>
  );
}
