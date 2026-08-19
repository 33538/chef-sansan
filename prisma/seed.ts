import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const menu = [
  {
    category: "Mains",
    items: [
      {
        name: "Braised Short Rib Rice Bowl",
        description:
          "Slow-braised beef short rib over jasmine rice with roasted root vegetables and a red-wine pan sauce.",
        priceCents: 1600,
      },
      {
        name: "Herb Roast Chicken Plate",
        description:
          "Free-range chicken thigh roasted with rosemary and garlic, served with mashed potatoes and green beans.",
        priceCents: 1400,
      },
      {
        name: "Grandma's Chicken Noodle Soup",
        description:
          "A from-scratch bone broth simmered all day with egg noodles, carrots, and shredded chicken.",
        priceCents: 1100,
      },
      {
        name: "Homestyle Vegetable Lasagna",
        description:
          "Layers of fresh pasta, ricotta, roasted zucchini and mushrooms, baked with a light tomato sauce.",
        priceCents: 1300,
      },
    ],
  },
  {
    category: "Bowls & Salads",
    items: [
      {
        name: "Quinoa Power Bowl",
        description:
          "Quinoa, roasted sweet potato, chickpeas, kale, and a lemon-tahini dressing. Vegan.",
        priceCents: 1200,
      },
      {
        name: "Citrus Kale Salad",
        description:
          "Massaged kale, orange segments, toasted almonds, and shaved parmesan with a citrus vinaigrette.",
        priceCents: 1000,
      },
    ],
  },
  {
    category: "Soups & Sides",
    items: [
      {
        name: "Roasted Tomato Basil Soup",
        description: "Slow-roasted tomatoes blended with fresh basil and a touch of cream.",
        priceCents: 700,
      },
      {
        name: "Garlic Herb Roasted Potatoes",
        description: "Crispy baby potatoes roasted with garlic, rosemary, and sea salt.",
        priceCents: 500,
      },
    ],
  },
  {
    category: "Desserts",
    items: [
      {
        name: "Warm Apple Crumble",
        description: "Cinnamon-baked apples with an oat-brown sugar crumble topping.",
        priceCents: 650,
      },
      {
        name: "Homemade Banana Bread Slice",
        description: "Moist banana bread baked fresh with walnuts.",
        priceCents: 450,
      },
    ],
  },
  {
    category: "Drinks",
    items: [
      {
        name: "Fresh Lemonade",
        description: "Squeezed daily, lightly sweetened.",
        priceCents: 400,
      },
      {
        name: "Iced Hibiscus Tea",
        description: "Brewed hibiscus flowers over ice, naturally tart and refreshing.",
        priceCents: 400,
      },
    ],
  },
];

async function main() {
  console.log("Seeding menu...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();

  let sortOrder = 0;
  for (const group of menu) {
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
