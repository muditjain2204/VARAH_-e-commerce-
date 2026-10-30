import { getAdminCouponsAction } from "@/actions/admin-coupon.actions";
import { CouponsManager } from "@/components/admin/coupons-manager";

export const metadata = {
  title: "Coupon & Discount Management | Varah Admin",
  description: "Create and manage promotional discount codes, validity windows, and usage caps.",
};

export default async function AdminCouponsPage() {
  const result = await getAdminCouponsAction();
  const coupons = result.data || [];

  return (
    <div className="max-w-7xl mx-auto py-4">
      <CouponsManager initialCoupons={coupons} />
    </div>
  );
}
