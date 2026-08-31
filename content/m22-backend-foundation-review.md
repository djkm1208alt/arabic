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

### Edge Functions — syntax-checked and reviewed, not live-executed

No Deno runtime, Supabase CLI, or live Stripe/Supabase test credentials exist in this sandbox. Ran `npx esbuild` (transform-only, no bundling, so it never needed network access to resolve the `esm.sh` imports) against both function files to confirm valid TypeScript syntax — both passed clean. Beyond that, verification is manual review against Stripe's and Supabase's documented API shapes: JWT-based identity resolution in `create-checkout-session` (never trusts a client-supplied user id), signature verification before any database write in `stripe-webhook`, and `service_role` as the only path that ever writes `subscriptions`.

This is stated plainly as a gap, not glossed over: a real deploy-and-test pass against a live Supabase + Stripe test-mode project is still owed before M23 puts a payment gate in front of learners. `supabase/README.md` documents exactly how to do that when a real project is available.

## Out of scope, confirmed unchanged

`index.html`, every `content/*.json`, `tools/*.js` — grep-verified none of these were touched by this milestone's diff. No auth UI, no client sync logic, no paywall UI — those are M22/M23's own work on top of this foundation.
