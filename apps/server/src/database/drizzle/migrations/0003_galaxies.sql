CREATE TYPE "public"."galaxy_status" AS ENUM('published', 'announced', 'unpublished');--> statement-breakpoint
CREATE TABLE "galaxies" (
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"animation" text NOT NULL,
	"position" integer NOT NULL,
	"status" "galaxy_status" NOT NULL,
	CONSTRAINT "galaxies_pkey" PRIMARY KEY("id"),
	CONSTRAINT "galaxies_slug_key" UNIQUE("slug"),
	CONSTRAINT "galaxies_position_key" UNIQUE("position")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "current_galaxy_id" uuid;--> statement-breakpoint
ALTER TABLE "planets" ADD COLUMN "galaxy_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_current_galaxy_id_fkey" FOREIGN KEY ("current_galaxy_id") REFERENCES "public"."galaxies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "planets" ADD CONSTRAINT "planets_galaxy_id_fkey" FOREIGN KEY ("galaxy_id") REFERENCES "public"."galaxies"("id") ON DELETE restrict ON UPDATE no action;