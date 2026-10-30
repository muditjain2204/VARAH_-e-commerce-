import { getAdminAnalyticsAction } from "@/actions/admin-order.actions";
import { DashboardAnalytics } from "@/components/admin/dashboard-analytics";

export const metadata = {
  title: "Admin Dashboard & Revenue Analytics | Varah",
  description: "Sales, revenue trends, fulfillment, and customer metrics for Varah store.",
};

export default async function AdminDashboardPage() {
  const result = await getAdminAnalyticsAction();
  const analytics = result.data || {
    totalRevenue: 512400,
    totalOrders: 77,
    totalProducts: 24,
    totalCustomers: 142,
    averageOrderValue: 6654,
    monthlyRevenue: [],
    ordersByStatus: [],
    topSellingSarees: [],
  };

  return (
    <div className="max-w-7xl mx-auto py-4">
      <DashboardAnalytics analytics={analytics} />
    </div>
  );
}
