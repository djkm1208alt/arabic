// M23 — Supabase Edge Function (Deno). Called by the authenticated client
// to start a Stripe Checkout session for the premium subscription.
//
// Auth: expects the caller's Supabase JWT in the Authorization header
// (the client's normal `supabase.functions.invoke(...)` already sends
// this). Uses the anon key + that JWT to resolve the caller's user id via
// RLS-scoped `auth.getUser()` — never trusts a user id passed in the body.
//
// Secrets required (set via `supabase secrets set`):
//   STRIPE_SECRET_KEY, STRIPE_PRICE_ID, SUPABASE_URL, SUPABASE_ANON_KEY,
//   SUPABASE_SERVICE_ROLE_KEY, CHECKOUT_SUCCESS_URL, CHECKOUT_CANCEL_URL

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const user = userData.user;

  // service_role client — needed to read/write subscriptions, which has no
  // client-facing write policy (see supabase/schema.sql).
  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: existing } = await adminClient
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  let customerId = existing?.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: Deno.env.get("STRIPE_PRICE_ID")!, quantity: 1 }],
    success_url: Deno.env.get("CHECKOUT_SUCCESS_URL")!,
    cancel_url: Deno.env.get("CHECKOUT_CANCEL_URL")!,
    client_reference_id: user.id,
    metadata: { supabase_user_id: user.id },
  });

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
