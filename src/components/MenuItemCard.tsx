"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatCents } from "@/lib/money";

type Props = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
};

export function MenuItemCard({ id, name, description, priceCents }: Props) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    addItem({ menuItemId: id, name, priceCents });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <div className="flex flex-col justify-between rounded-xl border border-brand-light bg-white p-5 shadow-sm">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-foreground">{name}</h3>
          <span className="whitespace-nowrap font-semibold text-brand-dark">
            {formatCents(priceCents)}
          </span>
        </div>
        <p className="mt-2 text-sm text-foreground/70">{description}</p>
      </div>
      <button
        onClick={handleAdd}
        className="mt-4 self-start rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-white transition hover:bg-brand-dark"
      >
        {justAdded ? "Added ✓" : "Add to cart"}
      </button>
    </div>
  );
}
