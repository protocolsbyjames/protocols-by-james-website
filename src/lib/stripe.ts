import Stripe from "stripe";

/**
 * Lazy Stripe client — avoids instantiating at module load, which breaks
 * Vercel's build-time page data collection when env vars aren't injected yet.
 * See supabase-admin.ts and email.ts for the same pattern.
 */
let _stripe: Stripe | null = null;

export function stripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  _stripe = new Stripe(key, { typescript: true });
  return _stripe;
}

/**
 * Marketing site's Stripe convention:
 * - The /apply form creates a Supabase user first (so we have a stable user_id).
 * - We then create a Stripe customer with metadata.supabase_user_id = user.id.
 * - That customer becomes the Checkout session's customer, and client_reference_id
 *   is also user_id. Both give us a path from Stripe → our user on success.
 */
export async function createStripeCustomerForUser(params: {
  userId: string;
  email: string;
  fullName: string;
}): Promise<string> {
  const customer = await stripe().customers.create({
    email: params.email,
    name: params.fullName,
    metadata: { supabase_user_id: params.userId },
  });
  return customer.id;
}
