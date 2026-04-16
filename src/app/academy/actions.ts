"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function validateAccessCode(formData: FormData) {
  const code = (formData.get("code") as string)?.trim().toUpperCase();

  if (!code) {
    return { error: "Please enter an access code." };
  }

  const validCodes = (process.env.ACADEMY_CODES || "")
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter((c) => c.length > 0);

  if (!validCodes.includes(code)) {
    return { error: "Invalid access code. Please check and try again." };
  }

  // Set the cookie
  const cookieStore = await cookies();
  cookieStore.set("academy_access", "granted", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  });

  // Redirect to the learn page
  redirect("/academy/learn");
}
