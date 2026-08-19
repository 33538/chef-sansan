"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ALL_ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/orderStatus";

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setUpdating(false);
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={updating}
      className="rounded-lg border border-brand-light px-2 py-1 text-sm disabled:opacity-60"
    >
      {ALL_ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
