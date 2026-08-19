"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteMenuItemButton({ itemId, itemName }: { itemId: string; itemName: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Remove "${itemName}" from the menu?`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/menu-items/${itemId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-sm text-foreground/40 hover:text-red-600 disabled:opacity-60"
    >
      {deleting ? "Removing..." : "Remove"}
    </button>
  );
}
