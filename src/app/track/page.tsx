"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatCents } from "@/lib/money";
import { ORDER_STATUS_LABELS } from "@/lib/orderStatus";

type OrderResult = {
  id: string;
  status: string;
  deliveryMethod: "DELIVERY" | "PICKUP";
  createdAt: string;
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  items: { name: string; quantity: number; priceCents: number }[];
};

function TrackContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("order") ?? "");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookup(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/orders/lookup?order=${encodeURIComponent(orderId)}&email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Order not found");
        return;
      }
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-brand-dark">Track your order</h1>
      <p className="mb-6 text-sm text-foreground/60">
        Enter your order reference and the email you used at checkout.
      </p>

      <form onSubmit={lookup} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Order reference</label>
          <input
            required
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full rounded-lg border border-brand-light px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-brand-light px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand py-2.5 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Looking up..." : "Track order"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-8 rounded-xl border border-brand-light bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-brand-dark">
              {ORDER_STATUS_LABELS[result.status] ?? result.status}
            </span>
            <span className="text-xs text-foreground/50">
              {new Date(result.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="mt-1 text-sm text-foreground/60">
            {result.deliveryMethod === "DELIVERY" ? "Delivery" : "Pickup"}
          </p>

          <ul className="mt-4 divide-y divide-brand-light border-t border-brand-light">
            {result.items.map((item, idx) => (
              <li key={idx} className="flex justify-between py-2 text-sm">
                <span>
                  {item.quantity}&times; {item.name}
                </span>
                <span>{formatCents(item.priceCents * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex justify-between border-t border-brand-light pt-3 font-semibold">
            <span>Total</span>
            <span>{formatCents(result.totalCents)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={null}>
      <TrackContent />
    </Suspense>
  );
}
