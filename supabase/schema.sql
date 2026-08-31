-- ============================================================================
-- Backend foundation — M22 (student accounts) / M23 (subscriptions)
-- Target: Supabase (Postgres 15+). See m22_backend_foundation_scope.md for
-- the design rationale and content/m22-backend-foundation-review.md for how
-- this was verified.
--
-- Apply with the Supabase CLI (`supabase db push`) or paste into the SQL
-- editor. Assumes the standard Supabase project setup: `auth.users` and
-- `auth.uid()` already exist and are managed by Supabase — this file never
-- creates or modifies anything under the `auth` schema.
--
-- `supabase/testing/` mocks `auth.users`/`auth.uid()` for local verification
-- against a plain Postgres install (no Supabase project needed); that mock
-- is dev-only scaffolding, not part of this schema.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles — one row per auth.users row. Supabase's own auth.users table
-- carries email/password and must not be extended directly, so app-owned
-- learner fields live here instead. Row created automatically on signup.
-- ----------------------------------------------------------------------------
create table public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    display_name text,
    preferences jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.profiles is
    'One row per auth.users row. App-owned learner fields Supabase auth cannot hold.';
comment on column public.profiles.preferences is
    'Free-form learner preferences (theme, audio settings, etc.) — client-defined shape, not enforced here.';

-- ----------------------------------------------------------------------------
-- enrollments — one row per (learner, course). `course_slug` defaults to
-- the single course that exists today but is not hard-coded to it, so a
-- future second course does not require a schema change.
-- `skill_levels` / `placement_result` mirror the client's existing
-- `deriveLevel()` output and M17 placement result shape respectively —
-- synced blobs, not decomposed into columns, so the schema does not need
-- to track every strand/level the client adds over time.
-- ----------------------------------------------------------------------------
create table public.enrollments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    course_slug text not null default 'arabic-core',
    skill_levels jsonb not null default '{}'::jsonb,
    placement_result jsonb,
    started_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (user_id, course_slug)
);

comment on table public.enrollments is
    'One row per learner per course. skill_levels/placement_result are synced client blobs (deriveLevel / M17 placement output), not decomposed into columns.';

-- ----------------------------------------------------------------------------
-- lesson_attempts — one row per lesson run (M16 curriculum lesson_id, a
-- client-side CONTENT identifier — deliberately NOT a foreign key, since
-- CONTENT stays compiled into index.html and is never mirrored server-side;
-- see the scope doc for why).
-- ----------------------------------------------------------------------------
create table public.lesson_attempts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    lesson_id text not null,
    started_at timestamptz not null default now(),
    completed_at timestamptz,
    steps_total int not null check (steps_total >= 0),
    steps_correct int not null default 0 check (steps_correct >= 0),
    created_at timestamptz not null default now(),
    check (completed_at is null or completed_at >= started_at),
    check (steps_correct <= steps_total)
);

create index lesson_attempts_user_id_idx on public.lesson_attempts (user_id, started_at desc);

comment on table public.lesson_attempts is
    'One row per lesson run. lesson_id is a client-side CONTENT/curriculum id — not a foreign key, since CONTENT is compiled into index.html and never mirrored server-side.';

-- ----------------------------------------------------------------------------
-- exercise_responses — one row per graded exercise item within an attempt.
-- object_id mirrors lesson_id's non-FK rationale (a CONTENT learning-object
-- id: lex:/let:/mrk:/syl:/gr:/txt: — see CURRICULUM_ARCHITECTURE.md).
--
-- audio_accuracy and the i'rab (case-ending) columns are deliberately
-- nullable with no default and no backfill: the client has no reliable
-- pronunciation scorer today (ROADMAP.md "Explicitly deferred" — the
-- recorder stays "compare to model", M15.5) and no i'rab-tagged grammar
-- content exists yet (only 3 grammar points, none case-related). These
-- columns exist so that future client work has somewhere real to write
-- once it exists — never populated with a guess in the meantime.
-- ----------------------------------------------------------------------------
create table public.exercise_responses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    attempt_id uuid not null references public.lesson_attempts (id) on delete cascade,
    object_id text not null,
    skill text not null check (
        skill in ('reading', 'writing', 'listening', 'speaking',
                  'vocabulary', 'grammar', 'pronunciation', 'comprehension')
    ),
    exercise_type text not null,
    correct boolean not null,
    latency_ms int check (latency_ms >= 0),

    -- Pronunciation accuracy, once a real scorer exists (0 = no match, 1 = exact).
    -- Never fabricated: absent today, not zero.
    audio_accuracy numeric(4, 3) check (audio_accuracy is null or (audio_accuracy >= 0 and audio_accuracy <= 1)),

    -- I'rab (case-ending) tracking, once case-bearing grammar content exists.
    expected_case text check (expected_case is null or expected_case in ('nominative', 'accusative', 'genitive')),
    produced_case text check (produced_case is null or produced_case in ('nominative', 'accusative', 'genitive')),
    case_error boolean generated always as (
        expected_case is not null and produced_case is not null and expected_case is distinct from produced_case
    ) stored,

    created_at timestamptz not null default now()
);

create index exercise_responses_user_id_idx on public.exercise_responses (user_id, created_at desc);
create index exercise_responses_attempt_id_idx on public.exercise_responses (attempt_id);
create index exercise_responses_object_id_idx on public.exercise_responses (object_id);

comment on column public.exercise_responses.audio_accuracy is
    'Nullable. No client-side pronunciation scorer exists yet (recorder stays "compare to model" per ROADMAP.md); never backfilled with a guess.';
comment on column public.exercise_responses.case_error is
    'Derived, not written directly. True only once both expected_case and produced_case are populated — i.e. once i''rab-tagged grammar content exists.';

-- ----------------------------------------------------------------------------
-- subscriptions — M23. Exactly one row per learner who has ever started
-- checkout. Written ONLY by the Stripe webhook Edge Function, which uses
-- the service_role key (bypasses RLS) — never written by the client
-- directly, so there is deliberately no client-facing insert/update policy.
-- ----------------------------------------------------------------------------
create table public.subscriptions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null unique references auth.users (id) on delete cascade,
    stripe_customer_id text not null,
    stripe_subscription_id text,
    status text not null default 'incomplete' check (
        status in ('incomplete', 'trialing', 'active', 'past_due', 'canceled', 'unpaid')
    ),
    price_id text,
    current_period_end timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create unique index subscriptions_stripe_customer_id_idx on public.subscriptions (stripe_customer_id);

comment on table public.subscriptions is
    'M23. Written only by the stripe-webhook Edge Function via the service_role key — no client write policy exists on this table.';

-- ============================================================================
-- updated_at maintenance
-- ============================================================================
create function public.set_updated_at() returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at before update on public.profiles
    for each row execute function public.set_updated_at();
create trigger enrollments_set_updated_at before update on public.enrollments
    for each row execute function public.set_updated_at();
create trigger subscriptions_set_updated_at before update on public.subscriptions
    for each row execute function public.set_updated_at();

-- ============================================================================
-- New-signup hook: auto-create the matching profiles row.
-- Runs as the function owner (security definer) since the inserting
-- session at signup time is not yet the new user.
-- ============================================================================
create function public.handle_new_user() returns trigger as $$
begin
    insert into public.profiles (id) values (new.id);
    return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- ============================================================================
-- Row Level Security — every table is a learner's own private data
-- (subscriptions: read-only for its owner; writes are service_role-only,
-- so intentionally no insert/update/delete policy for authenticated users).
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_attempts enable row level security;
alter table public.exercise_responses enable row level security;
alter table public.subscriptions enable row level security;

create policy "profiles_select_own" on public.profiles
    for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
    for update using (auth.uid() = id) with check (auth.uid() = id);
-- No insert/delete policy: rows are created only by handle_new_user() (security
-- definer, bypasses RLS) and removed only via the auth.users cascade.

create policy "enrollments_select_own" on public.enrollments
    for select using (auth.uid() = user_id);
create policy "enrollments_insert_own" on public.enrollments
    for insert with check (auth.uid() = user_id);
create policy "enrollments_update_own" on public.enrollments
    for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "enrollments_delete_own" on public.enrollments
    for delete using (auth.uid() = user_id);

create policy "lesson_attempts_select_own" on public.lesson_attempts
    for select using (auth.uid() = user_id);
create policy "lesson_attempts_insert_own" on public.lesson_attempts
    for insert with check (auth.uid() = user_id);
create policy "lesson_attempts_update_own" on public.lesson_attempts
    for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- No delete policy: attempt history is retained (feeds M21.5-style insights);
-- a learner can still exercise "the right to be forgotten" by deleting their
-- account, which cascades from auth.users.

create policy "exercise_responses_select_own" on public.exercise_responses
    for select using (auth.uid() = user_id);
create policy "exercise_responses_insert_own" on public.exercise_responses
    for insert with check (auth.uid() = user_id);
-- No update/delete policy: exercise responses are an append-only record,
-- same rationale as lesson_attempts above.

create policy "subscriptions_select_own" on public.subscriptions
    for select using (auth.uid() = user_id);
-- Deliberately no insert/update/delete policy for authenticated users — see
-- the table comment above. The Edge Functions write via service_role, which
-- bypasses RLS entirely and therefore needs no policy of its own.
