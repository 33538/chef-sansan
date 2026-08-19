import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MenuItemForm } from "@/components/MenuItemForm";

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.menuItem.findUnique({ where: { id } });

  if (!item) notFound();

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-brand-dark">Edit menu item</h2>
      <MenuItemForm
        mode="edit"
        itemId={item.id}
        initial={{
          name: item.name,
          description: item.description,
          priceCents: item.priceCents,
          category: item.category,
          available: item.available,
        }}
      />
    </div>
  );
}
