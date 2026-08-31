-- ============================================================================
-- Local verification scaffolding ONLY — not part of the shipped schema and
-- never applied to a real Supabase project (which already provides all of
-- this). Mocks just enough of Supabase's `auth` schema/roles to prove
-- schema.sql's RLS policies actually isolate users, against a plain local
-- Postgres install (see content/m22-backend-foundation-review.md for how
-- this was run).
-- ============================================================================
create schema if not exists auth;

create table auth.users (
    id uuid primary key default gen_random_uuid(),
    email text unique
);

-- Mirrors Supabase's real auth.uid(): reads the "sub" claim that PostgREST
-- sets per-request via the `request.jwt.claims` session setting.
create or replace function auth.uid() returns uuid as $$
    select nullif(current_setting('request.jwt.claims', true)::json ->> 'sub', '')::uuid
$$ language sql stable;

do $$
begin
    if not exists (select 1 from pg_roles where rolname = 'authenticated') then
        create role authenticated nologin;
    end if;
    if not exists (select 1 from pg_roles where rolname = 'service_role') then
        create role service_role nologin bypassrls;
    end if;
end
$$;

grant usage on schema auth, public to authenticated, service_role;
grant select on auth.users to authenticated, service_role;

-- schema.sql's tables don't exist yet when this file runs (mock_auth.sql
-- applies first) — default privileges cover tables created afterward, so
-- schema.sql needs no grants of its own (Supabase configures this for real
-- projects; this is the local equivalent).
alter default privileges in schema public grant all on tables to authenticated, service_role;
alter default privileges in schema public grant usage, select on sequences to authenticated, service_role;
