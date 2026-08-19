import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { STARTER_MENU } from "@/lib/starterMenu";

export async function POST() {
  const existingCount = await prisma.menuItem.count();
  if (existingCount > 0) {
    return NextResponse.json(
      { error: "The menu already has items. Remove them first if you want to reload the starter menu." },
      { status: 400 }
    );
  }

  let sortOrder = 0;
  for (const group of STARTER_MENU) {
    for (const item of group.items) {
      await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          priceCents: item.priceCents,
          category: group.category,
          sortOrder: sortOrder++,
        },
      });
    }
  }

  return NextResponse.json({ seeded: sortOrder });
}
