"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatCents, DELIVERY_FEE_CENTS } from "@/lib/money";

export default function CheckoutPage() {
  const { items, subtotalCents } = useCart();

  const [deliveryMethod, setDeliveryMethod] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryFeeCents = deliveryMethod === "DELIVERY" ? DELIVERY_FEE_CENTS : 0;
  const totalCents = subtotalCents + deliveryFeeCents;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-brand-dark">Your cart is empty</h1>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-2 font-medium text-white hover:bg-brand-dark"
        >
          Browse menu
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          deliveryMethod,
          deliveryAddress,
          deliveryNotes,
          items: items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-dark">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex gap-3">
          {(["DELIVERY", "PICKUP"] as const).map((method) => (
            <button
              type="button"
              key={method}
              onClick={() => setDeliveryMethod(method)}
              className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium ${
                deliveryMethod === method
                  ? "border-brand bg-brand-light text-brand-dark"
                  : "border-brand-light text-foreground/60"
              }`}
            >
              {method === "DELIVERY" ? "Delivery" : "Pickup"}
            </button>
          ))}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Full name</label>
          <input
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full rounded-lg border border-brand-light px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full rounded-lg border border-brand-light px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Phone</label>
          <input
            type="tel"
            required
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full rounded-lg border border-brand-light px-3 py-2"
          />
        </div>

        {deliveryMethod === "DELIVERY" && (
          <div>
            <label className="mb-1 block text-sm font-medium">Delivery address</label>
            <textarea
              required
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full rounded-lg border border-brand-light px-3 py-2"
              rows={2}
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">
            Notes <span className="text-foreground/40">(optional)</span>
          </label>
          <textarea
            value={deliveryNotes}
            onChange={(e) => setDeliveryNotes(e.target.value)}
            className="w-full rounded-lg border border-brand-light px-3 py-2"
            rows={2}
            placeholder="Allergies, gate code, preferred delivery time..."
          />
        </div>

        <div className="rounded-lg border border-brand-light bg-brand-light/40 p-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCents(subtotalCents)}</span>
          </div>
          <div className="flex justify-between">
            <span>{deliveryMethod === "DELIVERY" ? "Delivery fee" : "Pickup"}</span>
            <span>{deliveryFeeCents > 0 ? formatCents(deliveryFeeCents) : "Free"}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-brand-light pt-2 font-semibold">
            <span>Total</span>
            <span>{formatCents(totalCents)}</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand py-3 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {submitting ? "Redirecting to payment..." : `Pay ${formatCents(totalCents)}`}
        </button>
      </form>
    </div>
  );
}
