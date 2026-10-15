CREATE TABLE "outbox_events" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"event_name" text NOT NULL,
	"payload" jsonb NOT NULL,
	"sequence" bigserial NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"available_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	"reserved_by" text,
	"reservation_expires_at" timestamp with time zone,
	"last_error_code" text,
	CONSTRAINT "outbox_events_status_check" CHECK ("outbox_events"."status" in ('pending', 'publishing', 'published', 'failed')),
	CONSTRAINT "outbox_events_attempts_check" CHECK ("outbox_events"."attempts" >= 0),
	CONSTRAINT "outbox_events_reservation_check" CHECK ((
      "outbox_events"."status" = 'publishing' AND "outbox_events"."reserved_by" IS NOT NULL AND "outbox_events"."reservation_expires_at" IS NOT NULL
    ) OR (
      "outbox_events"."status" <> 'publishing' AND "outbox_events"."reserved_by" IS NULL AND "outbox_events"."reservation_expires_at" IS NULL
    ))
);
--> statement-breakpoint
CREATE INDEX "outbox_events_available_idx" ON "outbox_events" USING btree ("status","available_at","sequence");--> statement-breakpoint
CREATE INDEX "outbox_events_lease_idx" ON "outbox_events" USING btree ("status","reservation_expires_at");--> statement-breakpoint
CREATE INDEX "outbox_events_retention_idx" ON "outbox_events" USING btree ("status","published_at");