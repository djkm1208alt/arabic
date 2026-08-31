# Supabase backend

Infrastructure for M22 (student accounts) and M23 (subscriptions). See
[../m22_backend_foundation_scope.md](../m22_backend_foundation_scope.md) for
the design rationale and
[../content/m22-backend-foundation-review.md](../content/m22-backend-foundation-review.md)
for how it was verified. This directory has no effect on the app today —
`index.html` does not call any of it yet.

## Layout

- `schema.sql` — tables, triggers, and RLS policies. Apply to a real
  Supabase project.
- `functions/create-checkout-session/` — client-invoked Edge Function that
  starts a Stripe Checkout session.
- `functions/stripe-webhook/` — Stripe-invoked Edge Function; the only
  writer of `public.subscriptions`.
- `testing/` — **local verification scaffolding only.** Mocks just enough
  of Supabase's `auth` schema to prove `schema.sql`'s RLS policies against
  a plain local Postgres install. Never apply `testing/mock_auth.sql` to a
  real Supabase project — it already provides `auth.users`/`auth.uid()`.

## Applying the schema to a real project

```
supabase link --project-ref <your-project-ref>
supabase db push        # applies schema.sql
```

(or paste `schema.sql` into the Supabase SQL editor).

## Deploying the Edge Functions

```
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook --no-verify-jwt
```

`stripe-webhook` needs `--no-verify-jwt` since Stripe calls it directly,
not with a Supabase JWT — the function verifies the Stripe signature
itself instead.

Secrets (`supabase secrets set KEY=value`):

| Secret | Used by |
|---|---|
| `STRIPE_SECRET_KEY` | both functions |
| `STRIPE_PRICE_ID` | `create-checkout-session` |
| `CHECKOUT_SUCCESS_URL`, `CHECKOUT_CANCEL_URL` | `create-checkout-session` |
| `STRIPE_WEBHOOK_SECRET` | `stripe-webhook` (from the Stripe dashboard, after registering the endpoint) |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | both functions (Supabase sets `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` automatically for every project; `SUPABASE_ANON_KEY` still needs setting explicitly) |

Register the webhook endpoint's URL in the Stripe dashboard for at least:
`checkout.session.completed`, `customer.subscription.updated`,
`customer.subscription.deleted`.

## Running the Edge Function verification yourself

`testing/functions/` runs the **real** `functions/*/index.ts` code (bundled
with esbuild, Deno globals shimmed) against a local mock Stripe/Supabase
server, using the real `stripe` and `@supabase/supabase-js` npm packages —
no network egress needed, no live credentials needed:

```
cd testing/functions
npm install
npm test
```

A clean run ends with `N passed, 0 failed`. This is **not** a substitute for
a real deploy against live Supabase + Stripe test-mode projects (network
policy in the sandbox this was built in blocks `supabase.com`,
`api.stripe.com`, `esm.sh`, and `deno.land` outright — not a credentials
problem, an egress one) — but it does exercise every real code path: JWT
identity resolution, Stripe signature verification, customer reuse vs.
creation, and the exact upsert payload written to `subscriptions` for all
three webhook event types.

## Running the local RLS verification yourself

Requires a local Postgres server (no Supabase CLI or Docker needed):

```
createdb arabic_backend_test
psql -d arabic_backend_test -f testing/mock_auth.sql
psql -d arabic_backend_test -f schema.sql
psql -d arabic_backend_test -f testing/rls_smoke_test.sql
```

A clean run ends with `NOTICE: ALL RLS SMOKE TEST ASSERTIONS PASSED` and
`NOTICE: CASE_ERROR DERIVATION ASSERTIONS PASSED`; any RLS regression
raises a `FAIL:` exception instead.
