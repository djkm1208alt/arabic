// Executes the real supabase/functions/*/index.ts code (bundled, Deno
// globals shimmed) against a local mock Stripe/Supabase server — no network
// egress, since deno.land/esm.sh/api.stripe.com/supabase.com are all
// blocked by this sandbox's network policy. Uses the real `stripe` and
// `@supabase/supabase-js` npm packages, not fakes, so the actual request
// shapes the code builds are exercised for real.
import vm from "node:vm";
import { createRequire } from "node:module";
import { bundleFunction } from "./build.mjs";
import { startMockServer } from "./mock-server.mjs";

const require = createRequire(import.meta.url);

let pass = 0;
let fail = 0;
function assert(cond, msg) {
  if (cond) { pass++; console.log(`  PASS  ${msg}`); }
  else { fail++; console.log(`  FAIL  ${msg}`); }
}

// Runs bundled CJS code in its own sandbox so each function's Deno.serve
// registration doesn't clobber the other's.
function loadHandler(code) {
  const sandbox = {
    process, console, Buffer, require: require, module: { exports: {} },
    fetch, Request, Response, Headers, URL, setTimeout, clearTimeout,
    globalThis: undefined, TextEncoder, TextDecoder, WebSocket, crypto,
    setInterval, clearInterval,
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: "bundle.cjs" });
  if (typeof sandbox.__handler !== "function") {
    throw new Error("Deno.serve was never called — handler not captured");
  }
  return sandbox.__handler;
}

async function testCreateCheckoutSession(mock) {
  console.log("\n=== create-checkout-session ===");
  const code = await bundleFunction("create-checkout-session");
  const handler = loadHandler(code);

  // --- Unauthenticated request: must be rejected, never reach Stripe ---
  mock.calls.length = 0;
  const unauthed = await handler(new Request("http://x/", {
    method: "POST",
    headers: { Authorization: "Bearer not-a-real-token" },
  }));
  assert(unauthed.status === 401, `unauthenticated request rejected with 401 (got ${unauthed.status})`);
  assert(!mock.calls.some((c) => c.path === "/v1/customers"), "no Stripe customer created for an unauthenticated request");

  // --- Authenticated request: real user, first-time checkout -----------
  mock.calls.length = 0;
  const ok = await handler(new Request("http://x/", {
    method: "POST",
    headers: { Authorization: "Bearer user-abc-token" },
  }));
  const okBody = await ok.json();
  assert(ok.status === 200, `authenticated request succeeds with 200 (got ${ok.status})`);
  assert(okBody.url === "https://checkout.stripe.com/mock-session", "response carries the real Stripe Checkout URL");

  const customerCall = mock.calls.find((c) => c.path === "/v1/customers");
  assert(!!customerCall, "a Stripe customer was created (no existing subscriptions row)");
  const customerBody = Object.fromEntries(new URLSearchParams(customerCall?.body ?? ""));
  assert(customerBody["metadata[supabase_user_id]"] === "user-abc", "Stripe customer tagged with the real caller's user id, not a client-supplied one");

  const sessionCall = mock.calls.find((c) => c.path === "/v1/checkout/sessions");
  const sessionParams = Object.fromEntries(new URLSearchParams(sessionCall.body));
  assert(sessionParams["client_reference_id"] === "user-abc", "checkout session's client_reference_id is the authenticated user's real id");
  assert(sessionParams["customer"] === "cus_mock123", "checkout session uses the Stripe customer id just created");

  // --- Authenticated request, returning learner (existing customer) ----
  mock.subscriptionsTable.push({ user_id: "user-abc", stripe_customer_id: "cus_existing456" });
  mock.calls.length = 0;
  await handler(new Request("http://x/", { method: "POST", headers: { Authorization: "Bearer user-abc-token" } }));
  assert(!mock.calls.some((c) => c.path === "/v1/customers"), "returning learner: no duplicate Stripe customer created");
  const session2 = mock.calls.find((c) => c.path === "/v1/checkout/sessions");
  const session2Params = Object.fromEntries(new URLSearchParams(session2.body));
  assert(session2Params["customer"] === "cus_existing456", "returning learner: reuses their existing Stripe customer id from subscriptions");
}

async function testStripeWebhook(mock, stripeForSigning) {
  console.log("\n=== stripe-webhook ===");
  const code = await bundleFunction("stripe-webhook");
  const handler = loadHandler(code);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // --- Bad signature: must be rejected, never touch subscriptions ------
  mock.subscriptionsTable.length = 0;
  mock.calls.length = 0;
  const badPayload = JSON.stringify({ id: "evt_bad", type: "customer.subscription.updated", data: { object: {} } });
  const badSig = await handler(new Request("http://x/", {
    method: "POST",
    headers: { "stripe-signature": "t=1,v1=deadbeef" },
    body: badPayload,
  }));
  assert(badSig.status === 400, `invalid Stripe signature rejected with 400 (got ${badSig.status})`);
  assert(!mock.calls.some((c) => c.path === "/rest/v1/subscriptions" && c.method === "POST"), "no subscriptions write on an invalid signature");

  // --- checkout.session.completed: real signature, real event shape ----
  const sessionEvent = {
    id: "evt_1",
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        object: "checkout.session",
        mode: "subscription",
        subscription: "sub_mock789",
        client_reference_id: "user-abc",
      },
    },
  };
  const payload = JSON.stringify(sessionEvent);
  const header = stripeForSigning.webhooks.generateTestHeaderString({ payload, secret: webhookSecret });
  mock.calls.length = 0;
  const res = await handler(new Request("http://x/", {
    method: "POST",
    headers: { "stripe-signature": header },
    body: payload,
  }));
  assert(res.status === 200, `checkout.session.completed with a valid signature accepted (got ${res.status})`);
  assert(mock.calls.some((c) => c.path === "/v1/subscriptions/sub_mock789"), "webhook fetched the full subscription object from Stripe");
  const upsert = mock.calls.find((c) => c.path === "/rest/v1/subscriptions" && c.method === "POST");
  assert(!!upsert, "webhook upserted into public.subscriptions");
  const upsertBody = JSON.parse(upsert.body);
  assert(upsertBody.user_id === "user-abc", "upsert carries the real user id from client_reference_id, not a guess");
  assert(upsertBody.status === "active", "upsert carries the real status from the fetched Stripe subscription");
  assert(upsertBody.price_id === "price_mock_premium", "upsert carries the real price id from the fetched Stripe subscription");

  // --- customer.subscription.deleted: resolves user via stored customer id
  mock.subscriptionsTable.length = 0;
  mock.subscriptionsTable.push({ user_id: "user-xyz", stripe_customer_id: "cus_mock123" });
  const deleteEvent = {
    id: "evt_2",
    object: "event",
    type: "customer.subscription.deleted",
    data: {
      object: {
        object: "subscription",
        id: "sub_mock999",
        customer: "cus_mock123",
        status: "canceled",
        current_period_end: Math.floor(Date.now() / 1000),
        items: { data: [{ price: { id: "price_mock_premium" } }] },
      },
    },
  };
  const payload2 = JSON.stringify(deleteEvent);
  const header2 = stripeForSigning.webhooks.generateTestHeaderString({ payload: payload2, secret: webhookSecret });
  mock.calls.length = 0;
  const res2 = await handler(new Request("http://x/", {
    method: "POST",
    headers: { "stripe-signature": header2 },
    body: payload2,
  }));
  assert(res2.status === 200, `customer.subscription.deleted accepted (got ${res2.status})`);
  const upsert2 = mock.calls.find((c) => c.path === "/rest/v1/subscriptions" && c.method === "POST");
  assert(upsert2 && JSON.parse(upsert2.body).user_id === "user-xyz", "cancellation resolved to the right user via stored stripe_customer_id, and status/price updated to canceled");
  assert(JSON.parse(upsert2.body).status === "canceled", "subscription row's status updated to canceled");
}

async function main() {
  const subscriptionsTable = [];
  const { server, port, calls } = await startMockServer({ validAuthUserId: "user-abc", subscriptionsTable });
  const mock = { calls, subscriptionsTable };

  process.env.STRIPE_MOCK_PORT = String(port);
  process.env.STRIPE_SECRET_KEY = "sk_test_mock";
  process.env.STRIPE_PRICE_ID = "price_mock_premium";
  process.env.CHECKOUT_SUCCESS_URL = "https://example.com/success";
  process.env.CHECKOUT_CANCEL_URL = "https://example.com/cancel";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_mock_secret";
  process.env.SUPABASE_URL = `http://127.0.0.1:${port}`;
  process.env.SUPABASE_ANON_KEY = "anon_mock_key";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service_role_mock_key";

  const StripeReal = (await import("stripe")).default;
  const stripeForSigning = new StripeReal(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

  try {
    await testCreateCheckoutSession(mock);
    await testStripeWebhook(mock, stripeForSigning);
  } finally {
    server.close();
  }

  console.log(`\n${pass} passed, ${fail} failed.`);
  process.exit(fail === 0 ? 0 : 1);
}

main();
