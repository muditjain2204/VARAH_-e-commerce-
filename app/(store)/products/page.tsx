import { Suspense } from "react";
import { getProducts, getFilterOptions } from "@/lib/services/product.service";
import { ProductGrid } from "@/components/store";
import type { ProductFilters } from "@/types";

export const metadata = {
  title: "All Sarees",
  description:
    "Browse our complete collection of handcrafted Indian sarees — Silk, Banarasi, Cotton, Kanjivaram, Chanderi & more. Filter by fabric, occasion, price & color.",
};

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const filters: ProductFilters = {
    page: params.page ? Number(params.page) : 1,
    sort: (params.sort as ProductFilters["sort"]) || "newest",
    fabric: params.fabric as string | undefined,
    occasion: params.occasion as string | undefined,
    color: params.color as string | undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    search: params.search as string | undefined,
    isTrending: params.filter === "trending" ? true : undefined,
    isNewArrival: params.filter === "new" ? true : undefined,
    isBestSeller: params.filter === "bestseller" ? true : undefined,
  };

  const [result, filterOptions] = await Promise.all([
    getProducts(filters),
    getFilterOptions(),
  ]);

  // Serialize Decimal types for client component
  const serializedProducts = result.data.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    basePrice: Number(p.basePrice),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    fabric: p.fabric,
    averageRating: Number(p.averageRating),
    totalReviews: p.totalReviews,
    images: p.images.map((img) => ({ url: img.url, alt: img.alt })),
    category: p.category,
  }));

  const pageTitle = params.filter === "trending"
    ? "Trending Sarees"
    : params.filter === "new"
      ? "New Arrivals"
      : params.filter === "bestseller"
        ? "Best Sellers"
        : params.fabric
          ? `${params.fabric} Sarees`
          : params.occasion
            ? `${params.occasion} Sarees`
            : "All Sarees";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">
          {pageTitle}
        </h1>
        <p className="text-muted-foreground">
          {result.pagination.total > 0
            ? `${result.pagination.total} sarees found`
            : "Browse our complete collection of handcrafted Indian sarees"}
        </p>
      </div>

      <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
        <ProductGrid
          products={serializedProducts}
          pagination={result.pagination}
          filterOptions={filterOptions}
          basePath="/products"
        />
      </Suspense>
    </div>
  );
}
