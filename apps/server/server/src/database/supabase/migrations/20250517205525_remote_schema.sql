

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium";








ALTER SCHEMA "public" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgaudit" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."challenge_difficulty_level" AS ENUM (
    'easy',
    'medium',
    'hard'
);


ALTER TYPE "public"."challenge_difficulty_level" OWNER TO "postgres";


CREATE TYPE "public"."challenge_vote" AS ENUM (
    'upvote',
    'downvote'
);


ALTER TYPE "public"."challenge_vote" OWNER TO "postgres";


CREATE TYPE "public"."challenges_record" AS (
	"code" "text",
	"created_at" "text",
	"difficulty" "text",
	"downvotes" integer,
	"function_name" "text",
	"id" "text",
	"star_id" integer,
	"test_cases" "jsonb",
	"texts" "jsonb",
	"title" "text",
	"topic_id" "text",
	"total_completions" integer,
	"upvotes" integer,
	"created_by" "text"
);


ALTER TYPE "public"."challenges_record" OWNER TO "postgres";


CREATE TYPE "public"."ranking_status" AS ENUM (
    'winner',
    'loser'
);


ALTER TYPE "public"."ranking_status" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "content" "text" NOT NULL,
    "parent_comment_id" "uuid",
    "user_id" character varying DEFAULT 'apollo'::"text" NOT NULL,
    CONSTRAINT "comments_content_check" CHECK (("length"("content") >= 3))
);


ALTER TABLE "public"."comments" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."count_comments_upvotes"("public"."comments") RETURNS bigint
    LANGUAGE "sql" STABLE
    AS $_$
  SELECT COUNT(*) 
  FROM users_upvoted_comments AS UPC
  WHERE UPC.comment_id = $1.id
  GROUP BY UPC.id;
$_$;


ALTER FUNCTION "public"."count_comments_upvotes"("public"."comments") OWNER TO "postgres";


CREATE PROCEDURE "public"."delete_inactive_users"()
    LANGUAGE "plpgsql"
    AS $$
begin

  delete from auth.users where last_sign_in_at is null;

end;
$$;


ALTER PROCEDURE "public"."delete_inactive_users"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_public_user"("userid" character varying) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
begin
  --  delete from auth.users where id = userId;
   delete from public.users where id = userId;
end;
$$;


ALTER FUNCTION "public"."delete_public_user"("userid" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_user"("userid" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
   delete from auth.users where id = userId;
   delete from public.users where id = userId::uuid::varchar;
end;
$$;


ALTER FUNCTION "public"."delete_user"("userid" "uuid") OWNER TO "postgres";


CREATE PROCEDURE "public"."delete_user"(IN "userid" character varying)
    LANGUAGE "plpgsql"
    AS $$
begin
  delete from auth.users where id = 'bb8e9306-7137-4e4a-be74-a9b53aeea542';

end;
$$;


ALTER PROCEDURE "public"."delete_user"(IN "userid" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."deleteuser"("userid" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
begin
   delete from auth.users where id = userId;
   delete from public.users where id = userId;
end;
$$;


ALTER FUNCTION "public"."deleteuser"("userid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."filter_challenges"("userid" "text", "status" "text", "difficulty" "text") RETURNS "record"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  _challenges record;
begin
  select * from challenges into _challenges;
  return _challenges;
end;
$$;


ALTER FUNCTION "public"."filter_challenges"("userid" "text", "status" "text", "difficulty" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."filter_challenges"("userid" "uuid", "status" "text", "difficulty" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  select * from challenges;
end;
$$;


ALTER FUNCTION "public"."filter_challenges"("userid" "uuid", "status" "text", "difficulty" "text") OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."planets" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "image" "text" NOT NULL,
    "icon" "text" NOT NULL,
    "position" integer NOT NULL
);


ALTER TABLE "public"."planets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."stars" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "number" integer NOT NULL,
    "is_challenge" boolean DEFAULT false NOT NULL,
    "planet_id" "uuid" NOT NULL,
    "texts" "jsonb",
    "questions" "jsonb",
    "slug" "text" NOT NULL,
    "story" "text" DEFAULT ''::"text"
);


ALTER TABLE "public"."stars" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users_unlocked_stars" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" character varying NOT NULL,
    "star_id" "uuid" NOT NULL
);


ALTER TABLE "public"."users_unlocked_stars" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."next_star_from_next_planet" AS
 SELECT "s"."id",
    (EXISTS ( SELECT 1
           FROM "public"."users_unlocked_stars" "uus"
          WHERE (("uus"."star_id" = "s"."id") AND (("uus"."user_id")::"text" = '56b1f86c-7e54-44fd-967a-58abc49e68a2'::"text")))) AS "is_unlocked"
   FROM ("public"."stars" "s"
     JOIN "public"."planets" "p" ON (("p"."id" = "s"."planet_id")))
  WHERE (("p"."position" = (( SELECT "planets"."position"
           FROM "public"."planets"
          WHERE ("planets"."id" = '2ee862da-4b73-4fb3-984a-d6ed1743102b'::"uuid")) + 1)) AND ("s"."number" = 1));


ALTER TABLE "public"."next_star_from_next_planet" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_next_star_from_next_planet"("_current_planet_id" "uuid", "_user_id" character varying) RETURNS SETOF "public"."next_star_from_next_planet"
    LANGUAGE "sql"
    AS $$
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
$$;


ALTER FUNCTION "public"."get_next_star_from_next_planet"("_current_planet_id" "uuid", "_user_id" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."insert_initial_data"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."insert_initial_data"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."insert_user_initial_data"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."insert_user_initial_data"() OWNER TO "postgres";


CREATE PROCEDURE "public"."insertchallengestopics"()
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER PROCEDURE "public"."insertchallengestopics"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."install_available_extensions_and_test"() RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."install_available_extensions_and_test"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."olamundo"() RETURNS character varying
    LANGUAGE "plpgsql"
    AS $$
DECLARE
 msg varchar =  'Olá, Mundo!';
BEGIN
	RETURN msg;
END;
$$;


ALTER FUNCTION "public"."olamundo"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."resetstreak"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
declare
  user_rec record;
begin
  for user_rec in select id, week_status from users loop
    if (user_rec.week_status[6] = 'done') then
      update users set user_rec.week_status = array['todo', 'todo', 'todo', 'todo', 'todo', 'todo', 'todo'] where id = user_rec.id;
    end if;
  end loop;  
end;
$$;


ALTER FUNCTION "public"."resetstreak"() OWNER TO "postgres";


CREATE PROCEDURE "public"."setwinners"()
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER PROCEDURE "public"."setwinners"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."slugify"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
begin
  return trim(both '-' from regexp_replace(lower(unaccent(name)), '[^a-z0-9\\-_]+', '-', 'gi'));
end;
$$;


ALTER FUNCTION "public"."slugify"("name" "text") OWNER TO "postgres";


CREATE PROCEDURE "public"."slugify_entities_name"()
    LANGUAGE "plpgsql"
    AS $$
declare
    _challenge record;
begin
  for _challenge in select id, title from challenges loop
    update challenges set slug = (select slugify(_challenge.title)) where id = _challenge.id;
  end loop;
end;
$$;


ALTER PROCEDURE "public"."slugify_entities_name"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."teste"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."teste"() OWNER TO "postgres";


CREATE PROCEDURE "public"."testranking"()
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER PROCEDURE "public"."testranking"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_last_week_ranking_positions"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."update_last_week_ranking_positions"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_email"("new_email" "text", "user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
   update auth.users set email = new_email where id = user_id;
   update public.users set email = new_email where id = user_id::uuid::varchar;
end;
$$;


ALTER FUNCTION "public"."update_user_email"("new_email" "text", "user_id" "uuid") OWNER TO "postgres";


CREATE PROCEDURE "public"."updateranking"()
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER PROCEDURE "public"."updateranking"() OWNER TO "postgres";


CREATE PROCEDURE "public"."updateranking_"()
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER PROCEDURE "public"."updateranking_"() OWNER TO "postgres";


CREATE PROCEDURE "public"."updateuserspositions"()
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER PROCEDURE "public"."updateuserspositions"() OWNER TO "postgres";


CREATE PROCEDURE "public"."updatewinners"()
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER PROCEDURE "public"."updatewinners"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."achievements" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "icon" "text" NOT NULL,
    "description" "text" NOT NULL,
    "metric" "text" DEFAULT ''::"text" NOT NULL,
    "required_count" bigint NOT NULL,
    "reward" integer DEFAULT 20 NOT NULL,
    "position" integer NOT NULL
);


ALTER TABLE "public"."achievements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."avatars" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "image" "text" NOT NULL,
    "price" bigint NOT NULL,
    "is_selected_by_default" boolean DEFAULT false NOT NULL,
    "is_acquired_by_default" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."avatars" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying NOT NULL
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."challenges" (
    "title" character varying DEFAULT ''::character varying NOT NULL,
    "difficulty_level" character varying DEFAULT 'easy'::character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "star_id" "uuid",
    "code" "text" NOT NULL,
    "texts" "jsonb",
    "function_name" "text",
    "test_cases" "jsonb" NOT NULL,
    "slug" "text" NOT NULL,
    "user_id" "text" DEFAULT '38976417-7c77-44ff-9e26-5dc8b457f768'::"text" NOT NULL,
    "description" "text",
    "is_public" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."challenges" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."challenges_categories" (
    "challenge_id" "uuid" NOT NULL,
    "category_id" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL
);


ALTER TABLE "public"."challenges_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."challenges_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "challenge_id" "uuid",
    "comment_id" "uuid" NOT NULL
);


ALTER TABLE "public"."challenges_comments" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."challenges_view" AS
SELECT
    NULL::character varying AS "title",
    NULL::character varying AS "difficulty_level",
    NULL::timestamp with time zone AS "created_at",
    NULL::"uuid" AS "id",
    NULL::"uuid" AS "star_id",
    NULL::"text" AS "code",
    NULL::"jsonb" AS "texts",
    NULL::"text" AS "function_name",
    NULL::"jsonb" AS "test_cases",
    NULL::"text" AS "slug",
    NULL::"text" AS "user_id",
    NULL::"text" AS "description",
    NULL::boolean AS "is_public",
    NULL::character varying AS "author_id",
    NULL::character varying AS "author_name",
    NULL::"text" AS "author_slug",
    NULL::"text" AS "author_avatar_name",
    NULL::"text" AS "author_avatar_image",
    NULL::bigint AS "upvotes_count",
    NULL::bigint AS "downvotes_count",
    NULL::bigint AS "total_completitions",
    NULL::"json"[] AS "categories";


ALTER TABLE "public"."challenges_view" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."comments_view" AS
SELECT
    NULL::"uuid" AS "id",
    NULL::"text" AS "content",
    NULL::timestamp with time zone AS "created_at",
    NULL::"uuid" AS "parent_comment_id",
    NULL::character varying AS "author_id",
    NULL::bigint AS "upvotes_count",
    NULL::bigint AS "replies_count",
    NULL::character varying AS "author_name",
    NULL::"text" AS "author_slug",
    NULL::"text" AS "author_avatar_name",
    NULL::"text" AS "author_avatar_image";


ALTER TABLE "public"."comments_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."docs" (
    "title" "text" NOT NULL,
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "position" integer NOT NULL,
    "content" "text"
);


ALTER TABLE "public"."docs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."questions" (
    "content" "jsonb" NOT NULL,
    "star_id" "uuid" NOT NULL,
    "position" numeric NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."questions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ranking_users" (
    "id" character varying NOT NULL,
    "tier_id" "uuid" NOT NULL,
    "xp" bigint DEFAULT '0'::bigint NOT NULL,
    "status" "public"."ranking_status" DEFAULT 'winner'::"public"."ranking_status" NOT NULL,
    "position" integer NOT NULL
);


ALTER TABLE "public"."ranking_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rockets" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying NOT NULL,
    "price" integer NOT NULL,
    "image" character varying NOT NULL,
    "slug" "text" NOT NULL,
    "is_selected_by_default" boolean DEFAULT false NOT NULL,
    "is_acquired_by_default" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."rockets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."snippets" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" DEFAULT 'Sem título'::"text" NOT NULL,
    "code" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "is_public" boolean DEFAULT true NOT NULL,
    "user_id" character varying NOT NULL
);


ALTER TABLE "public"."snippets" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."snippets_view" AS
SELECT
    NULL::"uuid" AS "id",
    NULL::"text" AS "title",
    NULL::"text" AS "code",
    NULL::boolean AS "is_public",
    NULL::timestamp with time zone AS "created_at",
    NULL::character varying AS "author_id",
    NULL::character varying AS "author_name",
    NULL::"text" AS "author_slug",
    NULL::"text" AS "author_avatar_name",
    NULL::"text" AS "author_avatar_image";


ALTER TABLE "public"."snippets_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."solutions" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "challenge_id" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "user_id" character varying NOT NULL,
    "views_count" bigint NOT NULL
);


ALTER TABLE "public"."solutions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."solutions_comments" (
    "comment_id" "uuid" NOT NULL,
    "solution_id" "uuid" NOT NULL
);


ALTER TABLE "public"."solutions_comments" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."solutions_view" AS
SELECT
    NULL::"uuid" AS "id",
    NULL::"text" AS "title",
    NULL::"text" AS "content",
    NULL::"text" AS "slug",
    NULL::bigint AS "views_count",
    NULL::"uuid" AS "challenge_id",
    NULL::timestamp with time zone AS "created_at",
    NULL::character varying AS "author_id",
    NULL::bigint AS "upvotes_count",
    NULL::bigint AS "comments_count",
    NULL::character varying AS "author_name",
    NULL::"text" AS "author_slug",
    NULL::"text" AS "author_avatar_name",
    NULL::"text" AS "author_avatar_image";


ALTER TABLE "public"."solutions_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tiers" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "image" "text" NOT NULL,
    "position" integer DEFAULT 1 NOT NULL,
    "reward" integer NOT NULL
);


ALTER TABLE "public"."tiers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" character varying NOT NULL,
    "name" character varying NOT NULL,
    "email" character varying NOT NULL,
    "level" integer DEFAULT 1 NOT NULL,
    "xp" integer DEFAULT 0 NOT NULL,
    "coins" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "streak" integer DEFAULT 0 NOT NULL,
    "week_status" "text"[] DEFAULT '{todo,todo,todo,todo,todo,todo,todo}'::"text"[] NOT NULL,
    "did_complete_saturday" boolean DEFAULT false NOT NULL,
    "tier_id" "uuid" DEFAULT 'f542f61a-4e42-4914-88f6-9aa7c2358473'::"uuid",
    "rocket_id" "uuid" DEFAULT '03f3f359-a0ee-42c1-bd5f-b2ad01810d47'::"uuid",
    "weekly_xp" integer DEFAULT 0 NOT NULL,
    "can_see_ranking" boolean DEFAULT false NOT NULL,
    "last_week_ranking_position" integer,
    "avatar_id" "uuid" DEFAULT '557a33e8-ce8a-4ac2-992c-7eab630d186d'::"uuid",
    "study_time" "text" DEFAULT '10:00'::"text" NOT NULL,
    "did_break_streak" boolean DEFAULT false NOT NULL,
    "is_loser" boolean DEFAULT false,
    "slug" "text" NOT NULL
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users_acquired_avatars" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" character varying NOT NULL,
    "avatar_id" "uuid" NOT NULL
);


ALTER TABLE "public"."users_acquired_avatars" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users_acquired_rockets" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" character varying NOT NULL,
    "rocket_id" "uuid" NOT NULL
);


ALTER TABLE "public"."users_acquired_rockets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users_challenge_votes" (
    "challenge_id" "uuid" NOT NULL,
    "user_id" character varying NOT NULL,
    "vote" "public"."challenge_vote" NOT NULL
);


ALTER TABLE "public"."users_challenge_votes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users_completed_challenges" (
    "user_id" character varying NOT NULL,
    "challenge_id" "uuid" NOT NULL
);


ALTER TABLE "public"."users_completed_challenges" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."users_completed_planets_view" AS
 WITH "unlocked_stars_by_planet" AS (
         SELECT "p"."id" AS "planet_id",
            "p"."name" AS "planet_name",
            "count"(DISTINCT "uus"."star_id") AS "unlocked_stars_count",
            "uus"."user_id"
           FROM (("public"."users_unlocked_stars" "uus"
             JOIN "public"."stars" "s" ON (("uus"."star_id" = "s"."id")))
             JOIN "public"."planets" "p" ON (("s"."planet_id" = "p"."id")))
          GROUP BY "p"."id", "p"."name", "p"."position", "uus"."user_id"
          ORDER BY "p"."position"
        ), "all_stars_by_planet" AS (
         SELECT "p"."id" AS "planet_id",
            "p"."name" AS "planet_name",
            "count"("s"."id") AS "stars_count"
           FROM ("public"."planets" "p"
             JOIN "public"."stars" "s" ON (("s"."planet_id" = "p"."id")))
          GROUP BY "p"."id", "p"."name", "p"."position"
          ORDER BY "p"."position"
        )
 SELECT "u"."id" AS "user_id",
    "asbp"."planet_id"
   FROM (("unlocked_stars_by_planet" "usbp"
     JOIN "all_stars_by_planet" "asbp" ON (("usbp"."planet_id" = "asbp"."planet_id")))
     JOIN "public"."users" "u" ON ((("u"."id")::"text" = ("usbp"."user_id")::"text")))
  WHERE (("usbp"."unlocked_stars_count" >= "asbp"."stars_count") AND (("usbp"."user_id")::"text" = ("u"."id")::"text"));


ALTER TABLE "public"."users_completed_planets_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users_rescuable_achievements" (
    "user_id" character varying NOT NULL,
    "achievement_id" "uuid" NOT NULL
);


ALTER TABLE "public"."users_rescuable_achievements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users_unlocked_achievements" (
    "user_id" character varying NOT NULL,
    "achievement_id" "uuid" NOT NULL
);


ALTER TABLE "public"."users_unlocked_achievements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users_upvoted_comments" (
    "user_id" character varying NOT NULL,
    "comment_id" "uuid" NOT NULL
);


ALTER TABLE "public"."users_upvoted_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users_upvoted_solutions" (
    "solution_id" "uuid" NOT NULL,
    "user_id" character varying NOT NULL
);


ALTER TABLE "public"."users_upvoted_solutions" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."users_view" AS
SELECT
    NULL::character varying AS "id",
    NULL::character varying AS "name",
    NULL::character varying AS "email",
    NULL::integer AS "level",
    NULL::integer AS "xp",
    NULL::integer AS "coins",
    NULL::timestamp with time zone AS "created_at",
    NULL::integer AS "streak",
    NULL::"text"[] AS "week_status",
    NULL::boolean AS "did_complete_saturday",
    NULL::"uuid" AS "tier_id",
    NULL::"uuid" AS "rocket_id",
    NULL::integer AS "weekly_xp",
    NULL::boolean AS "can_see_ranking",
    NULL::integer AS "last_week_ranking_position",
    NULL::"uuid" AS "avatar_id",
    NULL::"text" AS "study_time",
    NULL::boolean AS "did_break_streak",
    NULL::boolean AS "is_loser",
    NULL::"text" AS "slug",
    NULL::"uuid"[] AS "unlocked_stars_ids",
    NULL::"uuid"[] AS "unlocked_achievements_ids",
    NULL::"uuid"[] AS "rescuable_achievements_ids",
    NULL::"uuid"[] AS "completed_challenges_ids",
    NULL::"uuid"[] AS "acquired_rockets_ids",
    NULL::"uuid"[] AS "acquired_avatars_ids",
    NULL::"uuid"[] AS "upvoted_comments_ids",
    NULL::"uuid"[] AS "upvoted_solutions_ids",
    NULL::"uuid"[] AS "completed_planets_ids";


ALTER TABLE "public"."users_view" OWNER TO "postgres";


ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_badge_achievement_key" UNIQUE ("icon");



ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_description_achievement_key" UNIQUE ("description");



ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_name_achievement_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."avatars"
    ADD CONSTRAINT "avatars_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."challenges_comments"
    ADD CONSTRAINT "challenge_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."challenges_categories"
    ADD CONSTRAINT "challenges_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."challenges"
    ADD CONSTRAINT "challenges_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."snippets"
    ADD CONSTRAINT "codes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."planets"
    ADD CONSTRAINT "planets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."questions"
    ADD CONSTRAINT "questions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tiers"
    ADD CONSTRAINT "rankings_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."tiers"
    ADD CONSTRAINT "rankings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rockets"
    ADD CONSTRAINT "rockets_image_key" UNIQUE ("image");



ALTER TABLE ONLY "public"."rockets"
    ADD CONSTRAINT "rockets_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."rockets"
    ADD CONSTRAINT "rockets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."solutions"
    ADD CONSTRAINT "solution_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."solutions_comments"
    ADD CONSTRAINT "solutions_comments_pkey" PRIMARY KEY ("comment_id", "solution_id");



ALTER TABLE ONLY "public"."solutions"
    ADD CONSTRAINT "solutions_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."solutions"
    ADD CONSTRAINT "solutions_title_key" UNIQUE ("title");



ALTER TABLE ONLY "public"."stars"
    ADD CONSTRAINT "stars_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."docs"
    ADD CONSTRAINT "topics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "user_email_user_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users_unlocked_stars"
    ADD CONSTRAINT "user_unlocked_stars_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users_upvoted_solutions"
    ADD CONSTRAINT "user_upvoted_solutions_pkey" PRIMARY KEY ("solution_id", "user_id");



ALTER TABLE ONLY "public"."users_acquired_avatars"
    ADD CONSTRAINT "users_acquired_avatars_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users_acquired_rockets"
    ADD CONSTRAINT "users_acquired_rockets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users_challenge_votes"
    ADD CONSTRAINT "users_challenge_votes_pkey" PRIMARY KEY ("challenge_id", "user_id");



ALTER TABLE ONLY "public"."users_completed_challenges"
    ADD CONSTRAINT "users_completed_challenges_pkey" PRIMARY KEY ("user_id", "challenge_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."users_rescuable_achievements"
    ADD CONSTRAINT "users_rescuable_achievements_pkey" PRIMARY KEY ("user_id", "achievement_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."users_unlocked_achievements"
    ADD CONSTRAINT "users_unlocked_achievements_pkey" PRIMARY KEY ("user_id", "achievement_id");



ALTER TABLE ONLY "public"."users_upvoted_comments"
    ADD CONSTRAINT "users_upvoted_comments_pkey" PRIMARY KEY ("user_id", "comment_id");



ALTER TABLE ONLY "public"."ranking_users"
    ADD CONSTRAINT "winners_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE VIEW "public"."comments_view" AS
 SELECT "c"."id",
    "c"."content",
    "c"."created_at",
    "c"."parent_comment_id",
    "c"."user_id" AS "author_id",
    COALESCE(( SELECT "count"("users_upvoted_comments"."comment_id") AS "count"
           FROM "public"."users_upvoted_comments"
          WHERE ("users_upvoted_comments"."comment_id" = "c"."id")), (0)::bigint) AS "upvotes_count",
    COALESCE(( SELECT "count"("comments"."id") AS "count"
           FROM "public"."comments"
          WHERE ("comments"."parent_comment_id" = "c"."id")), (0)::bigint) AS "replies_count",
    "u"."name" AS "author_name",
    "u"."slug" AS "author_slug",
    "a"."name" AS "author_avatar_name",
    "a"."image" AS "author_avatar_image"
   FROM (("public"."comments" "c"
     LEFT JOIN "public"."users" "u" ON ((("u"."id")::"text" = ("c"."user_id")::"text")))
     LEFT JOIN "public"."avatars" "a" ON (("a"."id" = "u"."avatar_id")))
  GROUP BY "c"."id", "u"."id", "a"."name", "a"."image";



CREATE OR REPLACE VIEW "public"."users_view" AS
 WITH "unlocked_stars_by_planet" AS (
         SELECT "p"."id" AS "planet_id",
            "p"."name" AS "planet_name",
            "count"(DISTINCT "uus_1"."star_id") AS "unlocked_stars_count",
            "uus_1"."user_id"
           FROM (("public"."users_unlocked_stars" "uus_1"
             JOIN "public"."stars" "s" ON (("uus_1"."star_id" = "s"."id")))
             JOIN "public"."planets" "p" ON (("s"."planet_id" = "p"."id")))
          GROUP BY "p"."id", "p"."name", "p"."position", "uus_1"."user_id"
          ORDER BY "p"."position"
        ), "all_stars_by_planet" AS (
         SELECT "p"."id" AS "planet_id",
            "p"."name" AS "planet_name",
            "count"("s"."id") AS "stars_count"
           FROM ("public"."planets" "p"
             JOIN "public"."stars" "s" ON (("s"."planet_id" = "p"."id")))
          GROUP BY "p"."id", "p"."name", "p"."position"
          ORDER BY "p"."position"
        )
 SELECT "u"."id",
    "u"."name",
    "u"."email",
    "u"."level",
    "u"."xp",
    "u"."coins",
    "u"."created_at",
    "u"."streak",
    "u"."week_status",
    "u"."did_complete_saturday",
    "u"."tier_id",
    "u"."rocket_id",
    "u"."weekly_xp",
    "u"."can_see_ranking",
    "u"."last_week_ranking_position",
    "u"."avatar_id",
    "u"."study_time",
    "u"."did_break_streak",
    "u"."is_loser",
    "u"."slug",
    "array_agg"(DISTINCT "uus"."star_id") AS "unlocked_stars_ids",
    "array_agg"(DISTINCT "uua"."achievement_id") AS "unlocked_achievements_ids",
    "array_agg"(DISTINCT "ura"."achievement_id") AS "rescuable_achievements_ids",
    "array_agg"(DISTINCT "ucc"."challenge_id") AS "completed_challenges_ids",
    "array_agg"(DISTINCT "uar"."rocket_id") AS "acquired_rockets_ids",
    "array_agg"(DISTINCT "uaa"."avatar_id") AS "acquired_avatars_ids",
    "array_agg"(DISTINCT "uuc"."comment_id") AS "upvoted_comments_ids",
    "array_agg"(DISTINCT "uuso"."solution_id") AS "upvoted_solutions_ids",
    ( SELECT "array_agg"(DISTINCT "asbp"."planet_id") AS "array_agg"
           FROM ("unlocked_stars_by_planet" "usbp"
             JOIN "all_stars_by_planet" "asbp" ON (("usbp"."planet_id" = "asbp"."planet_id")))
          WHERE (("usbp"."unlocked_stars_count" >= "asbp"."stars_count") AND (("usbp"."user_id")::"text" = ("u"."id")::"text"))) AS "completed_planets_ids"
   FROM (((((((("public"."users" "u"
     LEFT JOIN "public"."users_unlocked_stars" "uus" ON ((("uus"."user_id")::"text" = ("u"."id")::"text")))
     LEFT JOIN "public"."users_unlocked_achievements" "uua" ON ((("uua"."user_id")::"text" = ("u"."id")::"text")))
     LEFT JOIN "public"."users_rescuable_achievements" "ura" ON ((("ura"."user_id")::"text" = ("u"."id")::"text")))
     LEFT JOIN "public"."users_completed_challenges" "ucc" ON ((("ucc"."user_id")::"text" = ("u"."id")::"text")))
     LEFT JOIN "public"."users_acquired_rockets" "uar" ON ((("uar"."user_id")::"text" = ("u"."id")::"text")))
     LEFT JOIN "public"."users_acquired_avatars" "uaa" ON ((("uaa"."user_id")::"text" = ("u"."id")::"text")))
     LEFT JOIN "public"."users_upvoted_comments" "uuc" ON ((("uuc"."user_id")::"text" = ("u"."id")::"text")))
     LEFT JOIN "public"."users_upvoted_solutions" "uuso" ON ((("uuso"."user_id")::"text" = ("u"."id")::"text")))
  GROUP BY "u"."id";



CREATE OR REPLACE VIEW "public"."solutions_view" AS
 SELECT "s"."id",
    "s"."title",
    "s"."content",
    "s"."slug",
    "s"."views_count",
    "s"."challenge_id",
    "s"."created_at",
    "s"."user_id" AS "author_id",
    COALESCE(( SELECT "count"("users_upvoted_solutions"."solution_id") AS "count"
           FROM "public"."users_upvoted_solutions"
          WHERE ("users_upvoted_solutions"."solution_id" = "s"."id")), (0)::bigint) AS "upvotes_count",
    COALESCE(( SELECT "count"("solutions_comments"."solution_id") AS "count"
           FROM "public"."solutions_comments"
          WHERE ("solutions_comments"."solution_id" = "s"."id")), (0)::bigint) AS "comments_count",
    "u"."name" AS "author_name",
    "u"."slug" AS "author_slug",
    "a"."name" AS "author_avatar_name",
    "a"."image" AS "author_avatar_image"
   FROM (("public"."solutions" "s"
     LEFT JOIN "public"."users" "u" ON ((("u"."id")::"text" = ("s"."user_id")::"text")))
     LEFT JOIN "public"."avatars" "a" ON (("a"."id" = "u"."avatar_id")))
  GROUP BY "s"."id", "u"."id", "a"."name", "a"."image";



CREATE OR REPLACE VIEW "public"."snippets_view" AS
 SELECT "s"."id",
    "s"."title",
    "s"."code",
    "s"."is_public",
    "s"."created_at",
    "s"."user_id" AS "author_id",
    "u"."name" AS "author_name",
    "u"."slug" AS "author_slug",
    "a"."name" AS "author_avatar_name",
    "a"."image" AS "author_avatar_image"
   FROM (("public"."snippets" "s"
     LEFT JOIN "public"."users" "u" ON ((("u"."id")::"text" = ("s"."user_id")::"text")))
     LEFT JOIN "public"."avatars" "a" ON (("a"."id" = "u"."avatar_id")))
  GROUP BY "s"."id", "u"."id", "a"."name", "a"."image";



CREATE OR REPLACE VIEW "public"."challenges_view" AS
 SELECT "c"."title",
    "c"."difficulty_level",
    "c"."created_at",
    "c"."id",
    "c"."star_id",
    "c"."code",
    "c"."texts",
    "c"."function_name",
    "c"."test_cases",
    "c"."slug",
    "c"."user_id",
    "c"."description",
    "c"."is_public",
    "u"."id" AS "author_id",
    "u"."name" AS "author_name",
    "u"."slug" AS "author_slug",
    "a"."name" AS "author_avatar_name",
    "a"."image" AS "author_avatar_image",
    "count"(DISTINCT
        CASE
            WHEN ("uvc"."vote" = 'upvote'::"public"."challenge_vote") THEN 1
            ELSE NULL::integer
        END) AS "upvotes_count",
    "count"(DISTINCT
        CASE
            WHEN ("uvc"."vote" = 'downvote'::"public"."challenge_vote") THEN 1
            ELSE NULL::integer
        END) AS "downvotes_count",
    "count"(DISTINCT "ucc"."challenge_id") AS "total_completitions",
    "array_agg"("json_build_object"('id', "ccc"."id", 'name', "ccc"."name")) AS "categories"
   FROM (((((("public"."challenges" "c"
     LEFT JOIN "public"."users" "u" ON ((("u"."id")::"text" = "c"."user_id")))
     LEFT JOIN "public"."users_challenge_votes" "uvc" ON (("uvc"."challenge_id" = "c"."id")))
     LEFT JOIN "public"."users_completed_challenges" "ucc" ON (("ucc"."challenge_id" = "c"."id")))
     LEFT JOIN "public"."challenges_categories" "cc" ON (("cc"."challenge_id" = "c"."id")))
     LEFT JOIN "public"."categories" "ccc" ON (("ccc"."id" = "cc"."category_id")))
     LEFT JOIN "public"."avatars" "a" ON (("a"."id" = "u"."avatar_id")))
  GROUP BY "c"."id", "u"."id", "a"."name", "a"."image";



ALTER TABLE ONLY "public"."challenges_comments"
    ADD CONSTRAINT "challenge_comments_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."challenges_comments"
    ADD CONSTRAINT "challenge_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."challenges_categories"
    ADD CONSTRAINT "challenges_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."challenges_categories"
    ADD CONSTRAINT "challenges_categories_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."challenges"
    ADD CONSTRAINT "challenges_star_id_fkey" FOREIGN KEY ("star_id") REFERENCES "public"."stars"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."challenges"
    ADD CONSTRAINT "challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."solutions"
    ADD CONSTRAINT "public_solution_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."questions"
    ADD CONSTRAINT "questions_star_id_fkey" FOREIGN KEY ("star_id") REFERENCES "public"."stars"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."snippets"
    ADD CONSTRAINT "snippets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."solutions_comments"
    ADD CONSTRAINT "solutions_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."solutions_comments"
    ADD CONSTRAINT "solutions_comments_solution_id_fkey" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."solutions"
    ADD CONSTRAINT "solutions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stars"
    ADD CONSTRAINT "stars_planet_id_fkey" FOREIGN KEY ("planet_id") REFERENCES "public"."planets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_upvoted_solutions"
    ADD CONSTRAINT "user_upvoted_solutions_solution_id_fkey" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_upvoted_solutions"
    ADD CONSTRAINT "user_upvoted_solutions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_acquired_avatars"
    ADD CONSTRAINT "users_acquired_avatars_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "public"."avatars"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_acquired_avatars"
    ADD CONSTRAINT "users_acquired_avatars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_acquired_rockets"
    ADD CONSTRAINT "users_acquired_rockets_rocket_id_fkey" FOREIGN KEY ("rocket_id") REFERENCES "public"."rockets"("id");



ALTER TABLE ONLY "public"."users_acquired_rockets"
    ADD CONSTRAINT "users_acquired_rockets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "public"."avatars"("id");



ALTER TABLE ONLY "public"."users_completed_challenges"
    ADD CONSTRAINT "users_completed_challenges_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_completed_challenges"
    ADD CONSTRAINT "users_completed_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_ranking_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "public"."tiers"("id");



ALTER TABLE ONLY "public"."users_rescuable_achievements"
    ADD CONSTRAINT "users_rescuable_achievements_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_rescuable_achievements"
    ADD CONSTRAINT "users_rescuable_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_rocket_id_fkey" FOREIGN KEY ("rocket_id") REFERENCES "public"."rockets"("id");



ALTER TABLE ONLY "public"."users_unlocked_achievements"
    ADD CONSTRAINT "users_unlocked_achievements_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_unlocked_achievements"
    ADD CONSTRAINT "users_unlocked_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_unlocked_stars"
    ADD CONSTRAINT "users_unlocked_stars_star_id_fkey" FOREIGN KEY ("star_id") REFERENCES "public"."stars"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_unlocked_stars"
    ADD CONSTRAINT "users_unlocked_stars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_upvoted_comments"
    ADD CONSTRAINT "users_upvoted_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_upvoted_comments"
    ADD CONSTRAINT "users_upvoted_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_challenge_votes"
    ADD CONSTRAINT "users_voted_challenges_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_challenge_votes"
    ADD CONSTRAINT "users_voted_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ranking_users"
    ADD CONSTRAINT "winners_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ranking_users"
    ADD CONSTRAINT "winners_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "public"."tiers"("id") ON DELETE CASCADE;



CREATE POLICY "Authorization" ON "public"."solutions" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Only authenticated users can access avatars" ON "public"."avatars" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Only authenticated users can access categories" ON "public"."categories" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Only authenticated users can access challenges" ON "public"."challenges" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Only authenticated users can access challenges categories" ON "public"."challenges_categories" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Only authenticated users can access codes" ON "public"."comments" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Only authenticated users can access dictionary topics" ON "public"."docs" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Only authenticated users can access planets" ON "public"."planets" USING (true) WITH CHECK (true);



CREATE POLICY "Only authenticated users can access playgrounds" ON "public"."snippets" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Only authenticated users can access questions" ON "public"."questions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Only authenticated users can access rankings" ON "public"."tiers" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Only authenticated users can access rockets" ON "public"."rockets" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Only authenticated users can access stars" ON "public"."stars" FOR SELECT USING (true);



CREATE POLICY "authenticated" ON "public"."challenges_comments" TO "authenticated" USING (true) WITH CHECK (true);



ALTER TABLE "public"."challenges_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."challenges_comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."docs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "enable achivements" ON "public"."achievements" USING (true);



ALTER TABLE "public"."questions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."solutions" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."users";









REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT ALL ON SCHEMA "public" TO PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




































































































































































































































































































































































































































GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";



GRANT ALL ON FUNCTION "public"."count_comments_upvotes"("public"."comments") TO "anon";
GRANT ALL ON FUNCTION "public"."count_comments_upvotes"("public"."comments") TO "authenticated";
GRANT ALL ON FUNCTION "public"."count_comments_upvotes"("public"."comments") TO "service_role";



GRANT ALL ON PROCEDURE "public"."delete_inactive_users"() TO "anon";
GRANT ALL ON PROCEDURE "public"."delete_inactive_users"() TO "authenticated";
GRANT ALL ON PROCEDURE "public"."delete_inactive_users"() TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_public_user"("userid" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."delete_public_user"("userid" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_public_user"("userid" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_user"("userid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."delete_user"("userid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_user"("userid" "uuid") TO "service_role";



GRANT ALL ON PROCEDURE "public"."delete_user"(IN "userid" character varying) TO "anon";
GRANT ALL ON PROCEDURE "public"."delete_user"(IN "userid" character varying) TO "authenticated";
GRANT ALL ON PROCEDURE "public"."delete_user"(IN "userid" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."deleteuser"("userid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."deleteuser"("userid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."deleteuser"("userid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."filter_challenges"("userid" "text", "status" "text", "difficulty" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."filter_challenges"("userid" "text", "status" "text", "difficulty" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."filter_challenges"("userid" "text", "status" "text", "difficulty" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."filter_challenges"("userid" "uuid", "status" "text", "difficulty" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."filter_challenges"("userid" "uuid", "status" "text", "difficulty" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."filter_challenges"("userid" "uuid", "status" "text", "difficulty" "text") TO "service_role";



GRANT ALL ON TABLE "public"."planets" TO "anon";
GRANT ALL ON TABLE "public"."planets" TO "authenticated";
GRANT ALL ON TABLE "public"."planets" TO "service_role";



GRANT ALL ON TABLE "public"."stars" TO "anon";
GRANT ALL ON TABLE "public"."stars" TO "authenticated";
GRANT ALL ON TABLE "public"."stars" TO "service_role";



GRANT ALL ON TABLE "public"."users_unlocked_stars" TO "anon";
GRANT ALL ON TABLE "public"."users_unlocked_stars" TO "authenticated";
GRANT ALL ON TABLE "public"."users_unlocked_stars" TO "service_role";



GRANT ALL ON TABLE "public"."next_star_from_next_planet" TO "anon";
GRANT ALL ON TABLE "public"."next_star_from_next_planet" TO "authenticated";
GRANT ALL ON TABLE "public"."next_star_from_next_planet" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_next_star_from_next_planet"("_current_planet_id" "uuid", "_user_id" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."get_next_star_from_next_planet"("_current_planet_id" "uuid", "_user_id" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_next_star_from_next_planet"("_current_planet_id" "uuid", "_user_id" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."insert_initial_data"() TO "anon";
GRANT ALL ON FUNCTION "public"."insert_initial_data"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_initial_data"() TO "service_role";



GRANT ALL ON FUNCTION "public"."insert_user_initial_data"() TO "anon";
GRANT ALL ON FUNCTION "public"."insert_user_initial_data"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_user_initial_data"() TO "service_role";



GRANT ALL ON PROCEDURE "public"."insertchallengestopics"() TO "anon";
GRANT ALL ON PROCEDURE "public"."insertchallengestopics"() TO "authenticated";
GRANT ALL ON PROCEDURE "public"."insertchallengestopics"() TO "service_role";



GRANT ALL ON FUNCTION "public"."install_available_extensions_and_test"() TO "anon";
GRANT ALL ON FUNCTION "public"."install_available_extensions_and_test"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."install_available_extensions_and_test"() TO "service_role";



GRANT ALL ON FUNCTION "public"."olamundo"() TO "anon";
GRANT ALL ON FUNCTION "public"."olamundo"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."olamundo"() TO "service_role";



GRANT ALL ON FUNCTION "public"."resetstreak"() TO "anon";
GRANT ALL ON FUNCTION "public"."resetstreak"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."resetstreak"() TO "service_role";



GRANT ALL ON PROCEDURE "public"."setwinners"() TO "anon";
GRANT ALL ON PROCEDURE "public"."setwinners"() TO "authenticated";
GRANT ALL ON PROCEDURE "public"."setwinners"() TO "service_role";



GRANT ALL ON FUNCTION "public"."slugify"("name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."slugify"("name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."slugify"("name" "text") TO "service_role";



GRANT ALL ON PROCEDURE "public"."slugify_entities_name"() TO "anon";
GRANT ALL ON PROCEDURE "public"."slugify_entities_name"() TO "authenticated";
GRANT ALL ON PROCEDURE "public"."slugify_entities_name"() TO "service_role";



GRANT ALL ON FUNCTION "public"."teste"() TO "anon";
GRANT ALL ON FUNCTION "public"."teste"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."teste"() TO "service_role";



GRANT ALL ON PROCEDURE "public"."testranking"() TO "anon";
GRANT ALL ON PROCEDURE "public"."testranking"() TO "authenticated";
GRANT ALL ON PROCEDURE "public"."testranking"() TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_last_week_ranking_positions"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_last_week_ranking_positions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_last_week_ranking_positions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_email"("new_email" "text", "user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_email"("new_email" "text", "user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_email"("new_email" "text", "user_id" "uuid") TO "service_role";



GRANT ALL ON PROCEDURE "public"."updateranking"() TO "anon";
GRANT ALL ON PROCEDURE "public"."updateranking"() TO "authenticated";
GRANT ALL ON PROCEDURE "public"."updateranking"() TO "service_role";



GRANT ALL ON PROCEDURE "public"."updateranking_"() TO "anon";
GRANT ALL ON PROCEDURE "public"."updateranking_"() TO "authenticated";
GRANT ALL ON PROCEDURE "public"."updateranking_"() TO "service_role";



GRANT ALL ON PROCEDURE "public"."updateuserspositions"() TO "anon";
GRANT ALL ON PROCEDURE "public"."updateuserspositions"() TO "authenticated";
GRANT ALL ON PROCEDURE "public"."updateuserspositions"() TO "service_role";



GRANT ALL ON PROCEDURE "public"."updatewinners"() TO "anon";
GRANT ALL ON PROCEDURE "public"."updatewinners"() TO "authenticated";
GRANT ALL ON PROCEDURE "public"."updatewinners"() TO "service_role";



























GRANT ALL ON TABLE "public"."achievements" TO "anon";
GRANT ALL ON TABLE "public"."achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."achievements" TO "service_role";



GRANT ALL ON TABLE "public"."avatars" TO "anon";
GRANT ALL ON TABLE "public"."avatars" TO "authenticated";
GRANT ALL ON TABLE "public"."avatars" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."challenges" TO "anon";
GRANT ALL ON TABLE "public"."challenges" TO "authenticated";
GRANT ALL ON TABLE "public"."challenges" TO "service_role";



GRANT ALL ON TABLE "public"."challenges_categories" TO "anon";
GRANT ALL ON TABLE "public"."challenges_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."challenges_categories" TO "service_role";



GRANT ALL ON TABLE "public"."challenges_comments" TO "anon";
GRANT ALL ON TABLE "public"."challenges_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."challenges_comments" TO "service_role";



GRANT ALL ON TABLE "public"."challenges_view" TO "anon";
GRANT ALL ON TABLE "public"."challenges_view" TO "authenticated";
GRANT ALL ON TABLE "public"."challenges_view" TO "service_role";



GRANT ALL ON TABLE "public"."comments_view" TO "anon";
GRANT ALL ON TABLE "public"."comments_view" TO "authenticated";
GRANT ALL ON TABLE "public"."comments_view" TO "service_role";



GRANT ALL ON TABLE "public"."docs" TO "anon";
GRANT ALL ON TABLE "public"."docs" TO "authenticated";
GRANT ALL ON TABLE "public"."docs" TO "service_role";



GRANT ALL ON TABLE "public"."questions" TO "anon";
GRANT ALL ON TABLE "public"."questions" TO "authenticated";
GRANT ALL ON TABLE "public"."questions" TO "service_role";



GRANT ALL ON TABLE "public"."ranking_users" TO "anon";
GRANT ALL ON TABLE "public"."ranking_users" TO "authenticated";
GRANT ALL ON TABLE "public"."ranking_users" TO "service_role";



GRANT ALL ON TABLE "public"."rockets" TO "anon";
GRANT ALL ON TABLE "public"."rockets" TO "authenticated";
GRANT ALL ON TABLE "public"."rockets" TO "service_role";



GRANT ALL ON TABLE "public"."snippets" TO "anon";
GRANT ALL ON TABLE "public"."snippets" TO "authenticated";
GRANT ALL ON TABLE "public"."snippets" TO "service_role";



GRANT ALL ON TABLE "public"."snippets_view" TO "anon";
GRANT ALL ON TABLE "public"."snippets_view" TO "authenticated";
GRANT ALL ON TABLE "public"."snippets_view" TO "service_role";



GRANT ALL ON TABLE "public"."solutions" TO "anon";
GRANT ALL ON TABLE "public"."solutions" TO "authenticated";
GRANT ALL ON TABLE "public"."solutions" TO "service_role";



GRANT ALL ON TABLE "public"."solutions_comments" TO "anon";
GRANT ALL ON TABLE "public"."solutions_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."solutions_comments" TO "service_role";



GRANT ALL ON TABLE "public"."solutions_view" TO "anon";
GRANT ALL ON TABLE "public"."solutions_view" TO "authenticated";
GRANT ALL ON TABLE "public"."solutions_view" TO "service_role";



GRANT ALL ON TABLE "public"."tiers" TO "anon";
GRANT ALL ON TABLE "public"."tiers" TO "authenticated";
GRANT ALL ON TABLE "public"."tiers" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."users_acquired_avatars" TO "anon";
GRANT ALL ON TABLE "public"."users_acquired_avatars" TO "authenticated";
GRANT ALL ON TABLE "public"."users_acquired_avatars" TO "service_role";



GRANT ALL ON TABLE "public"."users_acquired_rockets" TO "anon";
GRANT ALL ON TABLE "public"."users_acquired_rockets" TO "authenticated";
GRANT ALL ON TABLE "public"."users_acquired_rockets" TO "service_role";



GRANT ALL ON TABLE "public"."users_challenge_votes" TO "anon";
GRANT ALL ON TABLE "public"."users_challenge_votes" TO "authenticated";
GRANT ALL ON TABLE "public"."users_challenge_votes" TO "service_role";



GRANT ALL ON TABLE "public"."users_completed_challenges" TO "anon";
GRANT ALL ON TABLE "public"."users_completed_challenges" TO "authenticated";
GRANT ALL ON TABLE "public"."users_completed_challenges" TO "service_role";



GRANT ALL ON TABLE "public"."users_completed_planets_view" TO "anon";
GRANT ALL ON TABLE "public"."users_completed_planets_view" TO "authenticated";
GRANT ALL ON TABLE "public"."users_completed_planets_view" TO "service_role";



GRANT ALL ON TABLE "public"."users_rescuable_achievements" TO "anon";
GRANT ALL ON TABLE "public"."users_rescuable_achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."users_rescuable_achievements" TO "service_role";



GRANT ALL ON TABLE "public"."users_unlocked_achievements" TO "anon";
GRANT ALL ON TABLE "public"."users_unlocked_achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."users_unlocked_achievements" TO "service_role";



GRANT ALL ON TABLE "public"."users_upvoted_comments" TO "anon";
GRANT ALL ON TABLE "public"."users_upvoted_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."users_upvoted_comments" TO "service_role";



GRANT ALL ON TABLE "public"."users_upvoted_solutions" TO "anon";
GRANT ALL ON TABLE "public"."users_upvoted_solutions" TO "authenticated";
GRANT ALL ON TABLE "public"."users_upvoted_solutions" TO "service_role";



GRANT ALL ON TABLE "public"."users_view" TO "anon";
GRANT ALL ON TABLE "public"."users_view" TO "authenticated";
GRANT ALL ON TABLE "public"."users_view" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
