import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-brand-dark">Checkout cancelled</h1>
      <p className="mt-3 text-foreground/70">
        No worries &mdash; your cart is still saved. You can pick up where you
        left off.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/cart"
          className="rounded-full bg-brand px-6 py-2 font-medium text-white hover:bg-brand-dark"
        >
          Back to cart
        </Link>
        <Link
          href="/"
          className="rounded-full border border-brand-light px-6 py-2 font-medium text-brand-dark hover:bg-brand-light"
        >
          Browse menu
        </Link>
      </div>
    </div>
  );
}
