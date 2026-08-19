import { prisma } from "@/lib/prisma";
import { MenuItemCard } from "@/components/MenuItemCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const items = await prisma.menuItem.findMany({
    where: { available: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div>
      <section className="bg-brand-light">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center">
          <h1 className="text-3xl font-bold text-brand-dark sm:text-4xl">
            Homemade. Fresh. Healthy. Tasty.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-foreground/70">
            Every dish is cooked fresh by Chef Sansan using real, wholesome
            ingredients &mdash; delivered to your door or ready for pickup.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10">
        {items.length === 0 && (
          <p className="text-center text-foreground/60">
            The menu is being updated &mdash; check back soon!
          </p>
        )}

        {categories.map((category) => (
          <section key={category} className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-brand-dark">{category}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items
                .filter((i) => i.category === category)
                .map((item) => (
                  <MenuItemCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    description={item.description}
                    priceCents={item.priceCents}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
