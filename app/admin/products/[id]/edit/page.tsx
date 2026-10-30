import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Product | Varah Admin",
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Products</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold font-playfair tracking-tight text-foreground">
          Edit Saree #{id}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Quick editing for prices and availability tags is also available directly in the Products table.
        </p>
      </div>

      <div className="p-8 rounded-2xl border border-border bg-card shadow-sm text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Saree pricing, stock, and tags (In Stock, Out of Stock, Upcoming) can be updated in 1-click on the Products Dashboard.
        </p>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm"
        >
          <span>Open Products Catalog Manager</span>
        </Link>
      </div>
    </div>
  );
}
