drop function if exists public.persist_feedback_message(jsonb);
alter table public.feedback_messages drop column if exists idempotency_payload;
