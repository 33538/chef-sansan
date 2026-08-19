"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatCents } from "@/lib/money";

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotalCents } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-brand-dark">Your cart is empty</h1>
        <p className="mt-2 text-foreground/60">Add something tasty from the menu.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-2 font-medium text-white hover:bg-brand-dark"
        >
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-dark">Your cart</h1>

      <ul className="divide-y divide-brand-light rounded-xl border border-brand-light bg-white">
        {items.map((item) => (
          <li key={item.menuItemId} className="flex items-center justify-between gap-4 p-4">
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-foreground/60">{formatCents(item.priceCents)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label={`Decrease quantity of ${item.name}`}
                onClick={() => setQuantity(item.menuItemId, item.quantity - 1)}
                className="h-7 w-7 rounded-full border border-brand-light text-brand-dark hover:bg-brand-light"
              >
                −
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                aria-label={`Increase quantity of ${item.name}`}
                onClick={() => setQuantity(item.menuItemId, item.quantity + 1)}
                className="h-7 w-7 rounded-full border border-brand-light text-brand-dark hover:bg-brand-light"
              >
                +
              </button>
            </div>
            <p className="w-20 text-right font-medium">
              {formatCents(item.priceCents * item.quantity)}
            </p>
            <button
              aria-label={`Remove ${item.name}`}
              onClick={() => removeItem(item.menuItemId)}
              className="text-sm text-foreground/40 hover:text-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between text-lg font-semibold">
        <span>Subtotal</span>
        <span>{formatCents(subtotalCents)}</span>
      </div>
      <p className="mt-1 text-sm text-foreground/60">
        Delivery fee and pickup option shown at checkout.
      </p>

      <Link
        href="/checkout"
        className="mt-6 block w-full rounded-full bg-brand py-3 text-center font-medium text-white hover:bg-brand-dark"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}
