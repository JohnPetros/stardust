create extension if not exists "unaccent" with schema "public";

create extension if not exists "vector" with schema "public";

create type "public"."chat_message_sender" as enum ('user', 'assistant');

create type "public"."feedback_intent" as enum ('bug', 'idea', 'other');

create type "public"."guide_category" as enum ('lsp', 'mdx');

create type "public"."platform" as enum ('web', 'mobile');

revoke delete on table "public"."docs" from "anon";

revoke insert on table "public"."docs" from "anon";

revoke references on table "public"."docs" from "anon";

revoke select on table "public"."docs" from "anon";

revoke trigger on table "public"."docs" from "anon";

revoke truncate on table "public"."docs" from "anon";

revoke update on table "public"."docs" from "anon";

revoke delete on table "public"."docs" from "authenticated";

revoke insert on table "public"."docs" from "authenticated";

revoke references on table "public"."docs" from "authenticated";

revoke select on table "public"."docs" from "authenticated";

revoke trigger on table "public"."docs" from "authenticated";

revoke truncate on table "public"."docs" from "authenticated";

revoke update on table "public"."docs" from "authenticated";

revoke delete on table "public"."docs" from "service_role";

revoke insert on table "public"."docs" from "service_role";

revoke references on table "public"."docs" from "service_role";

revoke select on table "public"."docs" from "service_role";

revoke trigger on table "public"."docs" from "service_role";

revoke truncate on table "public"."docs" from "service_role";

revoke update on table "public"."docs" from "service_role";

drop view if exists "public"."challenges_view";

drop view if exists "public"."planets_view";

alter table "public"."docs" drop constraint "topics_pkey";

drop index if exists "public"."topics_pkey";

drop table "public"."docs";


  create table "public"."api_keys" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "key_hash" text not null,
    "key_preview" text not null,
    "user_id" character varying not null,
    "created_at" timestamp with time zone not null default now(),
    "revoked_at" timestamp with time zone
      );



  create table "public"."challenge_sources" (
    "id" uuid not null default gen_random_uuid(),
    "challenge_id" uuid,
    "created_at" timestamp with time zone not null default now(),
    "url" text not null,
    "position" integer not null,
    "additional_instructions" text
      );



  create table "public"."chat_messages" (
    "id" uuid not null default gen_random_uuid(),
    "content" text not null,
    "sender" public.chat_message_sender not null,
    "chat_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now()
      );



  create table "public"."chats" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "user_id" character varying not null,
    "created_at" timestamp with time zone not null default now()
      );



  create table "public"."feedback_reports" (
    "id" uuid not null default gen_random_uuid(),
    "content" text not null,
    "screenshot" text,
    "created_at" timestamp with time zone not null default now(),
    "intent" public.feedback_intent not null,
    "user_id" character varying not null
      );



  create table "public"."guides" (
    "title" text not null,
    "id" uuid not null default extensions.uuid_generate_v4(),
    "position" integer not null,
    "content" text,
    "category" public.guide_category not null default 'lsp'::public.guide_category
      );



  create table "public"."questions" (
    "content" jsonb not null,
    "star_id" uuid not null,
    "position" numeric not null,
    "id" uuid not null default gen_random_uuid()
      );


alter table "public"."questions" enable row level security;


  create table "public"."ranking_users" (
    "id" character varying not null,
    "tier_id" uuid not null,
    "xp" bigint not null default '0'::bigint,
    "status" public.ranking_status not null default 'winner'::public.ranking_status,
    "position" integer not null
      );



  create table "public"."users_recently_unlocked_stars" (
    "user_id" text not null,
    "star_id" uuid not null
      );



  create table "public"."users_visits" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" character varying not null,
    "platform" public.platform not null,
    "created_at" timestamp with time zone not null
      );


alter table "public"."avatars" add column "is_purchasable" boolean not null default true;

alter table "public"."challenges" add column "is_new" boolean not null default false;

alter table "public"."challenges" alter column "user_id" drop default;

alter table "public"."challenges" alter column "user_id" set data type character varying using "user_id"::character varying;

alter table "public"."planets" add column "is_available" boolean not null default true;

alter table "public"."rockets" drop column "slug";

alter table "public"."rockets" add column "is_purchasable" boolean not null default true;

alter table "public"."stars" add column "is_available" boolean not null default true;

alter table "public"."users_completed_challenges" add column "created_at" timestamp with time zone not null default now();

alter table "public"."users_unlocked_stars" add column "created_at" timestamp with time zone default now();

CREATE INDEX api_keys_created_at_idx ON public.api_keys USING btree (created_at DESC);

CREATE UNIQUE INDEX api_keys_pkey ON public.api_keys USING btree (id);

CREATE INDEX api_keys_revoked_at_idx ON public.api_keys USING btree (revoked_at);

CREATE INDEX api_keys_user_id_idx ON public.api_keys USING btree (user_id);

CREATE UNIQUE INDEX challenge_sources_pkey ON public.challenge_sources USING btree (id);

CREATE UNIQUE INDEX challenge_sources_position_key ON public.challenge_sources USING btree ("position");

CREATE UNIQUE INDEX chat_messages_pkey ON public.chat_messages USING btree (id);

CREATE UNIQUE INDEX chats_pkey ON public.chats USING btree (id);

CREATE UNIQUE INDEX feedback_reports_pkey ON public.feedback_reports USING btree (id);

CREATE UNIQUE INDEX questions_pkey ON public.questions USING btree (id);

CREATE UNIQUE INDEX users_recently_unlocked_stars_pkey ON public.users_recently_unlocked_stars USING btree (user_id, star_id);

CREATE UNIQUE INDEX users_visits_pkey ON public.users_visits USING btree (id);

CREATE UNIQUE INDEX winners_pkey ON public.ranking_users USING btree (id);

CREATE UNIQUE INDEX topics_pkey ON public.guides USING btree (id);

alter table "public"."api_keys" add constraint "api_keys_pkey" PRIMARY KEY using index "api_keys_pkey";

alter table "public"."challenge_sources" add constraint "challenge_sources_pkey" PRIMARY KEY using index "challenge_sources_pkey";

alter table "public"."chat_messages" add constraint "chat_messages_pkey" PRIMARY KEY using index "chat_messages_pkey";

alter table "public"."chats" add constraint "chats_pkey" PRIMARY KEY using index "chats_pkey";

alter table "public"."feedback_reports" add constraint "feedback_reports_pkey" PRIMARY KEY using index "feedback_reports_pkey";

alter table "public"."guides" add constraint "topics_pkey" PRIMARY KEY using index "topics_pkey";

alter table "public"."questions" add constraint "questions_pkey" PRIMARY KEY using index "questions_pkey";

alter table "public"."ranking_users" add constraint "winners_pkey" PRIMARY KEY using index "winners_pkey";

alter table "public"."users_recently_unlocked_stars" add constraint "users_recently_unlocked_stars_pkey" PRIMARY KEY using index "users_recently_unlocked_stars_pkey";

alter table "public"."users_visits" add constraint "users_visits_pkey" PRIMARY KEY using index "users_visits_pkey";

alter table "public"."api_keys" add constraint "api_keys_name_check" CHECK (((char_length(TRIM(BOTH FROM name)) >= 1) AND (char_length(TRIM(BOTH FROM name)) <= 60))) not valid;

alter table "public"."api_keys" validate constraint "api_keys_name_check";

alter table "public"."api_keys" add constraint "api_keys_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."api_keys" validate constraint "api_keys_user_id_fkey";

alter table "public"."challenge_sources" add constraint "challenge_sources_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."challenge_sources" validate constraint "challenge_sources_challenge_id_fkey";

alter table "public"."challenge_sources" add constraint "challenge_sources_position_key" UNIQUE using index "challenge_sources_position_key";

alter table "public"."chat_messages" add constraint "chat_messages_chat_id_fkey" FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."chat_messages" validate constraint "chat_messages_chat_id_fkey";

alter table "public"."chats" add constraint "chats_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."chats" validate constraint "chats_user_id_fkey";

alter table "public"."feedback_reports" add constraint "feedback_reports_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."feedback_reports" validate constraint "feedback_reports_user_id_fkey";

alter table "public"."questions" add constraint "questions_star_id_fkey" FOREIGN KEY (star_id) REFERENCES public.stars(id) ON DELETE CASCADE not valid;

alter table "public"."questions" validate constraint "questions_star_id_fkey";

alter table "public"."ranking_users" add constraint "winners_id_fkey" FOREIGN KEY (id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ranking_users" validate constraint "winners_id_fkey";

alter table "public"."ranking_users" add constraint "winners_tier_id_fkey" FOREIGN KEY (tier_id) REFERENCES public.tiers(id) ON DELETE CASCADE not valid;

alter table "public"."ranking_users" validate constraint "winners_tier_id_fkey";

alter table "public"."users_recently_unlocked_stars" add constraint "users_recently_unlocked_stars_star_id_fkey" FOREIGN KEY (star_id) REFERENCES public.stars(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users_recently_unlocked_stars" validate constraint "users_recently_unlocked_stars_star_id_fkey";

alter table "public"."users_recently_unlocked_stars" add constraint "users_recently_unlocked_stars_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users_recently_unlocked_stars" validate constraint "users_recently_unlocked_stars_user_id_fkey";

alter table "public"."users_visits" add constraint "users_visits_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users_visits" validate constraint "users_visits_user_id_fkey";

set check_function_bodies = off;

create type "public"."challenges_record" as ("initial_code" text, "created_at" text, "difficulty" text, "downvotes" integer, "function_name" text, "id" text, "star_id" integer, "test_cases" jsonb, "texts" jsonb, "title" text, "topic_id" text, "total_completions" integer, "upvotes" integer, "created_by" text);

CREATE OR REPLACE FUNCTION public.count_comments_upvotes(public.comments)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
  SELECT COUNT(*) 
  FROM users_upvoted_comments AS UPC
  WHERE UPC.comment_id = $1.id
  GROUP BY UPC.id;
$function$
;

CREATE OR REPLACE FUNCTION public.count_planet_completions(planet_row public.planets)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
  SELECT count(DISTINCT user_id)
  FROM (
    -- CENÁRIO 1: É O ÚLTIMO PLANETA
    -- Verifica se NÃO existe nenhum planeta com posição maior.
    -- Se for verdade, retorna os usuários que finalizaram o espaço.
    SELECT u.id as user_id
    FROM public.users u
    WHERE u.has_completed_space = true
    AND NOT EXISTS (
       SELECT 1 
       FROM public.planets p 
       WHERE p.position > planet_row.position
    )

    UNION ALL

    -- CENÁRIO 2: EXISTE UM PRÓXIMO PLANETA
    -- Busca o ID do próximo planeta e conta quem tem estrelas nele.
    SELECT uls.user_id
    FROM public.users_unlocked_stars uls
    JOIN public.stars s ON uls.star_id = s.id
    WHERE s.planet_id = (
       SELECT id 
       FROM public.planets p 
       WHERE p.position > planet_row.position
       ORDER BY p.position ASC
       LIMIT 1
    )
  ) AS completion_count;
$function$
;

CREATE OR REPLACE FUNCTION public.count_star_unlocks(star_row public.stars)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
  SELECT COUNT(*)
  FROM public.users_unlocked_stars
  WHERE star_id = star_row.id;
$function$
;

CREATE OR REPLACE FUNCTION public.count_user_completed_challenges(user_row public.users)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
  SELECT count(*) 
  FROM users_completed_challenges
  WHERE user_id = user_row.id; -- Ajuste se a FK não for 'user_id'
$function$
;

CREATE OR REPLACE FUNCTION public.count_user_unlocked_achievements(user_row public.users)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
  SELECT count(*) 
  FROM users_unlocked_achievements
  WHERE user_id = user_row.id; -- Ajuste se a FK não for 'user_id'
$function$
;

CREATE OR REPLACE FUNCTION public.count_user_unlocked_stars(user_row public.users)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
  SELECT count(*) 
  FROM users_unlocked_stars
  WHERE user_id = user_row.id; -- Ajuste se a FK não for 'user_id'
$function$
;

CREATE OR REPLACE FUNCTION public.count_users_at_planet(planet_row public.planets)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
  SELECT COUNT(DISTINCT uus.user_id)
  FROM public.users_unlocked_stars uus
  JOIN public.stars s ON uus.star_id = s.id
  WHERE s.planet_id = planet_row.id -- 1. O usuário tem progresso neste planeta
  AND NOT EXISTS (
    -- 2. E garantimos que ele NÃO tem progresso em planetas futuros
    SELECT 1
    FROM public.users_unlocked_stars uus_check
    JOIN public.stars s_check ON uus_check.star_id = s_check.id
    JOIN public.planets p_check ON s_check.planet_id = p_check.id
    WHERE uus_check.user_id = uus.user_id
    AND p_check.position > planet_row.position
  );
$function$
;

CREATE OR REPLACE FUNCTION public.count_users_at_star(star_row public.stars)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
    SELECT COUNT(DISTINCT u.id)
    FROM public.users u
    -- 1. O usuário precisa ter a estrela alvo desbloqueada
    JOIN public.users_unlocked_stars uls_target 
    ON u.id = uls_target.user_id 
    AND uls_target.star_id = star_row.id
    WHERE NOT EXISTS (
        -- 2. Verificamos se existe alguma estrela "superior" desbloqueada para este usuário
        SELECT 1
        FROM public.users_unlocked_stars uls_check
        JOIN public.stars s_check ON uls_check.star_id = s_check.id
        JOIN public.planets p_check ON s_check.planet_id = p_check.id
        WHERE uls_check.user_id = u.id
        AND (
            -- Condição A: O planeta da estrela verificada está mais à frente
            p_check.position > (
                SELECT p_target.position 
                FROM public.stars s_target 
                JOIN public.planets p_target ON s_target.planet_id = p_target.id 
                WHERE s_target.id = star_row.id
            )
            OR
            -- Condição B: É o mesmo planeta, mas a estrela tem número maior
            (
                p_check.id = (SELECT planet_id FROM public.stars WHERE id = star_row.id)
                AND
                s_check.number > (SELECT number FROM public.stars WHERE id = star_row.id)
            )
        )
    );
$function$
;

CREATE OR REPLACE PROCEDURE public.delete_inactive_users()
 LANGUAGE plpgsql
AS $procedure$
begin

  delete from auth.users where last_sign_in_at is null;

end;
$procedure$
;

CREATE OR REPLACE FUNCTION public.delete_public_user(userid character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  --  delete from auth.users where id = userId;
   delete from public.users where id = userId;
end;
$function$
;

CREATE OR REPLACE PROCEDURE public.delete_user(IN userid character varying)
 LANGUAGE plpgsql
AS $procedure$
begin
  delete from auth.users where id = 'bb8e9306-7137-4e4a-be74-a9b53aeea542';

end;
$procedure$
;

CREATE OR REPLACE FUNCTION public.delete_user(userid uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
   delete from auth.users where id = userId;
   delete from public.users where id = userId::uuid::varchar;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.deleteuser(userid uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
   delete from auth.users where id = userId;
   delete from public.users where id = userId;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.filter_challenges(userid text, status text, difficulty text)
 RETURNS record
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  _challenges record;
begin
  select * from challenges into _challenges;
  return _challenges;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.filter_challenges(userid uuid, status text, difficulty text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  select * from challenges;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_last_user_unlocked_star_id(user_row public.users)
 RETURNS uuid
 LANGUAGE sql
 STABLE
AS $function$
  SELECT s.id
  FROM public.stars s
  JOIN public.planets p ON s.planet_id = p.id
  JOIN public.users_unlocked_stars uls ON uls.star_id = s.id
  WHERE uls.user_id = user_row.id
  ORDER BY p.position DESC, s.number DESC
  LIMIT 1;
$function$
;

CREATE OR REPLACE FUNCTION public.get_next_star_from_next_planet(_current_planet_id uuid, _user_id character varying)
 RETURNS TABLE(id uuid, is_unlocked boolean)
 LANGUAGE sql
AS $function$
    SELECT 
    S.id, 
    EXISTS (
        SELECT 1 
        FROM users_unlocked_stars AS UUS 
        WHERE 
        UUS.star_id = S.id AND UUS.user_id = _user_id
    ) AS is_unlocked
    FROM stars AS S
    JOIN planets AS P ON P.id = S.planet_id
    WHERE 
        P.position = 7
        AND S.number = 1
$function$
;

CREATE OR REPLACE FUNCTION public.insert_initial_data()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  first_star_id uuid;
  first_rocket_id uuid;
  first_avatar_id uuid;
  first_ranking_id uuid;
  avatar record;
begin
  select id from stars where number = 1 and planet_id = (select id from planets where position = 1) into first_star_id;
  select id from rockets where price = 0 into first_rocket_id;
  select id from rankings where position = 1 into first_ranking_id;
  select id from avatars where price = 0 and name = 'Apollo' into first_avatar_id;

  raise log '%', first_rocket_id;

  update users set rocket_id = first_rocket_id, avatar_id = first_avatar_id, ranking_id = first_ranking_id
   where id = new.id::uuid::varchar;
  insert into users_acquired_rockets (user_id, rocket_id) values (new.id::varchar::uuid, first_rocket_id);
  insert into users_unlocked_stars (user_id, star_id) values (new.id::varchar::uuid, first_star_id);

  for avatar in select id from avatars where price = 0 loop
    insert into users_acquired_avatars (user_id, avatar_id) values (new.id, avatar.id);
  end loop;

  select id from auth.users where id = new.id;
  if (id is not null) then
    insert into auth.users (id, name, email) values (new.id, new.name, new.email);
  end if;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_user_initial_data()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  first_star_id uuid;
  first_rocket_id uuid;
  first_avatar_id uuid;
  first_ranking_id uuid;
  avatar record;
begin
  select id from public.stars where number = 1 and planet_id = (select id from public.planets where position = 1) 
  into first_star_id;
  select id from public.rockets where price = 0 into first_rocket_id;
  select id from public.rankings where position = 1 into first_ranking_id;
  select id from public.avatars where price = 0 and name = 'Apollo' into first_avatar_id;

  raise log '%', new.id;
  raise log '%', new.name;
  raise log '%', new.slug;

  update users set rocket_id = first_rocket_id, avatar_id = first_avatar_id, ranking_id = first_ranking_id
  where id = new.id;

  insert into public.users_acquired_rockets (user_id, rocket_id) values (new.id, first_rocket_id);
  
  insert into public.users_unlocked_stars (user_id, star_id) values (new.id, first_star_id);

  for avatar in select id from public.avatars where price = 0 loop
    insert into public.users_acquired_avatars (user_id, avatar_id) values (new.id::varchar, avatar.id);
  end loop;

  return new;
end;
$function$
;

CREATE OR REPLACE PROCEDURE public.insertchallengestopics()
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    challenge RECORD;
    topic_id UUID;
BEGIN
    FOR challenge IN SELECT id, position FROM challenges LOOP
        INSERT INTO topics (id)
        VALUES (uuid())
        RETURNING id INTO topic_id;

        INSERT INTO challenges_topics (topic_id, challenge_id)
        VALUES (topic_id, challenge.id);
    END LOOP;
END;
$procedure$
;

CREATE OR REPLACE FUNCTION public.install_available_extensions_and_test()
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE extension_name TEXT;
allowed_extentions TEXT[] := string_to_array(current_setting('supautils.privileged_extensions'), ',');
BEGIN 
  FOREACH extension_name IN ARRAY allowed_extentions 
  LOOP
    SELECT trim(extension_name) INTO extension_name;
    /* skip below extensions check for now */
    CONTINUE WHEN extension_name = 'pgroonga' OR  extension_name = 'pgroonga_database' OR extension_name = 'pgsodium';
    CONTINUE WHEN extension_name = 'plpgsql' OR  extension_name = 'plpgsql_check' OR extension_name = 'pgtap';
    CONTINUE WHEN extension_name = 'supabase_vault' OR extension_name = 'wrappers';
    RAISE notice 'START TEST FOR: %', extension_name;
    EXECUTE format('DROP EXTENSION IF EXISTS %s CASCADE', quote_ident(extension_name));
    EXECUTE format('CREATE EXTENSION %s CASCADE', quote_ident(extension_name));
    RAISE notice 'END TEST FOR: %', extension_name;
  END LOOP;
    RAISE notice 'EXTENSION TESTS COMPLETED..';
    return true;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.list_challenges(p_title text DEFAULT ''::text, p_difficulty text DEFAULT 'all'::text, p_categories_ids uuid[] DEFAULT '{}'::uuid[], p_completion_status text DEFAULT 'all'::text, p_completed_challenges_ids uuid[] DEFAULT '{}'::uuid[], p_account_id text DEFAULT NULL::text, p_user_id text DEFAULT NULL::text, p_should_include_star_challenges boolean DEFAULT false, p_should_include_private_challenges boolean DEFAULT false, p_should_include_only_author boolean DEFAULT false, p_is_new_status text DEFAULT 'all'::text, p_page integer DEFAULT 1, p_items_per_page integer DEFAULT 10, p_upvotes_count_order text DEFAULT 'all'::text, p_downvote_count_order text DEFAULT 'all'::text, p_completion_count_order text DEFAULT 'all'::text, p_posting_order text DEFAULT 'all'::text)
 RETURNS TABLE(title text, difficulty_level text, created_at timestamp with time zone, id uuid, star_id uuid, initial_code text, texts jsonb, function_name text, test_cases jsonb, slug text, user_id text, description text, is_public boolean, is_new boolean, author_id text, author_name text, author_slug text, author_avatar_name text, author_avatar_image text, upvotes_count bigint, downvotes_count bigint, total_completitions bigint, categories json[], total_count bigint)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
  RETURN QUERY
  WITH filtered AS (
    SELECT
      cv.title::text,
      cv.difficulty_level::text,
      cv.created_at,
      cv.id,
      cv.star_id,
      cv.initial_code::text,
      cv.texts,
      cv.function_name::text,
      cv.test_cases,
      cv.slug::text,
      cv.user_id::text,
      cv.description::text,
      cv.is_public,
      cv.is_new,
      cv.author_id::text,
      cv.author_name::text,
      cv.author_slug::text,
      cv.author_avatar_name::text,
      cv.author_avatar_image::text,
      cv.upvotes_count,
      cv.downvotes_count,
      cv.total_completitions,
      cv.categories
    FROM challenges_view cv
    WHERE
      -- ── star challenges ──────────────────────────────────────────────
      (p_should_include_star_challenges OR cv.star_id IS NULL)

      -- ── author-only ──────────────────────────────────────────────────
      AND (
        NOT p_should_include_only_author
        OR (p_user_id IS NOT NULL AND cv.user_id = p_user_id)
      )

      -- ── title ────────────────────────────────────────────────────────
      AND (p_title = '' OR cv.title ILIKE '%' || p_title || '%')

      -- ── difficulty ───────────────────────────────────────────────────
      AND (
        p_difficulty = 'all'
        OR cv.difficulty_level = p_difficulty
      )

      -- ── is_new ───────────────────────────────────────────────────────
      AND (
        p_is_new_status = 'all'
        OR (p_is_new_status = 'new' AND cv.is_new = true)
        OR (p_is_new_status = 'old' AND (cv.is_new IS NULL OR cv.is_new = false))
      )

      -- ── categories (EXISTS evita duplicatas de join) ─────────────────
      AND (
        array_length(p_categories_ids, 1) IS NULL
        OR EXISTS (
          SELECT 1 FROM challenges_categories cc
          WHERE cc.challenge_id = cv.id
            AND cc.category_id  = ANY(p_categories_ids)
        )
      )

      -- ── visibilidade (is_public / autor / admin) ──────────────────────
      AND (
        p_should_include_private_challenges
        OR (p_account_id IS NOT NULL AND cv.author_id = p_account_id)
        OR cv.is_public = true
      )

      -- ── completion status ─────────────────────────────────────────────
      AND (
        p_completion_status = 'all'
        OR (
          p_completion_status = 'completed'
          AND cv.id = ANY(p_completed_challenges_ids)
        )
        OR (
          p_completion_status = 'not-completed'
          AND NOT (cv.id = ANY(p_completed_challenges_ids))
        )
      )

    ORDER BY
      -- ① dificuldade sempre primeiro (easy → medium → hard)
      cv.difficulty_level ASC,

      -- ② ordenações opcionais (só ativa quando não-'all')
      CASE WHEN p_posting_order          = 'ascending'  THEN cv.created_at           END ASC,
      CASE WHEN p_posting_order          = 'descending' THEN cv.created_at           END DESC,
      CASE WHEN p_upvotes_count_order    = 'ascending'  THEN cv.upvotes_count        END ASC,
      CASE WHEN p_upvotes_count_order    = 'descending' THEN cv.upvotes_count        END DESC,
      CASE WHEN p_downvote_count_order   = 'ascending'  THEN cv.downvotes_count      END ASC,
      CASE WHEN p_downvote_count_order   = 'descending' THEN cv.downvotes_count      END DESC,
      CASE WHEN p_completion_count_order = 'ascending'  THEN cv.total_completitions  END ASC,
      CASE WHEN p_completion_count_order = 'descending' THEN cv.total_completitions  END DESC
  ),

  counted AS (
    SELECT *, COUNT(*) OVER() AS _total FROM filtered
  )

  SELECT
    c.title,
    c.difficulty_level,
    c.created_at,
    c.id,
    c.star_id,
    c.initial_code,
    c.texts,
    c.function_name,
    c.test_cases,
    c.slug,
    c.user_id,
    c.description,
    c.is_public,
    c.is_new,
    c.author_id,
    c.author_name,
    c.author_slug,
    c.author_avatar_name,
    c.author_avatar_image,
    c.upvotes_count,
    c.downvotes_count,
    c.total_completitions,
    c.categories,
    c._total
  FROM counted c
  LIMIT  p_items_per_page
  OFFSET (p_page - 1) * p_items_per_page;
END;
$function$
;

create or replace view "public"."next_star_from_next_planet" as  SELECT s.id,
    (EXISTS ( SELECT 1
           FROM public.users_unlocked_stars uus
          WHERE ((uus.star_id = s.id) AND ((uus.user_id)::text = '56b1f86c-7e54-44fd-967a-58abc49e68a2'::text)))) AS is_unlocked
   FROM (public.stars s
     JOIN public.planets p ON ((p.id = s.planet_id)))
  WHERE ((p."position" = (( SELECT planets."position"
           FROM public.planets
          WHERE (planets.id = '2ee862da-4b73-4fb3-984a-d6ed1743102b'::uuid)) + 1)) AND (s.number = 1));


CREATE OR REPLACE FUNCTION public.olamundo()
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
 msg varchar =  'Olá, Mundo!';
BEGIN
	RETURN msg;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.resetstreak()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
  user_rec record;
begin
  for user_rec in select id, week_status from users loop
    if (user_rec.week_status[6] = 'done') then
      update users set user_rec.week_status = array['todo', 'todo', 'todo', 'todo', 'todo', 'todo', 'todo'] where id = user_rec.id;
    end if;
  end loop;  
end;
$function$
;

CREATE OR REPLACE PROCEDURE public.setwinners()
 LANGUAGE plpgsql
AS $procedure$
declare
    currentPosition int;
     ranking record;
     winner record;
     nextRankingId uuid;
begin
    for ranking in select id, position from rankings order by position desc loop
        currentPosition := 1;

        for winner in select id, name, weekly_xp, avatar_id from users where ranking_id = ranking.id and is_loser = false order by weekly_xp desc limit 5 loop
          select id into nextRankingId from rankings where position = ranking.position + 1;
          if (nextRankingId is not null) then
            update users set ranking_id = nextRankingId where id = winner.id;
          end if;
            insert into winners (user_id, name, ranking_id, avatar_id, xp, position) 
            values (winner.id, winner.name, ranking.id, winner.avatar_id, winner.weekly_xp, currentPosition);
            -- update users set is_loser = false where id = winner.id;
            -- raise log '%', winner.name;
            currentPosition := currentPosition + 1;
        end loop;
        
      end loop;
end;
$procedure$
;

CREATE OR REPLACE FUNCTION public.slugify(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
begin
  return trim(both '-' from regexp_replace(lower(unaccent(name)), '[^a-z0-9\\-_]+', '-', 'gi'));
end;
$function$
;

CREATE OR REPLACE PROCEDURE public.slugify_entities_name()
 LANGUAGE plpgsql
AS $procedure$
declare
    _challenge record;
begin
  for _challenge in select id, title from challenges loop
    update challenges set slug = (select slugify(_challenge.title)) where id = _challenge.id;
  end loop;
end;
$procedure$
;

CREATE OR REPLACE FUNCTION public.teste()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare
    msg text;
    sunday text;
    users_rec record;
begin
    for users_rec in select week_status, name, id from users loop
      if (users_rec.week_status[7] = 'done') then
        update users set week_status = array['todo', 'todo', 'todo', 'todo', 'todo', 'todo', 'todo'] where id = users_rec.id;
      end if;
    end loop;
    return msg;
end;
$function$
;

CREATE OR REPLACE PROCEDURE public.testranking()
 LANGUAGE plpgsql
AS $procedure$
declare
    currentPosition int;
    _user record;
begin
    currentPosition := 1;
    for _user in select id from users where ranking_id = 'ca31d693-3a2d-43af-8f60-05c907c1f316' loop
      update users set weekly_xp = currentPosition where id = _user.id;
      currentPosition := currentPosition + 1;
    end loop;
end;
$procedure$
;

CREATE OR REPLACE FUNCTION public.update_last_week_ranking_positions()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    current_position int;
    tier record;
    _user record;
begin
    for tier in select id from tiers order by position desc loop
        current_position := 1;
        for _user in select id from users where tier_id = tier.id order by weekly_xp desc loop
          update users set last_week_ranking_position = current_position where id = _user.id;
          current_position := current_position + 1;
        end loop;
    end loop;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_email(new_email text, user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
   update auth.users set email = new_email where id = user_id;
   update public.users set email = new_email where id = user_id::uuid::varchar;
end;
$function$
;

CREATE OR REPLACE PROCEDURE public.updateranking()
 LANGUAGE plpgsql
AS $procedure$
declare
    ranking record;
    loser record;
    previousRankingId uuid;
    currentPosition int;
begin
    truncate table winners;
    update users set is_loser = false;
    call updateUsersPositions();

    for ranking in select id, position from rankings order by position asc loop

      for loser in select id, name, weekly_xp, avatar_id from users where ranking_id = ranking.id order by weekly_xp asc limit 5 loop 
        select id into previousRankingId from rankings where position = ranking.position - 1;
        if (previousRankingId is not null) then
          update users set ranking_id = previousRankingId, is_loser = true where id = loser.id;
            raise log '%', loser.name;
        end if;
      end loop;

    end loop;

    call setwinners();

    update users set did_update_ranking = true;
    update users set weekly_xp = 0;
end;
$procedure$
;

CREATE OR REPLACE PROCEDURE public.updateranking_()
 LANGUAGE plpgsql
AS $procedure$
declare
    ranking record;
    winner record;
    nextRankingId uuid;
    currentPosition int = 1;
begin
    for ranking in select id, position from rankings order by position desc loop
      for winner in select id from users where ranking_id = ranking.id order by weekly_xp desc limit 3 loop
        select id into nextRankingId from rankings where position = ranking.position + 1;
        if (nextRankingId is not null) then
          update users set ranking_id = nextRankingId where id = winner.id and ranking_id = ranking.id;
          insert into winners (user_id, ranking_id, position) values (winner.id, ranking.id, currentPosition);
          currentPosition := currentPosition + 1;
        end if;
      end loop;
    end loop;
end;
$procedure$
;

CREATE OR REPLACE PROCEDURE public.updateuserspositions()
 LANGUAGE plpgsql
AS $procedure$
declare
    currentPosition int;
     ranking record;
    _user record;
begin
    for ranking in select id from rankings order by position desc loop
        currentPosition := 1;
        for _user in select id from users where ranking_id = ranking.id order by weekly_xp desc loop
          update users set last_position = currentPosition where id = _user.id;
          currentPosition := currentPosition + 1;
        end loop;
    end loop;
end;
$procedure$
;

CREATE OR REPLACE PROCEDURE public.updatewinners()
 LANGUAGE plpgsql
AS $procedure$
declare
    ranking record;
    winner record;
    nextRankingId uuid;
    currentPosition int = 1;
begin
    truncate table winners;

    for ranking in select id, position from rankings order by position desc loop
      for winner in select id, weekly_xp, avatar_id from users where ranking_id = ranking.id order by weekly_xp desc limit 3 loop
        select id into nextRankingId from rankings where position = ranking.position + 1;
        if (nextRankingId is not null) then
          update users set ranking_id = nextRankingId where id = winner.id;
          insert into winners (user_id, ranking_id, avatar_id, xp, position) 
          values (winner.id, ranking.id, winner.avatar_id, winner.weekly_xp, currentPosition);
          currentPosition := currentPosition + 1;
        end if;
      end loop;
    end loop;

    update users set did_update_ranking = true;
end;
$procedure$
;

CREATE OR REPLACE FUNCTION public.verify_user_space_completion(user_row public.users)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
  SELECT 
    (SELECT count(*) FROM users_unlocked_stars WHERE user_id = user_row.id) 
    = 
    (SELECT count(*) FROM stars);
$function$
;

create or replace view "public"."challenges_view" as  SELECT c.title,
    c.difficulty_level,
    c.created_at,
    c.id,
    c.star_id,
    c.initial_code,
    c.texts,
    c.function_name,
    c.test_cases,
    c.slug,
    c.user_id,
    c.description,
    c.is_public,
    c.is_new,
    c.user_id AS author_id,
    u.name AS author_name,
    u.slug AS author_slug,
    a.name AS author_avatar_name,
    a.image AS author_avatar_image,
    count(DISTINCT
        CASE
            WHEN (uvc.vote = 'upvote'::public.challenge_vote) THEN uvc.user_id
            ELSE NULL::character varying
        END) AS upvotes_count,
    count(DISTINCT
        CASE
            WHEN (uvc.vote = 'downvote'::public.challenge_vote) THEN uvc.user_id
            ELSE NULL::character varying
        END) AS downvotes_count,
    count(DISTINCT ucc.user_id) AS total_completitions,
    COALESCE(ARRAY( SELECT json_build_object('id', category.id, 'name', category.name) AS json_build_object
           FROM ( SELECT DISTINCT ccc2.id,
                    ccc2.name
                   FROM (public.challenges_categories cc2
                     JOIN public.categories ccc2 ON ((ccc2.id = cc2.category_id)))
                  WHERE (cc2.challenge_id = c.id)
                  ORDER BY ccc2.name) category), '{}'::json[]) AS categories
   FROM ((((public.challenges c
     LEFT JOIN public.users u ON (((u.id)::text = (c.user_id)::text)))
     LEFT JOIN public.users_challenge_votes uvc ON ((uvc.challenge_id = c.id)))
     LEFT JOIN public.users_completed_challenges ucc ON ((ucc.challenge_id = c.id)))
     LEFT JOIN public.avatars a ON ((a.id = u.avatar_id)))
  GROUP BY c.id, u.id, a.name, a.image;


create or replace view "public"."planets_view" as  WITH planet_star_counts AS (
         SELECT stars.planet_id,
            count(stars.id) AS total_stars
           FROM public.stars
          GROUP BY stars.planet_id
        ), user_planet_progress AS (
         SELECT s.planet_id,
            uus.user_id,
            count(uus.star_id) AS unlocked_stars_count
           FROM (public.users_unlocked_stars uus
             JOIN public.stars s ON ((uus.star_id = s.id)))
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
    p.is_available,
    COALESCE(cpc.completion_count, (0)::bigint) AS completions_count
   FROM (public.planets p
     LEFT JOIN completed_planets_counts cpc ON ((p.id = cpc.planet_id)));


grant delete on table "public"."api_keys" to "anon";

grant insert on table "public"."api_keys" to "anon";

grant references on table "public"."api_keys" to "anon";

grant select on table "public"."api_keys" to "anon";

grant trigger on table "public"."api_keys" to "anon";

grant truncate on table "public"."api_keys" to "anon";

grant update on table "public"."api_keys" to "anon";

grant delete on table "public"."api_keys" to "authenticated";

grant insert on table "public"."api_keys" to "authenticated";

grant references on table "public"."api_keys" to "authenticated";

grant select on table "public"."api_keys" to "authenticated";

grant trigger on table "public"."api_keys" to "authenticated";

grant truncate on table "public"."api_keys" to "authenticated";

grant update on table "public"."api_keys" to "authenticated";

grant delete on table "public"."api_keys" to "service_role";

grant insert on table "public"."api_keys" to "service_role";

grant references on table "public"."api_keys" to "service_role";

grant select on table "public"."api_keys" to "service_role";

grant trigger on table "public"."api_keys" to "service_role";

grant truncate on table "public"."api_keys" to "service_role";

grant update on table "public"."api_keys" to "service_role";

grant delete on table "public"."challenge_sources" to "anon";

grant insert on table "public"."challenge_sources" to "anon";

grant references on table "public"."challenge_sources" to "anon";

grant select on table "public"."challenge_sources" to "anon";

grant trigger on table "public"."challenge_sources" to "anon";

grant truncate on table "public"."challenge_sources" to "anon";

grant update on table "public"."challenge_sources" to "anon";

grant delete on table "public"."challenge_sources" to "authenticated";

grant insert on table "public"."challenge_sources" to "authenticated";

grant references on table "public"."challenge_sources" to "authenticated";

grant select on table "public"."challenge_sources" to "authenticated";

grant trigger on table "public"."challenge_sources" to "authenticated";

grant truncate on table "public"."challenge_sources" to "authenticated";

grant update on table "public"."challenge_sources" to "authenticated";

grant delete on table "public"."challenge_sources" to "service_role";

grant insert on table "public"."challenge_sources" to "service_role";

grant references on table "public"."challenge_sources" to "service_role";

grant select on table "public"."challenge_sources" to "service_role";

grant trigger on table "public"."challenge_sources" to "service_role";

grant truncate on table "public"."challenge_sources" to "service_role";

grant update on table "public"."challenge_sources" to "service_role";

grant delete on table "public"."chat_messages" to "anon";

grant insert on table "public"."chat_messages" to "anon";

grant references on table "public"."chat_messages" to "anon";

grant select on table "public"."chat_messages" to "anon";

grant trigger on table "public"."chat_messages" to "anon";

grant truncate on table "public"."chat_messages" to "anon";

grant update on table "public"."chat_messages" to "anon";

grant delete on table "public"."chat_messages" to "authenticated";

grant insert on table "public"."chat_messages" to "authenticated";

grant references on table "public"."chat_messages" to "authenticated";

grant select on table "public"."chat_messages" to "authenticated";

grant trigger on table "public"."chat_messages" to "authenticated";

grant truncate on table "public"."chat_messages" to "authenticated";

grant update on table "public"."chat_messages" to "authenticated";

grant delete on table "public"."chat_messages" to "service_role";

grant insert on table "public"."chat_messages" to "service_role";

grant references on table "public"."chat_messages" to "service_role";

grant select on table "public"."chat_messages" to "service_role";

grant trigger on table "public"."chat_messages" to "service_role";

grant truncate on table "public"."chat_messages" to "service_role";

grant update on table "public"."chat_messages" to "service_role";

grant delete on table "public"."chats" to "anon";

grant insert on table "public"."chats" to "anon";

grant references on table "public"."chats" to "anon";

grant select on table "public"."chats" to "anon";

grant trigger on table "public"."chats" to "anon";

grant truncate on table "public"."chats" to "anon";

grant update on table "public"."chats" to "anon";

grant delete on table "public"."chats" to "authenticated";

grant insert on table "public"."chats" to "authenticated";

grant references on table "public"."chats" to "authenticated";

grant select on table "public"."chats" to "authenticated";

grant trigger on table "public"."chats" to "authenticated";

grant truncate on table "public"."chats" to "authenticated";

grant update on table "public"."chats" to "authenticated";

grant delete on table "public"."chats" to "service_role";

grant insert on table "public"."chats" to "service_role";

grant references on table "public"."chats" to "service_role";

grant select on table "public"."chats" to "service_role";

grant trigger on table "public"."chats" to "service_role";

grant truncate on table "public"."chats" to "service_role";

grant update on table "public"."chats" to "service_role";

grant delete on table "public"."feedback_reports" to "anon";

grant insert on table "public"."feedback_reports" to "anon";

grant references on table "public"."feedback_reports" to "anon";

grant select on table "public"."feedback_reports" to "anon";

grant trigger on table "public"."feedback_reports" to "anon";

grant truncate on table "public"."feedback_reports" to "anon";

grant update on table "public"."feedback_reports" to "anon";

grant delete on table "public"."feedback_reports" to "authenticated";

grant insert on table "public"."feedback_reports" to "authenticated";

grant references on table "public"."feedback_reports" to "authenticated";

grant select on table "public"."feedback_reports" to "authenticated";

grant trigger on table "public"."feedback_reports" to "authenticated";

grant truncate on table "public"."feedback_reports" to "authenticated";

grant update on table "public"."feedback_reports" to "authenticated";

grant delete on table "public"."feedback_reports" to "service_role";

grant insert on table "public"."feedback_reports" to "service_role";

grant references on table "public"."feedback_reports" to "service_role";

grant select on table "public"."feedback_reports" to "service_role";

grant trigger on table "public"."feedback_reports" to "service_role";

grant truncate on table "public"."feedback_reports" to "service_role";

grant update on table "public"."feedback_reports" to "service_role";

grant delete on table "public"."guides" to "anon";

grant insert on table "public"."guides" to "anon";

grant references on table "public"."guides" to "anon";

grant select on table "public"."guides" to "anon";

grant trigger on table "public"."guides" to "anon";

grant truncate on table "public"."guides" to "anon";

grant update on table "public"."guides" to "anon";

grant delete on table "public"."guides" to "authenticated";

grant insert on table "public"."guides" to "authenticated";

grant references on table "public"."guides" to "authenticated";

grant select on table "public"."guides" to "authenticated";

grant trigger on table "public"."guides" to "authenticated";

grant truncate on table "public"."guides" to "authenticated";

grant update on table "public"."guides" to "authenticated";

grant delete on table "public"."guides" to "service_role";

grant insert on table "public"."guides" to "service_role";

grant references on table "public"."guides" to "service_role";

grant select on table "public"."guides" to "service_role";

grant trigger on table "public"."guides" to "service_role";

grant truncate on table "public"."guides" to "service_role";

grant update on table "public"."guides" to "service_role";

grant delete on table "public"."insignias" to "anon";

grant insert on table "public"."insignias" to "anon";

grant references on table "public"."insignias" to "anon";

grant select on table "public"."insignias" to "anon";

grant trigger on table "public"."insignias" to "anon";

grant truncate on table "public"."insignias" to "anon";

grant update on table "public"."insignias" to "anon";

grant delete on table "public"."insignias" to "authenticated";

grant insert on table "public"."insignias" to "authenticated";

grant references on table "public"."insignias" to "authenticated";

grant select on table "public"."insignias" to "authenticated";

grant trigger on table "public"."insignias" to "authenticated";

grant truncate on table "public"."insignias" to "authenticated";

grant update on table "public"."insignias" to "authenticated";

grant delete on table "public"."insignias" to "service_role";

grant insert on table "public"."insignias" to "service_role";

grant references on table "public"."insignias" to "service_role";

grant select on table "public"."insignias" to "service_role";

grant trigger on table "public"."insignias" to "service_role";

grant truncate on table "public"."insignias" to "service_role";

grant update on table "public"."insignias" to "service_role";

grant delete on table "public"."questions" to "anon";

grant insert on table "public"."questions" to "anon";

grant references on table "public"."questions" to "anon";

grant select on table "public"."questions" to "anon";

grant trigger on table "public"."questions" to "anon";

grant truncate on table "public"."questions" to "anon";

grant update on table "public"."questions" to "anon";

grant delete on table "public"."questions" to "authenticated";

grant insert on table "public"."questions" to "authenticated";

grant references on table "public"."questions" to "authenticated";

grant select on table "public"."questions" to "authenticated";

grant trigger on table "public"."questions" to "authenticated";

grant truncate on table "public"."questions" to "authenticated";

grant update on table "public"."questions" to "authenticated";

grant delete on table "public"."questions" to "service_role";

grant insert on table "public"."questions" to "service_role";

grant references on table "public"."questions" to "service_role";

grant select on table "public"."questions" to "service_role";

grant trigger on table "public"."questions" to "service_role";

grant truncate on table "public"."questions" to "service_role";

grant update on table "public"."questions" to "service_role";

grant delete on table "public"."ranking_users" to "anon";

grant insert on table "public"."ranking_users" to "anon";

grant references on table "public"."ranking_users" to "anon";

grant select on table "public"."ranking_users" to "anon";

grant trigger on table "public"."ranking_users" to "anon";

grant truncate on table "public"."ranking_users" to "anon";

grant update on table "public"."ranking_users" to "anon";

grant delete on table "public"."ranking_users" to "authenticated";

grant insert on table "public"."ranking_users" to "authenticated";

grant references on table "public"."ranking_users" to "authenticated";

grant select on table "public"."ranking_users" to "authenticated";

grant trigger on table "public"."ranking_users" to "authenticated";

grant truncate on table "public"."ranking_users" to "authenticated";

grant update on table "public"."ranking_users" to "authenticated";

grant delete on table "public"."ranking_users" to "service_role";

grant insert on table "public"."ranking_users" to "service_role";

grant references on table "public"."ranking_users" to "service_role";

grant select on table "public"."ranking_users" to "service_role";

grant trigger on table "public"."ranking_users" to "service_role";

grant truncate on table "public"."ranking_users" to "service_role";

grant update on table "public"."ranking_users" to "service_role";

grant delete on table "public"."users_acquired_insignias" to "anon";

grant insert on table "public"."users_acquired_insignias" to "anon";

grant references on table "public"."users_acquired_insignias" to "anon";

grant select on table "public"."users_acquired_insignias" to "anon";

grant trigger on table "public"."users_acquired_insignias" to "anon";

grant truncate on table "public"."users_acquired_insignias" to "anon";

grant update on table "public"."users_acquired_insignias" to "anon";

grant delete on table "public"."users_acquired_insignias" to "authenticated";

grant insert on table "public"."users_acquired_insignias" to "authenticated";

grant references on table "public"."users_acquired_insignias" to "authenticated";

grant select on table "public"."users_acquired_insignias" to "authenticated";

grant trigger on table "public"."users_acquired_insignias" to "authenticated";

grant truncate on table "public"."users_acquired_insignias" to "authenticated";

grant update on table "public"."users_acquired_insignias" to "authenticated";

grant delete on table "public"."users_acquired_insignias" to "service_role";

grant insert on table "public"."users_acquired_insignias" to "service_role";

grant references on table "public"."users_acquired_insignias" to "service_role";

grant select on table "public"."users_acquired_insignias" to "service_role";

grant trigger on table "public"."users_acquired_insignias" to "service_role";

grant truncate on table "public"."users_acquired_insignias" to "service_role";

grant update on table "public"."users_acquired_insignias" to "service_role";

grant delete on table "public"."users_recently_unlocked_stars" to "anon";

grant insert on table "public"."users_recently_unlocked_stars" to "anon";

grant references on table "public"."users_recently_unlocked_stars" to "anon";

grant select on table "public"."users_recently_unlocked_stars" to "anon";

grant trigger on table "public"."users_recently_unlocked_stars" to "anon";

grant truncate on table "public"."users_recently_unlocked_stars" to "anon";

grant update on table "public"."users_recently_unlocked_stars" to "anon";

grant delete on table "public"."users_recently_unlocked_stars" to "authenticated";

grant insert on table "public"."users_recently_unlocked_stars" to "authenticated";

grant references on table "public"."users_recently_unlocked_stars" to "authenticated";

grant select on table "public"."users_recently_unlocked_stars" to "authenticated";

grant trigger on table "public"."users_recently_unlocked_stars" to "authenticated";

grant truncate on table "public"."users_recently_unlocked_stars" to "authenticated";

grant update on table "public"."users_recently_unlocked_stars" to "authenticated";

grant delete on table "public"."users_recently_unlocked_stars" to "service_role";

grant insert on table "public"."users_recently_unlocked_stars" to "service_role";

grant references on table "public"."users_recently_unlocked_stars" to "service_role";

grant select on table "public"."users_recently_unlocked_stars" to "service_role";

grant trigger on table "public"."users_recently_unlocked_stars" to "service_role";

grant truncate on table "public"."users_recently_unlocked_stars" to "service_role";

grant update on table "public"."users_recently_unlocked_stars" to "service_role";

grant delete on table "public"."users_visits" to "anon";

grant insert on table "public"."users_visits" to "anon";

grant references on table "public"."users_visits" to "anon";

grant select on table "public"."users_visits" to "anon";

grant trigger on table "public"."users_visits" to "anon";

grant truncate on table "public"."users_visits" to "anon";

grant update on table "public"."users_visits" to "anon";

grant delete on table "public"."users_visits" to "authenticated";

grant insert on table "public"."users_visits" to "authenticated";

grant references on table "public"."users_visits" to "authenticated";

grant select on table "public"."users_visits" to "authenticated";

grant trigger on table "public"."users_visits" to "authenticated";

grant truncate on table "public"."users_visits" to "authenticated";

grant update on table "public"."users_visits" to "authenticated";

grant delete on table "public"."users_visits" to "service_role";

grant insert on table "public"."users_visits" to "service_role";

grant references on table "public"."users_visits" to "service_role";

grant select on table "public"."users_visits" to "service_role";

grant trigger on table "public"."users_visits" to "service_role";

grant truncate on table "public"."users_visits" to "service_role";

grant update on table "public"."users_visits" to "service_role";


  create policy "enable achivements"
  on "public"."achievements"
  as permissive
  for all
  to public
using (true);



  create policy "Only authenticated users can access avatars"
  on "public"."avatars"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Only authenticated users can access categories"
  on "public"."categories"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Only authenticated users can access challenges"
  on "public"."challenges"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Only authenticated users can access challenges categories"
  on "public"."challenges_categories"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "authenticated"
  on "public"."challenges_comments"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Only authenticated users can access codes"
  on "public"."comments"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Only authenticated users can access dictionary topics"
  on "public"."guides"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Only authenticated users can access planets"
  on "public"."planets"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Only authenticated users can access questions"
  on "public"."questions"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Only authenticated users can access rockets"
  on "public"."rockets"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Only authenticated users can access playgrounds"
  on "public"."snippets"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Authorization"
  on "public"."solutions"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Only authenticated users can access stars"
  on "public"."stars"
  as permissive
  for select
  to public
using (true);



  create policy "Only authenticated users can access rankings"
  on "public"."tiers"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Enable read access for all users"
  on "storage"."objects"
  as permissive
  for select
  to public
using (true);



  create policy "Give users access to own folder 1ffg0oo_1"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (true);



  create policy "Give users access to own folder 1ffg0oo_2"
  on "storage"."objects"
  as permissive
  for delete
  to public
using (true);


do $$
begin
  if exists (select 1 from pg_namespace where nspname = 'cron') then
    execute 'grant select on table "cron"."job" to "postgres"';
    execute 'grant delete on table "cron"."job_run_details" to "postgres"';
    execute 'grant insert on table "cron"."job_run_details" to "postgres"';
    execute 'grant references on table "cron"."job_run_details" to "postgres"';
    execute 'grant select on table "cron"."job_run_details" to "postgres"';
    execute 'grant trigger on table "cron"."job_run_details" to "postgres"';
    execute 'grant truncate on table "cron"."job_run_details" to "postgres"';
    execute 'grant update on table "cron"."job_run_details" to "postgres"';
    execute 'create policy "cron_job_policy" on "cron"."job" as permissive for all to public using ((username = CURRENT_USER))';
    execute 'create policy "cron_job_run_details_policy" on "cron"."job_run_details" as permissive for all to public using ((username = CURRENT_USER))';
    execute 'create trigger cron_job_cache_invalidate after insert or delete or update or truncate on cron.job for each statement execute function cron.job_cache_invalidate()';
  end if;
end
$$;

create extension if not exists "pgaudit" with schema "extensions";
