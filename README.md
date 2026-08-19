# Chef Sansan

Ordering site for Chef Sansan — homemade, fresh, healthy meals, available for
delivery or pickup.

Built with Next.js (App Router), Prisma + SQLite, and Stripe Checkout.

## What's here

- **Customer site** (`/`) — menu grid grouped by category, cart, checkout
  (delivery or pickup) via Stripe Checkout, order confirmation, and an order
  status lookup page at `/track`.
- **Admin dashboard** (`/admin`) — password-protected. Manage the menu
  (add/edit/hide items) and view/update order statuses.
- **Stripe webhook** — confirms orders once payment succeeds.

## Setup

```bash
npm install
cp .env.example .env   # then fill in the values below
npm run db:migrate     # creates the SQLite database
npm run db:seed        # loads the starter menu
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables (`.env`)

| Variable | What it's for |
| --- | --- |
| `DATABASE_URL` | SQLite file path. Default `file:./dev.db` is fine for local dev. |
| `STRIPE_SECRET_KEY` | Test-mode secret key from the [Stripe dashboard](https://dashboard.stripe.com/test/apikeys) (starts with `sk_test_`). |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the checkout webhook (see below). |
| `ADMIN_PASSWORD` | Password for `/admin`. Change it from the default. |
| `ADMIN_SESSION_SECRET` | Random string used to sign admin session cookies. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |

### Testing payments locally (Stripe test mode)

1. Install the [Stripe CLI](https://docs.stripe.com/stripe-cli) and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   This prints a `whsec_...` value — put it in `STRIPE_WEBHOOK_SECRET`.
2. Place an order and pay with a Stripe test card, e.g. `4242 4242 4242 4242`,
   any future expiry date, any CVC, any ZIP.
3. The order flips from "Awaiting payment" to "Confirmed" once the webhook
   fires — watch it update in `/admin/orders`.

No real charges happen in test mode. Swap in live keys (and a live webhook
endpoint configured in the Stripe dashboard) when you're ready to accept real
orders.

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
- **Menu** — add, edit, or remove items. Removing an item that's already
  part of a past order hides it instead of deleting it, so order history
  stays intact.

## Notes on what's intentionally simple

This is a solid MVP, not an enterprise platform. A few things to know:

- Delivery fee is a flat $5, set in `src/lib/money.ts`.
- There's a single admin password (no multi-user accounts/roles).
- No email/SMS notifications yet — customers check status at `/track`.
- No live order-status push updates — the track page is check-on-demand.

## Deploying

Any Node hosting works (Vercel, Railway, Fly.io, etc.). For production you'll
want to:

- Swap SQLite for a hosted Postgres/MySQL database (`DATABASE_URL` +
  matching Prisma driver adapter).
- Use live Stripe keys and register a production webhook endpoint in the
  Stripe dashboard pointing at `/api/stripe/webhook`.
- Set strong, unique values for `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
