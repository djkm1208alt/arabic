// M23 — Supabase Edge Function (Deno). Stripe webhook endpoint: the only
// writer of public.subscriptions (see supabase/schema.sql — that table has
// no client-facing insert/update policy by design). Registered directly in
// the Stripe dashboard/CLI, not called by the app.
//
// Secrets required (set via `supabase secrets set`):
//   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL,
//   SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

// service_role — this function is the one legitimate writer of
// subscriptions and must bypass RLS to do it.
const adminClient = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function upsertFromStripeSubscription(sub: Stripe.Subscription, userId?: string) {
  let resolvedUserId = userId;
  if (!resolvedUserId) {
    const { data } = await adminClient
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_customer_id", sub.customer as string)
      .maybeSingle();
    resolvedUserId = data?.user_id;
  }
  if (!resolvedUserId) {
    console.error("stripe-webhook: no matching user for customer", sub.customer);
    return;
  }

  await adminClient.from("subscriptions").upsert(
    {
      user_id: resolvedUserId,
      stripe_customer_id: sub.customer as string,
      stripe_subscription_id: sub.id,
      status: sub.status,
      price_id: sub.items.data[0]?.price?.id ?? null,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    },
    { onConflict: "user_id" },
  );
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
    );
  } catch (err) {
    console.error("stripe-webhook: signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === "subscription" && session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        await upsertFromStripeSubscription(sub, session.client_reference_id ?? undefined);
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await upsertFromStripeSubscription(sub);
      break;
    }
    default:
      // Every other event type is intentionally ignored — nothing else in
      // M23's scope needs it.
      break;
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
