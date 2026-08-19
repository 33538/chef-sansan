"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

function SuccessContent() {
  const { clear } = useCart();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-brand-dark">Thank you! 🎉</h1>
      <p className="mt-3 text-foreground/70">
        Your payment was received and your order is confirmed. Chef Sansan is
        already getting started.
      </p>
      {orderId && (
        <p className="mt-4 text-sm text-foreground/60">
          Order reference: <span className="font-mono">{orderId}</span>
        </p>
      )}
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href={orderId ? `/track?order=${orderId}` : "/track"}
          className="rounded-full bg-brand px-6 py-2 font-medium text-white hover:bg-brand-dark"
        >
          Track your order
        </Link>
        <Link
          href="/"
          className="rounded-full border border-brand-light px-6 py-2 font-medium text-brand-dark hover:bg-brand-light"
        >
          Back to menu
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
