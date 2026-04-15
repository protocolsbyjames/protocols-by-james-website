"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  setOnboardingCookie,
  readOnboardingCookie,
  clearOnboardingCookie,
  type OnboardingClaim,
} from "@/lib/onboarding-cookie";
import {
  AGREEMENT_VERSION,
  agreementPlainText,
} from "@/lib/agreement";
import {
  renderSignedAgreementPdf,
  signedAgreementFilename,
} from "@/lib/agreement-pdf";
import { sendSignedAgreementEmail } from "@/lib/email";

/**
 * Resolves the onboarding context for the /onboarding/agreement page.
 *
 *   1. If there's a ?session_id=... param, verify it with Stripe, look up
 *      the customer → supabase_user_id, mark the profile as onboarding_status
 *      = 'paid', mint the signed cookie, and return the context.
 *   2. Else if a valid onboarding cookie is already present (refresh case),
 *      reuse it.
 *   3. Otherwise return null so the page can redirect to /apply.
 *
 * This function is idempotent — calling it twice with the same session_id
 * is safe. It also never promotes a profile past 'paid' here; the agreement
 * submission does the next transition.
 */

type OnboardingContext = {
  userId: string;
  email: string;
  fullName: string;
  stripeSessionId: string;
  alreadySigned: boolean;
};

export async function resolveOnboardingContext(
  stripeSessionId?: string,
): Promise<OnboardingContext | null> {
  const admin = supabaseAdmin();

  // ---------- Path 1: Stripe session id on the URL ----------
  if (stripeSessionId) {
    const session = await stripe().checkout.sessions.retrieve(stripeSessionId, {
      expand: ["customer"],
    });

    if (session.payment_status !== "paid") {
      return null;
    }

    // Recover the supabase user id. Preferred source: the `client_id` we
    // stuffed into metadata when creating the checkout session. Fallback:
    // the customer's metadata.supabase_user_id.
    let userId = (session.metadata?.client_id as string | undefined) ?? null;

    if (
      !userId &&
      session.customer &&
      typeof session.customer !== "string" &&
      !session.customer.deleted
    ) {
      userId =
        (session.customer.metadata?.supabase_user_id as string | undefined) ??
        null;
    }

    if (!userId) return null;

    const { data: profile } = await admin
      .from("profiles")
      .select("id, email, full_name, onboarding_status")
      .eq("id", userId)
      .maybeSingle<{
        id: string;
        email: string;
        full_name: string | null;
        onboarding_status: string;
      }>();

    if (!profile) return null;

    // Move them forward to 'paid' if they're still marked as 'applied'. We
    // never regress here; if they already signed we leave the status alone.
    if (profile.onboarding_status === "applied") {
      await admin
        .from("profiles")
        .update({ onboarding_status: "paid" })
        .eq("id", userId);
    }

    const alreadySigned = await hasExistingSignature(userId);

    const claim: OnboardingClaim = {
      userId,
      stripeSessionId,
      issuedAt: Math.floor(Date.now() / 1000),
      email: profile.email,
    };
    await setOnboardingCookie(claim);

    return {
      userId,
      email: profile.email,
      fullName: profile.full_name ?? profile.email,
      stripeSessionId,
      alreadySigned,
    };
  }

  // ---------- Path 2: already have a signed cookie (refresh case) ----------
  const claim = await readOnboardingCookie();
  if (!claim) return null;

  const { data: profile } = await admin
    .from("profiles")
    .select("id, email, full_name")
    .eq("id", claim.userId)
    .maybeSingle<{ id: string; email: string; full_name: string | null }>();

  if (!profile) return null;

  const alreadySigned = await hasExistingSignature(claim.userId);

  return {
    userId: claim.userId,
    email: profile.email,
    fullName: profile.full_name ?? profile.email,
    stripeSessionId: claim.stripeSessionId,
    alreadySigned,
  };
}

async function hasExistingSignature(userId: string): Promise<boolean> {
  const admin = supabaseAdmin();
  const { count } = await admin
    .from("client_agreements")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", userId)
    .eq("agreement_version", AGREEMENT_VERSION);
  return (count ?? 0) > 0;
}

// ----------------------------------------------------------------------
// Submit signature
// ----------------------------------------------------------------------

const SignSchema = z.object({
  typedSignature: z.string().min(2).max(120).trim(),
  printedName: z.string().min(2).max(120).trim(),
  confirm: z.literal("on"),
});

export async function submitSignedAgreement(formData: FormData) {
  const claim = await readOnboardingCookie();
  if (!claim) {
    redirect("/apply?error=" + encodeURIComponent("Your session expired. Please start again."));
  }

  const parsed = SignSchema.safeParse({
    typedSignature: formData.get("typedSignature"),
    printedName: formData.get("printedName"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    redirect(
      "/onboarding/agreement?error=" +
        encodeURIComponent(
          "Please type your name and confirm you've read the agreement.",
        ),
    );
  }

  const { typedSignature, printedName } = parsed.data;
  const userId = claim!.userId;
  const admin = supabaseAdmin();

  // Pull request metadata for the audit footer.
  const h = await headers();
  const userAgent = h.get("user-agent");
  const ipAddress =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    null;

  const signedAtIso = new Date().toISOString();

  // ---------- 1. Write the agreement row ----------
  // We store the full plain-text snapshot of what the client saw so we can
  // always reconstruct the document at signature time, even if the
  // agreement copy changes later.
  const { data: agreementRow, error: agreementErr } = await admin
    .from("client_agreements")
    .insert({
      profile_id: userId,
      agreement_version: AGREEMENT_VERSION,
      agreement_text_snapshot: agreementPlainText(),
      typed_name: typedSignature,
      signed_at: signedAtIso,
      ip_address: ipAddress,
      user_agent: userAgent,
    })
    .select("id")
    .single<{ id: string }>();

  if (agreementErr || !agreementRow) {
    console.error("Failed to insert client_agreements row:", agreementErr);
    redirect(
      "/onboarding/agreement?error=" +
        encodeURIComponent("Couldn't save your signature. Please try again."),
    );
  }

  // ---------- 2. Generate signed PDF ----------
  const pdf = await renderSignedAgreementPdf({
    clientPrintedName: printedName,
    typedSignature,
    signedAt: signedAtIso,
    ipAddress,
    userAgent,
    userId,
  });
  const filename = signedAgreementFilename({
    clientPrintedName: printedName,
    typedSignature,
    signedAt: signedAtIso,
  });

  // ---------- 3. Email to client + James ----------
  // If this throws we still want the DB row to stick; just surface a soft
  // error so James can re-send manually from the coach portal later.
  try {
    await sendSignedAgreementEmail({
      clientName: printedName,
      clientEmail: claim!.email,
      pdf,
      filename,
      signedAt: signedAtIso,
    });
  } catch (emailErr) {
    console.error("Signed-agreement email failed (non-fatal):", emailErr);
  }

  // ---------- 4. Advance onboarding_status ----------
  await admin
    .from("profiles")
    .update({ onboarding_status: "agreement_signed" })
    .eq("id", userId);

  // ---------- 5. Clear cookie + hand back to the app ----------
  // The app's /onboarding/questionnaire page handles the intake form. We
  // clear the signed cookie so the client can't replay it later.
  await clearOnboardingCookie();

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://app.protocolsbyjames.com";
  redirect(`${appUrl}/onboarding/questionnaire?signed=1`);
}
