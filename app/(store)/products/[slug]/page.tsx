import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Heart, Share2, ShoppingCart, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/product.service";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { ProductCard, ProductDetailActions } from "@/components/store";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const primaryImage = product.images.find((i: any) => i.isPrimary) || product.images[0];

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription || product.description.slice(0, 160),
    keywords: product.metaKeywords || undefined,
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.shortDescription || undefined,
      images: primaryImage ? [{ url: primaryImage.url, alt: product.name }] : [],
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.categoryId,
    4
  );

  const basePrice = Number(product.basePrice);
  const salePrice = product.salePrice ? Number(product.salePrice) : null;
  const discount = salePrice ? getDiscountPercentage(basePrice, salePrice) : 0;
  const rating = Number(product.averageRating);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const primaryImage = product.images.find((i: any) => i.isPrimary) || product.images[0];

  // Check stock
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalStock = product.variants.reduce(
    (sum: number, v: any) => sum + (v.inventory?.quantity || 0),
    0
  );
  const inStock = totalStock > 0;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: product.images.map((i: any) => i.url),
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "Varah Store",
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.slug}`,
      priceCurrency: "INR",
      price: salePrice || basePrice,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    ...(product.totalReviews > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating,
        reviewCount: product.totalReviews,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 overflow-x-auto">
          <Link href="/" className="hover:text-foreground whitespace-nowrap">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
          <Link href="/products" className="hover:text-foreground whitespace-nowrap">All Sarees</Link>
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
          <Link href={`/categories/${product.category.slug}`} className="hover:text-foreground whitespace-nowrap">
            {product.category.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </nav>

        {/* Product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image gallery */}
          <div className="space-y-3">
            {/* Primary image */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt || product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                  <span className="text-8xl">🪷</span>
                </div>
              )}
              {discount > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-destructive text-destructive-foreground text-sm font-semibold rounded-lg">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {product.images.map((img: any, i: number) => (
                  <div
                    key={img.id}
                    className="relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors cursor-pointer"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || `${product.name} - Image ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                {product.category.name}
                {product.fabric && product.fabric !== product.category.name && ` · ${product.fabric}`}
              </p>
              <h1 className="font-playfair text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            {product.totalReviews > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-base ${i < Math.round(rating) ? "text-amber-500" : "text-muted-foreground/20"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {rating.toFixed(1)} ({product.totalReviews} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(salePrice || basePrice)}
              </span>
              {salePrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(basePrice)}
                  </span>
                  <span className="text-sm font-semibold text-emerald-600">
                    Save {formatPrice(basePrice - salePrice)}
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>

            {/* Interactive Actions & Variant Selection */}
            <ProductDetailActions
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                basePrice,
                salePrice,
                fabric: product.fabric,
                availabilityTag: product.availabilityTag,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                images: product.images.map((img: any) => ({ url: img.url })),
              }}
              variants={product.variants}
              totalStock={totalStock}
            />

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, text: "Free Shipping" },
                { icon: ShieldCheck, text: "100% Authentic" },
                { icon: RotateCcw, text: "7-Day Returns" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted/50 text-center">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground font-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="border-t border-border pt-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Details */}
            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Product Details</h2>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["SKU", product.sku],
                  ["Fabric", product.fabric],
                  ["Occasion", product.occasion],
                  ["Color", product.color],
                  ["Weight", product.weight ? `${product.weight}g` : null],
                  ["Length", product.length ? `${product.length}m` : null],
                  ["Blouse Piece", product.blousePiece ? "Included" : "Not Included"],
                  ["Wash Care", product.washCare],
                ]
                  .filter(([, val]) => val)
                  .map(([label, value]) => (
                    <div key={label as string}>
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-medium text-foreground">{value}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        {product.reviews.length > 0 && (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="font-playfair text-2xl font-bold text-foreground mb-6">
              Customer Reviews ({product.totalReviews})
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {product.reviews.map((review: any) => (
                <div key={review.id} className="p-5 rounded-xl border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {(review.user.firstName?.[0] || "U").toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {review.user.firstName} {review.user.lastName}
                      </p>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-xs ${i < review.rating ? "text-amber-500" : "text-muted-foreground/20"}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    {review.isVerified && (
                      <span className="ml-auto text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  {review.title && (
                    <p className="text-sm font-semibold text-foreground mb-1">{review.title}</p>
                  )}
                  {review.comment && (
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="font-playfair text-2xl font-bold text-foreground mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {relatedProducts.map((p: any) => (
                <ProductCard
                  key={p.id}
                  product={{
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    basePrice: Number(p.basePrice),
                    salePrice: p.salePrice ? Number(p.salePrice) : null,
                    fabric: p.fabric,
                    averageRating: Number(p.averageRating),
                    totalReviews: p.totalReviews,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    images: p.images.map((img: any) => ({ url: img.url, alt: img.alt })),
                    category: p.category,
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
