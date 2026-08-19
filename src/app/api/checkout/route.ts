import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { checkoutRequestSchema } from "@/lib/checkoutSchema";
import { DELIVERY_FEE_CENTS } from "@/lib/money";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const menuItemIds = data.items.map((i) => i.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds }, available: true },
  });

  if (menuItems.length !== new Set(menuItemIds).size) {
    return NextResponse.json(
      { error: "One or more items in your cart are no longer available" },
      { status: 400 }
    );
  }

  const orderLines = data.items.map((cartItem) => {
    const menuItem = menuItems.find((m) => m.id === cartItem.menuItemId)!;
    return {
      menuItemId: menuItem.id,
      nameSnapshot: menuItem.name,
      priceCentsSnapshot: menuItem.priceCents,
      quantity: cartItem.quantity,
    };
  });

  const subtotalCents = orderLines.reduce(
    (sum, l) => sum + l.priceCentsSnapshot * l.quantity,
    0
  );
  const deliveryFeeCents = data.deliveryMethod === "DELIVERY" ? DELIVERY_FEE_CENTS : 0;
  const totalCents = subtotalCents + deliveryFeeCents;

  const order = await prisma.order.create({
    data: {
      status: "PENDING_PAYMENT",
      deliveryMethod: data.deliveryMethod,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      deliveryAddress: data.deliveryMethod === "DELIVERY" ? data.deliveryAddress : null,
      deliveryNotes: data.deliveryNotes || null,
      subtotalCents,
      deliveryFeeCents,
      totalCents,
      items: {
        create: orderLines,
      },
    },
  });

  const origin = req.nextUrl.origin;

  const lineItems: Array<{
    price_data: {
      currency: string;
      product_data: { name: string };
      unit_amount: number;
    };
    quantity: number;
  }> = orderLines.map((l) => ({
    price_data: {
      currency: "usd",
      product_data: { name: l.nameSnapshot },
      unit_amount: l.priceCentsSnapshot,
    },
    quantity: l.quantity,
  }));

  if (deliveryFeeCents > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery fee" },
        unit_amount: deliveryFeeCents,
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: data.customerEmail,
    line_items: lineItems,
    success_url: `${origin}/checkout/success?order=${order.id}`,
    cancel_url: `${origin}/checkout/cancel?order=${order.id}`,
    metadata: { orderId: order.id },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeCheckoutSessionId: session.id },
  });

  return NextResponse.json({ url: session.url });
}
