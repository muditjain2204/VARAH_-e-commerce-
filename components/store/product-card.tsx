"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { useCart } from "@/components/providers/cart-provider";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number | { toNumber(): number };
    salePrice?: number | { toNumber(): number } | null;
    fabric?: string | null;
    averageRating: number | { toNumber(): number };
    totalReviews: number;
    images: { url: string; alt?: string | null }[];
    category: { name: string; slug: string };
    availabilityTag?: string | null;
    isTrending?: boolean;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
  };
}

function toNum(val: number | { toNumber(): number } | null | undefined): number {
  if (val == null) return 0;
  if (typeof val === "number") return val;
  return val.toNumber();
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  const basePrice = toNum(product.basePrice);
  const salePrice = product.salePrice ? toNum(product.salePrice) : null;
  const rating = toNum(product.averageRating);
  const discount = salePrice ? getDiscountPercentage(basePrice, salePrice) : 0;
  const primaryImage = product.images[0];
  const finalPrice = salePrice || basePrice;
  const wishlisted = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: finalPrice,
      originalPrice: salePrice ? basePrice : null,
      image: primaryImage?.url || "/images/placeholder-saree.jpg",
      fabric: product.fabric,
      inStock: true,
    });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: finalPrice,
      originalPrice: salePrice ? basePrice : null,
      image: primaryImage?.url || "/images/placeholder-saree.jpg",
      fabric: product.fabric,
      quantity: 1,
    });
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative block rounded-xl overflow-hidden bg-card border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
            <span className="text-5xl">🪷</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isTrending && (
            <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-sm flex items-center gap-1 w-fit">
              🔥 Trending
            </span>
          )}
          {product.isFeatured && !product.isTrending && (
            <span className="px-2 py-0.5 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-sm flex items-center gap-1 w-fit">
              ⭐ Featured
            </span>
          )}
          {product.availabilityTag === "UPCOMING" ? (
            <span className="px-2 py-0.5 bg-amber-600 text-white text-[11px] font-semibold rounded shadow-sm flex items-center gap-1">
              ✨ Upcoming
            </span>
          ) : product.availabilityTag === "OUT_OF_STOCK" ? (
            <span className="px-2 py-0.5 bg-zinc-800 text-zinc-100 text-[11px] font-semibold rounded shadow-sm">
              Out of Stock
            </span>
          ) : discount > 0 ? (
            <span className="px-2 py-0.5 bg-destructive text-destructive-foreground text-[11px] font-semibold rounded shadow-sm">
              {discount}% OFF
            </span>
          ) : null}
        </div>

        {/* Wishlist button */}
        <button
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            wishlisted
              ? "bg-white/90 text-destructive shadow-sm"
              : "bg-background/80 text-muted-foreground hover:text-destructive hover:bg-background opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
          }`}
          onClick={handleWishlistClick}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 transition-transform active:scale-125 ${
              wishlisted ? "fill-destructive text-destructive" : ""
            }`}
          />
        </button>

        {/* Quick Add to Bag on hover for desktop (if in stock) */}
        {product.availabilityTag !== "OUT_OF_STOCK" && product.availabilityTag !== "UPCOMING" && (
          <div className="absolute bottom-2 inset-x-2 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={handleQuickAdd}
              className="w-full py-2 px-3 bg-background/95 hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-semibold rounded-lg shadow-md backdrop-blur-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Quick Add
            </button>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3 sm:p-4 space-y-1.5">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
          {product.fabric || product.category.name}
        </p>
        <h3 className="font-medium text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="font-bold text-foreground text-sm">
            {formatPrice(salePrice || basePrice)}
          </span>
          {salePrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(basePrice)}
            </span>
          )}
        </div>
        {product.totalReviews > 0 && (
          <div className="flex items-center gap-1 pt-0.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-xs ${
                    i < Math.round(rating)
                      ? "text-amber-500"
                      : "text-muted-foreground/20"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground">
              ({product.totalReviews})
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
