"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-10 border-b border-brand-light bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-xl font-bold text-brand-dark">Chef Sansan</span>
          <span className="text-xs text-foreground/60">homemade &middot; fresh &middot; healthy</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link href="/" className="hover:text-brand-dark">
            Menu
          </Link>
          <Link href="/track" className="hover:text-brand-dark">
            Track order
          </Link>
          <Link
            href="/cart"
            className="relative rounded-full bg-brand px-4 py-2 text-white hover:bg-brand-dark"
          >
            Cart
            {itemCount > 0 && (
              <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-brand-dark">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
