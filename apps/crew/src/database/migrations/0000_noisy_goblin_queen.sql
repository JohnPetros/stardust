CREATE TYPE "crew"."agent_run_status" AS ENUM('started', 'running', 'stopping', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "crew"."agent_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agent" text NOT NULL,
	"idempotency_key" text NOT NULL,
	"input_hash" text NOT NULL,
	"status" "crew"."agent_run_status" DEFAULT 'started' NOT NULL,
	"heartbeat_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"subject_key" text,
	"subject_revision" text,
	"input" jsonb NOT NULL,
	"output" jsonb,
	"error_code" text,
	"error_message" text,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp (3) with time zone,
	"finished_at" timestamp (3) with time zone,
	CONSTRAINT "agent_runs_finished_state_check" CHECK (("crew"."agent_runs"."status" in ('completed', 'failed')) = ("crew"."agent_runs"."finished_at" is not null)),
	CONSTRAINT "agent_runs_output_state_check" CHECK ("crew"."agent_runs"."output" is null or "crew"."agent_runs"."status" = 'completed')
);
--> statement-breakpoint
CREATE UNIQUE INDEX "agent_runs_agent_idempotency_key_unique" ON "crew"."agent_runs" USING btree ("agent","idempotency_key");--> statement-breakpoint
CREATE INDEX "agent_runs_last_completed_idx" ON "crew"."agent_runs" USING btree ("agent","subject_key","finished_at" DESC NULLS LAST) WHERE "crew"."agent_runs"."status" = 'completed';--> statement-breakpoint
CREATE INDEX "agent_runs_unfinished_heartbeat_idx" ON "crew"."agent_runs" USING btree ("heartbeat_at") WHERE "crew"."agent_runs"."status" in ('started', 'running', 'stopping');--> statement-breakpoint
CREATE INDEX "agent_runs_finished_at_idx" ON "crew"."agent_runs" USING btree ("finished_at");