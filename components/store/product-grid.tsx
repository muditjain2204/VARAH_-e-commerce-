"use client";

import { useState } from "react";
import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { ProductCard, ProductFilters, ProductSort, Pagination } from "@/components/store";
import { TopBarPriceFilter } from "./top-bar-price-filter";

interface ProductGridProps {
  products: Array<{
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
  }>;
  pagination: {
    page: number;
    total: number;
    totalPages: number;
  };
  filterOptions: {
    fabrics: string[];
    occasions: string[];
    colors: string[];
  };
  basePath: string;
}

export function ProductGrid({
  products,
  pagination,
  filterOptions,
  basePath,
}: ProductGridProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="flex gap-8">
      {/* Filter sidebar */}
      <ProductFilters
        fabrics={filterOptions.fabrics}
        occasions={filterOptions.occasions}
        colors={filterOptions.colors}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      {/* Product grid */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="space-y-3 mb-6 bg-card/60 p-3.5 rounded-2xl border border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {products.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {pagination.total}
              </span>{" "}
              sarees
            </p>
            <div className="flex items-center gap-2">
              <ProductSort />
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden p-2 rounded-lg border border-input hover:bg-accent transition-colors flex items-center gap-1.5 text-xs font-medium"
                aria-label="Open filters"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Top Bar Custom Price Range Filter */}
          <div className="pt-2.5 border-t border-border/50">
            <TopBarPriceFilter />
          </div>
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                basePath={basePath}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-20 border border-dashed border-border rounded-xl">
            <div className="text-center space-y-3">
              <div className="text-5xl">🪷</div>
              <p className="text-muted-foreground font-medium">
                No sarees found
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or search terms
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
