import http from "node:http";

// A single mock server standing in for both api.stripe.com and a Supabase
// project's Auth/REST endpoints, so the real edge function code can talk to
// something without any network egress. Records every call it receives so
// tests can assert on what the function actually sent.

export function startMockServer({ validAuthUserId, subscriptionsTable }) {
  const calls = [];

  const server = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const rawBody = Buffer.concat(chunks).toString("utf8");
    const url = new URL(req.url, "http://127.0.0.1");
    calls.push({ method: req.method, path: url.pathname, query: Object.fromEntries(url.searchParams), body: rawBody, headers: req.headers });

    const json = (status, obj) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(obj));
    };

    // --- Supabase Auth: GET /auth/v1/user ------------------------------
    if (req.method === "GET" && url.pathname === "/auth/v1/user") {
      const auth = req.headers["authorization"] || "";
      if (auth === `Bearer ${validAuthUserId}-token`) {
        return json(200, { id: validAuthUserId, email: "learner@example.com" });
      }
      return json(401, { error: "invalid_token", msg: "invalid claim: missing sub claim" });
    }

    // --- Supabase REST: /rest/v1/subscriptions --------------------------
    if (url.pathname === "/rest/v1/subscriptions") {
      const wantsSingle = (req.headers["accept"] || "").includes("pgrst.object");

      if (req.method === "GET") {
        // PostgREST-style filters: any query param of the form col=eq.value
        // (the real code filters by user_id in one call site, by
        // stripe_customer_id in another).
        const filters = [...url.searchParams.entries()].filter(([k, v]) => v.startsWith("eq.") && k !== "select");
        const rows = subscriptionsTable.filter((r) =>
          filters.every(([col, val]) => String(r[col]) === val.replace("eq.", "")));
        if (wantsSingle) {
          if (rows.length === 1) return json(200, rows[0]);
          return json(406, { code: "PGRST116", message: "JSON object requested, multiple (or no) rows returned" });
        }
        return json(200, rows);
      }

      if (req.method === "POST") {
        const parsed = JSON.parse(rawBody);
        const rows = Array.isArray(parsed) ? parsed : [parsed];
        for (const row of rows) {
          const idx = subscriptionsTable.findIndex((r) => r.user_id === row.user_id);
          if (idx >= 0) subscriptionsTable[idx] = { ...subscriptionsTable[idx], ...row };
          else subscriptionsTable.push(row);
        }
        return json(201, rows);
      }
    }

    // --- Stripe: POST /v1/customers -------------------------------------
    if (req.method === "POST" && url.pathname === "/v1/customers") {
      return json(200, { id: "cus_mock123", object: "customer" });
    }

    // --- Stripe: POST /v1/checkout/sessions ------------------------------
    if (req.method === "POST" && url.pathname === "/v1/checkout/sessions") {
      return json(200, {
        id: "cs_mock_abc",
        object: "checkout.session",
        url: "https://checkout.stripe.com/mock-session",
      });
    }

    // --- Stripe: GET /v1/subscriptions/:id -------------------------------
    if (req.method === "GET" && url.pathname.startsWith("/v1/subscriptions/")) {
      return json(200, {
        id: url.pathname.split("/").pop(),
        object: "subscription",
        customer: "cus_mock123",
        status: "active",
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
        items: { data: [{ price: { id: "price_mock_premium" } }] },
      });
    }

    return json(404, { error: `mock server: unhandled ${req.method} ${url.pathname}` });
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      resolve({ server, port: server.address().port, calls });
    });
  });
}
