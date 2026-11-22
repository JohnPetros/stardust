CREATE TABLE "users_completed_stars" (
	"user_id" text NOT NULL,
	"star_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_completed_stars_pkey" PRIMARY KEY("user_id","star_id")
);
--> statement-breakpoint
CREATE TABLE "users_opened_planets" (
	"user_id" text NOT NULL,
	"planet_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_opened_planets_pkey" PRIMARY KEY("user_id","planet_id")
);
--> statement-breakpoint
ALTER TABLE "planets" ADD COLUMN "concept" text;--> statement-breakpoint
ALTER TABLE "stars" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "users_completed_stars" ADD CONSTRAINT "users_completed_stars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_completed_stars" ADD CONSTRAINT "users_completed_stars_star_id_fkey" FOREIGN KEY ("star_id") REFERENCES "public"."stars"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_opened_planets" ADD CONSTRAINT "users_opened_planets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_opened_planets" ADD CONSTRAINT "users_opened_planets_planet_id_fkey" FOREIGN KEY ("planet_id") REFERENCES "public"."planets"("id") ON DELETE cascade ON UPDATE no action;