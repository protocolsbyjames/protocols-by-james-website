import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

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
  const customer = await stripe.customers.create({
    email: params.email,
    name: params.fullName,
    metadata: { supabase_user_id: params.userId },
  });
  return customer.id;
}
