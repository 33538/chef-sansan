"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-10 border-b border-brand-light bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-display text-xl text-foreground">Chef Sansan</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">
            seasonal &middot; handcrafted &middot; delivered
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-xs font-medium uppercase tracking-widest">
          <Link href="/" className="text-foreground/70 hover:text-foreground">
            Menu
          </Link>
          <Link href="/track" className="text-foreground/70 hover:text-foreground">
            Track order
          </Link>
          <Link
            href="/cart"
            className="relative rounded-full bg-brand px-5 py-2 text-background hover:bg-brand-dark"
          >
            Cart
            {itemCount > 0 && (
              <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-background px-1 text-foreground normal-case tracking-normal">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
