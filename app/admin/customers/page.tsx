import { getAdminCustomersAction } from "@/actions/admin-order.actions";
import { CustomersManager } from "@/components/admin/customers-manager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = { title: "Customers | Varah Admin" };

export default async function AdminCustomersPage() {
  const result = await getAdminCustomersAction();
  return <CustomersManager customers={result.data || []} />;
}
