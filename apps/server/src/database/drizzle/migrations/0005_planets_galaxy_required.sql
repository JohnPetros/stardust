ALTER TABLE "planets" ALTER COLUMN "galaxy_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "planets" ADD CONSTRAINT "planets_galaxy_id_position_key" UNIQUE("galaxy_id","position");