@AGENTS.md

# Chef Sansan — project notes

Context for picking this project back up in a fresh session. See `README.md`
for setup/deploy instructions — this file is about decisions and state.

## What this is

A food ordering site for Chef Sansan, a homemade-food delivery business.
Customers browse a menu, order for delivery or pickup, and pay via Stripe
Checkout. There's a password-protected admin dashboard for managing the
menu and order statuses.

## Live status

- **Repo:** `33538/chef-sansan` on GitHub, `main` branch, auto-deploys to
  Vercel on every push.
- **Database:** Postgres via Neon, connected through Vercel's Storage tab.
  `DATABASE_URL` is set in Vercel's project env vars (Production + Preview).
- **Stripe:** test mode. Real `STRIPE_SECRET_KEY` /
  `STRIPE_WEBHOOK_SECRET` still need to be added by the owner (Vercel
  currently has placeholder values) before checkout will actually work.
- **Admin login:** password is whatever was set as `ADMIN_PASSWORD` in
  Vercel — not recorded here for obvious reasons. Menu can be populated via
  the "Load starter menu" button on `/admin/menu` if it's ever empty.

## Stack

Next.js 16 (App Router, TypeScript, Turbopack) · Tailwind CSS 4 · Prisma 7
with the `@prisma/adapter-pg` driver adapter · Stripe Checkout · `jose` for
signed admin session cookies.

## Notable decisions / gotchas hit along the way

- **Started on SQLite, switched to Postgres.** Vercel's filesystem is
  read-only/ephemeral at runtime, so a local SQLite file doesn't work there.
  Now Postgres-only, no SQLite code path left.
- **Schema sync uses `prisma db push`**, run automatically as part of
  `npm run build` (see `package.json`) — not formal migrations. Fine for
  this project's stage; revisit if the schema needs more careful
  versioning later.
- **Prisma 7 specifics:** custom client output (`src/generated/prisma`,
  gitignored, regenerated via `postinstall: prisma generate`), and the
  client entry point is `.../prisma/client`, not a bare `index.ts`.
- **Vercel's Neon integration** doesn't always create a plain
  `DATABASE_URL` — it can prefix vars with the connection's name (e.g.
  `DATABASE_URL_POSTGRES_PRISMA_URL`). If a future deploy fails with
  "Connection url is empty," check that a plain `DATABASE_URL` env var
  actually has a value in Vercel (edit it directly rather than re-adding).
- **Stock photo sites (Unsplash, Pexels, Wikimedia, Pixabay) are blocked**
  by this sandbox's network egress policy — don't retry fetching from
  them. The hero currently uses a hand-drawn SVG illustration
  (`src/components/illustrations/GardenHero.tsx`) instead of a photo. Swap
  in a real photo there if/when the owner provides one with proper rights.

## Brand voice

Went through a few rounds of copy iteration — landed on "elevated
homemade" rather than plain/generic:
- Hero: "Homemade, Elevated." / "Chef-crafted meals made from real,
  wholesome ingredients — delivered to your door or ready for pickup."
- Header tagline: "seasonal · handcrafted · delivered"
- Visual style: warm terracotta/olive/mustard palette, `Fraunces` italic
  serif for headings, subtle paper-grain texture, hand-drawn garden
  illustration. See `src/app/globals.css` for the color tokens.

## Intentionally simple (MVP scope)

- Flat $5 delivery fee (`src/lib/money.ts`).
- Single admin password, no multi-user roles.
- No email/SMS notifications — customers check status at `/track`.
- No formal Prisma migration history (see `db push` note above).

## Menu photos

`MenuItem.imageUrl` is optional. The admin menu form (add/edit) has a
"Photo URL" field — accepts a full URL or a root-relative path like
`/menu/photo.jpg` (for images placed directly in `public/menu/` and
committed to the repo, since the owner can't send image files through
chat in this environment). Rendered on the customer menu cards and as a
thumbnail in the admin menu list. No upload/blob storage wired up —
deliberately kept to "paste a URL" for now.

## Likely next steps

- Add real Stripe keys and test an actual end-to-end paid order.
- Owner is sending photos for each menu item — add them via the admin
  Photo URL field (or commit to `public/menu/`) once available.
- Confirm whether "Braised Beef Bowl" needs a rice/noodle choice — an
  earlier draft of the menu mentioned it, the final list didn't, so it's
  currently a single item with no variant.
- Maybe a real photo for the hero, once the owner has one with rights to
  use it commercially.
