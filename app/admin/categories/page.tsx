import { getAdminCategoriesAction } from "@/actions/admin-category.actions";
import { CategoriesManager } from "@/components/admin/categories-manager";

export const metadata = {
  title: "Categories Management | Varah Admin",
  description: "Organize saree weaves, silk collections, and handloom categories.",
};

export default async function AdminCategoriesPage() {
  const result = await getAdminCategoriesAction();
  const categories = result.data || [];

  return (
    <div className="max-w-7xl mx-auto py-4">
      <CategoriesManager initialCategories={categories} />
    </div>
  );
}
