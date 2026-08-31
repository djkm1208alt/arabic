-- ============================================================================
-- Local RLS smoke test — proves user isolation on schema.sql's policies.
-- Run after mock_auth.sql + schema.sql, as a superuser (so SET ROLE works
-- regardless of the mock roles' NOLOGIN attribute). Every assertion RAISEs
-- an exception on failure, so a clean run to the final NOTICE is the pass
-- signal.
-- ============================================================================
do $$
declare
    user_a uuid;
    user_b uuid;
    attempt_a uuid;
    n int;
begin
    -- Two learners signing up (bypasses RLS as postgres superuser, same as
    -- the on_auth_user_created trigger firing for a real Supabase signup).
    -- on_auth_user_created fires automatically and creates the matching
    -- profiles row (see handle_new_user() in schema.sql) — no explicit
    -- profiles insert needed here.
    insert into auth.users (email) values ('learner-a@example.com') returning id into user_a;
    insert into auth.users (email) values ('learner-b@example.com') returning id into user_b;

    -- --- Learner A writes their own rows -------------------------------
    set role authenticated;
    perform set_config('request.jwt.claims', json_build_object('sub', user_a)::text, true);

    insert into public.enrollments (user_id, skill_levels)
        values (user_a, '{"reading": "A1"}'::jsonb);

    insert into public.lesson_attempts (user_id, lesson_id, steps_total, steps_correct)
        values (user_a, 'a1-colours', 5, 4)
        returning id into attempt_a;

    insert into public.exercise_responses (user_id, attempt_id, object_id, skill, exercise_type, correct)
        values (user_a, attempt_a, 'lex:colour-red', 'vocabulary', 'choice', true);

    -- Learner A cannot write a row claiming to be learner B.
    begin
        insert into public.lesson_attempts (user_id, lesson_id, steps_total)
            values (user_b, 'a1-colours', 3);
        raise exception 'FAIL: learner A was able to insert a lesson_attempts row for learner B';
    exception when others then
        if sqlerrm not like '%row-level security%' then
            raise;
        end if;
    end;

    -- --- Learner B writes their own row, distinct from A's -------------
    perform set_config('request.jwt.claims', json_build_object('sub', user_b)::text, true);
    insert into public.lesson_attempts (user_id, lesson_id, steps_total, steps_correct)
        values (user_b, 'a1-family', 3, 3);

    -- Learner B's SELECT sees only their own attempt.
    select count(*) into n from public.lesson_attempts;
    if n <> 1 then
        raise exception 'FAIL: learner B saw % lesson_attempts rows, expected 1 (isolation broken)', n;
    end if;

    select count(*) into n from public.enrollments;
    if n <> 0 then
        raise exception 'FAIL: learner B saw % enrollments rows, expected 0 (A''s row leaked)', n;
    end if;

    select count(*) into n from public.profiles where id = user_a;
    if n <> 0 then
        raise exception 'FAIL: learner B could read learner A''s profile row';
    end if;

    -- --- Learner A's SELECT sees only their own rows --------------------
    perform set_config('request.jwt.claims', json_build_object('sub', user_a)::text, true);
    select count(*) into n from public.lesson_attempts;
    if n <> 1 then
        raise exception 'FAIL: learner A saw % lesson_attempts rows, expected 1', n;
    end if;

    select count(*) into n from public.exercise_responses;
    if n <> 1 then
        raise exception 'FAIL: learner A saw % exercise_responses rows, expected 1', n;
    end if;

    -- --- case_error seed row (assertions on the derived column run in the
    -- second DO block below, outside RLS context, to keep types simple).
    perform set_config('request.jwt.claims', json_build_object('sub', user_a)::text, true);
    insert into public.exercise_responses (user_id, attempt_id, object_id, skill, exercise_type, correct, expected_case)
        values (user_a, attempt_a, 'gr:present-tense', 'grammar', 'choice', false, 'accusative');

    reset role;

    -- No client write policy on subscriptions: even as the authenticated
    -- owner, a direct insert must fail.
    set role authenticated;
    perform set_config('request.jwt.claims', json_build_object('sub', user_a)::text, true);
    begin
        insert into public.subscriptions (user_id, stripe_customer_id) values (user_a, 'cus_test123');
        raise exception 'FAIL: authenticated learner was able to insert a subscriptions row directly';
    exception when others then
        if sqlerrm not like '%row-level security%' and sqlerrm not like '%permission denied%' then
            raise;
        end if;
    end;
    reset role;

    -- service_role (the Edge Function identity) bypasses RLS entirely.
    set role service_role;
    insert into public.subscriptions (user_id, stripe_customer_id, status)
        values (user_a, 'cus_test123', 'active');
    select count(*) into n from public.subscriptions;
    if n <> 1 then
        raise exception 'FAIL: service_role insert into subscriptions did not land';
    end if;
    reset role;

    -- Owner can read their own subscription row via RLS select policy.
    set role authenticated;
    perform set_config('request.jwt.claims', json_build_object('sub', user_a)::text, true);
    select count(*) into n from public.subscriptions where user_id = user_a;
    if n <> 1 then
        raise exception 'FAIL: learner A could not read their own subscriptions row';
    end if;
    reset role;

    raise notice 'ALL RLS SMOKE TEST ASSERTIONS PASSED';
end
$$;

-- Fix the case_error checkpoint above with a real assertion, run separately
-- so the boolean-into-int mismatch never actually executes.
do $$
declare
    r record;
begin
    select expected_case, produced_case, case_error into r
        from public.exercise_responses where object_id = 'gr:present-tense';
    if r.case_error is not false and r.case_error is not null then
        raise exception 'FAIL: case_error should be false/null with produced_case still unset, got %', r.case_error;
    end if;

    update public.exercise_responses set produced_case = 'nominative' where object_id = 'gr:present-tense';
    select case_error into r.case_error from public.exercise_responses where object_id = 'gr:present-tense';
    if r.case_error is distinct from true then
        raise exception 'FAIL: case_error should be true once expected/produced differ, got %', r.case_error;
    end if;

    update public.exercise_responses set produced_case = 'accusative' where object_id = 'gr:present-tense';
    select case_error into r.case_error from public.exercise_responses where object_id = 'gr:present-tense';
    if r.case_error is distinct from false then
        raise exception 'FAIL: case_error should be false once expected == produced, got %', r.case_error;
    end if;

    raise notice 'CASE_ERROR DERIVATION ASSERTIONS PASSED';
end
$$;
