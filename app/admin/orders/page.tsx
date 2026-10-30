import { getAdminOrdersAction } from "@/actions/admin-order.actions";
import { OrdersManager } from "@/components/admin/orders-manager";

export const metadata = {
  title: "Orders Management | Varah Admin",
  description: "Fulfill customer orders, assign couriers, and generate shipping labels.",
};

export default async function AdminOrdersPage() {
  const result = await getAdminOrdersAction();
  const orders = result.data || [];

  return (
    <div className="max-w-7xl mx-auto py-4">
      <OrdersManager initialOrders={orders} />
    </div>
  );
}
