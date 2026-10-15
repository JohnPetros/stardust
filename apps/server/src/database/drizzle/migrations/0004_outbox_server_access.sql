-- Outbox is internal Server infrastructure. Browser roles cannot read payloads
-- or enqueue events directly, even when schema default grants change.
REVOKE ALL PRIVILEGES ON TABLE public.outbox_events FROM PUBLIC, anon, authenticated;
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON SEQUENCE public.outbox_events_sequence_seq FROM PUBLIC, anon, authenticated;
