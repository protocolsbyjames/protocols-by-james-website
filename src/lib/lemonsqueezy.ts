/**
 * LemonSqueezy helpers for the marketing site.
 *
 * The marketing site only needs two things from LS:
 *   1. Verify that a checkout was paid (for the onboarding/agreement flow)
 *   2. (Future) Create a customer during /apply if needed
 *
 * Env vars required:
 *   LEMONSQUEEZY_API_KEY       — API key from LS dashboard → Settings → API
 *   LEMONSQUEEZY_STORE_ID      — Your store ID (number)
 */

const LS_API_BASE = "https://api.lemonsqueezy.com/v1";

function apiKey(): string {
  const key = process.env.LEMONSQUEEZY_API_KEY;
  if (!key) throw new Error("LEMONSQUEEZY_API_KEY is not set");
  return key;
}

/**
 * Make an authenticated request to the LemonSqueezy API.
 */
async function lsApi<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${LS_API_BASE}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey()}`,
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LemonSqueezy API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ────────────────────────────────────────────────────────────────
// Orders — verify one-time and subscription checkouts
// ────────────────────────────────────────────────────────────────

type LsOrder = {
  data: {
    id: string;
    attributes: {
      store_id: number;
      customer_id: number;
      status: string; // "paid", "pending", "refunded", "failed"
      total: number;
      currency: string;
      first_order_item: {
        variant_id: number;
        price_id: number;
      } | null;
      urls: {
        receipt: string;
      };
      created_at: string;
      [key: string]: unknown;
    };
  };
  meta?: {
    custom_data?: Record<string, string>;
  };
};

export async function getOrder(orderId: string): Promise<LsOrder> {
  return lsApi<LsOrder>(`/orders/${orderId}`);
}

// ────────────────────────────────────────────────────────────────
// Subscriptions — look up subscription details
// ────────────────────────────────────────────────────────────────

type LsSubscription = {
  data: {
    id: string;
    attributes: {
      store_id: number;
      customer_id: number;
      status: string;
      urls: {
        update_payment_method: string;
        customer_portal: string;
      };
      [key: string]: unknown;
    };
  };
};

export async function getSubscription(
  subscriptionId: string,
): Promise<LsSubscription> {
  return lsApi<LsSubscription>(`/subscriptions/${subscriptionId}`);
}

// ────────────────────────────────────────────────────────────────
// Customers
// ────────────────────────────────────────────────────────────────

type LsCustomer = {
  data: {
    id: string;
    attributes: {
      store_id: number;
      name: string;
      email: string;
      urls: {
        customer_portal: string;
      };
      [key: string]: unknown;
    };
  };
};

export async function getCustomer(
  customerId: string,
): Promise<LsCustomer> {
  return lsApi<LsCustomer>(`/customers/${customerId}`);
}
