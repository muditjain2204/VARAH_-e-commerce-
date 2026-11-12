import { cookies } from "next/headers";
import { Navbar, Footer, WhatsAppButton } from "@/components/layout";
import { AdminPreviewBar } from "@/components/admin/admin-preview-bar";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAdmin = Boolean(cookieStore.get("varah_admin_session")?.value);

  return (
    <div className="flex min-h-screen flex-col">
      <AdminPreviewBar isAdmin={isAdmin} />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
