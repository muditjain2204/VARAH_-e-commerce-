"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Share2, Zap, Check, MapPin, Truck, MessageCircle } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

interface Variant {
  id: string;
  name: string;
  sku: string;
  color?: string | null;
  size?: string | null;
  price?: number | { toNumber(): number } | null;
  inventory?: {
    quantity: number;
    reservedQuantity: number;
  } | null;
}

interface ProductDetailActionsProps {
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    salePrice?: number | null;
    fabric?: string | null;
    images: { url: string }[];
    availabilityTag?: string | null;
  };
  variants: Variant[];
  totalStock: number;
}

export function ProductDetailActions({
  product,
  variants,
  totalStock,
}: ProductDetailActionsProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.length > 0 ? variants[0].id : null
  );
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const activeStock = selectedVariant?.inventory
    ? selectedVariant.inventory.quantity - selectedVariant.inventory.reservedQuantity
    : totalStock;
  const inStock = activeStock > 0;

  const unitSalePrice = product.salePrice;
  const unitBasePrice = product.basePrice;

  const variantPriceNumber = selectedVariant?.price
    ? typeof selectedVariant.price === "number"
      ? selectedVariant.price
      : selectedVariant.price.toNumber()
    : null;

  const activeUnitPrice = variantPriceNumber || (unitSalePrice || unitBasePrice);

  // Live real-time multiplied pricing based on selected quantity
  const totalEffectivePrice = activeUnitPrice * quantity;
  const totalBasePrice = unitBasePrice * quantity;
  const totalSavings = unitSalePrice ? (unitBasePrice - unitSalePrice) * quantity : 0;

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (redirectAfter = false) => {
    if (!inStock) return;

    addItem({
      id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
      productId: product.id,
      name: selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name,
      slug: product.slug,
      price: activeUnitPrice,
      originalPrice: product.salePrice ? product.basePrice : null,
      image: product.images[0]?.url || "/images/placeholder-saree.jpg",
      variantId: selectedVariantId,
      color: selectedVariant?.color,
      fabric: product.fabric,
      quantity,
      maxStock: activeStock,
    });

    if (redirectAfter) {
      router.push("/cart");
    }
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: activeUnitPrice,
      originalPrice: product.salePrice ? product.basePrice : null,
      image: product.images[0]?.url || "/images/placeholder-saree.jpg",
      fabric: product.fabric,
      inStock,
    });
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this handcrafted saree on Varah: ${product.name}`,
          url,
        });
      } catch {
        // user cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Product link copied to clipboard!", { id: "product-share-copy" });
    }
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      toast.error("Please enter a valid 6-digit Indian PIN code", { id: "pincode-error" });
      return;
    }
    setIsCheckingPincode(true);
    setTimeout(() => {
      setIsCheckingPincode(false);
      setDeliveryEstimate("Estimated delivery in 3-5 business days. Free shipping available!");
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Real-time Dynamic Price Display */}
      <div className="space-y-1">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-3xl md:text-4xl font-bold text-foreground tracking-tight transition-all duration-150">
            {formatPrice(totalEffectivePrice)}
          </span>
          {unitSalePrice && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(totalBasePrice)}
              </span>
              <span className="text-sm font-semibold text-emerald-600">
                Save {formatPrice(totalSavings)}
              </span>
            </>
          )}
          {quantity > 1 && (
            <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md">
              {formatPrice(activeUnitPrice)} each × {quantity}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
      </div>

      {/* Variants Selector */}
      {variants.length > 1 && (
        <div className="space-y-2.5">
          <label className="text-sm font-semibold text-foreground flex items-center justify-between">
            <span>Choose Color / Variant</span>
            {selectedVariant && (
              <span className="text-xs text-muted-foreground font-normal">
                {selectedVariant.name}
              </span>
            )}
          </label>
          <div className="flex flex-wrap gap-2.5">
            {variants.map((v) => {
              const isSelected = v.id === selectedVariantId;
              const varStock = v.inventory
                ? v.inventory.quantity - v.inventory.reservedQuantity
                : 1;
              const isVarOutOfStock = varStock <= 0;

              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariantId(v.id)}
                  disabled={isVarOutOfStock}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                      : isVarOutOfStock
                      ? "border-border/50 text-muted-foreground/40 line-through cursor-not-allowed bg-muted/20"
                      : "border-border hover:border-foreground/40 text-foreground"
                  }`}
                >
                  {v.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector & Stock Info */}
      <div className="flex items-center justify-between gap-4 py-2 border-y border-border/50">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">Quantity:</span>
          <div className="flex items-center border border-border rounded-lg overflow-hidden bg-background shadow-xs">
            <button
              type="button"
              disabled={quantity <= 1 || !inStock}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-9 flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed font-medium"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-10 text-center text-sm font-semibold text-foreground select-none">
              {quantity}
            </span>
            <button
              type="button"
              disabled={quantity >= activeStock || !inStock}
              onClick={() => setQuantity((q) => Math.min(activeStock, q + 1))}
              className="w-9 h-9 flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed font-medium"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          {quantity > 1 && (
            <span className="text-xs font-semibold text-primary">
              = {formatPrice(totalEffectivePrice)}
            </span>
          )}
        </div>

        <div>
          {product.availabilityTag === "UPCOMING" ? (
            <span className="inline-flex items-center text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
              ✨ Upcoming Collection
            </span>
          ) : inStock ? (
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              In Stock ({activeStock} left)
            </span>
          ) : (
            <span className="inline-flex items-center text-xs font-semibold text-destructive bg-destructive/10 px-2.5 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2.5">
        <div className="flex gap-2.5">
          {product.availabilityTag === "UPCOMING" ? (
            <button
              type="button"
              onClick={() =>
                toast.success("Notification enabled! We'll alert you when this saree launches.", {
                  id: "upcoming-alert",
                })
              }
              className="flex-1 inline-flex items-center justify-center gap-2 h-12 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              <span>🔔 Notify Me When Available</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={!inStock}
                onClick={() => handleAddToCart(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 h-12 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <ShoppingCart className="h-5 w-5" />
                {inStock
                  ? quantity > 1
                    ? `Add to Cart (${quantity})`
                    : "Add to Cart"
                  : "Out of Stock"}
              </button>

              <button
                type="button"
                disabled={!inStock}
                onClick={() => handleAddToCart(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 h-12 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Zap className="h-5 w-5 fill-current" />
                Buy Now
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`h-12 w-12 flex items-center justify-center rounded-xl border transition-all active:scale-95 ${
              isWishlisted
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : "border-border hover:border-destructive/40 text-muted-foreground hover:text-destructive"
            }`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current text-destructive" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="h-12 w-12 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all active:scale-95"
            aria-label="Share saree"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* WhatsApp Inquiry Button */}
        <a
          href={`https://wa.me/919461500924?text=${encodeURIComponent(
            `Hello Maa Laxmi Sarees, I have an inquiry about this saree: "${product.name}" (Qty: ${quantity}, Total: ₹${totalEffectivePrice})`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 h-11 border border-emerald-600/30 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold rounded-xl text-xs transition-all active:scale-[0.98] shadow-xs"
        >
          <MessageCircle className="h-4 w-4 text-emerald-600" />
          <span>Inquire or Request Video on WhatsApp (+91 94615 00924)</span>
        </a>
      </div>

      {/* PIN Code Delivery Checker */}
      <div className="rounded-xl border border-border/70 p-4 bg-muted/10 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>Check Delivery & Cash on Delivery</span>
        </div>
        <form onSubmit={handleCheckPincode} className="flex gap-2">
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 6-digit PIN code"
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={isCheckingPincode || pincode.length !== 6}
            className="px-4 py-2 text-xs font-semibold bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {isCheckingPincode ? "Checking..." : "Check"}
          </button>
        </form>
        {deliveryEstimate && (
          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5 pt-1">
            <Truck className="h-3.5 w-3.5" />
            {deliveryEstimate}
          </p>
        )}
      </div>
    </div>
  );
}
