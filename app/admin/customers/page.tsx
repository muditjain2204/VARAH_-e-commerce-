import { getAdminCustomersAction } from "@/actions/admin-order.actions";
import { CustomersManager } from "@/components/admin/customers-manager";

export const metadata = { title: "Customers | Varah Admin" };

export default async function AdminCustomersPage() {
  const result = await getAdminCustomersAction();
  return <CustomersManager customers={result.data || []} />;
}
