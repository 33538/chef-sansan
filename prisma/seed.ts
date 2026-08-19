import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { STARTER_MENU } from "../src/lib/starterMenu";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding menu...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();

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

  console.log(`Seeded ${sortOrder} menu items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
