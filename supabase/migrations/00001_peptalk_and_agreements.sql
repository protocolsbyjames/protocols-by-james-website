-- ⚠️  SCHEMA LIVES IN THE FITNESS-APP REPO ⚠️
--
-- The marketing site and the fitness app share the same Supabase
-- project. The canonical schema for peptalk_bookings, client_agreements,
-- and client_intake_submissions is defined in:
--
--     pbj-fitness-app/supabase/migrations/00006_onboarding.sql
--
-- The reminder columns added for the cron route are defined in:
--
--     pbj-fitness-app/supabase/migrations/00007_peptalk_reminders.sql
--
-- Do not add schema here — keep everything in the fitness-app repo so
-- there's one source of truth. This file is intentionally a no-op.

select 1;
