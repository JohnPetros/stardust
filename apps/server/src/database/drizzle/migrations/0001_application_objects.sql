-- Application objects and legacy access captured from the replayed 24 migrations.
-- Infrastructure schemas, extensions and role memberships remain owned by bootstrap.
-- Legacy functions are defined here; none is invoked or seeded.

SET search_path TO public, extensions;

--> statement-breakpoint

SET check_function_bodies = false;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.change_feedback_report_status(p_request jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_report public.feedback_reports;
  v_report_id uuid := (p_request->>'reportId')::uuid;
  v_expected text := p_request->>'expectedStatus';
  v_status text := p_request->>'status';
begin
  select * into v_report from public.feedback_reports where id = v_report_id for update;
  if not found then raise exception 'feedback_report_not_found'; end if;

  if v_report.status <> v_expected then
    raise exception 'feedback_report_status_conflict';
  end if;
  if v_status not in ('open', 'closed') then raise exception 'feedback_report_status_invalid'; end if;

  update public.feedback_reports
  set status = v_status, last_activity_at = greatest(last_activity_at, now())
  where id = v_report_id
  returning * into v_report;

  return to_jsonb(v_report);
end;
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."change_feedback_report_status"(p_request jsonb) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.clear_text_block_audio(p_star_id uuid, p_block_index integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if p_block_index < 0 then
    raise exception 'p_block_index must be greater than or equal to zero';
  end if;

  update public.stars
  set texts = jsonb_set(
    texts,
    array[p_block_index::text],
    (texts -> p_block_index) - 'audio',
    false
  )
  where id = p_star_id
    and texts is not null
    and jsonb_typeof(texts) = 'array'
    and p_block_index < jsonb_array_length(texts);

  if not found then
    raise exception 'Star or block index not found for audio cleanup';
  end if;
end;
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."clear_text_block_audio"(p_star_id uuid, p_block_index integer) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.count_comments_upvotes(comments)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
  SELECT COUNT(*) 
  FROM users_upvoted_comments AS UPC
  WHERE UPC.comment_id = $1.id
  GROUP BY UPC.id;
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."count_comments_upvotes"(comments) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.count_planet_completions(planet_row planets)
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
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."count_planet_completions"(planet_row planets) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.count_star_unlocks(star_row stars)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
  SELECT COUNT(*)
  FROM public.users_unlocked_stars
  WHERE star_id = star_row.id;
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."count_star_unlocks"(star_row stars) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.count_unread_user_feedback_reports(p_author_id character varying)
 RETURNS bigint
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select count(*)
  from public.feedback_reports r
  where r.user_id = p_author_id
    and r.last_admin_message_at is not null
    and (r.author_read_at is null or r.last_admin_message_at > r.author_read_at);
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."count_unread_user_feedback_reports"(p_author_id character varying) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.count_user_completed_challenges(user_row users)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
  SELECT count(*) 
  FROM users_completed_challenges
  WHERE user_id = user_row.id; -- Ajuste se a FK não for 'user_id'
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."count_user_completed_challenges"(user_row users) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.count_user_unlocked_achievements(user_row users)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
  SELECT count(*) 
  FROM users_unlocked_achievements
  WHERE user_id = user_row.id; -- Ajuste se a FK não for 'user_id'
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."count_user_unlocked_achievements"(user_row users) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.count_user_unlocked_stars(user_row users)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
  SELECT count(*) 
  FROM users_unlocked_stars
  WHERE user_id = user_row.id; -- Ajuste se a FK não for 'user_id'
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."count_user_unlocked_stars"(user_row users) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.count_users_at_planet(planet_row planets)
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
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."count_users_at_planet"(planet_row planets) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.count_users_at_star(star_row stars)
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
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."count_users_at_star"(star_row stars) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE PROCEDURE public.delete_inactive_users()
 LANGUAGE plpgsql
AS $procedure$
begin

  delete from auth.users where last_sign_in_at is null;

end;
$procedure$;

--> statement-breakpoint

ALTER PROCEDURE "public"."delete_inactive_users"() OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.delete_public_user(userid character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  --  delete from auth.users where id = userId;
   delete from public.users where id = userId;
end;
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."delete_public_user"(userid character varying) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.deleteuser(userid uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
   delete from auth.users where id = userId;
   delete from public.users where id = userId;
end;
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."deleteuser"(userid uuid) OWNER TO "postgres";

--> statement-breakpoint
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
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."filter_challenges"(userid text, status text, difficulty text) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.filter_challenges(userid uuid, status text, difficulty text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  select * from challenges;
end;
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."filter_challenges"(userid uuid, status text, difficulty text) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.get_last_user_unlocked_star_id(user_row users)
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
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."get_last_user_unlocked_star_id"(user_row users) OWNER TO "postgres";

--> statement-breakpoint
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
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."insert_initial_data"() OWNER TO "postgres";

--> statement-breakpoint
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
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."insert_user_initial_data"() OWNER TO "postgres";

--> statement-breakpoint
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
$procedure$;

--> statement-breakpoint

ALTER PROCEDURE "public"."insertchallengestopics"() OWNER TO "postgres";

--> statement-breakpoint
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
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."install_available_extensions_and_test"() OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.list_challenges(p_title text DEFAULT ''::text, p_difficulty text DEFAULT 'all'::text, p_categories_ids uuid[] DEFAULT '{}'::uuid[], p_completion_status text DEFAULT 'all'::text, p_completed_challenges_ids uuid[] DEFAULT '{}'::uuid[], p_account_id text DEFAULT NULL::text, p_user_id text DEFAULT NULL::text, p_should_include_star_challenges boolean DEFAULT false, p_should_include_private_challenges boolean DEFAULT false, p_should_include_only_author boolean DEFAULT false, p_is_new_status text DEFAULT 'all'::text, p_page integer DEFAULT 1, p_items_per_page integer DEFAULT 10, p_upvotes_count_order text DEFAULT 'all'::text, p_downvote_count_order text DEFAULT 'all'::text, p_completion_count_order text DEFAULT 'all'::text, p_posting_order text DEFAULT 'all'::text)
 RETURNS TABLE(title text, difficulty_level text, created_at timestamp with time zone, id uuid, star_id uuid, initial_code text, texts jsonb, function_name text, test_cases jsonb, slug text, user_id text, description text, is_public boolean, is_new boolean, is_evaluated_by_function boolean, author_id text, author_name text, author_slug text, author_avatar_name text, author_avatar_image text, upvotes_count bigint, downvotes_count bigint, total_completitions bigint, categories json[], total_count bigint)
 LANGUAGE plpgsql
 STABLE
AS $function$
begin
  return query
  with filtered as (
    select
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
      cv.is_evaluated_by_function,
      cv.author_id::text,
      cv.author_name::text,
      cv.author_slug::text,
      cv.author_avatar_name::text,
      cv.author_avatar_image::text,
      cv.upvotes_count,
      cv.downvotes_count,
      cv.total_completitions,
      cv.categories
    from challenges_view cv
    where
      (p_should_include_star_challenges or cv.star_id is null)
      and (
        not p_should_include_only_author
        or (p_user_id is not null and cv.user_id = p_user_id)
      )
      and (p_title = '' or cv.title ilike '%' || p_title || '%')
      and (
        p_difficulty = 'all'
        or cv.difficulty_level = p_difficulty
      )
      and (
        p_is_new_status = 'all'
        or (p_is_new_status = 'new' and cv.is_new = true)
        or (p_is_new_status = 'old' and (cv.is_new is null or cv.is_new = false))
      )
      and (
        array_length(p_categories_ids, 1) is null
        or exists (
          select 1 from challenges_categories cc
          where cc.challenge_id = cv.id
            and cc.category_id = any(p_categories_ids)
        )
      )
      and (
        p_should_include_private_challenges
        or (p_account_id is not null and cv.author_id = p_account_id)
        or cv.is_public = true
      )
      and (
        p_completion_status = 'all'
        or (
          p_completion_status = 'completed'
          and cv.id = any(p_completed_challenges_ids)
        )
        or (
          p_completion_status = 'not-completed'
          and not (cv.id = any(p_completed_challenges_ids))
        )
      )
    order by
      cv.difficulty_level asc,
      case when p_posting_order = 'ascending' then cv.created_at end asc,
      case when p_posting_order = 'descending' then cv.created_at end desc,
      case when p_upvotes_count_order = 'ascending' then cv.upvotes_count end asc,
      case when p_upvotes_count_order = 'descending' then cv.upvotes_count end desc,
      case when p_downvote_count_order = 'ascending' then cv.downvotes_count end asc,
      case when p_downvote_count_order = 'descending' then cv.downvotes_count end desc,
      case when p_completion_count_order = 'ascending' then cv.total_completitions end asc,
      case when p_completion_count_order = 'descending' then cv.total_completitions end desc
  ),
  counted as (
    select *, count(*) over() as _total from filtered
  )
  select
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
    c.is_evaluated_by_function,
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
  from counted c
  limit p_items_per_page
  offset (p_page - 1) * p_items_per_page;
end;
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."list_challenges"(p_title text, p_difficulty text, p_categories_ids uuid[], p_completion_status text, p_completed_challenges_ids uuid[], p_account_id text, p_user_id text, p_should_include_star_challenges boolean, p_should_include_private_challenges boolean, p_should_include_only_author boolean, p_is_new_status text, p_page integer, p_items_per_page integer, p_upvotes_count_order text, p_downvote_count_order text, p_completion_count_order text, p_posting_order text) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.list_feedback_reports(p_search text DEFAULT NULL::text, p_intent feedback_intent DEFAULT NULL::feedback_intent, p_status text DEFAULT NULL::text, p_created_at_start timestamp with time zone DEFAULT NULL::timestamp with time zone, p_created_at_end timestamp with time zone DEFAULT NULL::timestamp with time zone, p_page integer DEFAULT 1, p_items_per_page integer DEFAULT 20)
 RETURNS TABLE(id uuid, content text, screenshot text, intent feedback_intent, user_id character varying, title character varying, status text, created_at timestamp with time zone, last_activity_at timestamp with time zone, last_user_message_at timestamp with time zone, studio_read_at timestamp with time zone, admin_message_count bigint, total_count bigint, is_unread boolean, author_name text, author_email text, author_slug text, preview text, avatar_name text, avatar_image text, summary_total bigint, summary_open bigint, summary_closed bigint, summary_unread bigint)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with filtered as (
    select r.*, u.name as author_name, u.email as author_email, u.slug as author_slug,
      a.name as avatar_name, a.image as avatar_image,
      count(m.id) filter (where m.author_role = 'admin') as admin_count,
      (r.last_user_message_at is not null and
       (r.studio_read_at is null or r.last_user_message_at > r.studio_read_at)) as unread
    from public.feedback_reports r
    join public.users u on u.id = r.user_id
    left join public.avatars a on a.id = u.avatar_id
    left join public.feedback_messages m on m.report_id = r.id
    where (p_search is null or r.id::text ilike '%' || p_search || '%'
      or exists (select 1 from public.users u where u.id = r.user_id and u.email ilike '%' || p_search || '%'))
      and (p_intent is null or r.intent = p_intent)
      and (p_status is null or r.status = p_status)
      and (p_created_at_start is null or r.created_at >= p_created_at_start)
      and (p_created_at_end is null or r.created_at <= p_created_at_end)
    group by r.id, u.name, u.email, u.slug, a.name, a.image
  ),
  paged as (
    select *
    from filtered
    order by unread desc, last_activity_at desc, id desc
    offset greatest(p_page - 1, 0) * p_items_per_page
    limit greatest(p_items_per_page, 1)
  ),
  summary as (
    select
      (select count(*) from public.feedback_reports) as summary_total,
      (select count(*) from public.feedback_reports where status = 'open') as summary_open,
      (select count(*) from public.feedback_reports where status = 'closed') as summary_closed,
      (select count(*) from public.feedback_reports where last_user_message_at is not null
        and (studio_read_at is null or last_user_message_at > studio_read_at)) as summary_unread,
      (select count(*) from filtered) as filtered_total
  )
  select id, content, screenshot, intent, user_id, title, status, created_at,
    last_activity_at, last_user_message_at, studio_read_at, admin_count,
    summary.filtered_total, unread,
    author_name, author_email, author_slug, avatar_name, avatar_image,
    coalesce((select left(most_recent.content, 160) from public.feedback_messages most_recent
      where most_recent.report_id = id order by most_recent.created_at desc, most_recent.id desc limit 1),
      left(content, 160)),
    summary.summary_total, summary.summary_open, summary.summary_closed,
    summary.summary_unread
  from paged cross join summary
  union all
  select null::uuid, null::text, null::text, null::public.feedback_intent,
    null::varchar, null::varchar, null::text, null::timestamptz,
    null::timestamptz, null::timestamptz, null::timestamptz, 0::bigint,
    summary.filtered_total, false, null::text, null::text, null::text,
    null::text, null::text, null::text, summary.summary_total, summary.summary_open,
    summary.summary_closed, summary.summary_unread
  from summary
  where not exists (select 1 from paged);
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."list_feedback_reports"(p_search text, p_intent feedback_intent, p_status text, p_created_at_start timestamp with time zone, p_created_at_end timestamp with time zone, p_page integer, p_items_per_page integer) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.list_user_feedback_reports(p_author_id character varying, p_status text DEFAULT NULL::text, p_page integer DEFAULT 1, p_items_per_page integer DEFAULT 10)
 RETURNS TABLE(id uuid, content text, screenshot text, intent feedback_intent, user_id character varying, title character varying, status text, created_at timestamp with time zone, last_activity_at timestamp with time zone, last_user_message_at timestamp with time zone, studio_read_at timestamp with time zone, last_admin_message_at timestamp with time zone, author_read_at timestamp with time zone, admin_message_count bigint, is_unread boolean, preview text, total_count bigint, author_name character varying, author_email character varying, author_slug text, avatar_name text, avatar_image text)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with filtered as (
    select
      r.*,
      u.name as author_name,
      u.email as author_email,
      u.slug as author_slug,
      a.name as avatar_name,
      a.image as avatar_image,
      (
        select count(*)
        from public.feedback_messages m
        where m.report_id = r.id and m.author_role = 'admin'
      ) as admin_count,
      (
        r.last_admin_message_at is not null
        and (r.author_read_at is null or r.last_admin_message_at > r.author_read_at)
      ) as unread,
      coalesce(
        (
          select left(m.content, 160)
          from public.feedback_messages m
          where m.report_id = r.id
          order by m.created_at desc, m.id desc
          limit 1
        ),
        left(r.content, 160)
      ) as report_preview
    from public.feedback_reports r
    join public.users u on u.id = r.user_id
    left join public.avatars a on a.id = u.avatar_id
    where r.user_id = p_author_id
      and (p_status is null or r.status = p_status)
  ), counted as (
    select filtered.*, count(*) over () as total
    from filtered
  )
  select
    id,
    content,
    screenshot,
    intent,
    user_id,
    title,
    status,
    created_at,
    last_activity_at,
    last_user_message_at,
    studio_read_at,
    last_admin_message_at,
    author_read_at,
    admin_count,
    unread,
    report_preview,
    total,
    author_name,
    author_email,
    author_slug,
    avatar_name,
    avatar_image
  from counted
  order by unread desc, last_activity_at desc, id desc
  offset greatest(p_page - 1, 0) * least(greatest(p_items_per_page, 1), 10)
  limit least(greatest(p_items_per_page, 1), 10);
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."list_user_feedback_reports"(p_author_id character varying, p_status text, p_page integer, p_items_per_page integer) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.mark_user_feedback_report_read(p_report_id uuid, p_author_id character varying, p_last_seen_admin_message_at timestamp with time zone)
 RETURNS void
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
  update public.feedback_reports r
  set author_read_at = greatest(coalesce(r.author_read_at, '-infinity'::timestamptz), p_last_seen_admin_message_at)
  where r.id = p_report_id
    and r.user_id = p_author_id
    and r.last_admin_message_at is not null
    and p_last_seen_admin_message_at <= r.last_admin_message_at;
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."mark_user_feedback_report_read"(p_report_id uuid, p_author_id character varying, p_last_seen_admin_message_at timestamp with time zone) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.olamundo()
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
 msg varchar =  'Olá, Mundo!';
BEGIN
	RETURN msg;
END;
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."olamundo"() OWNER TO "postgres";

--> statement-breakpoint
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
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."resetstreak"() OWNER TO "postgres";

--> statement-breakpoint
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
$procedure$;

--> statement-breakpoint

ALTER PROCEDURE "public"."setwinners"() OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.slugify(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
begin
  return trim(both '-' from regexp_replace(lower(unaccent(name)), '[^a-z0-9\\-_]+', '-', 'gi'));
end;
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."slugify"(name text) OWNER TO "postgres";

--> statement-breakpoint
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
$procedure$;

--> statement-breakpoint

ALTER PROCEDURE "public"."slugify_entities_name"() OWNER TO "postgres";

--> statement-breakpoint
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
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."teste"() OWNER TO "postgres";

--> statement-breakpoint
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
$procedure$;

--> statement-breakpoint

ALTER PROCEDURE "public"."testranking"() OWNER TO "postgres";

--> statement-breakpoint
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
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."update_last_week_ranking_positions"() OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.update_text_block_audio(p_star_id uuid, p_block_index integer, p_audio jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if p_block_index < 0 then
    raise exception 'p_block_index must be greater than or equal to zero';
  end if;

  update public.stars
  set texts = jsonb_set(texts, array[p_block_index::text, 'audio'], p_audio, true)
  where id = p_star_id
    and texts is not null
    and jsonb_typeof(texts) = 'array'
    and p_block_index < jsonb_array_length(texts);

  if not found then
    raise exception 'Star or block index not found for audio update';
  end if;
end;
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."update_text_block_audio"(p_star_id uuid, p_block_index integer, p_audio jsonb) OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.update_user_email(new_email text, user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
   update auth.users set email = new_email where id = user_id;
   update public.users set email = new_email where id = user_id::uuid::varchar;
end;
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."update_user_email"(new_email text, user_id uuid) OWNER TO "postgres";

--> statement-breakpoint
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
$procedure$;

--> statement-breakpoint

ALTER PROCEDURE "public"."updateranking"() OWNER TO "postgres";

--> statement-breakpoint
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
$procedure$;

--> statement-breakpoint

ALTER PROCEDURE "public"."updateranking_"() OWNER TO "postgres";

--> statement-breakpoint
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
$procedure$;

--> statement-breakpoint

ALTER PROCEDURE "public"."updateuserspositions"() OWNER TO "postgres";

--> statement-breakpoint
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
$procedure$;

--> statement-breakpoint

ALTER PROCEDURE "public"."updatewinners"() OWNER TO "postgres";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.verify_user_space_completion(user_row users)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
  SELECT 
    (SELECT count(*) FROM users_unlocked_stars WHERE user_id = user_row.id) 
    = 
    (SELECT count(*) FROM stars);
$function$;

--> statement-breakpoint

ALTER FUNCTION "public"."verify_user_space_completion"(user_row users) OWNER TO "postgres";

--> statement-breakpoint

SET check_function_bodies = true;

--> statement-breakpoint

CREATE VIEW "public"."challenges_view" AS  SELECT c.title,
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
    c.is_evaluated_by_function,
    u.id AS author_id,
    u.name AS author_name,
    u.slug AS author_slug,
    a.name AS author_avatar_name,
    a.image AS author_avatar_image,
    count(DISTINCT
        CASE
            WHEN uvc.vote = 'upvote'::challenge_vote THEN 1
            ELSE NULL::integer
        END) AS upvotes_count,
    count(DISTINCT
        CASE
            WHEN uvc.vote = 'downvote'::challenge_vote THEN 1
            ELSE NULL::integer
        END) AS downvotes_count,
    count(DISTINCT ucc.challenge_id) AS total_completitions,
    ARRAY( SELECT json_build_object('id', category.id, 'name', category.name) AS json_build_object
           FROM ( SELECT DISTINCT ccc2.id,
                    ccc2.name
                   FROM challenges_categories cc2
                     JOIN categories ccc2 ON ccc2.id = cc2.category_id
                  WHERE cc2.challenge_id = c.id
                  ORDER BY ccc2.name) category) AS categories,
    c.official_solution
   FROM challenges c
     LEFT JOIN users u ON u.id::text = c.user_id::text
     LEFT JOIN users_challenge_votes uvc ON uvc.challenge_id = c.id
     LEFT JOIN users_completed_challenges ucc ON ucc.challenge_id = c.id
     LEFT JOIN avatars a ON a.id = u.avatar_id
  GROUP BY c.id, u.id, a.name, a.image;

--> statement-breakpoint

ALTER VIEW "public"."challenges_view" OWNER TO "postgres";

--> statement-breakpoint

CREATE VIEW "public"."comments_view" AS  SELECT c.id,
    c.content,
    c.created_at,
    c.parent_comment_id,
    c.user_id AS author_id,
    COALESCE(( SELECT count(users_upvoted_comments.comment_id) AS count
           FROM users_upvoted_comments
          WHERE users_upvoted_comments.comment_id = c.id), 0::bigint) AS upvotes_count,
    COALESCE(( SELECT count(comments.id) AS count
           FROM comments
          WHERE comments.parent_comment_id = c.id), 0::bigint) AS replies_count,
    u.name AS author_name,
    u.slug AS author_slug,
    a.name AS author_avatar_name,
    a.image AS author_avatar_image
   FROM comments c
     LEFT JOIN users u ON u.id::text = c.user_id::text
     LEFT JOIN avatars a ON a.id = u.avatar_id
  GROUP BY c.id, u.id, a.name, a.image;

--> statement-breakpoint

ALTER VIEW "public"."comments_view" OWNER TO "postgres";

--> statement-breakpoint

CREATE VIEW "public"."planets_view" AS  WITH planet_star_counts AS (
         SELECT stars.planet_id,
            count(stars.id) AS total_stars
           FROM stars
          GROUP BY stars.planet_id
        ), user_planet_progress AS (
         SELECT s.planet_id,
            uus.user_id,
            count(uus.star_id) AS unlocked_stars_count
           FROM users_unlocked_stars uus
             JOIN stars s ON uus.star_id = s.id
          GROUP BY s.planet_id, uus.user_id
        ), completed_planets_counts AS (
         SELECT upp.planet_id,
            count(upp.user_id) AS completion_count
           FROM user_planet_progress upp
             JOIN planet_star_counts psc ON upp.planet_id = psc.planet_id
          WHERE upp.unlocked_stars_count = psc.total_stars
          GROUP BY upp.planet_id
        )
 SELECT p.id,
    p.name,
    p.image,
    p.icon,
    p."position",
    p.is_available,
    COALESCE(cpc.completion_count, 0::bigint) AS completions_count
   FROM planets p
     LEFT JOIN completed_planets_counts cpc ON p.id = cpc.planet_id;

--> statement-breakpoint

ALTER VIEW "public"."planets_view" OWNER TO "postgres";

--> statement-breakpoint

CREATE VIEW "public"."snippets_view" AS  SELECT s.id,
    s.title,
    s.code,
    s.is_public,
    s.created_at,
    s.user_id AS author_id,
    u.name AS author_name,
    u.slug AS author_slug,
    a.name AS author_avatar_name,
    a.image AS author_avatar_image
   FROM snippets s
     LEFT JOIN users u ON u.id::text = s.user_id::text
     LEFT JOIN avatars a ON a.id = u.avatar_id
  GROUP BY s.id, u.id, a.name, a.image;

--> statement-breakpoint

ALTER VIEW "public"."snippets_view" OWNER TO "postgres";

--> statement-breakpoint

CREATE VIEW "public"."solutions_view" AS  SELECT s.id,
    s.title,
    s.content,
    s.slug,
    s.views_count,
    s.challenge_id,
    s.created_at,
    s.user_id AS author_id,
    COALESCE(( SELECT count(users_upvoted_solutions.solution_id) AS count
           FROM users_upvoted_solutions
          WHERE users_upvoted_solutions.solution_id = s.id), 0::bigint) AS upvotes_count,
    COALESCE(( SELECT count(solutions_comments.solution_id) AS count
           FROM solutions_comments
          WHERE solutions_comments.solution_id = s.id), 0::bigint) AS comments_count,
    u.name AS author_name,
    u.slug AS author_slug,
    a.name AS author_avatar_name,
    a.image AS author_avatar_image
   FROM solutions s
     LEFT JOIN users u ON u.id::text = s.user_id::text
     LEFT JOIN avatars a ON a.id = u.avatar_id
  GROUP BY s.id, u.id, a.name, a.image;

--> statement-breakpoint

ALTER VIEW "public"."solutions_view" OWNER TO "postgres";

--> statement-breakpoint

CREATE VIEW "public"."users_completed_planets_view" AS  WITH unlocked_stars_by_planet AS (
         SELECT p.id AS planet_id,
            p.name AS planet_name,
            count(DISTINCT uus.star_id) AS unlocked_stars_count,
            uus.user_id
           FROM users_unlocked_stars uus
             JOIN stars s ON uus.star_id = s.id
             JOIN planets p ON s.planet_id = p.id
          GROUP BY p.id, p.name, p."position", uus.user_id
          ORDER BY p."position"
        ), all_stars_by_planet AS (
         SELECT p.id AS planet_id,
            p.name AS planet_name,
            count(s.id) AS stars_count
           FROM planets p
             JOIN stars s ON s.planet_id = p.id
          GROUP BY p.id, p.name, p."position"
          ORDER BY p."position"
        )
 SELECT u.id AS user_id,
    asbp.planet_id
   FROM unlocked_stars_by_planet usbp
     JOIN all_stars_by_planet asbp ON usbp.planet_id = asbp.planet_id
     JOIN users u ON u.id::text = usbp.user_id::text
  WHERE usbp.unlocked_stars_count >= asbp.stars_count AND usbp.user_id::text = u.id::text;

--> statement-breakpoint

ALTER VIEW "public"."users_completed_planets_view" OWNER TO "postgres";

--> statement-breakpoint

CREATE VIEW "public"."users_view" AS  WITH unlocked_stars_by_planet AS (
         SELECT p.id AS planet_id,
            p.name AS planet_name,
            count(DISTINCT uus_1.star_id) AS unlocked_stars_count,
            uus_1.user_id
           FROM users_unlocked_stars uus_1
             JOIN stars s ON uus_1.star_id = s.id
             JOIN planets p ON s.planet_id = p.id
          GROUP BY p.id, p.name, p."position", uus_1.user_id
          ORDER BY p."position"
        ), all_stars_by_planet AS (
         SELECT p.id AS planet_id,
            p.name AS planet_name,
            count(s.id) AS stars_count
           FROM planets p
             JOIN stars s ON s.planet_id = p.id
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
           FROM unlocked_stars_by_planet usbp
             JOIN all_stars_by_planet asbp ON usbp.planet_id = asbp.planet_id
          WHERE usbp.unlocked_stars_count >= asbp.stars_count AND usbp.user_id::text = u.id::text) AS completed_planets_ids
   FROM users u
     LEFT JOIN users_unlocked_stars uus ON uus.user_id::text = u.id::text
     LEFT JOIN users_unlocked_achievements uua ON uua.user_id::text = u.id::text
     LEFT JOIN users_rescuable_achievements ura ON ura.user_id::text = u.id::text
     LEFT JOIN users_completed_challenges ucc ON ucc.user_id::text = u.id::text
     LEFT JOIN users_acquired_rockets uar ON uar.user_id::text = u.id::text
     LEFT JOIN users_acquired_avatars uaa ON uaa.user_id::text = u.id::text
     LEFT JOIN users_upvoted_comments uuc ON uuc.user_id::text = u.id::text
     LEFT JOIN users_upvoted_solutions uuso ON uuso.user_id::text = u.id::text
  GROUP BY u.id;

--> statement-breakpoint

ALTER VIEW "public"."users_view" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."achievements" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."achievements" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."achievements" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."api_keys" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."api_keys" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."api_keys" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."avatars" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."avatars" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."avatars" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."categories" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."categories" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."categories" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."challenge_code_executions" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."challenge_code_executions" ENABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."challenge_code_executions" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."challenge_sources" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."challenge_sources" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."challenge_sources" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."challenges" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."challenges" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."challenges" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."challenges_categories" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."challenges_categories" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."challenges_categories" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."challenges_comments" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."challenges_comments" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."challenges_comments" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."chat_messages" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."chat_messages" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."chat_messages" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."chats" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."chats" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."chats" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."comments" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."comments" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."comments" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."feedback_message_attachments" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."feedback_message_attachments" ENABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."feedback_message_attachments" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."feedback_messages" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."feedback_messages" ENABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."feedback_messages" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."feedback_reports" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."feedback_reports" ENABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."feedback_reports" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."guides" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."guides" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."guides" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."insignias" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."insignias" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."insignias" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."notes" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."notes" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."notes" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."planets" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."planets" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."planets" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."questions" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."questions" ENABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."questions" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."ranking_users" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."ranking_users" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."ranking_users" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."rockets" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."rockets" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."rockets" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."snippets" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."snippets" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."snippets" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."solutions" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."solutions" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."solutions" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."solutions_comments" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."solutions_comments" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."solutions_comments" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."stars" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."stars" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."stars" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."tiers" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."tiers" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."tiers" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."users" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_acquired_avatars" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."users_acquired_avatars" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_acquired_avatars" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_acquired_insignias" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."users_acquired_insignias" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_acquired_insignias" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_acquired_rockets" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."users_acquired_rockets" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_acquired_rockets" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_challenge_votes" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."users_challenge_votes" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_challenge_votes" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_completed_challenges" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."users_completed_challenges" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_completed_challenges" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_recently_unlocked_stars" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."users_recently_unlocked_stars" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_recently_unlocked_stars" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_rescuable_achievements" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."users_rescuable_achievements" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_rescuable_achievements" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_unlocked_achievements" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."users_unlocked_achievements" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_unlocked_achievements" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_unlocked_stars" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."users_unlocked_stars" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_unlocked_stars" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_upvoted_comments" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."users_upvoted_comments" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_upvoted_comments" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_upvoted_solutions" OWNER TO "postgres";

--> statement-breakpoint

ALTER TABLE "public"."users_upvoted_solutions" DISABLE ROW LEVEL SECURITY;

--> statement-breakpoint

ALTER TABLE "public"."users_upvoted_solutions" NO FORCE ROW LEVEL SECURITY;

--> statement-breakpoint

CREATE POLICY "enable achivements" ON "public"."achievements" AS PERMISSIVE FOR ALL TO PUBLIC USING (true);

--> statement-breakpoint

CREATE POLICY "Only authenticated users can access avatars" ON "public"."avatars" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);

--> statement-breakpoint

CREATE POLICY "Only authenticated users can access categories" ON "public"."categories" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);

--> statement-breakpoint

CREATE POLICY "Users can insert own challenge code executions" ON "public"."challenge_code_executions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((auth.uid())::text = user_id));

--> statement-breakpoint

CREATE POLICY "Users can select own challenge code executions" ON "public"."challenge_code_executions" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((auth.uid())::text = user_id));

--> statement-breakpoint

CREATE POLICY "Only authenticated users can access challenges" ON "public"."challenges" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);

--> statement-breakpoint

CREATE POLICY "Only authenticated users can access challenges categories" ON "public"."challenges_categories" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);

--> statement-breakpoint

CREATE POLICY "authenticated" ON "public"."challenges_comments" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);

--> statement-breakpoint

CREATE POLICY "Only authenticated users can access codes" ON "public"."comments" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);

--> statement-breakpoint

CREATE POLICY "feedback_message_attachments_author_insert" ON "public"."feedback_message_attachments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM (feedback_messages m
     JOIN feedback_reports r ON ((r.id = m.report_id)))
  WHERE ((m.id = feedback_message_attachments.message_id) AND (m.author_role = 'user'::text) AND ((m.author_id)::text = (auth.uid())::text) AND ((auth.uid())::text = (r.user_id)::text)))));

--> statement-breakpoint

CREATE POLICY "feedback_message_attachments_author_select" ON "public"."feedback_message_attachments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM (feedback_messages m
     JOIN feedback_reports r ON ((r.id = m.report_id)))
  WHERE ((m.id = feedback_message_attachments.message_id) AND ((auth.uid())::text = (r.user_id)::text)))));

--> statement-breakpoint

CREATE POLICY "feedback_message_attachments_author_update" ON "public"."feedback_message_attachments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM (feedback_messages m
     JOIN feedback_reports r ON ((r.id = m.report_id)))
  WHERE ((m.id = feedback_message_attachments.message_id) AND (m.author_role = 'user'::text) AND ((m.author_id)::text = (auth.uid())::text) AND ((auth.uid())::text = (r.user_id)::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM (feedback_messages m
     JOIN feedback_reports r ON ((r.id = m.report_id)))
  WHERE ((m.id = feedback_message_attachments.message_id) AND (m.author_role = 'user'::text) AND ((m.author_id)::text = (auth.uid())::text) AND ((auth.uid())::text = (r.user_id)::text)))));

--> statement-breakpoint

CREATE POLICY "feedback_messages_author_insert" ON "public"."feedback_messages" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((author_role = 'user'::text) AND ((author_id)::text = (auth.uid())::text) AND (EXISTS ( SELECT 1
   FROM feedback_reports r
  WHERE ((r.id = feedback_messages.report_id) AND ((auth.uid())::text = (r.user_id)::text))))));

--> statement-breakpoint

CREATE POLICY "feedback_messages_author_select" ON "public"."feedback_messages" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM feedback_reports r
  WHERE ((r.id = feedback_messages.report_id) AND ((auth.uid())::text = (r.user_id)::text)))));

--> statement-breakpoint

CREATE POLICY "feedback_messages_author_update" ON "public"."feedback_messages" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((author_role = 'user'::text) AND ((author_id)::text = (auth.uid())::text) AND (EXISTS ( SELECT 1
   FROM feedback_reports r
  WHERE ((r.id = feedback_messages.report_id) AND ((auth.uid())::text = (r.user_id)::text)))))) WITH CHECK (((author_role = 'user'::text) AND ((author_id)::text = (auth.uid())::text) AND (EXISTS ( SELECT 1
   FROM feedback_reports r
  WHERE ((r.id = feedback_messages.report_id) AND ((auth.uid())::text = (r.user_id)::text))))));

--> statement-breakpoint

CREATE POLICY "feedback_reports_author_insert" ON "public"."feedback_reports" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((auth.uid())::text = (user_id)::text));

--> statement-breakpoint

CREATE POLICY "feedback_reports_author_select" ON "public"."feedback_reports" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((auth.uid())::text = (user_id)::text));

--> statement-breakpoint

CREATE POLICY "feedback_reports_author_update" ON "public"."feedback_reports" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((auth.uid())::text = (user_id)::text)) WITH CHECK (((auth.uid())::text = (user_id)::text));

--> statement-breakpoint

CREATE POLICY "Only authenticated users can access dictionary topics" ON "public"."guides" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);

--> statement-breakpoint

CREATE POLICY "Only authenticated users can access planets" ON "public"."planets" AS PERMISSIVE FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

--> statement-breakpoint

CREATE POLICY "Only authenticated users can access questions" ON "public"."questions" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);

--> statement-breakpoint

CREATE POLICY "Only authenticated users can access rockets" ON "public"."rockets" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);

--> statement-breakpoint

CREATE POLICY "Only authenticated users can access playgrounds" ON "public"."snippets" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);

--> statement-breakpoint

CREATE POLICY "Authorization" ON "public"."solutions" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);

--> statement-breakpoint

CREATE POLICY "Only authenticated users can access stars" ON "public"."stars" AS PERMISSIVE FOR SELECT TO PUBLIC USING (true);

--> statement-breakpoint

CREATE POLICY "Only authenticated users can access rankings" ON "public"."tiers" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);

--> statement-breakpoint

CREATE POLICY "Enable read access for all users" ON "storage"."objects" AS PERMISSIVE FOR SELECT TO PUBLIC USING (true);

--> statement-breakpoint

CREATE POLICY "Give users access to own folder 1ffg0oo_1" ON "storage"."objects" AS PERMISSIVE FOR INSERT TO PUBLIC WITH CHECK (true);

--> statement-breakpoint

CREATE POLICY "Give users access to own folder 1ffg0oo_2" ON "storage"."objects" AS PERMISSIVE FOR DELETE TO PUBLIC USING (true);

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."change_feedback_report_status"(p_request jsonb) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."clear_text_block_audio"(p_star_id uuid, p_block_index integer) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."count_comments_upvotes"(comments) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."count_planet_completions"(planet_row planets) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."count_star_unlocks"(star_row stars) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."count_unread_user_feedback_reports"(p_author_id character varying) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."count_user_completed_challenges"(user_row users) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."count_user_unlocked_achievements"(user_row users) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."count_user_unlocked_stars"(user_row users) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."count_users_at_planet"(planet_row planets) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."count_users_at_star"(star_row stars) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."delete_inactive_users"() FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."delete_public_user"(userid character varying) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."deleteuser"(userid uuid) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."filter_challenges"(userid text, status text, difficulty text) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."filter_challenges"(userid uuid, status text, difficulty text) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."get_last_user_unlocked_star_id"(user_row users) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."insert_initial_data"() FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."insert_user_initial_data"() FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."insertchallengestopics"() FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."install_available_extensions_and_test"() FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."list_challenges"(p_title text, p_difficulty text, p_categories_ids uuid[], p_completion_status text, p_completed_challenges_ids uuid[], p_account_id text, p_user_id text, p_should_include_star_challenges boolean, p_should_include_private_challenges boolean, p_should_include_only_author boolean, p_is_new_status text, p_page integer, p_items_per_page integer, p_upvotes_count_order text, p_downvote_count_order text, p_completion_count_order text, p_posting_order text) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."list_feedback_reports"(p_search text, p_intent feedback_intent, p_status text, p_created_at_start timestamp with time zone, p_created_at_end timestamp with time zone, p_page integer, p_items_per_page integer) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."list_user_feedback_reports"(p_author_id character varying, p_status text, p_page integer, p_items_per_page integer) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."mark_user_feedback_report_read"(p_report_id uuid, p_author_id character varying, p_last_seen_admin_message_at timestamp with time zone) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."olamundo"() FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."resetstreak"() FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."setwinners"() FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."slugify"(name text) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."slugify_entities_name"() FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."teste"() FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."testranking"() FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."update_last_week_ranking_positions"() FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."update_text_block_audio"(p_star_id uuid, p_block_index integer, p_audio jsonb) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."update_user_email"(new_email text, user_id uuid) FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."updateranking"() FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."updateranking_"() FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."updateuserspositions"() FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."updatewinners"() FROM PUBLIC;

--> statement-breakpoint

REVOKE ALL ON ROUTINE "public"."verify_user_space_completion"(user_row users) FROM PUBLIC;

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."achievements" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."achievements" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."achievements" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."achievements" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."achievements" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."achievements" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."achievements" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."achievements" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."achievements" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."achievements" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."achievements" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."achievements" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."achievements" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."achievements" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."achievements" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."achievements" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."achievements" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."achievements" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."achievements" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."achievements" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."achievements" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."achievements" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."achievements" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."achievements" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."achievements" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."achievements" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."achievements" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."achievements" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."achievements" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."api_keys" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."api_keys" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."api_keys" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."api_keys" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."api_keys" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."api_keys" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."api_keys" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."api_keys" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."api_keys" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."api_keys" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."api_keys" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."api_keys" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."api_keys" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."api_keys" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."api_keys" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."api_keys" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."api_keys" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."api_keys" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."api_keys" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."api_keys" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."api_keys" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."api_keys" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."api_keys" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."api_keys" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."api_keys" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."api_keys" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."api_keys" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."api_keys" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."api_keys" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."avatars" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."avatars" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."avatars" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."avatars" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."avatars" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."avatars" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."avatars" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."avatars" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."avatars" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."avatars" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."avatars" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."avatars" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."avatars" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."avatars" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."avatars" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."avatars" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."avatars" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."avatars" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."avatars" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."avatars" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."avatars" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."avatars" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."avatars" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."avatars" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."avatars" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."avatars" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."avatars" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."avatars" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."avatars" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."categories" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."categories" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."categories" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."categories" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."categories" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."categories" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."categories" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."categories" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."categories" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."categories" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."categories" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."categories" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."categories" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."categories" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."categories" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."categories" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."categories" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."categories" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."categories" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."categories" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."categories" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."categories" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."categories" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."categories" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."categories" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."categories" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."categories" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."categories" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."categories" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenge_code_executions" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenge_code_executions" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenge_code_executions" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenge_code_executions" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenge_code_executions" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenge_code_executions" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenge_code_executions" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenge_code_executions" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenge_code_executions" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."challenge_code_executions" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenge_code_executions" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenge_code_executions" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenge_code_executions" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenge_code_executions" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenge_code_executions" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenge_code_executions" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenge_code_executions" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenge_code_executions" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenge_code_executions" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenge_code_executions" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenge_code_executions" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenge_code_executions" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenge_sources" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenge_sources" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenge_sources" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenge_sources" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenge_sources" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenge_sources" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenge_sources" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenge_sources" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenge_sources" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenge_sources" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenge_sources" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenge_sources" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenge_sources" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenge_sources" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenge_sources" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenge_sources" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."challenge_sources" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenge_sources" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenge_sources" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenge_sources" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenge_sources" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenge_sources" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenge_sources" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenge_sources" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenge_sources" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenge_sources" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenge_sources" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenge_sources" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenge_sources" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenges" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenges" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenges" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenges" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenges" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenges" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenges" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenges" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenges" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenges" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenges" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenges" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenges" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenges" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenges" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenges" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."challenges" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenges" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenges" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenges" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenges" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenges" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenges" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenges" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenges" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenges" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenges" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenges" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenges" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenges_categories" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenges_categories" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenges_categories" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenges_categories" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenges_categories" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenges_categories" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenges_categories" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenges_categories" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenges_categories" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenges_categories" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenges_categories" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenges_categories" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenges_categories" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenges_categories" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenges_categories" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenges_categories" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."challenges_categories" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenges_categories" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenges_categories" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenges_categories" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenges_categories" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenges_categories" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenges_categories" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenges_categories" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenges_categories" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenges_categories" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenges_categories" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenges_categories" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenges_categories" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenges_comments" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenges_comments" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenges_comments" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenges_comments" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenges_comments" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenges_comments" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenges_comments" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenges_comments" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenges_comments" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenges_comments" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenges_comments" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenges_comments" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenges_comments" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenges_comments" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenges_comments" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenges_comments" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."challenges_comments" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenges_comments" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenges_comments" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenges_comments" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenges_comments" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenges_comments" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenges_comments" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenges_comments" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenges_comments" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenges_comments" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenges_comments" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenges_comments" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenges_comments" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenges_view" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenges_view" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."challenges_view" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."challenges_view" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."challenges_view" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."challenges_view" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenges_view" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."challenges_view" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."challenges_view" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."challenges_view" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."challenges_view" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."chat_messages" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."chat_messages" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."chat_messages" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."chat_messages" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."chat_messages" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."chat_messages" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."chat_messages" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."chat_messages" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."chat_messages" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."chat_messages" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."chat_messages" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."chat_messages" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."chat_messages" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."chat_messages" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."chat_messages" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."chat_messages" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."chat_messages" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."chat_messages" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."chat_messages" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."chat_messages" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."chat_messages" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."chat_messages" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."chat_messages" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."chat_messages" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."chat_messages" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."chat_messages" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."chat_messages" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."chat_messages" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."chat_messages" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."chats" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."chats" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."chats" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."chats" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."chats" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."chats" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."chats" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."chats" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."chats" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."chats" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."chats" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."chats" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."chats" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."chats" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."chats" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."chats" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."chats" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."chats" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."chats" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."chats" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."chats" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."chats" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."chats" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."chats" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."chats" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."chats" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."chats" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."chats" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."chats" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."comments" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."comments" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."comments" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."comments" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."comments" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."comments" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."comments" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."comments" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."comments" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."comments" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."comments" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."comments" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."comments" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."comments" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."comments" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."comments" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."comments" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."comments" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."comments" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."comments" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."comments" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."comments" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."comments" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."comments" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."comments" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."comments" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."comments" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."comments" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."comments" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."comments_view" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."comments_view" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."comments_view" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."comments_view" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."comments_view" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."comments_view" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."comments_view" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."comments_view" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."comments_view" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."comments_view" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."comments_view" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."feedback_message_attachments" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."feedback_message_attachments" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."feedback_message_attachments" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."feedback_message_attachments" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."feedback_message_attachments" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."feedback_message_attachments" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."feedback_message_attachments" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."feedback_message_attachments" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."feedback_message_attachments" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."feedback_message_attachments" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."feedback_message_attachments" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."feedback_message_attachments" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."feedback_message_attachments" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."feedback_message_attachments" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."feedback_messages" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."feedback_messages" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."feedback_messages" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."feedback_messages" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."feedback_messages" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."feedback_messages" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."feedback_messages" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."feedback_messages" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."feedback_messages" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."feedback_messages" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."feedback_messages" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."feedback_messages" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."feedback_messages" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."feedback_messages" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."feedback_reports" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."feedback_reports" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."feedback_reports" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."feedback_reports" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."feedback_reports" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."feedback_reports" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."feedback_reports" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."feedback_reports" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."feedback_reports" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."feedback_reports" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."feedback_reports" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."feedback_reports" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."feedback_reports" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."feedback_reports" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."feedback_reports" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."feedback_reports" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."feedback_reports" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."feedback_reports" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."feedback_reports" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."feedback_reports" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."feedback_reports" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."feedback_reports" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."feedback_reports" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."feedback_reports" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."feedback_reports" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."feedback_reports" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."feedback_reports" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."feedback_reports" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."feedback_reports" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."guides" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."guides" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."guides" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."guides" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."guides" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."guides" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."guides" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."guides" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."guides" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."guides" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."guides" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."guides" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."guides" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."guides" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."guides" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."guides" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."guides" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."guides" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."guides" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."guides" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."guides" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."guides" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."guides" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."guides" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."guides" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."guides" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."guides" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."guides" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."guides" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."insignias" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."insignias" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."insignias" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."insignias" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."insignias" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."insignias" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."insignias" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."insignias" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."insignias" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."insignias" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."insignias" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."insignias" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."insignias" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."insignias" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."insignias" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."insignias" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."insignias" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."insignias" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."insignias" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."insignias" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."insignias" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."insignias" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."insignias" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."insignias" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."insignias" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."insignias" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."insignias" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."insignias" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."insignias" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."notes" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."notes" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."notes" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."notes" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."notes" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."notes" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."notes" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."notes" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."notes" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."notes" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."notes" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."notes" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."notes" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."notes" TO "service_role";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."notes" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."notes" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."notes" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."notes" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."notes" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."notes" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."planets" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."planets" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."planets" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."planets" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."planets" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."planets" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."planets" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."planets" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."planets" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."planets" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."planets" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."planets" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."planets" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."planets" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."planets" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."planets" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."planets" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."planets" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."planets" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."planets" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."planets" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."planets" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."planets" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."planets" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."planets" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."planets" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."planets" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."planets" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."planets" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."planets_view" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."planets_view" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."planets_view" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."planets_view" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."planets_view" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."planets_view" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."planets_view" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."planets_view" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."questions" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."questions" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."questions" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."questions" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."questions" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."questions" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."questions" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."questions" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."questions" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."questions" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."questions" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."questions" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."questions" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."questions" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."questions" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."questions" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."questions" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."questions" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."questions" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."questions" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."questions" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."questions" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."questions" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."questions" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."questions" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."questions" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."questions" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."questions" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."questions" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."ranking_users" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."ranking_users" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."ranking_users" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."ranking_users" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."ranking_users" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."ranking_users" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."ranking_users" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."ranking_users" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."ranking_users" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."ranking_users" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."ranking_users" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."ranking_users" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."ranking_users" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."ranking_users" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."ranking_users" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."ranking_users" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."ranking_users" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."ranking_users" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."ranking_users" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."ranking_users" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."ranking_users" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."ranking_users" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."ranking_users" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."ranking_users" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."ranking_users" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."ranking_users" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."ranking_users" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."ranking_users" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."ranking_users" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."rockets" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."rockets" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."rockets" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."rockets" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."rockets" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."rockets" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."rockets" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."rockets" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."rockets" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."rockets" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."rockets" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."rockets" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."rockets" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."rockets" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."rockets" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."rockets" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."rockets" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."rockets" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."rockets" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."rockets" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."rockets" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."rockets" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."rockets" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."rockets" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."rockets" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."rockets" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."rockets" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."rockets" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."rockets" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."snippets" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."snippets" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."snippets" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."snippets" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."snippets" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."snippets" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."snippets" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."snippets" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."snippets" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."snippets" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."snippets" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."snippets" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."snippets" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."snippets" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."snippets" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."snippets" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."snippets" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."snippets" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."snippets" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."snippets" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."snippets" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."snippets" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."snippets" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."snippets" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."snippets" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."snippets" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."snippets" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."snippets" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."snippets" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."snippets_view" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."snippets_view" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."snippets_view" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."snippets_view" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."snippets_view" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."snippets_view" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."snippets_view" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."snippets_view" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."solutions" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."solutions" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."solutions" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."solutions" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."solutions" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."solutions" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."solutions" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."solutions" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."solutions" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."solutions" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."solutions" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."solutions" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."solutions" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."solutions" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."solutions" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."solutions" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."solutions" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."solutions" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."solutions" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."solutions" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."solutions" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."solutions" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."solutions" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."solutions" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."solutions" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."solutions" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."solutions" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."solutions" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."solutions" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."solutions_comments" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."solutions_comments" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."solutions_comments" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."solutions_comments" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."solutions_comments" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."solutions_comments" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."solutions_comments" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."solutions_comments" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."solutions_comments" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."solutions_comments" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."solutions_comments" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."solutions_comments" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."solutions_comments" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."solutions_comments" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."solutions_comments" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."solutions_comments" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."solutions_comments" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."solutions_comments" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."solutions_comments" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."solutions_comments" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."solutions_comments" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."solutions_comments" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."solutions_comments" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."solutions_comments" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."solutions_comments" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."solutions_comments" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."solutions_comments" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."solutions_comments" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."solutions_comments" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."solutions_view" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."solutions_view" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."solutions_view" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."solutions_view" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."solutions_view" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."solutions_view" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."solutions_view" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."solutions_view" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."stars" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."stars" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."stars" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."stars" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."stars" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."stars" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."stars" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."stars" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."stars" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."stars" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."stars" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."stars" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."stars" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."stars" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."stars" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."stars" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."stars" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."stars" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."stars" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."stars" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."stars" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."stars" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."stars" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."stars" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."stars" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."stars" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."stars" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."stars" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."stars" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."tiers" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."tiers" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."tiers" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."tiers" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."tiers" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."tiers" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."tiers" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."tiers" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."tiers" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."tiers" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."tiers" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."tiers" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."tiers" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."tiers" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."tiers" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."tiers" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."tiers" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."tiers" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."tiers" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."tiers" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."tiers" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."tiers" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."tiers" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."tiers" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."tiers" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."tiers" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."tiers" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."tiers" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."tiers" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."users" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_acquired_avatars" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_acquired_avatars" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_acquired_avatars" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_acquired_avatars" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_acquired_avatars" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_acquired_avatars" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_acquired_avatars" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_acquired_avatars" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_acquired_avatars" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_acquired_avatars" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_acquired_avatars" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_acquired_avatars" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_acquired_avatars" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_acquired_avatars" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_acquired_avatars" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_acquired_avatars" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."users_acquired_avatars" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_acquired_avatars" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_acquired_avatars" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_acquired_avatars" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_acquired_avatars" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_acquired_avatars" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_acquired_avatars" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_acquired_avatars" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_acquired_avatars" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_acquired_avatars" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_acquired_avatars" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_acquired_avatars" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_acquired_avatars" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_acquired_insignias" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_acquired_insignias" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_acquired_insignias" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_acquired_insignias" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_acquired_insignias" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_acquired_insignias" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_acquired_insignias" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_acquired_insignias" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_acquired_insignias" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_acquired_insignias" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_acquired_insignias" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_acquired_insignias" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_acquired_insignias" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_acquired_insignias" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_acquired_insignias" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_acquired_insignias" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."users_acquired_insignias" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_acquired_insignias" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_acquired_insignias" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_acquired_insignias" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_acquired_insignias" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_acquired_insignias" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_acquired_insignias" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_acquired_insignias" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_acquired_insignias" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_acquired_insignias" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_acquired_insignias" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_acquired_insignias" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_acquired_insignias" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_acquired_rockets" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_acquired_rockets" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_acquired_rockets" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_acquired_rockets" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_acquired_rockets" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_acquired_rockets" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_acquired_rockets" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_acquired_rockets" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_acquired_rockets" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_acquired_rockets" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_acquired_rockets" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_acquired_rockets" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_acquired_rockets" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_acquired_rockets" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_acquired_rockets" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_acquired_rockets" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."users_acquired_rockets" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_acquired_rockets" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_acquired_rockets" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_acquired_rockets" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_acquired_rockets" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_acquired_rockets" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_acquired_rockets" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_acquired_rockets" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_acquired_rockets" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_acquired_rockets" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_acquired_rockets" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_acquired_rockets" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_acquired_rockets" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_challenge_votes" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_challenge_votes" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_challenge_votes" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_challenge_votes" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_challenge_votes" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_challenge_votes" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_challenge_votes" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_challenge_votes" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_challenge_votes" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_challenge_votes" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_challenge_votes" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_challenge_votes" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_challenge_votes" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_challenge_votes" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_challenge_votes" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_challenge_votes" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."users_challenge_votes" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_challenge_votes" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_challenge_votes" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_challenge_votes" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_challenge_votes" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_challenge_votes" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_challenge_votes" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_challenge_votes" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_challenge_votes" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_challenge_votes" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_challenge_votes" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_challenge_votes" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_challenge_votes" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_completed_challenges" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_completed_challenges" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_completed_challenges" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_completed_challenges" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_completed_challenges" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_completed_challenges" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_completed_challenges" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_completed_challenges" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_completed_challenges" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_completed_challenges" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_completed_challenges" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_completed_challenges" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_completed_challenges" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_completed_challenges" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_completed_challenges" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_completed_challenges" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."users_completed_challenges" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_completed_challenges" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_completed_challenges" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_completed_challenges" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_completed_challenges" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_completed_challenges" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_completed_challenges" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_completed_challenges" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_completed_challenges" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_completed_challenges" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_completed_challenges" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_completed_challenges" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_completed_challenges" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_completed_planets_view" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_completed_planets_view" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_completed_planets_view" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_completed_planets_view" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."users_completed_planets_view" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_completed_planets_view" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_completed_planets_view" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_completed_planets_view" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_completed_planets_view" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_completed_planets_view" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_completed_planets_view" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_recently_unlocked_stars" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_recently_unlocked_stars" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_recently_unlocked_stars" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_recently_unlocked_stars" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_recently_unlocked_stars" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_recently_unlocked_stars" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_recently_unlocked_stars" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_recently_unlocked_stars" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_recently_unlocked_stars" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_recently_unlocked_stars" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_recently_unlocked_stars" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_recently_unlocked_stars" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_recently_unlocked_stars" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_recently_unlocked_stars" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_recently_unlocked_stars" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_recently_unlocked_stars" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."users_recently_unlocked_stars" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_recently_unlocked_stars" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_recently_unlocked_stars" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_recently_unlocked_stars" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_recently_unlocked_stars" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_recently_unlocked_stars" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_recently_unlocked_stars" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_recently_unlocked_stars" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_recently_unlocked_stars" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_recently_unlocked_stars" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_recently_unlocked_stars" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_recently_unlocked_stars" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_recently_unlocked_stars" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_rescuable_achievements" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_rescuable_achievements" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_rescuable_achievements" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_rescuable_achievements" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_rescuable_achievements" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_rescuable_achievements" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_rescuable_achievements" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_rescuable_achievements" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_rescuable_achievements" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_rescuable_achievements" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_rescuable_achievements" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_rescuable_achievements" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_rescuable_achievements" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_rescuable_achievements" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_rescuable_achievements" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_rescuable_achievements" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."users_rescuable_achievements" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_rescuable_achievements" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_rescuable_achievements" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_rescuable_achievements" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_rescuable_achievements" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_rescuable_achievements" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_rescuable_achievements" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_rescuable_achievements" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_rescuable_achievements" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_rescuable_achievements" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_rescuable_achievements" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_rescuable_achievements" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_rescuable_achievements" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_unlocked_achievements" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_unlocked_achievements" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_unlocked_achievements" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_unlocked_achievements" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_unlocked_achievements" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_unlocked_achievements" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_unlocked_achievements" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_unlocked_achievements" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_unlocked_achievements" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_unlocked_achievements" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_unlocked_achievements" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_unlocked_achievements" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_unlocked_achievements" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_unlocked_achievements" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_unlocked_achievements" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_unlocked_achievements" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."users_unlocked_achievements" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_unlocked_achievements" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_unlocked_achievements" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_unlocked_achievements" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_unlocked_achievements" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_unlocked_achievements" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_unlocked_achievements" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_unlocked_achievements" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_unlocked_achievements" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_unlocked_achievements" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_unlocked_achievements" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_unlocked_achievements" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_unlocked_achievements" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_unlocked_stars" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_unlocked_stars" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_unlocked_stars" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_unlocked_stars" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_unlocked_stars" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_unlocked_stars" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_unlocked_stars" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_unlocked_stars" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_unlocked_stars" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_unlocked_stars" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_unlocked_stars" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_unlocked_stars" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_unlocked_stars" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_unlocked_stars" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_unlocked_stars" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_unlocked_stars" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."users_unlocked_stars" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_unlocked_stars" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_unlocked_stars" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_unlocked_stars" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_unlocked_stars" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_unlocked_stars" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_unlocked_stars" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_unlocked_stars" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_unlocked_stars" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_unlocked_stars" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_unlocked_stars" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_unlocked_stars" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_unlocked_stars" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_upvoted_comments" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_upvoted_comments" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_upvoted_comments" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_upvoted_comments" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_upvoted_comments" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_upvoted_comments" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_upvoted_comments" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_upvoted_comments" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_upvoted_comments" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_upvoted_comments" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_upvoted_comments" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_upvoted_comments" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_upvoted_comments" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_upvoted_comments" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_upvoted_comments" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_upvoted_comments" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."users_upvoted_comments" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_upvoted_comments" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_upvoted_comments" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_upvoted_comments" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_upvoted_comments" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_upvoted_comments" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_upvoted_comments" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_upvoted_comments" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_upvoted_comments" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_upvoted_comments" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_upvoted_comments" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_upvoted_comments" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_upvoted_comments" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_upvoted_solutions" TO "anon";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_upvoted_solutions" TO "anon";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_upvoted_solutions" TO "anon";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_upvoted_solutions" TO "anon";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_upvoted_solutions" TO "anon";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_upvoted_solutions" TO "anon";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_upvoted_solutions" TO "anon";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_upvoted_solutions" TO "authenticated";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_upvoted_solutions" TO "authenticated";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_upvoted_solutions" TO "authenticated";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_upvoted_solutions" TO "authenticated";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_upvoted_solutions" TO "authenticated";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_upvoted_solutions" TO "authenticated";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_upvoted_solutions" TO "authenticated";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_upvoted_solutions" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_upvoted_solutions" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."users_upvoted_solutions" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_upvoted_solutions" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_upvoted_solutions" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_upvoted_solutions" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_upvoted_solutions" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_upvoted_solutions" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_upvoted_solutions" TO "service_role";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_upvoted_solutions" TO "service_role";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_upvoted_solutions" TO "service_role";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_upvoted_solutions" TO "service_role";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_upvoted_solutions" TO "service_role";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_upvoted_solutions" TO "service_role";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_upvoted_solutions" TO "service_role";

--> statement-breakpoint

GRANT DELETE ON TABLE "public"."users_view" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "public"."users_view" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "public"."users_view" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "public"."users_view" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "public"."users_view" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "public"."users_view" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "public"."users_view" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "public"."users_view" TO "postgres";

--> statement-breakpoint

GRANT DELETE ON TABLE "storage"."objects" TO "postgres";

--> statement-breakpoint

GRANT INSERT ON TABLE "storage"."objects" TO "postgres";

--> statement-breakpoint

GRANT MAINTAIN ON TABLE "storage"."objects" TO "postgres";

--> statement-breakpoint

GRANT REFERENCES ON TABLE "storage"."objects" TO "postgres";

--> statement-breakpoint

GRANT SELECT ON TABLE "storage"."objects" TO "postgres";

--> statement-breakpoint

GRANT TRIGGER ON TABLE "storage"."objects" TO "postgres";

--> statement-breakpoint

GRANT TRUNCATE ON TABLE "storage"."objects" TO "postgres";

--> statement-breakpoint

GRANT UPDATE ON TABLE "storage"."objects" TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."change_feedback_report_status"(p_request jsonb) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."change_feedback_report_status"(p_request jsonb) TO "anon";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."change_feedback_report_status"(p_request jsonb) TO "authenticated";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."change_feedback_report_status"(p_request jsonb) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."clear_text_block_audio"(p_star_id uuid, p_block_index integer) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."clear_text_block_audio"(p_star_id uuid, p_block_index integer) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."clear_text_block_audio"(p_star_id uuid, p_block_index integer) TO "service_role";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."count_comments_upvotes"(comments) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."count_comments_upvotes"(comments) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."count_planet_completions"(planet_row planets) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."count_planet_completions"(planet_row planets) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."count_star_unlocks"(star_row stars) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."count_star_unlocks"(star_row stars) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."count_unread_user_feedback_reports"(p_author_id character varying) TO "authenticated";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."count_unread_user_feedback_reports"(p_author_id character varying) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."count_user_completed_challenges"(user_row users) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."count_user_completed_challenges"(user_row users) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."count_user_unlocked_achievements"(user_row users) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."count_user_unlocked_achievements"(user_row users) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."count_user_unlocked_stars"(user_row users) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."count_user_unlocked_stars"(user_row users) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."count_users_at_planet"(planet_row planets) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."count_users_at_planet"(planet_row planets) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."count_users_at_star"(star_row stars) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."count_users_at_star"(star_row stars) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."delete_inactive_users"() TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."delete_inactive_users"() TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."delete_public_user"(userid character varying) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."delete_public_user"(userid character varying) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."deleteuser"(userid uuid) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."deleteuser"(userid uuid) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."filter_challenges"(userid text, status text, difficulty text) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."filter_challenges"(userid text, status text, difficulty text) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."filter_challenges"(userid uuid, status text, difficulty text) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."filter_challenges"(userid uuid, status text, difficulty text) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."get_last_user_unlocked_star_id"(user_row users) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."get_last_user_unlocked_star_id"(user_row users) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."insert_initial_data"() TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."insert_initial_data"() TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."insert_user_initial_data"() TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."insert_user_initial_data"() TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."insertchallengestopics"() TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."insertchallengestopics"() TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."install_available_extensions_and_test"() TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."install_available_extensions_and_test"() TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."list_challenges"(p_title text, p_difficulty text, p_categories_ids uuid[], p_completion_status text, p_completed_challenges_ids uuid[], p_account_id text, p_user_id text, p_should_include_star_challenges boolean, p_should_include_private_challenges boolean, p_should_include_only_author boolean, p_is_new_status text, p_page integer, p_items_per_page integer, p_upvotes_count_order text, p_downvote_count_order text, p_completion_count_order text, p_posting_order text) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."list_challenges"(p_title text, p_difficulty text, p_categories_ids uuid[], p_completion_status text, p_completed_challenges_ids uuid[], p_account_id text, p_user_id text, p_should_include_star_challenges boolean, p_should_include_private_challenges boolean, p_should_include_only_author boolean, p_is_new_status text, p_page integer, p_items_per_page integer, p_upvotes_count_order text, p_downvote_count_order text, p_completion_count_order text, p_posting_order text) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."list_feedback_reports"(p_search text, p_intent feedback_intent, p_status text, p_created_at_start timestamp with time zone, p_created_at_end timestamp with time zone, p_page integer, p_items_per_page integer) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."list_feedback_reports"(p_search text, p_intent feedback_intent, p_status text, p_created_at_start timestamp with time zone, p_created_at_end timestamp with time zone, p_page integer, p_items_per_page integer) TO "anon";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."list_feedback_reports"(p_search text, p_intent feedback_intent, p_status text, p_created_at_start timestamp with time zone, p_created_at_end timestamp with time zone, p_page integer, p_items_per_page integer) TO "authenticated";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."list_feedback_reports"(p_search text, p_intent feedback_intent, p_status text, p_created_at_start timestamp with time zone, p_created_at_end timestamp with time zone, p_page integer, p_items_per_page integer) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."list_user_feedback_reports"(p_author_id character varying, p_status text, p_page integer, p_items_per_page integer) TO "authenticated";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."list_user_feedback_reports"(p_author_id character varying, p_status text, p_page integer, p_items_per_page integer) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."mark_user_feedback_report_read"(p_report_id uuid, p_author_id character varying, p_last_seen_admin_message_at timestamp with time zone) TO "authenticated";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."mark_user_feedback_report_read"(p_report_id uuid, p_author_id character varying, p_last_seen_admin_message_at timestamp with time zone) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."olamundo"() TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."olamundo"() TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."resetstreak"() TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."resetstreak"() TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."setwinners"() TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."setwinners"() TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."slugify"(name text) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."slugify"(name text) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."slugify_entities_name"() TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."slugify_entities_name"() TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."teste"() TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."teste"() TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."testranking"() TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."testranking"() TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."update_last_week_ranking_positions"() TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."update_last_week_ranking_positions"() TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."update_text_block_audio"(p_star_id uuid, p_block_index integer, p_audio jsonb) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."update_text_block_audio"(p_star_id uuid, p_block_index integer, p_audio jsonb) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."update_text_block_audio"(p_star_id uuid, p_block_index integer, p_audio jsonb) TO "service_role";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."update_user_email"(new_email text, user_id uuid) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."update_user_email"(new_email text, user_id uuid) TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."updateranking"() TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."updateranking"() TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."updateranking_"() TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."updateranking_"() TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."updateuserspositions"() TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."updateuserspositions"() TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."updatewinners"() TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."updatewinners"() TO "postgres";

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."verify_user_space_completion"(user_row users) TO PUBLIC;

--> statement-breakpoint

GRANT EXECUTE ON ROUTINE "public"."verify_user_space_completion"(user_row users) TO "postgres";
