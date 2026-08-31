# Backend foundation (Supabase) — implementation review

See [m22_backend_foundation_scope.md](../m22_backend_foundation_scope.md) for the scope doc — read that first for the design rationale behind each schema decision.

## What shipped

- `supabase/schema.sql` — `profiles`, `enrollments`, `lesson_attempts`, `exercise_responses` (with nullable `audio_accuracy` and `expected_case`/`produced_case`/generated `case_error`), `subscriptions`; `updated_at` triggers; a `handle_new_user()` signup trigger; RLS enabled and policied on every table.
- `supabase/functions/create-checkout-session/index.ts`, `supabase/functions/stripe-webhook/index.ts` — the two Edge Functions M23 needs.
- `supabase/testing/mock_auth.sql`, `supabase/testing/rls_smoke_test.sql` — local-only verification scaffolding.
- `supabase/README.md` — deployment + local-verification instructions.

Nothing in `index.html` or `content/*.json` changed — this milestone is purely additive under `supabase/`.

## Verification

### Schema + RLS — against a real, running Postgres

This sandbox has no Docker daemon and no Supabase CLI, but does have a directly-installed PostgreSQL 16 server package. Started it (`sudo pg_ctlcluster 16 main start`, confirmed via `pg_lsclusters` showing `16 main 5432 online`) and used it as a genuine verification target rather than reasoning about the SQL in the abstract.

1. **Clean apply.** `mock_auth.sql` (mocks `auth.users` + a real-implementation-mirroring `auth.uid()`) then `schema.sql` applied to a fresh `arabic_backend_test` database with zero errors.
2. **RLS smoke test**, `supabase/testing/rls_smoke_test.sql`, asserts (and `raise exception`s on any failure):
   - Two learners sign up (insert into the mocked `auth.users`); `handle_new_user()`'s trigger creates each `profiles` row automatically.
   - Learner A can write their own `enrollments`/`lesson_attempts`/`exercise_responses`, and **cannot** insert a `lesson_attempts` row claiming `user_id = learner B`.
   - Learner B's `SELECT` on `lesson_attempts` returns exactly 1 row (their own), on `enrollments` returns 0 (A's row does not leak), and cannot read A's `profiles` row.
   - An authenticated learner's direct `INSERT` into `subscriptions` is rejected (no client write policy exists).
   - `service_role` (mocked with `bypassrls`, matching Supabase's real `service_role`) can insert into `subscriptions`; the owning learner can then `SELECT` that row via the read policy.
   - `case_error` is verified through all three real states, not just read from the DDL: `null`/`false` while `produced_case` is unset → `true` once `expected_case ≠ produced_case` → `false` again once they're updated to match.
3. **Full clean re-run.** Dropped and recreated the test database, re-ran `mock_auth.sql` → `schema.sql` → `rls_smoke_test.sql` from nothing, with no manual patching, and it passed outright.

### A real bug the test caught before this shipped

The first version of `rls_smoke_test.sql` explicitly did `insert into public.profiles (id) values (user_a), (user_b)` right after creating the two `auth.users` rows — and hit `duplicate key value violates unique constraint "profiles_pkey"`. That's not a test bug to shrug off; it's the `on_auth_user_created` trigger proving it actually fires (it had already created both rows). Fixed by deleting the redundant insert — which also means the trigger itself was verified as a side effect of the failure, not just by assertion.

A second real issue surfaced on the full clean re-run: `mock_auth.sql`'s original `grant all on all tables in schema public ...` ran before `schema.sql` created any tables, so the grant applied to nothing and every write from the `authenticated` role failed with `permission denied for table enrollments`. Fixed by switching to `alter default privileges ... grant all on tables to ...`, which applies to tables created afterward — confirmed by the subsequent clean end-to-end run passing with no manual grant step in between.

### Edge Functions — actually executed, against real SDKs, not just read

`deno.land`, `esm.sh`, `supabase.com`, and `api.stripe.com` are all rejected outright by this sandbox's egress proxy (`connect_rejected` / 403 on every one, confirmed via the proxy status endpoint) — a network-policy wall, not a missing-credentials problem, so no Deno runtime and no live Stripe/Supabase project were reachable no matter what credentials were supplied. Rather than stop at a syntax check, built `supabase/testing/functions/` (npm-only dependencies, all from the allowlisted registry): it bundles the real `supabase/functions/*/index.ts` source with esbuild (Deno's `esm.sh` imports redirected to the real `stripe`/`@supabase/supabase-js` npm packages, `Deno.serve`/`Deno.env` shimmed), runs the bundle in a Node `vm` context, and points it at a local mock HTTP server standing in for both `api.stripe.com` and a Supabase project's Auth/REST endpoints.

This exercises the actual code, not a description of it — 21 assertions, all passing:

- **`create-checkout-session`**: an unauthenticated request is rejected with 401 before any Stripe call is made; an authenticated request creates a real-shaped Stripe customer tagged with the *server-resolved* user id (never a client-supplied one) and returns the real Checkout URL; a returning learner reuses their stored `stripe_customer_id` instead of creating a duplicate.
- **`stripe-webhook`**: a request with an invalid signature is rejected with 400 and never reaches the database (verified using the real `stripe` SDK's own `webhooks.generateTestHeaderString` to construct genuinely valid signatures for the passing cases — this is real HMAC verification, not a mocked check); `checkout.session.completed` fetches the full subscription from Stripe and upserts it with the correct user id, status, and price id; `customer.subscription.deleted` resolves the right user via the stored `stripe_customer_id` when no user id is otherwise available, and updates status to `canceled`.

One real bug surfaced and was fixed along the way: the first version of the mock server's `subscriptions` lookup only filtered by `user_id`, but `stripe-webhook`'s cancellation-handling path queries by `stripe_customer_id` — the test failed with "no matching user for customer," which was the mock being wrong, not the function. Fixed by making the mock's filter logic generic across whatever column the real code queries by, and the resolution-by-customer-id path then passed for real.

What's still not done, stated plainly: a deploy against an actual live Supabase project and a real Stripe test-mode account, with Stripe's real webhook delivery and Supabase's real Auth/PostgREST behind it. That remains blocked by this sandbox's network policy specifically — not by anything in the code — and is owed before M23 puts a payment gate in front of learners. `supabase/README.md` documents exactly how to do that once a real project is reachable.

## Out of scope, confirmed unchanged

`index.html`, every `content/*.json`, `tools/*.js` — grep-verified none of these were touched by this milestone's diff. No auth UI, no client sync logic, no paywall UI — those are M22/M23's own work on top of this foundation.
