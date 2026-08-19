import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("order")?.trim();
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  if (!orderId || !email) {
    return NextResponse.json({ error: "Order ID and email are required" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.customerEmail.toLowerCase() !== email) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: order.id,
    status: order.status,
    deliveryMethod: order.deliveryMethod,
    createdAt: order.createdAt,
    subtotalCents: order.subtotalCents,
    deliveryFeeCents: order.deliveryFeeCents,
    totalCents: order.totalCents,
    items: order.items.map((i) => ({
      name: i.nameSnapshot,
      quantity: i.quantity,
      priceCents: i.priceCentsSnapshot,
    })),
  });
}
