-- Feedback delivery is intentionally best-effort after direct persistence.
-- The feature no longer requires a transactional outbox.
drop table if exists public.feedback_outbox_events cascade;
