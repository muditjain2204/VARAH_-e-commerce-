"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  Search,
  CheckCircle2,
  X,
  ExternalLink,
  Flame,
  Award,
  Clock,
  Eye,
  ArrowRight,
} from "lucide-react";
import {
  getProductByIdAction,
  updateProductShowcaseFlagsAction,
} from "@/actions/admin-product.actions";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface CurateShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillProductId?: string;
  onSuccess?: () => void;
}

export function CurateShowcaseModal({
  isOpen,
  onClose,
  prefillProductId = "",
  onSuccess,
}: CurateShowcaseModalProps) {
  const [productIdInput, setProductIdInput] = useState(prefillProductId || "saree_1");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sareeDetails, setSareeDetails] = useState<any | null>(null);

  // Flags
  const [isTrending, setIsTrending] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  // Lookup product
  const handleLookup = async (idToFetch?: string) => {
    const target = idToFetch || productIdInput;
    if (!target.trim()) {
      toast.error("Please enter a Product ID, SKU, or name");
      return;
    }

    setIsLoading(true);
    try {
      const res = await getProductByIdAction(target);
      if (res.success && res.data) {
        setSareeDetails(res.data);
        setIsTrending(Boolean(res.data.isTrending));
        setIsFeatured(Boolean(res.data.isFeatured));
        setIsNewArrival(Boolean(res.data.isNewArrival));
        setIsBestSeller(Boolean(res.data.isBestSeller));
        toast.success(`Found: ${res.data.name}`);
      } else {
        toast.error(res.error || "Product not found");
      }
    } catch {
      toast.error("Error looking up product");
    } finally {
      setIsLoading(false);
    }
  };

  // Save Flags
  const handleSaveShowcase = async () => {
    if (!sareeDetails?.id) return;

    setIsSaving(true);
    try {
      const res = await updateProductShowcaseFlagsAction(sareeDetails.id, {
        isTrending,
        isFeatured,
        isNewArrival,
        isBestSeller,
      });

      if (res.success) {
        toast.success("Showcase settings saved! Saree is now updated on the home page.", {
          description: `Trending: ${isTrending ? "Yes" : "No"}, Featured: ${isFeatured ? "Yes" : "No"}`,
        });
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.error || "Failed to update showcase flags");
      }
    } catch {
      toast.error("Error updating showcase placement");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-xl rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-playfair text-foreground">
                List Product on Storefront & Trending
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Control which sarees display in Trending Now, Featured, and New Arrivals on the home page.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step 1: Product ID Lookup */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>Enter Product ID or SKU</span>
            <span className="text-[10px] text-muted-foreground">
              Required to load saree details
            </span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={productIdInput}
                onChange={(e) => setProductIdInput(e.target.value)}
                placeholder="e.g. saree_1, KANJ-CRM-001"
                className="w-full pl-10 pr-4 py-2.5 text-xs font-mono rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <button
              type="button"
              onClick={() => handleLookup()}
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Searching..." : "Fetch Saree"}
            </button>
          </div>

          {/* Quick Preset ID Chips */}
          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-muted-foreground overflow-x-auto">
            <span>Quick Select:</span>
            {["saree_1", "saree_2", "saree_4"].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setProductIdInput(id);
                  handleLookup(id);
                }}
                className="font-mono px-2 py-0.5 rounded-md bg-muted hover:bg-primary/10 hover:text-primary transition-colors border border-border/50 text-[10px]"
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Saree Details Card */}
        {sareeDetails && (
          <div className="p-4 rounded-2xl border border-border bg-muted/20 space-y-4 animate-in fade-in duration-200">
            <div className="flex gap-3.5 items-center">
              <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border shadow-xs">
                {sareeDetails.images?.[0]?.url ? (
                  <Image
                    src={sareeDetails.images[0].url}
                    alt={sareeDetails.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs">🪷</div>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary text-secondary-foreground">
                  {sareeDetails.category?.name || "Silk"}
                </span>
                <h4 className="font-bold text-sm text-foreground leading-tight line-clamp-1">
                  {sareeDetails.name}
                </h4>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-foreground">
                    {formatPrice(sareeDetails.salePrice || sareeDetails.basePrice)}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    ID: {sareeDetails.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3: Checkboxes to Display on Homepage Sections */}
            <div className="pt-3 border-t border-border/80 space-y-2.5">
              <h5 className="text-xs font-semibold text-foreground">
                Select Where Saree Will Display on Storefront:
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Trending */}
                <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card cursor-pointer hover:border-amber-500/50 transition-all">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="rounded border-border text-amber-600 focus:ring-amber-500 h-4 w-4"
                  />
                  <div>
                    <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-amber-600" />
                      <span>Trending Now</span>
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      Featured in the home page "Trending Now" carousel
                    </p>
                  </div>
                </label>

                {/* Featured */}
                <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card cursor-pointer hover:border-primary/50 transition-all">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <div>
                    <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span>Featured Collection</span>
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      Promoted as handpicked curated artisan masterwork
                    </p>
                  </div>
                </label>

                {/* New Arrival */}
                <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card cursor-pointer hover:border-emerald-500/50 transition-all">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="rounded border-border text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <div>
                    <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-emerald-600" />
                      <span>New Arrival</span>
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      Appears in the "New Arrivals" section
                    </p>
                  </div>
                </label>

                {/* Best Seller */}
                <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card cursor-pointer hover:border-purple-500/50 transition-all">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="rounded border-border text-purple-600 focus:ring-purple-500 h-4 w-4"
                  />
                  <div>
                    <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-purple-600" />
                      <span>Best Seller</span>
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      Displays in top customer favorites section
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Preview Live Home Page</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSaving || !sareeDetails}
              onClick={handleSaveShowcase}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md active:scale-95 transition-all disabled:opacity-50"
            >
              <span>{isSaving ? "Publishing..." : "Publish to Home Page"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
