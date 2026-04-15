import { cookies } from "next/headers";
import crypto from "node:crypto";

/**
 * Signed onboarding cookie.
 *
 * The marketing site doesn't share Supabase auth cookies with the app
 * (they live on different subdomains and the app's auth flow requires a
 * password-set step). Instead, after Stripe checkout completes, we mint a
 * short-lived HMAC-signed cookie that says "this browser belongs to user X,
 * who paid Stripe session Y, and is mid-onboarding."
 *
 * The cookie is scoped to protocolsbyjames.com so only our site reads it,
 * expires after 24 hours, and is HMAC-signed with ONBOARDING_COOKIE_SECRET
 * so a user can't forge their own.
 */

const COOKIE_NAME = "pbj_onboarding";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24; // 24h

export type OnboardingClaim = {
  userId: string;
  stripeSessionId: string;
  issuedAt: number; // unix seconds
  email: string;
};

function secret(): string {
  const s = process.env.ONBOARDING_COOKIE_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      "ONBOARDING_COOKIE_SECRET must be set and at least 32 chars. " +
        "Generate with: openssl rand -hex 32",
    );
  }
  return s;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function encodeOnboardingClaim(claim: OnboardingClaim): string {
  const payload = Buffer.from(JSON.stringify(claim), "utf8").toString(
    "base64url",
  );
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function decodeOnboardingClaim(token: string): OnboardingClaim | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const expected = sign(payload);
  // timing-safe compare
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null;
  }

  try {
    const claim = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as OnboardingClaim;

    // expiry check
    const ageSeconds = Math.floor(Date.now() / 1000) - claim.issuedAt;
    if (ageSeconds < 0 || ageSeconds > COOKIE_MAX_AGE_SECONDS) return null;

    return claim;
  } catch {
    return null;
  }
}

export async function setOnboardingCookie(claim: OnboardingClaim) {
  const store = await cookies();
  store.set(COOKIE_NAME, encodeOnboardingClaim(claim), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

export async function readOnboardingCookie(): Promise<OnboardingClaim | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  return decodeOnboardingClaim(raw);
}

export async function clearOnboardingCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
