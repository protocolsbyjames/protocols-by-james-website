"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Submit the /apply form.
 *
 * Flow:
 *   1. Validate the form with zod.
 *   2. Create a Supabase auth user (no password — passwordless via magic link).
 *   3. Create the profiles row with role=client + onboarding_status='applied'
 *      + applied_* fields (age, sex, goal, phone).
 *   4. Generate a magic link that drops the user into the app's /onboarding
 *      plan-selection page already logged in.
 *   5. Redirect the browser to the magic link URL — they land in the app,
 *      pick a plan, hit LemonSqueezy Checkout. Checkout success redirects to
 *      protocolsbyjames.com/onboarding/agreement (set on the app's checkout
 *      success_url — that's wired in pbj-fitness-app/src/app/api/checkout/route.ts).
 */

const ApplicationSchema = z.object({
  fullName: z.string().min(2).max(120).trim(),
  preferredName: z.string().max(60).trim().optional().or(z.literal("")),
  email: z.string().email().toLowerCase().trim(),
  phone: z.string().min(7).max(40).trim(),
  age: z.coerce.number().int().min(13).max(120),
  sex: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  goal: z.string().min(10).max(2000).trim(),
  plan: z.string().optional(),
});

function redirectWithError(message: string, plan?: string): never {
  const qs = new URLSearchParams();
  qs.set("error", message);
  if (plan) qs.set("plan", plan);
  redirect(`/apply?${qs.toString()}`);
}

export async function submitApplication(formData: FormData) {
  const rawPlan =
    typeof formData.get("plan") === "string"
      ? (formData.get("plan") as string)
      : undefined;

  const parsed = ApplicationSchema.safeParse({
    fullName: formData.get("fullName"),
    preferredName: formData.get("preferredName") || undefined,
    email: formData.get("email"),
    phone: formData.get("phone"),
    age: formData.get("age"),
    sex: formData.get("sex"),
    goal: formData.get("goal"),
    plan: rawPlan,
  });

  if (!parsed.success) {
    redirectWithError(
      "Please double-check the form — one or more fields look off.",
      rawPlan,
    );
  }

  const app = parsed.data;
  const admin = supabaseAdmin();

  // ---------------- 1. Create or look up the auth user ----------------
  // If someone with this email already exists we don't create a dup — we reuse
  // their row and update their profile. This handles "user applies twice".
  const { data: existingList } = await admin.auth.admin.listUsers();
  const existingUser = existingList?.users.find(
    (u) => u.email?.toLowerCase() === app.email,
  );

  let userId: string;
  if (existingUser) {
    userId = existingUser.id;
  } else {
    const { data: created, error: createErr } =
      await admin.auth.admin.createUser({
        email: app.email,
        email_confirm: true, // skip the confirmation email — they'll confirm via magic link later
        user_metadata: {
          full_name: app.fullName,
          preferred_name: app.preferredName || null,
        },
      });
    if (createErr || !created.user) {
      redirectWithError(
        "Couldn't create your account. Please try again or email me directly.",
      );
    }
    userId = created!.user!.id;
  }

  // ---------------- 2. Upsert the profile ----------------
  // The profiles table has a trigger on auth.users that creates a row on
  // insert (if it does — double-check 00001). We upsert to be safe.
  const { error: profileErr } = await admin
    .from("profiles")
    .upsert(
      {
        id: userId,
        role: "client",
        full_name: app.fullName,
        email: app.email,
        onboarding_status: "applied",
        applied_at: new Date().toISOString(),
        applied_age: app.age,
        applied_sex: app.sex,
        applied_goal: app.goal,
        applied_phone: app.phone,
      },
      { onConflict: "id" },
    );

  if (profileErr) {
    console.error("Profile upsert failed:", profileErr);
    redirectWithError(
      "Couldn't save your application. Please try again or email me directly.",
    );
  }

  // ---------------- 3. Generate magic link into the app ----------------
  // After login, they land on /onboarding (the existing plan-selection page)
  // with their session already set.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    console.error("NEXT_PUBLIC_APP_URL not set");
    redirectWithError("Server misconfiguration. Please email me directly.");
  }
  const planQuery = app.plan ? `?plan=${encodeURIComponent(app.plan)}` : "";
  const { data: linkData, error: linkErr } =
    await admin.auth.admin.generateLink({
      type: "magiclink",
      email: app.email,
      options: { redirectTo: `${appUrl}/onboarding${planQuery}` },
    });

  if (linkErr || !linkData.properties?.action_link) {
    console.error("Magic link generation failed:", linkErr);
    redirectWithError(
      "Couldn't prep your sign-in link. Please try again or email me directly.",
    );
  }

  // ---------------- 4. Redirect to the magic link ----------------
  // This both verifies their email (supabase does this on first click) AND
  // logs them into app.protocolsbyjames.com in one hop.
  redirect(linkData!.properties!.action_link!);
}
