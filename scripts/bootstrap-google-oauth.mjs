#!/usr/bin/env node
/**
 * One-off script to mint a Google OAuth refresh token for peptalk bookings.
 *
 * Usage (from the marketing site repo):
 *   GOOGLE_OAUTH_CLIENT_ID=xxx \
 *   GOOGLE_OAUTH_CLIENT_SECRET=xxx \
 *   node scripts/bootstrap-google-oauth.mjs
 *
 * What it does:
 *   1. Spins up a tiny http server on http://localhost:53682.
 *   2. Prints an auth URL you open in your browser. You log in, grant
 *      calendar access, and Google redirects back to localhost.
 *   3. This script exchanges the code for a refresh token and prints it.
 *
 * Requirements:
 *   - Your OAuth client in GCP must be "Desktop app" type (no redirect
 *     URI configuration needed — Google allows loopback for desktop).
 *   - You must be added as a test user on the OAuth consent screen.
 *
 * No dependencies beyond Node's stdlib — this runs before `npm install`
 * is necessarily complete in new clones.
 */

import http from "node:http";
import { URL } from "node:url";
import { exec } from "node:child_process";

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const PORT = 53682;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Missing GOOGLE_OAUTH_CLIENT_ID or GOOGLE_OAUTH_CLIENT_SECRET. " +
      "See docs/PEPTALK_GOOGLE_SETUP.md step 5.",
  );
  process.exit(1);
}

const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
authUrl.searchParams.set("client_id", CLIENT_ID);
authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("scope", SCOPES.join(" "));
authUrl.searchParams.set("access_type", "offline");
// prompt=consent forces Google to return a refresh_token even if you've
// previously authorized this client. Without this you may get only an
// access token on re-runs.
authUrl.searchParams.set("prompt", "consent");

const server = http.createServer(async (req, res) => {
  if (!req.url?.startsWith("/callback")) {
    res.writeHead(404);
    res.end("not found");
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    respond(res, 400, `OAuth error: ${error}`);
    console.error(`\n❌ OAuth error: ${error}`);
    server.close();
    process.exit(1);
  }

  if (!code) {
    respond(res, 400, "No code in callback");
    return;
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });
    const data = await tokenRes.json();

    if (!tokenRes.ok || !data.refresh_token) {
      respond(
        res,
        500,
        "Token exchange failed — check the terminal for details.",
      );
      console.error(
        "\n❌ Token exchange failed:",
        JSON.stringify(data, null, 2),
      );
      server.close();
      process.exit(1);
    }

    respond(
      res,
      200,
      "All set — you can close this tab and check your terminal.",
    );

    console.log("\n✅ Success!\n");
    console.log("Add these to Vercel (marketing site) and your .env.local:\n");
    console.log(`  GOOGLE_OAUTH_CLIENT_ID=${CLIENT_ID}`);
    console.log(`  GOOGLE_OAUTH_CLIENT_SECRET=${CLIENT_SECRET}`);
    console.log(`  GOOGLE_OAUTH_REFRESH_TOKEN=${data.refresh_token}`);
    console.log(`  GOOGLE_CALENDAR_ID=primary`);
    console.log(`  PEPTALK_TIMEZONE=America/Los_Angeles`);
    console.log("");

    server.close();
  } catch (e) {
    console.error("Token exchange threw:", e);
    respond(res, 500, "Token exchange error");
    server.close();
    process.exit(1);
  }
});

function respond(res, status, body) {
  res.writeHead(status, { "Content-Type": "text/html" });
  res.end(
    `<!doctype html><html><body style="font-family: -apple-system, sans-serif; padding: 3em; text-align: center;"><h1>${body}</h1></body></html>`,
  );
}

server.listen(PORT, () => {
  console.log("\n👉  Open this URL in your browser:\n");
  console.log(`   ${authUrl.toString()}\n`);
  console.log(
    "Log in as protocolsbyjames@gmail.com, grant calendar access, and",
  );
  console.log(
    "Google will redirect you to localhost. This script will do the rest.\n",
  );

  // Best-effort: try to open the browser automatically on macOS.
  if (process.platform === "darwin") {
    exec(`open "${authUrl.toString()}"`);
  }
});
