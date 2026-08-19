import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { DeleteMenuItemButton } from "@/components/DeleteMenuItemButton";
import { SeedMenuButton } from "@/components/SeedMenuButton";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const items = await prisma.menuItem.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-brand-dark">Menu</h2>
        <Link
          href="/admin/menu/new"
          className="rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark"
        >
          Add item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-brand-light bg-white p-6">
          <p className="mb-3 text-foreground/60">
            No menu items yet. Load the starter menu to get going quickly, then
            edit it to match what you actually offer.
          </p>
          <SeedMenuButton />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brand-light bg-white">
          <table className="w-full text-sm">
            <thead className="bg-brand-light/50 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-brand-light">
                  <td className="p-3">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-foreground/50">{item.description}</div>
                  </td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{formatCents(item.priceCents)}</td>
                  <td className="p-3">
                    {item.available ? (
                      <span className="text-green-700">Available</span>
                    ) : (
                      <span className="text-foreground/40">Hidden</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/menu/${item.id}`}
                        className="text-sm text-brand-dark hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteMenuItemButton itemId={item.id} itemName={item.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
