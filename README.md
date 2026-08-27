# Sauce Tao

Ordering site for Sauce Tao — homemade, fresh, healthy meals, available for
delivery or pickup.

Built with Next.js (App Router), Prisma + Postgres, and Stripe Checkout.

## What's here

- **Customer site** (`/`) — menu grid grouped by category, cart, checkout
  (delivery or pickup) via Stripe Checkout, order confirmation, and an order
  status lookup page at `/track`.
- **Admin dashboard** (`/admin`) — password-protected. Manage the menu
  (add/edit/hide items) and view/update order statuses.
- **Stripe webhook** — confirms orders once payment succeeds.

## Deploying on Vercel (no local install needed)

1. On [vercel.com](https://vercel.com), sign in with GitHub and import this
   repo (`33538/chef-sansan`).
2. Before deploying, add a database: in the project's **Storage** tab,
   create a **Postgres** database (Neon, free tier) and connect it to the
   project. This automatically sets `DATABASE_URL`.
3. Fill in the other environment variables Vercel detects from
   `.env.example` (see the table below).
4. Deploy. The build runs `prisma db push` automatically, which creates the
   database tables on first deploy.
5. Once it's live, go to `/admin/login`, sign in, and click **Load starter
   menu** on the Menu tab to populate it with sample dishes — no local
   commands needed. Edit from there to match what you actually offer.

### Environment variables

| Variable | What it's for |
| --- | --- |
| `DATABASE_URL` | Postgres connection string. Auto-filled if you use Vercel's Storage tab; otherwise get one free from [neon.tech](https://neon.tech). |
| `STRIPE_SECRET_KEY` | Test-mode secret key from the [Stripe dashboard](https://dashboard.stripe.com/test/apikeys) (starts with `sk_test_`). |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the checkout webhook (see below). |
| `ADMIN_PASSWORD` | Password for `/admin`. Pick something only you know. |
| `ADMIN_SESSION_SECRET` | Random string used to sign admin session cookies. Any long random string works — e.g. mash the keyboard for 40+ characters. |

### Setting up the Stripe webhook (so orders confirm after payment)

1. In the [Stripe dashboard](https://dashboard.stripe.com/test/webhooks)
   (test mode), add an endpoint pointing at
   `https://<your-vercel-domain>/api/stripe/webhook`, subscribed to the
   `checkout.session.completed` event.
2. Copy the endpoint's signing secret (`whsec_...`) into
   `STRIPE_WEBHOOK_SECRET` in Vercel's project settings, then redeploy.
3. Place a test order and pay with a Stripe test card, e.g.
   `4242 4242 4242 4242`, any future expiry date, any CVC, any ZIP.
4. The order flips from "Awaiting payment" to "Confirmed" once the webhook
   fires — watch it update in `/admin/orders`.

No real charges happen in test mode. Swap in live Stripe keys (and a live
webhook endpoint) when you're ready to accept real orders.

## Running it locally

Once you have Node.js installed (e.g. on a personal machine):

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL (same Postgres DB as above,
                        # or a fresh one) and the other values
npm run db:push         # syncs the schema to your database
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For webhook testing
locally, use the [Stripe CLI](https://docs.stripe.com/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Data model

- `MenuItem` — name, description, price, category, availability.
- `Order` — customer info, delivery method (delivery/pickup), address,
  status, totals, Stripe session/payment IDs.
- `OrderItem` — line items snapshot the item's name/price at order time, so
  editing the menu later doesn't change historical orders.

## Admin dashboard

Go to `/admin/login` and sign in with `ADMIN_PASSWORD`.

- **Orders** — every order, newest first, with a status dropdown
  (Confirmed → Preparing → Out for delivery / Ready for pickup → Completed).
- **Menu** — add, edit, or remove items (or load the starter menu if it's
  empty). Removing an item that's already part of a past order hides it
  instead of deleting it, so order history stays intact.

## Notes on what's intentionally simple

This is a solid MVP, not an enterprise platform. A few things to know:

- Delivery fee is a flat $5, set in `src/lib/money.ts`.
- There's a single admin password (no multi-user accounts/roles).
- No email/SMS notifications yet — customers check status at `/track`.
- No live order-status push updates — the track page is check-on-demand.
