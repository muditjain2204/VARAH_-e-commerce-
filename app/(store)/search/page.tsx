import { Suspense } from "react";
import { getProducts, getFilterOptions } from "@/lib/services/product.service";
import { ProductGrid } from "@/components/store";
import type { ProductFilters } from "@/types";

export const metadata = {
  title: "Search Sarees",
  description: "Search our complete collection of Indian sarees.",
};

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const query = (sp.q as string) || (sp.search as string) || "";

  const filters: ProductFilters = {
    search: query,
    page: sp.page ? Number(sp.page) : 1,
    sort: (sp.sort as ProductFilters["sort"]) || "newest",
    fabric: sp.fabric as string | undefined,
    occasion: sp.occasion as string | undefined,
    color: sp.color as string | undefined,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
  };

  const [result, filterOptions] = await Promise.all([
    getProducts(filters),
    getFilterOptions(),
  ]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">
          {query ? `Results for "${query}"` : "Search Sarees"}
        </h1>
        <p className="text-muted-foreground">
          {query
            ? `${result.pagination.total} sarees found`
            : "Search our complete collection of handcrafted Indian sarees"}
        </p>
      </div>

      {!query ? (
        <div className="flex items-center justify-center py-20 border border-dashed border-border rounded-xl">
          <div className="text-center space-y-3">
            <div className="text-5xl">🔍</div>
            <p className="text-muted-foreground font-medium">
              Enter a search term to find sarees
            </p>
            <p className="text-sm text-muted-foreground">
              Try &quot;Banarasi&quot;, &quot;Silk&quot;, &quot;Wedding&quot;, or
              &quot;Cotton&quot;
            </p>
          </div>
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="h-96 flex items-center justify-center">
              <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <ProductGrid
            products={serializedProducts}
            pagination={result.pagination}
            filterOptions={filterOptions}
            basePath="/search"
          />
        </Suspense>
      )}
    </div>
  );
}
