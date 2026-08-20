"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatCents } from "@/lib/money";

type Props = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl?: string | null;
};

export function MenuItemCard({ id, name, description, priceCents, imageUrl }: Props) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    addItem({ menuItemId: id, name, priceCents });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <div className="group flex flex-col justify-between overflow-hidden border border-brand-light bg-background transition hover:border-foreground/30">
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-supplied URLs, not a fixed set of domains
        <img src={imageUrl} alt={name} className="h-44 w-full object-cover" />
      )}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg text-foreground">{name}</h3>
            <span className="whitespace-nowrap text-accent">{formatCents(priceCents)}</span>
          </div>
          <p className="mt-2 text-sm text-foreground/60">{description}</p>
        </div>
        <button
          onClick={handleAdd}
          className="mt-5 self-start border-b border-foreground/30 pb-0.5 text-xs font-medium uppercase tracking-widest text-foreground transition group-hover:border-foreground"
        >
          {justAdded ? "Added" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
