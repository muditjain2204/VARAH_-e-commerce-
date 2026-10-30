import { notFound } from "next/navigation";
import { getAdminOrderDetailAction } from "@/actions/admin-order.actions";
import { OrderDetailView } from "@/components/admin/order-detail-view";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Order Fulfillment | Varah Admin",
};

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params;
  const result = await getAdminOrderDetailAction(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto py-4">
      <OrderDetailView initialOrder={result.data} />
    </div>
  );
}
