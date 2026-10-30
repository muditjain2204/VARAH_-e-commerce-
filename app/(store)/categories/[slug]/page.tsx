import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, getProducts, getFilterOptions } from "@/lib/services/product.service";
import { ProductGrid } from "@/components/store";
import type { ProductFilters } from "@/types";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${category.name} Sarees Online`,
    description:
      category.description ||
      `Shop premium ${category.name} sarees online at Varah Store. Authentic handcrafted ${category.name.toLowerCase()} sarees with free shipping across India.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const filters: ProductFilters = {
    categorySlug: slug,
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
          {category.name} Sarees
        </h1>
        {category.description && (
          <p className="text-muted-foreground max-w-2xl">
            {category.description}
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          {result.pagination.total} products found
        </p>
      </div>

      <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
        <ProductGrid
          products={serializedProducts}
          pagination={result.pagination}
          filterOptions={filterOptions}
          basePath={`/categories/${slug}`}
        />
      </Suspense>
    </div>
  );
}
