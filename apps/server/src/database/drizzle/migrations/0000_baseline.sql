CREATE TYPE "public"."challenge_difficulty_level" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."challenge_vote" AS ENUM('upvote', 'downvote');--> statement-breakpoint
CREATE TYPE "public"."chat_message_sender" AS ENUM('user', 'assistant');--> statement-breakpoint
CREATE TYPE "public"."guide_category" AS ENUM('lsp', 'mdx');--> statement-breakpoint
CREATE TYPE "public"."ranking_status" AS ENUM('winner', 'loser');--> statement-breakpoint
CREATE TYPE "public"."feedback_intent" AS ENUM('bug', 'idea', 'other');--> statement-breakpoint
CREATE TYPE "public"."insignia_role" AS ENUM('engineer', 'god');--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"key_hash" text NOT NULL,
	"key_preview" text NOT NULL,
	"user_id" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone,
	CONSTRAINT "api_keys_pkey" PRIMARY KEY("id"),
	CONSTRAINT "api_keys_name_check" CHECK (char_length(TRIM(BOTH FROM name)) >= 1 AND char_length(TRIM(BOTH FROM name)) <= 60)
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "categories_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "challenges_categories" (
	"challenge_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	CONSTRAINT "challenges_categories_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "challenge_code_executions" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"challenge_id" uuid NOT NULL,
	"code" text NOT NULL,
	"status" text NOT NULL,
	"test_results" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"outputs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"error" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "challenge_code_executions_pkey" PRIMARY KEY("id"),
	CONSTRAINT "challenge_code_executions_status_check" CHECK (status = ANY (ARRAY['accepted'::text, 'wrong_answer'::text, 'syntax_error'::text, 'runtime_error'::text, 'internal_error'::text]))
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"title" varchar DEFAULT ''::character varying NOT NULL,
	"difficulty_level" varchar DEFAULT 'easy'::character varying NOT NULL,
	"created_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"star_id" uuid,
	"initial_code" text NOT NULL,
	"texts" jsonb,
	"function_name" text,
	"test_cases" jsonb NOT NULL,
	"slug" text NOT NULL,
	"user_id" varchar NOT NULL,
	"description" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"is_evaluated_by_function" boolean DEFAULT true NOT NULL,
	"official_solution" jsonb,
	CONSTRAINT "challenges_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "challenge_sources" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"challenge_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"url" text NOT NULL,
	"position" integer NOT NULL,
	"additional_instructions" text,
	CONSTRAINT "challenge_sources_pkey" PRIMARY KEY("id"),
	CONSTRAINT "challenge_sources_position_key" UNIQUE("position")
);
--> statement-breakpoint
CREATE TABLE "solutions" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"challenge_id" uuid NOT NULL,
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"user_id" varchar NOT NULL,
	"views_count" bigint NOT NULL,
	CONSTRAINT "solution_pkey" PRIMARY KEY("id"),
	CONSTRAINT "solutions_slug_key" UNIQUE("slug"),
	CONSTRAINT "solutions_title_key" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"sender" "chat_message_sender" NOT NULL,
	"chat_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chat_messages_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chats" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"user_id" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chats_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "challenges_comments" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"challenge_id" uuid,
	"comment_id" uuid NOT NULL,
	CONSTRAINT "challenge_comments_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	"content" text NOT NULL,
	"parent_comment_id" uuid,
	"user_id" varchar DEFAULT 'apollo'::text NOT NULL,
	CONSTRAINT "comments_pkey" PRIMARY KEY("id"),
	CONSTRAINT "comments_content_check" CHECK (length(content) >= 3)
);
--> statement-breakpoint
CREATE TABLE "solutions_comments" (
	"comment_id" uuid NOT NULL,
	"solution_id" uuid NOT NULL,
	CONSTRAINT "solutions_comments_pkey" PRIMARY KEY("comment_id","solution_id")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"content" jsonb NOT NULL,
	"star_id" uuid NOT NULL,
	"position" numeric NOT NULL,
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "questions_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "guides" (
	"title" text NOT NULL,
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"position" integer NOT NULL,
	"content" text,
	"category" "guide_category" DEFAULT 'lsp'::guide_category NOT NULL,
	CONSTRAINT "topics_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "snippets" (
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"title" text DEFAULT 'Sem título'::text NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"user_id" varchar NOT NULL,
	CONSTRAINT "codes_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" text NOT NULL,
	"icon" text NOT NULL,
	"description" text NOT NULL,
	"metric" text DEFAULT ''::text NOT NULL,
	"required_count" bigint NOT NULL,
	"reward" integer DEFAULT 20 NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "achievements_pkey" PRIMARY KEY("id"),
	CONSTRAINT "achievements_badge_achievement_key" UNIQUE("icon"),
	CONSTRAINT "achievements_description_achievement_key" UNIQUE("description"),
	CONSTRAINT "achievements_name_achievement_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text DEFAULT ''::text NOT NULL,
	"created_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	"user_id" varchar NOT NULL,
	CONSTRAINT "notes_pkey" PRIMARY KEY("id"),
	CONSTRAINT "notes_title_check" CHECK (length(title) >= 1)
);
--> statement-breakpoint
CREATE TABLE "users_acquired_avatars" (
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" varchar NOT NULL,
	"avatar_id" uuid NOT NULL,
	CONSTRAINT "users_acquired_avatars_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "users_acquired_insignias" (
	"user_id" varchar NOT NULL,
	"insignia_id" uuid NOT NULL,
	CONSTRAINT "users_acquired_insignias_pkey" PRIMARY KEY("user_id","insignia_id")
);
--> statement-breakpoint
CREATE TABLE "users_acquired_rockets" (
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" varchar NOT NULL,
	"rocket_id" uuid NOT NULL,
	CONSTRAINT "users_acquired_rockets_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "users_challenge_votes" (
	"challenge_id" uuid NOT NULL,
	"user_id" varchar NOT NULL,
	"vote" "challenge_vote" NOT NULL,
	CONSTRAINT "users_challenge_votes_pkey" PRIMARY KEY("challenge_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "users_completed_challenges" (
	"user_id" varchar NOT NULL,
	"challenge_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_completed_challenges_pkey" PRIMARY KEY("user_id","challenge_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"coins" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"week_status" text[] DEFAULT '{todo,todo,todo,todo,todo,todo,todo}'::text[] NOT NULL,
	"did_complete_saturday" boolean DEFAULT false NOT NULL,
	"tier_id" uuid DEFAULT 'f542f61a-4e42-4914-88f6-9aa7c2358473'::uuid,
	"rocket_id" uuid DEFAULT '03f3f359-a0ee-42c1-bd5f-b2ad01810d47'::uuid,
	"weekly_xp" integer DEFAULT 0 NOT NULL,
	"can_see_ranking" boolean DEFAULT false NOT NULL,
	"last_week_ranking_position" integer,
	"avatar_id" uuid DEFAULT '557a33e8-ce8a-4ac2-992c-7eab630d186d'::uuid,
	"study_time" text DEFAULT '10:00'::text NOT NULL,
	"did_break_streak" boolean DEFAULT false NOT NULL,
	"is_loser" boolean DEFAULT false,
	"slug" text NOT NULL,
	"has_completed_space" boolean DEFAULT false NOT NULL,
	CONSTRAINT "user_pkey" PRIMARY KEY("id"),
	CONSTRAINT "user_email_user_key" UNIQUE("email"),
	CONSTRAINT "users_name_key" UNIQUE("name"),
	CONSTRAINT "users_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users_recently_unlocked_stars" (
	"user_id" text NOT NULL,
	"star_id" uuid NOT NULL,
	CONSTRAINT "users_recently_unlocked_stars_pkey" PRIMARY KEY("user_id","star_id")
);
--> statement-breakpoint
CREATE TABLE "users_rescuable_achievements" (
	"user_id" varchar NOT NULL,
	"achievement_id" uuid NOT NULL,
	CONSTRAINT "users_rescuable_achievements_pkey" PRIMARY KEY("user_id","achievement_id")
);
--> statement-breakpoint
CREATE TABLE "users_unlocked_achievements" (
	"user_id" varchar NOT NULL,
	"achievement_id" uuid NOT NULL,
	CONSTRAINT "users_unlocked_achievements_pkey" PRIMARY KEY("user_id","achievement_id")
);
--> statement-breakpoint
CREATE TABLE "users_unlocked_stars" (
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" varchar NOT NULL,
	"star_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_unlocked_stars_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "users_upvoted_comments" (
	"user_id" varchar NOT NULL,
	"comment_id" uuid NOT NULL,
	CONSTRAINT "users_upvoted_comments_pkey" PRIMARY KEY("user_id","comment_id")
);
--> statement-breakpoint
CREATE TABLE "users_upvoted_solutions" (
	"solution_id" uuid NOT NULL,
	"user_id" varchar NOT NULL,
	CONSTRAINT "user_upvoted_solutions_pkey" PRIMARY KEY("solution_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "ranking_users" (
	"id" varchar NOT NULL,
	"tier_id" uuid NOT NULL,
	"xp" bigint DEFAULT '0'::bigint NOT NULL,
	"status" "ranking_status" DEFAULT 'winner'::ranking_status NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "winners_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "tiers" (
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" text NOT NULL,
	"image" text NOT NULL,
	"position" integer DEFAULT 1 NOT NULL,
	"reward" integer NOT NULL,
	CONSTRAINT "rankings_pkey" PRIMARY KEY("id"),
	CONSTRAINT "rankings_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "feedback_message_attachments" (
	"id" uuid NOT NULL,
	"message_id" uuid NOT NULL,
	"storage_key" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size" bigint NOT NULL,
	"position" smallint NOT NULL,
	CONSTRAINT "feedback_message_attachments_pkey" PRIMARY KEY("id"),
	CONSTRAINT "feedback_message_attachments_message_id_position_key" UNIQUE("message_id","position"),
	CONSTRAINT "feedback_message_attachments_storage_key_key" UNIQUE("storage_key"),
	CONSTRAINT "feedback_message_attachments_mime_type_check" CHECK (mime_type = ANY (ARRAY['image/png'::text, 'image/jpeg'::text])),
	CONSTRAINT "feedback_message_attachments_position_check" CHECK ("position" >= 0 AND "position" <= 2),
	CONSTRAINT "feedback_message_attachments_size_check" CHECK (size >= 1 AND size <= 10485760)
);
--> statement-breakpoint
CREATE TABLE "feedback_messages" (
	"id" uuid NOT NULL,
	"report_id" uuid NOT NULL,
	"author_role" text NOT NULL,
	"author_id" varchar NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "feedback_messages_pkey" PRIMARY KEY("id"),
	CONSTRAINT "feedback_messages_author_role_check" CHECK (author_role = ANY (ARRAY['user'::text, 'admin'::text])),
	CONSTRAINT "feedback_messages_content_check" CHECK (char_length(TRIM(BOTH FROM content)) >= 1 AND char_length(TRIM(BOTH FROM content)) <= 2000)
);
--> statement-breakpoint
CREATE TABLE "feedback_reports" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"screenshot" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"intent" "feedback_intent" NOT NULL,
	"user_id" varchar NOT NULL,
	"title" varchar(60) DEFAULT ''::character varying NOT NULL,
	"status" text DEFAULT 'open'::text NOT NULL,
	"last_activity_at" timestamp with time zone NOT NULL,
	"last_user_message_at" timestamp with time zone,
	"studio_read_at" timestamp with time zone,
	"last_admin_message_at" timestamp with time zone,
	"author_read_at" timestamp with time zone,
	CONSTRAINT "feedback_reports_pkey" PRIMARY KEY("id"),
	CONSTRAINT "feedback_reports_status_check" CHECK (status = ANY (ARRAY['open'::text, 'closed'::text])),
	CONSTRAINT "feedback_reports_title_length_check" CHECK (char_length(title::text) >= 1 AND char_length(title::text) <= 60)
);
--> statement-breakpoint
CREATE TABLE "avatars" (
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" text NOT NULL,
	"image" text NOT NULL,
	"price" bigint NOT NULL,
	"is_selected_by_default" boolean DEFAULT false NOT NULL,
	"is_acquired_by_default" boolean DEFAULT false NOT NULL,
	"is_purchasable" boolean DEFAULT true NOT NULL,
	CONSTRAINT "avatars_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "insignias" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"image" text NOT NULL,
	"role" "insignia_role" NOT NULL,
	"is_purchasable" boolean DEFAULT false NOT NULL,
	CONSTRAINT "insignias_pkey" PRIMARY KEY("id"),
	CONSTRAINT "insignias_role_key" UNIQUE("role")
);
--> statement-breakpoint
CREATE TABLE "rockets" (
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar NOT NULL,
	"price" integer NOT NULL,
	"image" varchar NOT NULL,
	"is_selected_by_default" boolean DEFAULT false NOT NULL,
	"is_acquired_by_default" boolean DEFAULT false NOT NULL,
	"is_purchasable" boolean DEFAULT true NOT NULL,
	CONSTRAINT "rockets_pkey" PRIMARY KEY("id"),
	CONSTRAINT "rockets_image_key" UNIQUE("image"),
	CONSTRAINT "rockets_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "planets" (
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" text NOT NULL,
	"image" text NOT NULL,
	"icon" text NOT NULL,
	"position" integer NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	CONSTRAINT "planets_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "stars" (
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" text NOT NULL,
	"number" integer NOT NULL,
	"is_challenge" boolean DEFAULT false NOT NULL,
	"planet_id" uuid NOT NULL,
	"texts" jsonb,
	"questions" jsonb,
	"slug" text NOT NULL,
	"story" text DEFAULT ''::text,
	"is_available" boolean DEFAULT true NOT NULL,
	CONSTRAINT "stars_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges_categories" ADD CONSTRAINT "challenges_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges_categories" ADD CONSTRAINT "challenges_categories_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_code_executions" ADD CONSTRAINT "challenge_code_executions_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_code_executions" ADD CONSTRAINT "challenge_code_executions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_star_id_fkey" FOREIGN KEY ("star_id") REFERENCES "public"."stars"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "challenge_sources" ADD CONSTRAINT "challenge_sources_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "solutions" ADD CONSTRAINT "public_solution_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "challenges_comments" ADD CONSTRAINT "challenge_comments_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "challenges_comments" ADD CONSTRAINT "challenge_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "solutions_comments" ADD CONSTRAINT "solutions_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "solutions_comments" ADD CONSTRAINT "solutions_comments_solution_id_fkey" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_star_id_fkey" FOREIGN KEY ("star_id") REFERENCES "public"."stars"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snippets" ADD CONSTRAINT "snippets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_acquired_avatars" ADD CONSTRAINT "users_acquired_avatars_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "public"."avatars"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_acquired_avatars" ADD CONSTRAINT "users_acquired_avatars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_acquired_insignias" ADD CONSTRAINT "users_acquired_insignias_insignia_id_fkey" FOREIGN KEY ("insignia_id") REFERENCES "public"."insignias"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_acquired_insignias" ADD CONSTRAINT "users_acquired_insignias_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_acquired_rockets" ADD CONSTRAINT "users_acquired_rockets_rocket_id_fkey" FOREIGN KEY ("rocket_id") REFERENCES "public"."rockets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_acquired_rockets" ADD CONSTRAINT "users_acquired_rockets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_challenge_votes" ADD CONSTRAINT "users_voted_challenges_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_challenge_votes" ADD CONSTRAINT "users_voted_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_completed_challenges" ADD CONSTRAINT "users_completed_challenges_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_completed_challenges" ADD CONSTRAINT "users_completed_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "public"."avatars"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_ranking_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "public"."tiers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_rocket_id_fkey" FOREIGN KEY ("rocket_id") REFERENCES "public"."rockets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_recently_unlocked_stars" ADD CONSTRAINT "users_recently_unlocked_stars_star_id_fkey" FOREIGN KEY ("star_id") REFERENCES "public"."stars"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_recently_unlocked_stars" ADD CONSTRAINT "users_recently_unlocked_stars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_rescuable_achievements" ADD CONSTRAINT "users_rescuable_achievements_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_rescuable_achievements" ADD CONSTRAINT "users_rescuable_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_unlocked_achievements" ADD CONSTRAINT "users_unlocked_achievements_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_unlocked_achievements" ADD CONSTRAINT "users_unlocked_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_unlocked_stars" ADD CONSTRAINT "users_unlocked_stars_star_id_fkey" FOREIGN KEY ("star_id") REFERENCES "public"."stars"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_unlocked_stars" ADD CONSTRAINT "users_unlocked_stars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_upvoted_comments" ADD CONSTRAINT "users_upvoted_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_upvoted_comments" ADD CONSTRAINT "users_upvoted_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_upvoted_solutions" ADD CONSTRAINT "user_upvoted_solutions_solution_id_fkey" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_upvoted_solutions" ADD CONSTRAINT "user_upvoted_solutions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ranking_users" ADD CONSTRAINT "winners_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ranking_users" ADD CONSTRAINT "winners_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "public"."tiers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_message_attachments" ADD CONSTRAINT "feedback_message_attachments_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "public"."feedback_messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_messages" ADD CONSTRAINT "feedback_messages_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "public"."feedback_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_reports" ADD CONSTRAINT "feedback_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "stars" ADD CONSTRAINT "stars_planet_id_fkey" FOREIGN KEY ("planet_id") REFERENCES "public"."planets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "api_keys_created_at_idx" ON "api_keys" USING btree ("created_at" DESC NULLS FIRST);--> statement-breakpoint
CREATE INDEX "api_keys_revoked_at_idx" ON "api_keys" USING btree ("revoked_at");--> statement-breakpoint
CREATE INDEX "api_keys_user_id_idx" ON "api_keys" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "challenge_code_executions_user_challenge_created_at_idx" ON "challenge_code_executions" USING btree ("user_id","challenge_id","created_at" DESC NULLS FIRST);--> statement-breakpoint
CREATE INDEX "challenge_code_executions_user_challenge_status_idx" ON "challenge_code_executions" USING btree ("user_id","challenge_id","status");--> statement-breakpoint
CREATE INDEX "notes_user_id_updated_at_idx" ON "notes" USING btree ("user_id","updated_at" DESC NULLS FIRST);--> statement-breakpoint
CREATE INDEX "feedback_message_attachments_message_idx" ON "feedback_message_attachments" USING btree ("message_id","position");--> statement-breakpoint
CREATE INDEX "feedback_messages_report_idx" ON "feedback_messages" USING btree ("report_id","created_at","id");--> statement-breakpoint
CREATE INDEX "feedback_reports_author_history_idx" ON "feedback_reports" USING btree ("user_id","last_activity_at" DESC NULLS FIRST,"id" DESC NULLS FIRST);--> statement-breakpoint
CREATE INDEX "feedback_reports_author_unread_idx" ON "feedback_reports" USING btree ("user_id","last_admin_message_at" DESC NULLS FIRST) WHERE ((last_admin_message_at IS NOT NULL) AND ((author_read_at IS NULL) OR (last_admin_message_at > author_read_at)));--> statement-breakpoint
CREATE INDEX "feedback_reports_queue_idx" ON "feedback_reports" USING btree ("status","last_activity_at" DESC NULLS FIRST,"id" DESC NULLS FIRST);--> statement-breakpoint
CREATE INDEX "feedback_reports_unread_idx" ON "feedback_reports" USING btree ("last_user_message_at","studio_read_at");--> statement-breakpoint
CREATE INDEX "feedback_reports_user_idx" ON "feedback_reports" USING btree ("user_id");