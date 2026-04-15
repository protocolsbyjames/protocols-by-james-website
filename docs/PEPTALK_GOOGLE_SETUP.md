# Peptalk — Google Calendar OAuth setup

You only have to do this once. It gets the server a long-lived refresh
token so it can create Google Meet events on your calendar without you
re-logging in.

**Total time: ~10 minutes.**

---

## 1. Create a Google Cloud project

1. Go to <https://console.cloud.google.com/>.
2. Top bar → project dropdown → **New Project**. Name it `protocols-by-james`. Create.
3. Make sure the new project is selected (top bar shows its name).

## 2. Enable the Calendar API

1. Left nav → **APIs & Services → Library**.
2. Search for "Google Calendar API". Click it. **Enable**.

## 3. Configure the OAuth consent screen

1. **APIs & Services → OAuth consent screen**.
2. User type: **External**. Create.
3. Fill in the minimum required:
   - **App name:** Protocols by James
   - **User support email:** protocolsbyjames@gmail.com
   - **Developer contact:** protocolsbyjames@gmail.com
4. **Save and continue** through the rest — no scopes or test users
   needed at this step.
5. You don't need to publish the app. Leave it in "Testing" mode — it
   will work fine because you're the only user.
6. Back on the OAuth consent screen page → **Test users → Add users**.
   Add `protocolsbyjames@gmail.com`. Save.

## 4. Create OAuth client credentials

1. **APIs & Services → Credentials → + Create credentials → OAuth client ID**.
2. Application type: **Desktop app**.
3. Name: `peptalk-bootstrap`. Create.
4. You'll get a **Client ID** and **Client secret**. Copy both. You'll
   paste them in the next step.

## 5. Run the bootstrap script

From your Mac, in the marketing site repo:

```bash
cd ~/protocols-by-james-website
GOOGLE_OAUTH_CLIENT_ID=<paste client id> \
GOOGLE_OAUTH_CLIENT_SECRET=<paste client secret> \
node scripts/bootstrap-google-oauth.mjs
```

It will:

1. Print a URL. **Open it in your browser.**
2. Log in as `protocolsbyjames@gmail.com`. You may see a "Google hasn't
   verified this app" warning — click **Advanced → Go to
   protocols-by-james (unsafe)**. That's safe because it's *your* app.
3. Allow calendar access.
4. Google redirects you to a `localhost` URL. The script is listening
   there, grabs the code, exchanges it for a refresh token, and prints
   it to your terminal.

## 6. Add the env vars

Paste the values into both Vercel (marketing site project) and your
local `.env.local`:

```
GOOGLE_OAUTH_CLIENT_ID=...        # from step 4
GOOGLE_OAUTH_CLIENT_SECRET=...    # from step 4
GOOGLE_OAUTH_REFRESH_TOKEN=...    # from step 5 output
GOOGLE_CALENDAR_ID=primary        # or a dedicated "Peptalks" calendar id
PEPTALK_TIMEZONE=America/Los_Angeles
```

Redeploy the marketing site.

## 7. Test it

Visit `/peptalk/book` on the deployed site. You should see live
available slots pulled from your real calendar. Book one as a test —
you should end up on the confirmation page, see the Meet link, get a
Google Calendar invite, and receive the signed PDF in your email.

## Troubleshooting

- **"Booking is temporarily unavailable" on /peptalk/book** — one of the
  three `GOOGLE_OAUTH_*` env vars is missing or wrong.
- **"invalid_grant" in Vercel logs** — the refresh token was revoked.
  This happens if you unlink the app from your Google account or if the
  project is still in Testing mode and you didn't add yourself as a
  test user. Re-run the bootstrap script to mint a new one.
- **No slots appear** — your calendar might be fully booked during the
  work-hours window. Check `PEPTALK_TIMEZONE` is what you expect and
  try widening `DEFAULT_WORK_HOUR_START`/`END` in `src/lib/peptalk-slots.ts`.
