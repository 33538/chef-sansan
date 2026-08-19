import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { menuItemSchema } from "@/lib/menuItemSchema";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = menuItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid item" },
      { status: 400 }
    );
  }

  const maxSort = await prisma.menuItem.aggregate({ _max: { sortOrder: true } });

  const item = await prisma.menuItem.create({
    data: { ...parsed.data, sortOrder: (maxSort._max.sortOrder ?? 0) + 1 },
  });

  return NextResponse.json(item, { status: 201 });
}
