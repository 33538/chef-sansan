import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { menuItemSchema } from "@/lib/menuItemSchema";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = menuItemSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid item" },
      { status: 400 }
    );
  }

  const item = await prisma.menuItem.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const usedInOrder = await prisma.orderItem.findFirst({ where: { menuItemId: id } });
  if (usedInOrder) {
    const item = await prisma.menuItem.update({ where: { id }, data: { available: false } });
    return NextResponse.json({
      ...item,
      note: "Item has past orders, so it was hidden instead of deleted.",
    });
  }

  await prisma.menuItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
