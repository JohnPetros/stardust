-- Include the owning user in the authenticated feedback history RPC.
-- feedback_reports.user_id has a foreign key to users.id, so an inner join is
-- intentional: every history row must carry the user metadata consumed by the
-- SupabaseFeedbackReportMapper.

drop function if exists public.list_user_feedback_reports(varchar, text, integer, integer);

create function public.list_user_feedback_reports(
  p_author_id varchar,
  p_status text default null,
  p_page integer default 1,
  p_items_per_page integer default 10
)
returns table (
  id uuid,
  content text,
  screenshot text,
  intent public.feedback_intent,
  user_id varchar,
  title varchar,
  status text,
  created_at timestamptz,
  last_activity_at timestamptz,
  last_user_message_at timestamptz,
  studio_read_at timestamptz,
  last_admin_message_at timestamptz,
  author_read_at timestamptz,
  admin_message_count bigint,
  is_unread boolean,
  preview text,
  total_count bigint,
  author_name varchar,
  author_email varchar,
  author_slug text,
  avatar_name text,
  avatar_image text
)
language sql
stable
security invoker
set search_path = public
as $$
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
$$;

grant execute on function public.list_user_feedback_reports(varchar, text, integer, integer)
  to authenticated;

revoke execute on function public.list_user_feedback_reports(varchar, text, integer, integer)
  from public, anon;
