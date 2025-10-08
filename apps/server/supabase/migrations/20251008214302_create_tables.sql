create type "public"."challenge_difficulty_level" as enum ('easy', 'medium', 'hard');

create type "public"."challenge_vote" as enum ('upvote', 'downvote');

create type "public"."ranking_status" as enum ('winner', 'loser');

create table "public"."achievements" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "icon" text not null,
    "description" text not null,
    "metric" text not null default ''::text,
    "required_count" bigint not null,
    "reward" integer not null default 20,
    "position" integer not null
);


create table "public"."avatars" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "image" text not null,
    "price" bigint not null,
    "is_selected_by_default" boolean not null default false,
    "is_acquired_by_default" boolean not null default false
);


create table "public"."categories" (
    "id" uuid not null default uuid_generate_v4(),
    "name" character varying not null
);


create table "public"."challenges" (
    "title" character varying not null default ''::character varying,
    "difficulty_level" character varying not null default 'easy'::character varying,
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "id" uuid not null default uuid_generate_v4(),
    "star_id" uuid,
    "code" text not null,
    "texts" jsonb,
    "function_name" text,
    "test_cases" jsonb not null,
    "slug" text not null,
    "user_id" text not null default '38976417-7c77-44ff-9e26-5dc8b457f768'::text,
    "description" text,
    "is_public" boolean not null default false
);


create table "public"."challenges_categories" (
    "challenge_id" uuid not null,
    "category_id" uuid not null,
    "id" uuid not null default uuid_generate_v4()
);


create table "public"."challenges_comments" (
    "id" uuid not null default gen_random_uuid(),
    "challenge_id" uuid,
    "comment_id" uuid not null
);


create table "public"."comments" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "content" text not null,
    "parent_comment_id" uuid,
    "user_id" character varying not null default 'apollo'::text
);


create table "public"."docs" (
    "title" text not null,
    "id" uuid not null default uuid_generate_v4(),
    "position" integer not null,
    "content" text
);


create table "public"."planets" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "image" text not null,
    "icon" text not null,
    "position" integer not null
);


create table "public"."rockets" (
    "id" uuid not null default uuid_generate_v4(),
    "name" character varying not null,
    "price" integer not null,
    "image" character varying not null,
    "slug" text not null,
    "is_selected_by_default" boolean not null default false,
    "is_acquired_by_default" boolean not null default false
);


create table "public"."snippets" (
    "id" uuid not null default uuid_generate_v4(),
    "title" text not null default 'Sem título'::text,
    "code" text not null,
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "is_public" boolean not null default true,
    "user_id" character varying not null
);


create table "public"."solutions" (
    "created_at" timestamp with time zone not null default now(),
    "title" text not null,
    "content" text not null,
    "challenge_id" uuid not null,
    "id" uuid not null default gen_random_uuid(),
    "slug" text not null,
    "user_id" character varying not null,
    "views_count" bigint not null
);


create table "public"."solutions_comments" (
    "comment_id" uuid not null,
    "solution_id" uuid not null
);


create table "public"."stars" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "number" integer not null,
    "is_challenge" boolean not null default false,
    "planet_id" uuid not null,
    "texts" jsonb,
    "questions" jsonb,
    "slug" text not null,
    "story" text default ''::text
);


create table "public"."tiers" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "image" text not null,
    "position" integer not null default 1,
    "reward" integer not null
);


create table "public"."users" (
    "id" character varying not null,
    "name" character varying not null,
    "email" character varying not null,
    "level" integer not null default 1,
    "xp" integer not null default 0,
    "coins" integer not null default 0,
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "streak" integer not null default 0,
    "week_status" text[] not null default '{todo,todo,todo,todo,todo,todo,todo}'::text[],
    "did_complete_saturday" boolean not null default false,
    "tier_id" uuid default 'f542f61a-4e42-4914-88f6-9aa7c2358473'::uuid,
    "rocket_id" uuid default '03f3f359-a0ee-42c1-bd5f-b2ad01810d47'::uuid,
    "weekly_xp" integer not null default 0,
    "can_see_ranking" boolean not null default false,
    "last_week_ranking_position" integer,
    "avatar_id" uuid default '557a33e8-ce8a-4ac2-992c-7eab630d186d'::uuid,
    "study_time" text not null default '10:00'::text,
    "did_break_streak" boolean not null default false,
    "is_loser" boolean default false,
    "slug" text not null,
    "has_completed_space" boolean not null default false
);


create table "public"."users_acquired_avatars" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" character varying not null,
    "avatar_id" uuid not null
);


create table "public"."users_acquired_rockets" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" character varying not null,
    "rocket_id" uuid not null
);


create table "public"."users_challenge_votes" (
    "challenge_id" uuid not null,
    "user_id" character varying not null,
    "vote" challenge_vote not null
);


create table "public"."users_completed_challenges" (
    "user_id" character varying not null,
    "challenge_id" uuid not null
);


create table "public"."users_rescuable_achievements" (
    "user_id" character varying not null,
    "achievement_id" uuid not null
);


create table "public"."users_unlocked_achievements" (
    "user_id" character varying not null,
    "achievement_id" uuid not null
);


create table "public"."users_unlocked_stars" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" character varying not null,
    "star_id" uuid not null
);


create table "public"."users_upvoted_comments" (
    "user_id" character varying not null,
    "comment_id" uuid not null
);


create table "public"."users_upvoted_solutions" (
    "solution_id" uuid not null,
    "user_id" character varying not null
);


CREATE UNIQUE INDEX achievements_badge_achievement_key ON public.achievements USING btree (icon);

CREATE UNIQUE INDEX achievements_description_achievement_key ON public.achievements USING btree (description);

CREATE UNIQUE INDEX achievements_name_achievement_key ON public.achievements USING btree (name);

CREATE UNIQUE INDEX achievements_pkey ON public.achievements USING btree (id);

CREATE UNIQUE INDEX avatars_pkey ON public.avatars USING btree (id);

CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id);

CREATE UNIQUE INDEX challenge_comments_pkey ON public.challenges_comments USING btree (id);

CREATE UNIQUE INDEX challenges_categories_pkey ON public.challenges_categories USING btree (id);

CREATE UNIQUE INDEX challenges_pkey ON public.challenges USING btree (id);

CREATE UNIQUE INDEX codes_pkey ON public.snippets USING btree (id);

CREATE UNIQUE INDEX comments_pkey ON public.comments USING btree (id);

CREATE UNIQUE INDEX planets_pkey ON public.planets USING btree (id);

CREATE UNIQUE INDEX rankings_name_key ON public.tiers USING btree (name);

CREATE UNIQUE INDEX rankings_pkey ON public.tiers USING btree (id);

CREATE UNIQUE INDEX rockets_image_key ON public.rockets USING btree (image);

CREATE UNIQUE INDEX rockets_name_key ON public.rockets USING btree (name);

CREATE UNIQUE INDEX rockets_pkey ON public.rockets USING btree (id);

CREATE UNIQUE INDEX solution_pkey ON public.solutions USING btree (id);

CREATE UNIQUE INDEX solutions_comments_pkey ON public.solutions_comments USING btree (comment_id, solution_id);

CREATE UNIQUE INDEX solutions_slug_key ON public.solutions USING btree (slug);

CREATE UNIQUE INDEX solutions_title_key ON public.solutions USING btree (title);

CREATE UNIQUE INDEX stars_pkey ON public.stars USING btree (id);

CREATE UNIQUE INDEX topics_pkey ON public.docs USING btree (id);

CREATE UNIQUE INDEX user_email_user_key ON public.users USING btree (email);

CREATE UNIQUE INDEX user_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX user_unlocked_stars_pkey ON public.users_unlocked_stars USING btree (id);

CREATE UNIQUE INDEX user_upvoted_solutions_pkey ON public.users_upvoted_solutions USING btree (solution_id, user_id);

CREATE UNIQUE INDEX users_acquired_avatars_pkey ON public.users_acquired_avatars USING btree (id);

CREATE UNIQUE INDEX users_acquired_rockets_pkey ON public.users_acquired_rockets USING btree (id);

CREATE UNIQUE INDEX users_challenge_votes_pkey ON public.users_challenge_votes USING btree (challenge_id, user_id);

CREATE UNIQUE INDEX users_completed_challenges_pkey ON public.users_completed_challenges USING btree (user_id, challenge_id);

CREATE UNIQUE INDEX users_name_key ON public.users USING btree (name);

CREATE UNIQUE INDEX users_rescuable_achievements_pkey ON public.users_rescuable_achievements USING btree (user_id, achievement_id);

CREATE UNIQUE INDEX users_slug_key ON public.users USING btree (slug);

CREATE UNIQUE INDEX users_unlocked_achievements_pkey ON public.users_unlocked_achievements USING btree (user_id, achievement_id);

CREATE UNIQUE INDEX users_upvoted_comments_pkey ON public.users_upvoted_comments USING btree (user_id, comment_id);

alter table "public"."achievements" add constraint "achievements_pkey" PRIMARY KEY using index "achievements_pkey";

alter table "public"."avatars" add constraint "avatars_pkey" PRIMARY KEY using index "avatars_pkey";

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."challenges" add constraint "challenges_pkey" PRIMARY KEY using index "challenges_pkey";

alter table "public"."challenges_categories" add constraint "challenges_categories_pkey" PRIMARY KEY using index "challenges_categories_pkey";

alter table "public"."challenges_comments" add constraint "challenge_comments_pkey" PRIMARY KEY using index "challenge_comments_pkey";

alter table "public"."comments" add constraint "comments_pkey" PRIMARY KEY using index "comments_pkey";

alter table "public"."docs" add constraint "topics_pkey" PRIMARY KEY using index "topics_pkey";

alter table "public"."planets" add constraint "planets_pkey" PRIMARY KEY using index "planets_pkey";

alter table "public"."rockets" add constraint "rockets_pkey" PRIMARY KEY using index "rockets_pkey";

alter table "public"."snippets" add constraint "codes_pkey" PRIMARY KEY using index "codes_pkey";

alter table "public"."solutions" add constraint "solution_pkey" PRIMARY KEY using index "solution_pkey";

alter table "public"."solutions_comments" add constraint "solutions_comments_pkey" PRIMARY KEY using index "solutions_comments_pkey";

alter table "public"."stars" add constraint "stars_pkey" PRIMARY KEY using index "stars_pkey";

alter table "public"."tiers" add constraint "rankings_pkey" PRIMARY KEY using index "rankings_pkey";

alter table "public"."users" add constraint "user_pkey" PRIMARY KEY using index "user_pkey";

alter table "public"."users_acquired_avatars" add constraint "users_acquired_avatars_pkey" PRIMARY KEY using index "users_acquired_avatars_pkey";

alter table "public"."users_acquired_rockets" add constraint "users_acquired_rockets_pkey" PRIMARY KEY using index "users_acquired_rockets_pkey";

alter table "public"."users_challenge_votes" add constraint "users_challenge_votes_pkey" PRIMARY KEY using index "users_challenge_votes_pkey";

alter table "public"."users_completed_challenges" add constraint "users_completed_challenges_pkey" PRIMARY KEY using index "users_completed_challenges_pkey";

alter table "public"."users_rescuable_achievements" add constraint "users_rescuable_achievements_pkey" PRIMARY KEY using index "users_rescuable_achievements_pkey";

alter table "public"."users_unlocked_achievements" add constraint "users_unlocked_achievements_pkey" PRIMARY KEY using index "users_unlocked_achievements_pkey";

alter table "public"."users_unlocked_stars" add constraint "user_unlocked_stars_pkey" PRIMARY KEY using index "user_unlocked_stars_pkey";

alter table "public"."users_upvoted_comments" add constraint "users_upvoted_comments_pkey" PRIMARY KEY using index "users_upvoted_comments_pkey";

alter table "public"."users_upvoted_solutions" add constraint "user_upvoted_solutions_pkey" PRIMARY KEY using index "user_upvoted_solutions_pkey";

alter table "public"."achievements" add constraint "achievements_badge_achievement_key" UNIQUE using index "achievements_badge_achievement_key";

alter table "public"."achievements" add constraint "achievements_description_achievement_key" UNIQUE using index "achievements_description_achievement_key";

alter table "public"."achievements" add constraint "achievements_name_achievement_key" UNIQUE using index "achievements_name_achievement_key";

alter table "public"."challenges" add constraint "challenges_star_id_fkey" FOREIGN KEY (star_id) REFERENCES stars(id) ON DELETE CASCADE not valid;

alter table "public"."challenges" validate constraint "challenges_star_id_fkey";

alter table "public"."challenges" add constraint "challenges_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."challenges" validate constraint "challenges_user_id_fkey";

alter table "public"."challenges_categories" add constraint "challenges_categories_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE not valid;

alter table "public"."challenges_categories" validate constraint "challenges_categories_category_id_fkey";

alter table "public"."challenges_categories" add constraint "challenges_categories_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE not valid;

alter table "public"."challenges_categories" validate constraint "challenges_categories_challenge_id_fkey";

alter table "public"."challenges_comments" add constraint "challenge_comments_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."challenges_comments" validate constraint "challenge_comments_challenge_id_fkey";

alter table "public"."challenges_comments" add constraint "challenge_comments_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."challenges_comments" validate constraint "challenge_comments_comment_id_fkey";

alter table "public"."comments" add constraint "comments_content_check" CHECK ((length(content) >= 3)) not valid;

alter table "public"."comments" validate constraint "comments_content_check";

alter table "public"."comments" add constraint "comments_parent_comment_id_fkey" FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_parent_comment_id_fkey";

alter table "public"."comments" add constraint "comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_user_id_fkey";

alter table "public"."rockets" add constraint "rockets_image_key" UNIQUE using index "rockets_image_key";

alter table "public"."rockets" add constraint "rockets_name_key" UNIQUE using index "rockets_name_key";

alter table "public"."snippets" add constraint "snippets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."snippets" validate constraint "snippets_user_id_fkey";

alter table "public"."solutions" add constraint "public_solution_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."solutions" validate constraint "public_solution_challenge_id_fkey";

alter table "public"."solutions" add constraint "solutions_slug_key" UNIQUE using index "solutions_slug_key";

alter table "public"."solutions" add constraint "solutions_title_key" UNIQUE using index "solutions_title_key";

alter table "public"."solutions" add constraint "solutions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."solutions" validate constraint "solutions_user_id_fkey";

alter table "public"."solutions_comments" add constraint "solutions_comments_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."solutions_comments" validate constraint "solutions_comments_comment_id_fkey";

alter table "public"."solutions_comments" add constraint "solutions_comments_solution_id_fkey" FOREIGN KEY (solution_id) REFERENCES solutions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."solutions_comments" validate constraint "solutions_comments_solution_id_fkey";

alter table "public"."stars" add constraint "stars_planet_id_fkey" FOREIGN KEY (planet_id) REFERENCES planets(id) ON DELETE CASCADE not valid;

alter table "public"."stars" validate constraint "stars_planet_id_fkey";

alter table "public"."tiers" add constraint "rankings_name_key" UNIQUE using index "rankings_name_key";

alter table "public"."users" add constraint "user_email_user_key" UNIQUE using index "user_email_user_key";

alter table "public"."users" add constraint "users_avatar_id_fkey" FOREIGN KEY (avatar_id) REFERENCES avatars(id) not valid;

alter table "public"."users" validate constraint "users_avatar_id_fkey";

alter table "public"."users" add constraint "users_name_key" UNIQUE using index "users_name_key";

alter table "public"."users" add constraint "users_ranking_id_fkey" FOREIGN KEY (tier_id) REFERENCES tiers(id) not valid;

alter table "public"."users" validate constraint "users_ranking_id_fkey";

alter table "public"."users" add constraint "users_rocket_id_fkey" FOREIGN KEY (rocket_id) REFERENCES rockets(id) not valid;

alter table "public"."users" validate constraint "users_rocket_id_fkey";

alter table "public"."users" add constraint "users_slug_key" UNIQUE using index "users_slug_key";

alter table "public"."users_acquired_avatars" add constraint "users_acquired_avatars_avatar_id_fkey" FOREIGN KEY (avatar_id) REFERENCES avatars(id) ON DELETE CASCADE not valid;

alter table "public"."users_acquired_avatars" validate constraint "users_acquired_avatars_avatar_id_fkey";

alter table "public"."users_acquired_avatars" add constraint "users_acquired_avatars_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users_acquired_avatars" validate constraint "users_acquired_avatars_user_id_fkey";

alter table "public"."users_acquired_rockets" add constraint "users_acquired_rockets_rocket_id_fkey" FOREIGN KEY (rocket_id) REFERENCES rockets(id) not valid;

alter table "public"."users_acquired_rockets" validate constraint "users_acquired_rockets_rocket_id_fkey";

alter table "public"."users_acquired_rockets" add constraint "users_acquired_rockets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users_acquired_rockets" validate constraint "users_acquired_rockets_user_id_fkey";

alter table "public"."users_challenge_votes" add constraint "users_voted_challenges_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users_challenge_votes" validate constraint "users_voted_challenges_challenge_id_fkey";

alter table "public"."users_challenge_votes" add constraint "users_voted_challenges_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users_challenge_votes" validate constraint "users_voted_challenges_user_id_fkey";

alter table "public"."users_completed_challenges" add constraint "users_completed_challenges_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE not valid;

alter table "public"."users_completed_challenges" validate constraint "users_completed_challenges_challenge_id_fkey";

alter table "public"."users_completed_challenges" add constraint "users_completed_challenges_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."users_completed_challenges" validate constraint "users_completed_challenges_user_id_fkey";

alter table "public"."users_rescuable_achievements" add constraint "users_rescuable_achievements_achievement_id_fkey" FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE not valid;

alter table "public"."users_rescuable_achievements" validate constraint "users_rescuable_achievements_achievement_id_fkey";

alter table "public"."users_rescuable_achievements" add constraint "users_rescuable_achievements_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."users_rescuable_achievements" validate constraint "users_rescuable_achievements_user_id_fkey";

alter table "public"."users_unlocked_achievements" add constraint "users_unlocked_achievements_achievement_id_fkey" FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE not valid;

alter table "public"."users_unlocked_achievements" validate constraint "users_unlocked_achievements_achievement_id_fkey";

alter table "public"."users_unlocked_achievements" add constraint "users_unlocked_achievements_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."users_unlocked_achievements" validate constraint "users_unlocked_achievements_user_id_fkey";

alter table "public"."users_unlocked_stars" add constraint "users_unlocked_stars_star_id_fkey" FOREIGN KEY (star_id) REFERENCES stars(id) ON DELETE CASCADE not valid;

alter table "public"."users_unlocked_stars" validate constraint "users_unlocked_stars_star_id_fkey";

alter table "public"."users_unlocked_stars" add constraint "users_unlocked_stars_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."users_unlocked_stars" validate constraint "users_unlocked_stars_user_id_fkey";

alter table "public"."users_upvoted_comments" add constraint "users_upvoted_comments_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE not valid;

alter table "public"."users_upvoted_comments" validate constraint "users_upvoted_comments_comment_id_fkey";

alter table "public"."users_upvoted_comments" add constraint "users_upvoted_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users_upvoted_comments" validate constraint "users_upvoted_comments_user_id_fkey";

alter table "public"."users_upvoted_solutions" add constraint "user_upvoted_solutions_solution_id_fkey" FOREIGN KEY (solution_id) REFERENCES solutions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users_upvoted_solutions" validate constraint "user_upvoted_solutions_solution_id_fkey";

alter table "public"."users_upvoted_solutions" add constraint "user_upvoted_solutions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users_upvoted_solutions" validate constraint "user_upvoted_solutions_user_id_fkey";

create or replace view "public"."challenges_view" as  SELECT c.title,
    c.difficulty_level,
    c.created_at,
    c.id,
    c.star_id,
    c.code,
    c.texts,
    c.function_name,
    c.test_cases,
    c.slug,
    c.user_id,
    c.description,
    c.is_public,
    u.id AS author_id,
    u.name AS author_name,
    u.slug AS author_slug,
    a.name AS author_avatar_name,
    a.image AS author_avatar_image,
    count(DISTINCT
        CASE
            WHEN (uvc.vote = 'upvote'::challenge_vote) THEN 1
            ELSE NULL::integer
        END) AS upvotes_count,
    count(DISTINCT
        CASE
            WHEN (uvc.vote = 'downvote'::challenge_vote) THEN 1
            ELSE NULL::integer
        END) AS downvotes_count,
    count(DISTINCT ucc.challenge_id) AS total_completitions,
    array_agg(json_build_object('id', ccc.id, 'name', ccc.name)) AS categories
   FROM ((((((challenges c
     LEFT JOIN users u ON (((u.id)::text = c.user_id)))
     LEFT JOIN users_challenge_votes uvc ON ((uvc.challenge_id = c.id)))
     LEFT JOIN users_completed_challenges ucc ON ((ucc.challenge_id = c.id)))
     LEFT JOIN challenges_categories cc ON ((cc.challenge_id = c.id)))
     LEFT JOIN categories ccc ON ((ccc.id = cc.category_id)))
     LEFT JOIN avatars a ON ((a.id = u.avatar_id)))
  GROUP BY c.id, u.id, a.name, a.image;


create or replace view "public"."comments_view" as  SELECT c.id,
    c.content,
    c.created_at,
    c.parent_comment_id,
    c.user_id AS author_id,
    COALESCE(( SELECT count(users_upvoted_comments.comment_id) AS count
           FROM users_upvoted_comments
          WHERE (users_upvoted_comments.comment_id = c.id)), (0)::bigint) AS upvotes_count,
    COALESCE(( SELECT count(comments.id) AS count
           FROM comments
          WHERE (comments.parent_comment_id = c.id)), (0)::bigint) AS replies_count,
    u.name AS author_name,
    u.slug AS author_slug,
    a.name AS author_avatar_name,
    a.image AS author_avatar_image
   FROM ((comments c
     LEFT JOIN users u ON (((u.id)::text = (c.user_id)::text)))
     LEFT JOIN avatars a ON ((a.id = u.avatar_id)))
  GROUP BY c.id, u.id, a.name, a.image;


create or replace view "public"."planets_view" as  WITH planet_star_counts AS (
         SELECT stars.planet_id,
            count(stars.id) AS total_stars
           FROM stars
          GROUP BY stars.planet_id
        ), user_planet_progress AS (
         SELECT s.planet_id,
            uus.user_id,
            count(uus.star_id) AS unlocked_stars_count
           FROM (users_unlocked_stars uus
             JOIN stars s ON ((uus.star_id = s.id)))
          GROUP BY s.planet_id, uus.user_id
        ), completed_planets_counts AS (
         SELECT upp.planet_id,
            count(upp.user_id) AS completion_count
           FROM (user_planet_progress upp
             JOIN planet_star_counts psc ON ((upp.planet_id = psc.planet_id)))
          WHERE (upp.unlocked_stars_count = psc.total_stars)
          GROUP BY upp.planet_id
        )
 SELECT p.id,
    p.name,
    p.image,
    p.icon,
    p."position",
    COALESCE(cpc.completion_count, (0)::bigint) AS completions_count
   FROM (planets p
     LEFT JOIN completed_planets_counts cpc ON ((p.id = cpc.planet_id)));


create or replace view "public"."snippets_view" as  SELECT s.id,
    s.title,
    s.code,
    s.is_public,
    s.created_at,
    s.user_id AS author_id,
    u.name AS author_name,
    u.slug AS author_slug,
    a.name AS author_avatar_name,
    a.image AS author_avatar_image
   FROM ((snippets s
     LEFT JOIN users u ON (((u.id)::text = (s.user_id)::text)))
     LEFT JOIN avatars a ON ((a.id = u.avatar_id)))
  GROUP BY s.id, u.id, a.name, a.image;


create or replace view "public"."solutions_view" as  SELECT s.id,
    s.title,
    s.content,
    s.slug,
    s.views_count,
    s.challenge_id,
    s.created_at,
    s.user_id AS author_id,
    COALESCE(( SELECT count(users_upvoted_solutions.solution_id) AS count
           FROM users_upvoted_solutions
          WHERE (users_upvoted_solutions.solution_id = s.id)), (0)::bigint) AS upvotes_count,
    COALESCE(( SELECT count(solutions_comments.solution_id) AS count
           FROM solutions_comments
          WHERE (solutions_comments.solution_id = s.id)), (0)::bigint) AS comments_count,
    u.name AS author_name,
    u.slug AS author_slug,
    a.name AS author_avatar_name,
    a.image AS author_avatar_image
   FROM ((solutions s
     LEFT JOIN users u ON (((u.id)::text = (s.user_id)::text)))
     LEFT JOIN avatars a ON ((a.id = u.avatar_id)))
  GROUP BY s.id, u.id, a.name, a.image;


create or replace view "public"."users_completed_planets_view" as  WITH unlocked_stars_by_planet AS (
         SELECT p.id AS planet_id,
            p.name AS planet_name,
            count(DISTINCT uus.star_id) AS unlocked_stars_count,
            uus.user_id
           FROM ((users_unlocked_stars uus
             JOIN stars s ON ((uus.star_id = s.id)))
             JOIN planets p ON ((s.planet_id = p.id)))
          GROUP BY p.id, p.name, p."position", uus.user_id
          ORDER BY p."position"
        ), all_stars_by_planet AS (
         SELECT p.id AS planet_id,
            p.name AS planet_name,
            count(s.id) AS stars_count
           FROM (planets p
             JOIN stars s ON ((s.planet_id = p.id)))
          GROUP BY p.id, p.name, p."position"
          ORDER BY p."position"
        )
 SELECT u.id AS user_id,
    asbp.planet_id
   FROM ((unlocked_stars_by_planet usbp
     JOIN all_stars_by_planet asbp ON ((usbp.planet_id = asbp.planet_id)))
     JOIN users u ON (((u.id)::text = (usbp.user_id)::text)))
  WHERE ((usbp.unlocked_stars_count >= asbp.stars_count) AND ((usbp.user_id)::text = (u.id)::text));


create or replace view "public"."users_view" as  WITH unlocked_stars_by_planet AS (
         SELECT p.id AS planet_id,
            p.name AS planet_name,
            count(DISTINCT uus_1.star_id) AS unlocked_stars_count,
            uus_1.user_id
           FROM ((users_unlocked_stars uus_1
             JOIN stars s ON ((uus_1.star_id = s.id)))
             JOIN planets p ON ((s.planet_id = p.id)))
          GROUP BY p.id, p.name, p."position", uus_1.user_id
          ORDER BY p."position"
        ), all_stars_by_planet AS (
         SELECT p.id AS planet_id,
            p.name AS planet_name,
            count(s.id) AS stars_count
           FROM (planets p
             JOIN stars s ON ((s.planet_id = p.id)))
          GROUP BY p.id, p.name, p."position"
          ORDER BY p."position"
        )
 SELECT u.id,
    u.name,
    u.email,
    u.level,
    u.xp,
    u.coins,
    u.created_at,
    u.streak,
    u.week_status,
    u.did_complete_saturday,
    u.tier_id,
    u.rocket_id,
    u.weekly_xp,
    u.can_see_ranking,
    u.last_week_ranking_position,
    u.avatar_id,
    u.study_time,
    u.did_break_streak,
    u.is_loser,
    u.slug,
    array_agg(DISTINCT uus.star_id) AS unlocked_stars_ids,
    array_agg(DISTINCT uua.achievement_id) AS unlocked_achievements_ids,
    array_agg(DISTINCT ura.achievement_id) AS rescuable_achievements_ids,
    array_agg(DISTINCT ucc.challenge_id) AS completed_challenges_ids,
    array_agg(DISTINCT uar.rocket_id) AS acquired_rockets_ids,
    array_agg(DISTINCT uaa.avatar_id) AS acquired_avatars_ids,
    array_agg(DISTINCT uuc.comment_id) AS upvoted_comments_ids,
    array_agg(DISTINCT uuso.solution_id) AS upvoted_solutions_ids,
    ( SELECT array_agg(DISTINCT asbp.planet_id) AS array_agg
           FROM (unlocked_stars_by_planet usbp
             JOIN all_stars_by_planet asbp ON ((usbp.planet_id = asbp.planet_id)))
          WHERE ((usbp.unlocked_stars_count >= asbp.stars_count) AND ((usbp.user_id)::text = (u.id)::text))) AS completed_planets_ids
   FROM ((((((((users u
     LEFT JOIN users_unlocked_stars uus ON (((uus.user_id)::text = (u.id)::text)))
     LEFT JOIN users_unlocked_achievements uua ON (((uua.user_id)::text = (u.id)::text)))
     LEFT JOIN users_rescuable_achievements ura ON (((ura.user_id)::text = (u.id)::text)))
     LEFT JOIN users_completed_challenges ucc ON (((ucc.user_id)::text = (u.id)::text)))
     LEFT JOIN users_acquired_rockets uar ON (((uar.user_id)::text = (u.id)::text)))
     LEFT JOIN users_acquired_avatars uaa ON (((uaa.user_id)::text = (u.id)::text)))
     LEFT JOIN users_upvoted_comments uuc ON (((uuc.user_id)::text = (u.id)::text)))
     LEFT JOIN users_upvoted_solutions uuso ON (((uuso.user_id)::text = (u.id)::text)))
  GROUP BY u.id;


grant delete on table "public"."achievements" to "anon";

grant insert on table "public"."achievements" to "anon";

grant references on table "public"."achievements" to "anon";

grant select on table "public"."achievements" to "anon";

grant trigger on table "public"."achievements" to "anon";

grant truncate on table "public"."achievements" to "anon";

grant update on table "public"."achievements" to "anon";

grant delete on table "public"."achievements" to "authenticated";

grant insert on table "public"."achievements" to "authenticated";

grant references on table "public"."achievements" to "authenticated";

grant select on table "public"."achievements" to "authenticated";

grant trigger on table "public"."achievements" to "authenticated";

grant truncate on table "public"."achievements" to "authenticated";

grant update on table "public"."achievements" to "authenticated";

grant delete on table "public"."achievements" to "service_role";

grant insert on table "public"."achievements" to "service_role";

grant references on table "public"."achievements" to "service_role";

grant select on table "public"."achievements" to "service_role";

grant trigger on table "public"."achievements" to "service_role";

grant truncate on table "public"."achievements" to "service_role";

grant update on table "public"."achievements" to "service_role";

grant delete on table "public"."avatars" to "anon";

grant insert on table "public"."avatars" to "anon";

grant references on table "public"."avatars" to "anon";

grant select on table "public"."avatars" to "anon";

grant trigger on table "public"."avatars" to "anon";

grant truncate on table "public"."avatars" to "anon";

grant update on table "public"."avatars" to "anon";

grant delete on table "public"."avatars" to "authenticated";

grant insert on table "public"."avatars" to "authenticated";

grant references on table "public"."avatars" to "authenticated";

grant select on table "public"."avatars" to "authenticated";

grant trigger on table "public"."avatars" to "authenticated";

grant truncate on table "public"."avatars" to "authenticated";

grant update on table "public"."avatars" to "authenticated";

grant delete on table "public"."avatars" to "service_role";

grant insert on table "public"."avatars" to "service_role";

grant references on table "public"."avatars" to "service_role";

grant select on table "public"."avatars" to "service_role";

grant trigger on table "public"."avatars" to "service_role";

grant truncate on table "public"."avatars" to "service_role";

grant update on table "public"."avatars" to "service_role";

grant delete on table "public"."categories" to "anon";

grant insert on table "public"."categories" to "anon";

grant references on table "public"."categories" to "anon";

grant select on table "public"."categories" to "anon";

grant trigger on table "public"."categories" to "anon";

grant truncate on table "public"."categories" to "anon";

grant update on table "public"."categories" to "anon";

grant delete on table "public"."categories" to "authenticated";

grant insert on table "public"."categories" to "authenticated";

grant references on table "public"."categories" to "authenticated";

grant select on table "public"."categories" to "authenticated";

grant trigger on table "public"."categories" to "authenticated";

grant truncate on table "public"."categories" to "authenticated";

grant update on table "public"."categories" to "authenticated";

grant delete on table "public"."categories" to "service_role";

grant insert on table "public"."categories" to "service_role";

grant references on table "public"."categories" to "service_role";

grant select on table "public"."categories" to "service_role";

grant trigger on table "public"."categories" to "service_role";

grant truncate on table "public"."categories" to "service_role";

grant update on table "public"."categories" to "service_role";

grant delete on table "public"."challenges" to "anon";

grant insert on table "public"."challenges" to "anon";

grant references on table "public"."challenges" to "anon";

grant select on table "public"."challenges" to "anon";

grant trigger on table "public"."challenges" to "anon";

grant truncate on table "public"."challenges" to "anon";

grant update on table "public"."challenges" to "anon";

grant delete on table "public"."challenges" to "authenticated";

grant insert on table "public"."challenges" to "authenticated";

grant references on table "public"."challenges" to "authenticated";

grant select on table "public"."challenges" to "authenticated";

grant trigger on table "public"."challenges" to "authenticated";

grant truncate on table "public"."challenges" to "authenticated";

grant update on table "public"."challenges" to "authenticated";

grant delete on table "public"."challenges" to "service_role";

grant insert on table "public"."challenges" to "service_role";

grant references on table "public"."challenges" to "service_role";

grant select on table "public"."challenges" to "service_role";

grant trigger on table "public"."challenges" to "service_role";

grant truncate on table "public"."challenges" to "service_role";

grant update on table "public"."challenges" to "service_role";

grant delete on table "public"."challenges_categories" to "anon";

grant insert on table "public"."challenges_categories" to "anon";

grant references on table "public"."challenges_categories" to "anon";

grant select on table "public"."challenges_categories" to "anon";

grant trigger on table "public"."challenges_categories" to "anon";

grant truncate on table "public"."challenges_categories" to "anon";

grant update on table "public"."challenges_categories" to "anon";

grant delete on table "public"."challenges_categories" to "authenticated";

grant insert on table "public"."challenges_categories" to "authenticated";

grant references on table "public"."challenges_categories" to "authenticated";

grant select on table "public"."challenges_categories" to "authenticated";

grant trigger on table "public"."challenges_categories" to "authenticated";

grant truncate on table "public"."challenges_categories" to "authenticated";

grant update on table "public"."challenges_categories" to "authenticated";

grant delete on table "public"."challenges_categories" to "service_role";

grant insert on table "public"."challenges_categories" to "service_role";

grant references on table "public"."challenges_categories" to "service_role";

grant select on table "public"."challenges_categories" to "service_role";

grant trigger on table "public"."challenges_categories" to "service_role";

grant truncate on table "public"."challenges_categories" to "service_role";

grant update on table "public"."challenges_categories" to "service_role";

grant delete on table "public"."challenges_comments" to "anon";

grant insert on table "public"."challenges_comments" to "anon";

grant references on table "public"."challenges_comments" to "anon";

grant select on table "public"."challenges_comments" to "anon";

grant trigger on table "public"."challenges_comments" to "anon";

grant truncate on table "public"."challenges_comments" to "anon";

grant update on table "public"."challenges_comments" to "anon";

grant delete on table "public"."challenges_comments" to "authenticated";

grant insert on table "public"."challenges_comments" to "authenticated";

grant references on table "public"."challenges_comments" to "authenticated";

grant select on table "public"."challenges_comments" to "authenticated";

grant trigger on table "public"."challenges_comments" to "authenticated";

grant truncate on table "public"."challenges_comments" to "authenticated";

grant update on table "public"."challenges_comments" to "authenticated";

grant delete on table "public"."challenges_comments" to "service_role";

grant insert on table "public"."challenges_comments" to "service_role";

grant references on table "public"."challenges_comments" to "service_role";

grant select on table "public"."challenges_comments" to "service_role";

grant trigger on table "public"."challenges_comments" to "service_role";

grant truncate on table "public"."challenges_comments" to "service_role";

grant update on table "public"."challenges_comments" to "service_role";

grant delete on table "public"."comments" to "anon";

grant insert on table "public"."comments" to "anon";

grant references on table "public"."comments" to "anon";

grant select on table "public"."comments" to "anon";

grant trigger on table "public"."comments" to "anon";

grant truncate on table "public"."comments" to "anon";

grant update on table "public"."comments" to "anon";

grant delete on table "public"."comments" to "authenticated";

grant insert on table "public"."comments" to "authenticated";

grant references on table "public"."comments" to "authenticated";

grant select on table "public"."comments" to "authenticated";

grant trigger on table "public"."comments" to "authenticated";

grant truncate on table "public"."comments" to "authenticated";

grant update on table "public"."comments" to "authenticated";

grant delete on table "public"."comments" to "service_role";

grant insert on table "public"."comments" to "service_role";

grant references on table "public"."comments" to "service_role";

grant select on table "public"."comments" to "service_role";

grant trigger on table "public"."comments" to "service_role";

grant truncate on table "public"."comments" to "service_role";

grant update on table "public"."comments" to "service_role";

grant delete on table "public"."docs" to "anon";

grant insert on table "public"."docs" to "anon";

grant references on table "public"."docs" to "anon";

grant select on table "public"."docs" to "anon";

grant trigger on table "public"."docs" to "anon";

grant truncate on table "public"."docs" to "anon";

grant update on table "public"."docs" to "anon";

grant delete on table "public"."docs" to "authenticated";

grant insert on table "public"."docs" to "authenticated";

grant references on table "public"."docs" to "authenticated";

grant select on table "public"."docs" to "authenticated";

grant trigger on table "public"."docs" to "authenticated";

grant truncate on table "public"."docs" to "authenticated";

grant update on table "public"."docs" to "authenticated";

grant delete on table "public"."docs" to "service_role";

grant insert on table "public"."docs" to "service_role";

grant references on table "public"."docs" to "service_role";

grant select on table "public"."docs" to "service_role";

grant trigger on table "public"."docs" to "service_role";

grant truncate on table "public"."docs" to "service_role";

grant update on table "public"."docs" to "service_role";

grant delete on table "public"."planets" to "anon";

grant insert on table "public"."planets" to "anon";

grant references on table "public"."planets" to "anon";

grant select on table "public"."planets" to "anon";

grant trigger on table "public"."planets" to "anon";

grant truncate on table "public"."planets" to "anon";

grant update on table "public"."planets" to "anon";

grant delete on table "public"."planets" to "authenticated";

grant insert on table "public"."planets" to "authenticated";

grant references on table "public"."planets" to "authenticated";

grant select on table "public"."planets" to "authenticated";

grant trigger on table "public"."planets" to "authenticated";

grant truncate on table "public"."planets" to "authenticated";

grant update on table "public"."planets" to "authenticated";

grant delete on table "public"."planets" to "service_role";

grant insert on table "public"."planets" to "service_role";

grant references on table "public"."planets" to "service_role";

grant select on table "public"."planets" to "service_role";

grant trigger on table "public"."planets" to "service_role";

grant truncate on table "public"."planets" to "service_role";

grant update on table "public"."planets" to "service_role";

grant delete on table "public"."rockets" to "anon";

grant insert on table "public"."rockets" to "anon";

grant references on table "public"."rockets" to "anon";

grant select on table "public"."rockets" to "anon";

grant trigger on table "public"."rockets" to "anon";

grant truncate on table "public"."rockets" to "anon";

grant update on table "public"."rockets" to "anon";

grant delete on table "public"."rockets" to "authenticated";

grant insert on table "public"."rockets" to "authenticated";

grant references on table "public"."rockets" to "authenticated";

grant select on table "public"."rockets" to "authenticated";

grant trigger on table "public"."rockets" to "authenticated";

grant truncate on table "public"."rockets" to "authenticated";

grant update on table "public"."rockets" to "authenticated";

grant delete on table "public"."rockets" to "service_role";

grant insert on table "public"."rockets" to "service_role";

grant references on table "public"."rockets" to "service_role";

grant select on table "public"."rockets" to "service_role";

grant trigger on table "public"."rockets" to "service_role";

grant truncate on table "public"."rockets" to "service_role";

grant update on table "public"."rockets" to "service_role";

grant delete on table "public"."snippets" to "anon";

grant insert on table "public"."snippets" to "anon";

grant references on table "public"."snippets" to "anon";

grant select on table "public"."snippets" to "anon";

grant trigger on table "public"."snippets" to "anon";

grant truncate on table "public"."snippets" to "anon";

grant update on table "public"."snippets" to "anon";

grant delete on table "public"."snippets" to "authenticated";

grant insert on table "public"."snippets" to "authenticated";

grant references on table "public"."snippets" to "authenticated";

grant select on table "public"."snippets" to "authenticated";

grant trigger on table "public"."snippets" to "authenticated";

grant truncate on table "public"."snippets" to "authenticated";

grant update on table "public"."snippets" to "authenticated";

grant delete on table "public"."snippets" to "service_role";

grant insert on table "public"."snippets" to "service_role";

grant references on table "public"."snippets" to "service_role";

grant select on table "public"."snippets" to "service_role";

grant trigger on table "public"."snippets" to "service_role";

grant truncate on table "public"."snippets" to "service_role";

grant update on table "public"."snippets" to "service_role";

grant delete on table "public"."solutions" to "anon";

grant insert on table "public"."solutions" to "anon";

grant references on table "public"."solutions" to "anon";

grant select on table "public"."solutions" to "anon";

grant trigger on table "public"."solutions" to "anon";

grant truncate on table "public"."solutions" to "anon";

grant update on table "public"."solutions" to "anon";

grant delete on table "public"."solutions" to "authenticated";

grant insert on table "public"."solutions" to "authenticated";

grant references on table "public"."solutions" to "authenticated";

grant select on table "public"."solutions" to "authenticated";

grant trigger on table "public"."solutions" to "authenticated";

grant truncate on table "public"."solutions" to "authenticated";

grant update on table "public"."solutions" to "authenticated";

grant delete on table "public"."solutions" to "service_role";

grant insert on table "public"."solutions" to "service_role";

grant references on table "public"."solutions" to "service_role";

grant select on table "public"."solutions" to "service_role";

grant trigger on table "public"."solutions" to "service_role";

grant truncate on table "public"."solutions" to "service_role";

grant update on table "public"."solutions" to "service_role";

grant delete on table "public"."solutions_comments" to "anon";

grant insert on table "public"."solutions_comments" to "anon";

grant references on table "public"."solutions_comments" to "anon";

grant select on table "public"."solutions_comments" to "anon";

grant trigger on table "public"."solutions_comments" to "anon";

grant truncate on table "public"."solutions_comments" to "anon";

grant update on table "public"."solutions_comments" to "anon";

grant delete on table "public"."solutions_comments" to "authenticated";

grant insert on table "public"."solutions_comments" to "authenticated";

grant references on table "public"."solutions_comments" to "authenticated";

grant select on table "public"."solutions_comments" to "authenticated";

grant trigger on table "public"."solutions_comments" to "authenticated";

grant truncate on table "public"."solutions_comments" to "authenticated";

grant update on table "public"."solutions_comments" to "authenticated";

grant delete on table "public"."solutions_comments" to "service_role";

grant insert on table "public"."solutions_comments" to "service_role";

grant references on table "public"."solutions_comments" to "service_role";

grant select on table "public"."solutions_comments" to "service_role";

grant trigger on table "public"."solutions_comments" to "service_role";

grant truncate on table "public"."solutions_comments" to "service_role";

grant update on table "public"."solutions_comments" to "service_role";

grant delete on table "public"."stars" to "anon";

grant insert on table "public"."stars" to "anon";

grant references on table "public"."stars" to "anon";

grant select on table "public"."stars" to "anon";

grant trigger on table "public"."stars" to "anon";

grant truncate on table "public"."stars" to "anon";

grant update on table "public"."stars" to "anon";

grant delete on table "public"."stars" to "authenticated";

grant insert on table "public"."stars" to "authenticated";

grant references on table "public"."stars" to "authenticated";

grant select on table "public"."stars" to "authenticated";

grant trigger on table "public"."stars" to "authenticated";

grant truncate on table "public"."stars" to "authenticated";

grant update on table "public"."stars" to "authenticated";

grant delete on table "public"."stars" to "service_role";

grant insert on table "public"."stars" to "service_role";

grant references on table "public"."stars" to "service_role";

grant select on table "public"."stars" to "service_role";

grant trigger on table "public"."stars" to "service_role";

grant truncate on table "public"."stars" to "service_role";

grant update on table "public"."stars" to "service_role";

grant delete on table "public"."tiers" to "anon";

grant insert on table "public"."tiers" to "anon";

grant references on table "public"."tiers" to "anon";

grant select on table "public"."tiers" to "anon";

grant trigger on table "public"."tiers" to "anon";

grant truncate on table "public"."tiers" to "anon";

grant update on table "public"."tiers" to "anon";

grant delete on table "public"."tiers" to "authenticated";

grant insert on table "public"."tiers" to "authenticated";

grant references on table "public"."tiers" to "authenticated";

grant select on table "public"."tiers" to "authenticated";

grant trigger on table "public"."tiers" to "authenticated";

grant truncate on table "public"."tiers" to "authenticated";

grant update on table "public"."tiers" to "authenticated";

grant delete on table "public"."tiers" to "service_role";

grant insert on table "public"."tiers" to "service_role";

grant references on table "public"."tiers" to "service_role";

grant select on table "public"."tiers" to "service_role";

grant trigger on table "public"."tiers" to "service_role";

grant truncate on table "public"."tiers" to "service_role";

grant update on table "public"."tiers" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

grant delete on table "public"."users_acquired_avatars" to "anon";

grant insert on table "public"."users_acquired_avatars" to "anon";

grant references on table "public"."users_acquired_avatars" to "anon";

grant select on table "public"."users_acquired_avatars" to "anon";

grant trigger on table "public"."users_acquired_avatars" to "anon";

grant truncate on table "public"."users_acquired_avatars" to "anon";

grant update on table "public"."users_acquired_avatars" to "anon";

grant delete on table "public"."users_acquired_avatars" to "authenticated";

grant insert on table "public"."users_acquired_avatars" to "authenticated";

grant references on table "public"."users_acquired_avatars" to "authenticated";

grant select on table "public"."users_acquired_avatars" to "authenticated";

grant trigger on table "public"."users_acquired_avatars" to "authenticated";

grant truncate on table "public"."users_acquired_avatars" to "authenticated";

grant update on table "public"."users_acquired_avatars" to "authenticated";

grant delete on table "public"."users_acquired_avatars" to "service_role";

grant insert on table "public"."users_acquired_avatars" to "service_role";

grant references on table "public"."users_acquired_avatars" to "service_role";

grant select on table "public"."users_acquired_avatars" to "service_role";

grant trigger on table "public"."users_acquired_avatars" to "service_role";

grant truncate on table "public"."users_acquired_avatars" to "service_role";

grant update on table "public"."users_acquired_avatars" to "service_role";

grant delete on table "public"."users_acquired_rockets" to "anon";

grant insert on table "public"."users_acquired_rockets" to "anon";

grant references on table "public"."users_acquired_rockets" to "anon";

grant select on table "public"."users_acquired_rockets" to "anon";

grant trigger on table "public"."users_acquired_rockets" to "anon";

grant truncate on table "public"."users_acquired_rockets" to "anon";

grant update on table "public"."users_acquired_rockets" to "anon";

grant delete on table "public"."users_acquired_rockets" to "authenticated";

grant insert on table "public"."users_acquired_rockets" to "authenticated";

grant references on table "public"."users_acquired_rockets" to "authenticated";

grant select on table "public"."users_acquired_rockets" to "authenticated";

grant trigger on table "public"."users_acquired_rockets" to "authenticated";

grant truncate on table "public"."users_acquired_rockets" to "authenticated";

grant update on table "public"."users_acquired_rockets" to "authenticated";

grant delete on table "public"."users_acquired_rockets" to "service_role";

grant insert on table "public"."users_acquired_rockets" to "service_role";

grant references on table "public"."users_acquired_rockets" to "service_role";

grant select on table "public"."users_acquired_rockets" to "service_role";

grant trigger on table "public"."users_acquired_rockets" to "service_role";

grant truncate on table "public"."users_acquired_rockets" to "service_role";

grant update on table "public"."users_acquired_rockets" to "service_role";

grant delete on table "public"."users_challenge_votes" to "anon";

grant insert on table "public"."users_challenge_votes" to "anon";

grant references on table "public"."users_challenge_votes" to "anon";

grant select on table "public"."users_challenge_votes" to "anon";

grant trigger on table "public"."users_challenge_votes" to "anon";

grant truncate on table "public"."users_challenge_votes" to "anon";

grant update on table "public"."users_challenge_votes" to "anon";

grant delete on table "public"."users_challenge_votes" to "authenticated";

grant insert on table "public"."users_challenge_votes" to "authenticated";

grant references on table "public"."users_challenge_votes" to "authenticated";

grant select on table "public"."users_challenge_votes" to "authenticated";

grant trigger on table "public"."users_challenge_votes" to "authenticated";

grant truncate on table "public"."users_challenge_votes" to "authenticated";

grant update on table "public"."users_challenge_votes" to "authenticated";

grant delete on table "public"."users_challenge_votes" to "service_role";

grant insert on table "public"."users_challenge_votes" to "service_role";

grant references on table "public"."users_challenge_votes" to "service_role";

grant select on table "public"."users_challenge_votes" to "service_role";

grant trigger on table "public"."users_challenge_votes" to "service_role";

grant truncate on table "public"."users_challenge_votes" to "service_role";

grant update on table "public"."users_challenge_votes" to "service_role";

grant delete on table "public"."users_completed_challenges" to "anon";

grant insert on table "public"."users_completed_challenges" to "anon";

grant references on table "public"."users_completed_challenges" to "anon";

grant select on table "public"."users_completed_challenges" to "anon";

grant trigger on table "public"."users_completed_challenges" to "anon";

grant truncate on table "public"."users_completed_challenges" to "anon";

grant update on table "public"."users_completed_challenges" to "anon";

grant delete on table "public"."users_completed_challenges" to "authenticated";

grant insert on table "public"."users_completed_challenges" to "authenticated";

grant references on table "public"."users_completed_challenges" to "authenticated";

grant select on table "public"."users_completed_challenges" to "authenticated";

grant trigger on table "public"."users_completed_challenges" to "authenticated";

grant truncate on table "public"."users_completed_challenges" to "authenticated";

grant update on table "public"."users_completed_challenges" to "authenticated";

grant delete on table "public"."users_completed_challenges" to "service_role";

grant insert on table "public"."users_completed_challenges" to "service_role";

grant references on table "public"."users_completed_challenges" to "service_role";

grant select on table "public"."users_completed_challenges" to "service_role";

grant trigger on table "public"."users_completed_challenges" to "service_role";

grant truncate on table "public"."users_completed_challenges" to "service_role";

grant update on table "public"."users_completed_challenges" to "service_role";

grant delete on table "public"."users_rescuable_achievements" to "anon";

grant insert on table "public"."users_rescuable_achievements" to "anon";

grant references on table "public"."users_rescuable_achievements" to "anon";

grant select on table "public"."users_rescuable_achievements" to "anon";

grant trigger on table "public"."users_rescuable_achievements" to "anon";

grant truncate on table "public"."users_rescuable_achievements" to "anon";

grant update on table "public"."users_rescuable_achievements" to "anon";

grant delete on table "public"."users_rescuable_achievements" to "authenticated";

grant insert on table "public"."users_rescuable_achievements" to "authenticated";

grant references on table "public"."users_rescuable_achievements" to "authenticated";

grant select on table "public"."users_rescuable_achievements" to "authenticated";

grant trigger on table "public"."users_rescuable_achievements" to "authenticated";

grant truncate on table "public"."users_rescuable_achievements" to "authenticated";

grant update on table "public"."users_rescuable_achievements" to "authenticated";

grant delete on table "public"."users_rescuable_achievements" to "service_role";

grant insert on table "public"."users_rescuable_achievements" to "service_role";

grant references on table "public"."users_rescuable_achievements" to "service_role";

grant select on table "public"."users_rescuable_achievements" to "service_role";

grant trigger on table "public"."users_rescuable_achievements" to "service_role";

grant truncate on table "public"."users_rescuable_achievements" to "service_role";

grant update on table "public"."users_rescuable_achievements" to "service_role";

grant delete on table "public"."users_unlocked_achievements" to "anon";

grant insert on table "public"."users_unlocked_achievements" to "anon";

grant references on table "public"."users_unlocked_achievements" to "anon";

grant select on table "public"."users_unlocked_achievements" to "anon";

grant trigger on table "public"."users_unlocked_achievements" to "anon";

grant truncate on table "public"."users_unlocked_achievements" to "anon";

grant update on table "public"."users_unlocked_achievements" to "anon";

grant delete on table "public"."users_unlocked_achievements" to "authenticated";

grant insert on table "public"."users_unlocked_achievements" to "authenticated";

grant references on table "public"."users_unlocked_achievements" to "authenticated";

grant select on table "public"."users_unlocked_achievements" to "authenticated";

grant trigger on table "public"."users_unlocked_achievements" to "authenticated";

grant truncate on table "public"."users_unlocked_achievements" to "authenticated";

grant update on table "public"."users_unlocked_achievements" to "authenticated";

grant delete on table "public"."users_unlocked_achievements" to "service_role";

grant insert on table "public"."users_unlocked_achievements" to "service_role";

grant references on table "public"."users_unlocked_achievements" to "service_role";

grant select on table "public"."users_unlocked_achievements" to "service_role";

grant trigger on table "public"."users_unlocked_achievements" to "service_role";

grant truncate on table "public"."users_unlocked_achievements" to "service_role";

grant update on table "public"."users_unlocked_achievements" to "service_role";

grant delete on table "public"."users_unlocked_stars" to "anon";

grant insert on table "public"."users_unlocked_stars" to "anon";

grant references on table "public"."users_unlocked_stars" to "anon";

grant select on table "public"."users_unlocked_stars" to "anon";

grant trigger on table "public"."users_unlocked_stars" to "anon";

grant truncate on table "public"."users_unlocked_stars" to "anon";

grant update on table "public"."users_unlocked_stars" to "anon";

grant delete on table "public"."users_unlocked_stars" to "authenticated";

grant insert on table "public"."users_unlocked_stars" to "authenticated";

grant references on table "public"."users_unlocked_stars" to "authenticated";

grant select on table "public"."users_unlocked_stars" to "authenticated";

grant trigger on table "public"."users_unlocked_stars" to "authenticated";

grant truncate on table "public"."users_unlocked_stars" to "authenticated";

grant update on table "public"."users_unlocked_stars" to "authenticated";

grant delete on table "public"."users_unlocked_stars" to "service_role";

grant insert on table "public"."users_unlocked_stars" to "service_role";

grant references on table "public"."users_unlocked_stars" to "service_role";

grant select on table "public"."users_unlocked_stars" to "service_role";

grant trigger on table "public"."users_unlocked_stars" to "service_role";

grant truncate on table "public"."users_unlocked_stars" to "service_role";

grant update on table "public"."users_unlocked_stars" to "service_role";

grant delete on table "public"."users_upvoted_comments" to "anon";

grant insert on table "public"."users_upvoted_comments" to "anon";

grant references on table "public"."users_upvoted_comments" to "anon";

grant select on table "public"."users_upvoted_comments" to "anon";

grant trigger on table "public"."users_upvoted_comments" to "anon";

grant truncate on table "public"."users_upvoted_comments" to "anon";

grant update on table "public"."users_upvoted_comments" to "anon";

grant delete on table "public"."users_upvoted_comments" to "authenticated";

grant insert on table "public"."users_upvoted_comments" to "authenticated";

grant references on table "public"."users_upvoted_comments" to "authenticated";

grant select on table "public"."users_upvoted_comments" to "authenticated";

grant trigger on table "public"."users_upvoted_comments" to "authenticated";

grant truncate on table "public"."users_upvoted_comments" to "authenticated";

grant update on table "public"."users_upvoted_comments" to "authenticated";

grant delete on table "public"."users_upvoted_comments" to "service_role";

grant insert on table "public"."users_upvoted_comments" to "service_role";

grant references on table "public"."users_upvoted_comments" to "service_role";

grant select on table "public"."users_upvoted_comments" to "service_role";

grant trigger on table "public"."users_upvoted_comments" to "service_role";

grant truncate on table "public"."users_upvoted_comments" to "service_role";

grant update on table "public"."users_upvoted_comments" to "service_role";

grant delete on table "public"."users_upvoted_solutions" to "anon";

grant insert on table "public"."users_upvoted_solutions" to "anon";

grant references on table "public"."users_upvoted_solutions" to "anon";

grant select on table "public"."users_upvoted_solutions" to "anon";

grant trigger on table "public"."users_upvoted_solutions" to "anon";

grant truncate on table "public"."users_upvoted_solutions" to "anon";

grant update on table "public"."users_upvoted_solutions" to "anon";

grant delete on table "public"."users_upvoted_solutions" to "authenticated";

grant insert on table "public"."users_upvoted_solutions" to "authenticated";

grant references on table "public"."users_upvoted_solutions" to "authenticated";

grant select on table "public"."users_upvoted_solutions" to "authenticated";

grant trigger on table "public"."users_upvoted_solutions" to "authenticated";

grant truncate on table "public"."users_upvoted_solutions" to "authenticated";

grant update on table "public"."users_upvoted_solutions" to "authenticated";

grant delete on table "public"."users_upvoted_solutions" to "service_role";

grant insert on table "public"."users_upvoted_solutions" to "service_role";

grant references on table "public"."users_upvoted_solutions" to "service_role";

grant select on table "public"."users_upvoted_solutions" to "service_role";

grant trigger on table "public"."users_upvoted_solutions" to "service_role";

grant truncate on table "public"."users_upvoted_solutions" to "service_role";

grant update on table "public"."users_upvoted_solutions" to "service_role";


