# Peptalk auto-reminders

Two automated emails go out for every confirmed peptalk booking:

1. **24 hours before** — "your peptalk with James is tomorrow"
2. **1 hour before** — "your peptalk starts in an hour"

Both go to the booker only. James gets his own 15/10-minute popup
reminders from Google Calendar (set on the event itself).

## How it works

- **Vercel Cron** hits `/api/cron/peptalk-reminders` every 10 minutes.
- The route queries `peptalk_bookings` for:
  - `status = confirmed`
  - Rows inside a window of `now + 23h → now + 25h` (for the 24h blast) or
    `now + 55m → now + 80m` (for the 1h blast)
  - Rows where the matching `reminder_*_sent_at` column is still `NULL`.
- For each match, it sends the email via Resend (from
  `protocolsbyjames@gmail.com`) and stamps the `reminder_*_sent_at`
  column. That column is the idempotency guard — once it's set, the
  row is skipped on future sweeps.
- Partial indexes (`peptalk_bookings_pending_24h_idx` /
  `peptalk_bookings_pending_1h_idx`) keep the scan cheap as the table
  grows.

Windows are wider than the gaps between reminders (2h for 24h, 25m for
1h) so a missed cron tick doesn't drop a reminder — and the sent-at
stamp prevents double-sends within those windows.

## James's one-time setup

### 1. Apply the migration
The reminder columns and indexes live in:

```
pbj-fitness-app/supabase/migrations/00007_peptalk_reminders.sql
```

Run it in the Supabase SQL editor for the project (same project as the
rest of the schema). It's idempotent so re-running is safe.

### 2. Generate a cron secret
```bash
openssl rand -hex 32
```

### 3. Add `CRON_SECRET` to Vercel
In the marketing-site Vercel project → Settings → Environment Variables:

```
CRON_SECRET = <paste the hex from step 2>
```

Apply to Production (and Preview if you want to test on previews).

### 4. Deploy
Push to main. On next deploy Vercel picks up `vercel.json` and starts
invoking the cron every 10 minutes.

### 5. Verify (optional)
Manually hit the route with your secret to process any eligible rows
right now:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://protocolsbyjames.com/api/cron/peptalk-reminders
```

You should get `{"ok": true, "processed": N, "results": [...]}`. If
you see `"unauthorized"` the header is wrong; if you see
`"not_configured"` the env var isn't set in that environment.

## Troubleshooting

- **Reminder didn't send for a specific booking** — check the row in
  `peptalk_bookings`. If `reminder_24h_sent_at` is already non-null,
  it was sent successfully once. Look in Resend's dashboard for the
  delivery receipt.
- **`invalid_grant` in Vercel logs from the cron route** — that comes
  from the Google Calendar library, not the reminder cron. The reminder
  cron only talks to Supabase + Resend.
- **Client says they never got the email** — double-check their inbox
  address on the booking row and have them check spam. Resend
  deliverability from `protocolsbyjames@gmail.com` is Gmail-verified
  but some corporate spam filters flag anything from a gmail.com
  address as "external."
