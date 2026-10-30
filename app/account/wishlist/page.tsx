"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { useCart } from "@/components/providers/cart-provider";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { items, itemCount, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (item: (typeof items)[0]) => {
    addItem({
      id: item.productId,
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      fabric: item.fabric,
      quantity: 1,
    });
    removeFromWishlist(item.productId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
            My Wishlist
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            {itemCount} {itemCount === 1 ? "saree saved" : "sarees saved"} for later
          </p>
        </div>

        {itemCount > 0 && (
          <Link
            href="/products"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-2xl p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <Heart className="w-10 h-10 stroke-1" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h2 className="font-semibold text-lg text-foreground">Your wishlist is empty</h2>
            <p className="text-xs text-muted-foreground">
              Save your favourite weaves and traditional sarees by tapping the heart icon on any
              product.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm"
            >
              <span>Explore Sarees</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <div
              key={item.productId}
              className="group relative rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/20 hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Image & Remove */}
              <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
                <Link href={`/products/${item.slug}`} className="block w-full h-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </Link>

                <button
                  type="button"
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-background/80 hover:bg-background text-muted-foreground hover:text-destructive shadow-sm backdrop-blur-sm transition-all"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Details & Move to bag */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  {item.fabric && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.fabric}
                    </span>
                  )}
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-medium text-sm text-foreground hover:text-primary transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="font-bold text-sm text-foreground">
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleMoveToCart(item)}
                  className="w-full py-2.5 px-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Move to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
