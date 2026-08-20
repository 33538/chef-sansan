import Link from "next/link";
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
      <section className="border-b border-brand-light">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:py-32">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/50">
            Seasonal &middot; Handcrafted &middot; Delivered
          </p>
          <h1 className="mt-6 font-display text-5xl text-foreground sm:text-6xl">
            Homemade, <span className="italic">elevated.</span>
          </h1>
          <div className="mx-auto mt-6 h-px w-16 bg-brand-light" />
          <p className="mx-auto mt-6 max-w-md text-foreground/60">
            Chef-crafted meals made from real, wholesome ingredients
            &mdash; delivered to your door or ready for pickup.
          </p>
          <Link
            href="#menu"
            className="mt-10 inline-block rounded-full bg-brand px-8 py-3 text-sm font-medium uppercase tracking-wide text-background transition hover:bg-brand-dark"
          >
            See the menu
          </Link>
        </div>
      </section>

      <div id="menu" className="mx-auto max-w-4xl px-4 py-20 scroll-mt-20">
        {items.length === 0 && (
          <p className="text-center text-foreground/60">
            The menu is being updated &mdash; check back soon!
          </p>
        )}

        {categories.map((category) => (
          <section key={category} className="mb-16">
            <div className="mb-8 text-center">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/50">
                {category}
              </h2>
              <div className="mx-auto mt-3 h-px w-10 bg-brand-light" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items
                .filter((i) => i.category === category)
                .map((item) => (
                  <MenuItemCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    description={item.description}
                    priceCents={item.priceCents}
                    imageUrl={item.imageUrl}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
