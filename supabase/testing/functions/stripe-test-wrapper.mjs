// Test-only substitute for the esm.sh Stripe import: same real npm `stripe`
// SDK, just pointed at the local mock server instead of api.stripe.com.
import StripeReal from "stripe";

export default class Stripe extends StripeReal {
  constructor(key, config) {
    super(key, {
      ...config,
      host: "127.0.0.1",
      port: Number(process.env.STRIPE_MOCK_PORT),
      protocol: "http",
    });
  }
}
