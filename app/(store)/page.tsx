import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";
import {
  getCategories,
  getTrendingProducts,
  getNewArrivals,
  getBestSellers,
} from "@/lib/services/product.service";
import { ProductCard, SareeCarousel3D } from "@/components/store";

export default async function HomePage() {
  const [categories, trending, newArrivals, bestSellers] = await Promise.all([
    getCategories(),
    getTrendingProducts(4),
    getNewArrivals(4),
    getBestSellers(4),
  ]);

  const categoryEmojis: Record<string, string> = {
    silk: "🧵",
    banarasi: "✨",
    cotton: "☁️",
    kanjivaram: "🌺",
    chanderi: "💫",
    organza: "🌸",
    linen: "🍃",
    tussar: "🌾",
    chiffon: "💨",
    georgette: "🎀",
    net: "✨",
    designer: "💎",
    bridal: "👑",
    "half-sarees": "🪷",
    bandhani: "🎨",
    paithani: "🦚",
    patola: "💠",
  };

  function serializeProduct(p: any) {
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      basePrice: Number(p.basePrice),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
      fabric: p.fabric,
      averageRating: Number(p.averageRating),
      totalReviews: p.totalReviews,
      images: (p.images || []).map((img: { url: string; alt?: string | null }) => ({
        url: img.url,
        alt: img.alt,
      })),
      category: p.category,
      availabilityTag: p.availabilityTag,
      isTrending: Boolean(p.isTrending),
      isFeatured: Boolean(p.isFeatured),
      isBestSeller: Boolean(p.isBestSeller),
      isNewArrival: Boolean(p.isNewArrival),
    };
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-5.5rem)] flex flex-col justify-start overflow-hidden">
        {/* Completely Static Background Image & Luxury Palace Vignette */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: "url('/hero/palace-bg.webp')",
          }}
        >
          {/* Subtle warm cream / ivory luxury overlays for perfect typography legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5]/95 via-[#faf8f5]/40 to-[#faf8f5]/90 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,250,240,0.7),transparent_75%)] pointer-events-none" />
          {/* Subtle top & bottom edge blend into theme */}
          <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#faf8f5] to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#faf8f5] to-transparent pointer-events-none" />
        </div>

        {/* Hero Top Content: Editorial Typography & CTAs (Shifted cleanly upper) */}
        <div className="relative z-10 container mx-auto px-4 pt-3 sm:pt-4 md:pt-5 pb-0 flex flex-col items-center text-center">
          <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.15] tracking-tight max-w-3xl">
            Timeless Elegance,{" "}
            <span className="text-primary italic font-serif">Woven</span> with Tradition
          </h1>

          <p className="mt-2 text-xs sm:text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed font-normal">
            Discover our curated collection of handcrafted Indian sarees — from
            the looms of Banaras to the silk mills of Kanchipuram. Each piece tells
            a story of artistry and heritage.
          </p>

          <div className="mt-3 sm:mt-3.5 mb-1 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-full text-xs sm:text-sm font-medium tracking-wide hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Shop Now</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/products?filter=new"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 bg-white/80 hover:bg-white text-foreground rounded-full text-xs sm:text-sm font-medium tracking-wide border border-stone-300 hover:border-primary transition-all backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
            >
              <span>New Arrivals</span>
            </Link>
          </div>
        </div>

        {/* 3D Saree Carousel Section */}
        <div className="relative z-10 w-full px-2 sm:px-4 pt-1 pb-3 sm:pb-4 flex flex-col items-center">
          <SareeCarousel3D />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-border bg-muted/20">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: "Free Shipping", desc: "On orders above ₹1,999" },
              { icon: ShieldCheck, label: "Authentic Products", desc: "100% genuine sarees" },
              { icon: RotateCcw, label: "Easy Returns", desc: "7-day return policy" },
              { icon: Headphones, label: "24/7 Support", desc: "Dedicated help desk" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-3">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Explore our finest collections, handpicked from traditional weaving
              clusters across India.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(0, 15).map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/20 border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {categoryEmojis[category.slug] || "🧵"}
                  </span>
                  <span className="text-sm font-semibold text-foreground text-center">
                    {category.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {category._count.products} products
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trending Sarees */}
      {trending.length > 0 && (
        <section className="bg-muted/20 py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Trending Now
                </h2>
                <p className="text-muted-foreground">
                  Most loved sarees by our customers
                </p>
              </div>
              <Link
                href="/products?filter=trending"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {trending.map((product: any) => (
                <ProductCard key={product.id} product={serializeProduct(product)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-2">
                New Arrivals
              </h2>
              <p className="text-muted-foreground">
                Fresh additions to our collection
              </p>
            </div>
            <Link
              href="/products?filter=new"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product: any) => (
              <ProductCard key={product.id} product={serializeProduct(product)} />
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="bg-muted/20 py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Best Sellers
                </h2>
                <p className="text-muted-foreground">
                  Our most popular sarees
                </p>
              </div>
              <Link
                href="/products?filter=bestseller"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {bestSellers.map((product: any) => (
                <ProductCard key={product.id} product={serializeProduct(product)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="bg-primary/5 border-y border-border">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-3">
            Stay Connected
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Get notified about new arrivals, exclusive offers, and festival collections.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-11 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <button className="h-11 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
