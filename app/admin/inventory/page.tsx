import { getAdminInventoryAction } from "@/actions/admin-order.actions";
import { InventoryManager } from "@/components/admin/inventory-manager";

export const metadata = {
  title: "Inventory & Stock Alerts | Varah Admin",
};

export default async function AdminInventoryPage() {
  const result = await getAdminInventoryAction();
  const items = result.data || [];

  return (
    <div className="max-w-7xl mx-auto py-4">
      <InventoryManager initialItems={items} />
    </div>
  );
}
