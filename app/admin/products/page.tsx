import { getAdminProductsAction } from "@/actions/admin-product.actions";
import { ProductsManager, AdminProduct } from "@/components/admin/products-manager";

export const metadata = {
  title: "Products Management | Varah Admin",
  description: "Manage sarees, update prices, change availability tags, and control inventory.",
};

export default async function AdminProductsPage() {
  const result = await getAdminProductsAction();
  const products = (result.data?.products || []) as unknown as AdminProduct[];
  const categories = result.data?.categories || [];

  return (
    <div className="max-w-7xl mx-auto py-4">
      <ProductsManager initialProducts={products} categories={categories} />
    </div>
  );
}
