import Link from "next/link";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-brand-dark">Chef Sansan — Admin</h1>
          <nav className="mt-2 flex gap-4 text-sm font-medium">
            <Link href="/admin/orders" className="hover:text-brand-dark">
              Orders
            </Link>
            <Link href="/admin/menu" className="hover:text-brand-dark">
              Menu
            </Link>
          </nav>
        </div>
        <AdminLogoutButton />
      </div>
      {children}
    </div>
  );
}
