drop function if exists public.list_challenges(
  text,
  text,
  uuid[],
  text,
  uuid[],
  text,
  text,
  boolean,
  boolean,
  boolean,
  text,
  integer,
  integer,
  text,
  text,
  text,
  text
);

drop view if exists public.challenges_view;

create view public.challenges_view as
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
  u.id as author_id,
  u.name as author_name,
  u.slug as author_slug,
  a.name as author_avatar_name,
  a.image as author_avatar_image,
  count(
    distinct case
      when uvc.vote = 'upvote'::challenge_vote then 1
      else null::integer
    end
  ) as upvotes_count,
  count(
    distinct case
      when uvc.vote = 'downvote'::challenge_vote then 1
      else null::integer
    end
  ) as downvotes_count,
  count(distinct ucc.challenge_id) as total_completitions,
  array(
    select
      json_build_object('id', category.id, 'name', category.name)
    from (
      select distinct
        ccc2.id,
        ccc2.name
      from
        challenges_categories cc2
        join categories ccc2 on ccc2.id = cc2.category_id
      where
        cc2.challenge_id = c.id
      order by
        ccc2.name
    ) as category
  ) as categories
from
  challenges c
  left join users u on u.id::text = c.user_id
  left join users_challenge_votes uvc on uvc.challenge_id = c.id
  left join users_completed_challenges ucc on ucc.challenge_id = c.id
  left join avatars a on a.id = u.avatar_id
group by
  c.id,
  u.id,
  a.name,
  a.image;

create or replace function public.list_challenges(
  p_title text default ''::text,
  p_difficulty text default 'all'::text,
  p_categories_ids uuid[] default '{}'::uuid[],
  p_completion_status text default 'all'::text,
  p_completed_challenges_ids uuid[] default '{}'::uuid[],
  p_account_id text default null::text,
  p_user_id text default null::text,
  p_should_include_star_challenges boolean default false,
  p_should_include_private_challenges boolean default false,
  p_should_include_only_author boolean default false,
  p_is_new_status text default 'all'::text,
  p_page integer default 1,
  p_items_per_page integer default 10,
  p_upvotes_count_order text default 'all'::text,
  p_downvote_count_order text default 'all'::text,
  p_completion_count_order text default 'all'::text,
  p_posting_order text default 'all'::text
)
returns table(
  title text,
  difficulty_level text,
  created_at timestamp with time zone,
  id uuid,
  star_id uuid,
  initial_code text,
  texts jsonb,
  function_name text,
  test_cases jsonb,
  slug text,
  user_id text,
  description text,
  is_public boolean,
  is_new boolean,
  author_id text,
  author_name text,
  author_slug text,
  author_avatar_name text,
  author_avatar_image text,
  upvotes_count bigint,
  downvotes_count bigint,
  total_completitions bigint,
  categories json[],
  total_count bigint
)
language plpgsql
stable
as $function$
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
