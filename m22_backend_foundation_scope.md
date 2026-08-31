# Backend foundation (Supabase) — schema, RLS, Stripe

**Status:** Draft for review, implemented in the same pass per standing direction — see rollout note.

**Parent:** [ROADMAP.md](ROADMAP.md) M22 (student accounts) / M23 (subscriptions). Not itself M22 or M23 — this is the backend infrastructure both build on, laid down first per explicit direction: *"Lock in Supabase. Draft a PostgreSQL schema for users, enrollments, lesson_attempts, and exercise_responses (tracking audio accuracy + I'rab case errors). Implement Row Level Security (RLS) for privacy. Use Stripe via Supabase Edge Functions for M23 subscriptions."*

---

## 1. What this is (and isn't)

This locks in the backend decision ROADMAP.md left open ("Firebase Auth + Firestore *or* Supabase, decision surfaced when M22 starts") and delivers the schema/RLS/payments infrastructure. It does **not** implement M22 or M23 themselves — no auth UI, no client-side sync logic, no subscription gating in `index.html`. `index.html` is untouched by this milestone: it stays exactly the local-first, zero-runtime-dependency, buildless app it is today. Wiring the client to this backend is M22/M23's own work, once scoped.

Why land the infrastructure first, separately: the schema and RLS design is itself a real design decision worth reviewing on its own (table shapes, what's nullable, what the client can and can't write) before any client code depends on it — same reasoning this project has applied to every other foundation-before-feature milestone (M14 before M15, M19.5 before M21.5).

## 2. What it delivers

- **`supabase/schema.sql`** — the full DDL: `profiles`, `enrollments`, `lesson_attempts`, `exercise_responses`, `subscriptions`; `updated_at` triggers; a `handle_new_user()` signup trigger that creates the matching `profiles` row; RLS enabled and policied on every table.
- **`supabase/functions/create-checkout-session/`** and **`supabase/functions/stripe-webhook/`** — Deno Edge Functions for M23's Stripe integration.
- **`supabase/testing/`** — local-only scaffolding (`mock_auth.sql`, `rls_smoke_test.sql`) that mimics just enough of Supabase's `auth` schema to verify the RLS policies against a real, locally-running Postgres — not shipped to any real Supabase project.
- **`supabase/README.md`** — how to apply this to a real Supabase project and deploy the functions.

## 3. Schema design decisions

| Decision | Why |
|---|---|
| `profiles`, not extending `auth.users` | Supabase manages `auth.users` (email/password, etc.) directly; app-owned fields never belong on it. Standard Supabase pattern. |
| `lesson_id` / `object_id` are `text`, not foreign keys into a server-side content table | `CONTENT` is compiled into `index.html` at build time and never mirrored server-side (buildless-runtime rule, standing rule 5). A server-side mirror would be a second source of truth for content that already has one. |
| `enrollments.skill_levels` / `placement_result` are `jsonb`, not decomposed columns | These already exist client-side as `deriveLevel()` output (M15) and M17's placement result shape. Syncing the blob as-is avoids the schema having to track every strand/level the client adds; the client owns the shape. |
| `audio_accuracy` is nullable, no default, `numeric(4,3)` with a `[0,1]` check | Requested explicitly ("tracking audio accuracy"), but the client has no reliable pronunciation scorer today — ROADMAP.md's own "Explicitly deferred" list: *"Pronunciation scoring → the recorder stays 'compare to model'; no score unless a genuinely reliable one exists."* The column exists for when that changes; it is never backfilled with a guess in the meantime. |
| `expected_case` / `produced_case` / generated `case_error` | Requested explicitly ("I'rab case errors"). No i'rab-tagged grammar content exists yet — `content/grammar.json` has 3 entries, none case-related (verified by reading the file before writing this schema). Same honesty stance as `audio_accuracy`: the columns are real and ready, `case_error` is a `generated always as` column so it can never be hand-set inconsistently with its two inputs, and every row starts and stays `null`/`false` until real content and real client data exist to populate it. |
| `subscriptions` has no client insert/update/delete policy | Per the explicit direction, Stripe writes happen via the webhook Edge Function using the `service_role` key, which bypasses RLS. Giving the client any write path onto its own subscription status would let a compromised client (or a bug) grant itself premium access. |
| `lesson_attempts` / `exercise_responses` have no delete policy (only insert/select) | These are append-only pedagogical history, same as M19's `interactionLog`/`reviewState` philosophy — a learner's right to erase their data is exercised by deleting their account (`on delete cascade` from `auth.users`), not by editing individual rows. |

## 4. RLS design

Every table: `auth.uid() = user_id` (or `= id` for `profiles`) on every policy. No table is world-readable; no table lets one learner see another's rows, full stop — verified directly (§6), not just asserted.

## 5. Stripe via Edge Functions

- **`create-checkout-session`** — client-invoked (with the caller's Supabase JWT). Resolves the caller's identity via `auth.getUser()` on the incoming JWT — never trusts a user id passed in the request body. Creates (or reuses) a Stripe customer, starts a Checkout session, returns the redirect URL.
- **`stripe-webhook`** — Stripe-invoked directly (registered as a webhook endpoint, not called by the app). Verifies the Stripe signature before touching anything. Upserts `subscriptions` using the `service_role` key. Handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`; every other event type is ignored on purpose.

Both are genuinely new code with no live Stripe/Supabase project or Deno runtime available in this sandbox to execute end-to-end — see §6 for exactly what was and wasn't verified.

## 6. Verification

**Schema + RLS — verified against a real, running Postgres 16 server** (`sudo pg_ctlcluster 16 main start`; `arabic_backend_test` database), not just read:

1. `supabase/testing/mock_auth.sql` (mocks `auth.users` + `auth.uid()` to mirror Supabase's real implementation) + `supabase/schema.sql` applied cleanly to a fresh database, zero errors.
2. `supabase/testing/rls_smoke_test.sql` run against that database and passed every assertion:
   - The `on_auth_user_created` signup trigger really does create the matching `profiles` row (caught a real bug in an earlier version of the test script that inserted the row a second time — duplicate-key error proved the trigger fires).
   - Learner A cannot insert a `lesson_attempts` row claiming to belong to learner B (`auth.uid() = user_id` check policy blocks it).
   - Learner B's `SELECT` on `lesson_attempts`/`enrollments`/`profiles` returns zero of learner A's rows and exactly their own — real cross-user isolation, not just "the policy exists."
   - An authenticated learner cannot `INSERT` into `subscriptions` directly (no policy exists for it) — confirmed the insert is rejected.
   - `service_role` (mocked with `bypassrls`, mirroring Supabase's real `service_role`) can write `subscriptions`, and the owning learner can then read that row via the `select` policy.
   - `case_error` is `null`/`false` while `produced_case` is unset, becomes `true` once `expected_case ≠ produced_case`, and `false` again once they match — the generated column's logic verified through all three states, not just read from the DDL.
3. Re-ran the whole sequence (drop DB → recreate → mock_auth → schema → smoke test) end-to-end from a clean database as a final check — passed with no manual patching, after fixing a grant-ordering bug the first attempt surfaced (`alter default privileges` needed to be set before `schema.sql` creates the tables, not after).

**Edge Functions — verified by syntax check and manual review, not live execution:**

- `npx esbuild` transform-only pass on both files confirms valid TypeScript syntax.
- No Deno runtime, Supabase CLI, or live Stripe test-mode credentials are available in this sandbox, so the functions were **not** executed end-to-end against a real Stripe/Supabase project. This is stated plainly rather than glossed over — consistent with this project's own "never fabricate a result" standard. The logic (JWT-based identity resolution, signature verification before any DB write, `service_role` for the one legitimate writer of `subscriptions`) was checked against Stripe's and Supabase's own documented API shapes, but a real deploy-and-test pass against a live Supabase project is still owed before M23 ships a payment gate on top of this.

**Not touched, confirmed by diff:** `index.html`, every `content/*.json` file, `tools/*.js` — this milestone is additive-only under `supabase/`.

## 7. Out of scope

- M22's actual auth UI (sign-up/sign-in forms), client-side sync logic, and the local↔remote merge strategy for a learner who used the app offline before creating an account.
- M23's actual paywall / premium-gating UI in the client.
- Any change to `index.html` or the compiled `CONTENT`.
- A live deploy against a real Supabase + Stripe project (owed before M23 ships, per §6).
- i'rab-tagged grammar content itself, and a real pronunciation scorer — both remain their own, separately-scoped future work; this milestone only makes sure the schema has somewhere honest to put that data once it exists.

## 8. Rollout

Implemented directly following this scope doc in the same session, per standing direction. This PR carries the diff.
