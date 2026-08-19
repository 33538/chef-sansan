import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MenuItemCard } from "@/components/MenuItemCard";
import { GardenHero } from "@/components/illustrations/GardenHero";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const items = await prisma.menuItem.findMany({
    where: { available: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-light">
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-14 sm:py-20 md:grid-cols-2">
          <div className="text-center md:text-left">
            <h1 className="font-display text-4xl italic text-brand-dark sm:text-5xl">
              Homemade, Elevated.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-foreground/70 md:mx-0">
              Chef-crafted meals made from real, wholesome ingredients
              &mdash; delivered to your door or ready for pickup.
            </p>
            <Link
              href="#menu"
              className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-medium text-white transition hover:bg-brand-dark"
            >
              See the menu
            </Link>
          </div>
          <GardenHero className="mx-auto w-full max-w-sm md:max-w-none" />
        </div>

        <svg
          className="block w-full text-background"
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 20c150 30 300 30 450 10s300-30 450-10 200 30 300 10V60H0Z"
            fill="currentColor"
          />
        </svg>
      </section>

      <div id="menu" className="mx-auto max-w-5xl px-4 py-10 scroll-mt-20">
        {items.length === 0 && (
          <p className="text-center text-foreground/60">
            The menu is being updated &mdash; check back soon!
          </p>
        )}

        {categories.map((category) => (
          <section key={category} className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 font-display text-2xl italic text-brand-dark">
              <span aria-hidden="true">🌿</span>
              {category}
            </h2>
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
