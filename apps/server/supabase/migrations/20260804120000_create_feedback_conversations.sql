-- Feedback conversations are an additive extension of feedback_reports.
-- The migration deliberately keeps the existing report row as the first
-- message: old content and screenshots remain in their original columns.

alter table public.feedback_reports
  add column if not exists title varchar(60),
  add column if not exists status text,
  add column if not exists last_activity_at timestamptz,
  add column if not exists last_user_message_at timestamptz,
  add column if not exists studio_read_at timestamptz;

update public.feedback_reports
set
  title = left(regexp_replace(trim(content), '\\s+', ' ', 'g'), 60),
  status = coalesce(status, 'open'),
  last_activity_at = coalesce(last_activity_at, created_at)
where title is null or status is null or last_activity_at is null;

alter table public.feedback_reports
  alter column title set not null,
  alter column title set default '',
  alter column status set not null,
  alter column status set default 'open',
  alter column last_activity_at set not null;

do $$ begin
  alter table public.feedback_reports add constraint feedback_reports_title_length_check
    check (char_length(title) between 1 and 60);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.feedback_reports add constraint feedback_reports_status_check
    check (status in ('open', 'closed'));
exception when duplicate_object then null;
end $$;

create table if not exists public.feedback_messages (
  id uuid primary key,
  report_id uuid not null references public.feedback_reports(id) on delete cascade,
  author_role text not null check (author_role in ('user', 'admin')),
  author_id character varying not null,
  content text not null check (char_length(trim(content)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create table if not exists public.feedback_message_attachments (
  id uuid primary key,
  message_id uuid not null references public.feedback_messages(id) on delete cascade,
  storage_key text not null unique,
  original_name text not null,
  mime_type text not null check (mime_type in ('image/png', 'image/jpeg')),
  size bigint not null check (size between 1 and 10485760),
  position smallint not null check (position between 0 and 2),
  unique (message_id, position)
);

create index if not exists feedback_reports_queue_idx
  on public.feedback_reports (status, last_activity_at desc, id desc);
create index if not exists feedback_reports_unread_idx
  on public.feedback_reports (last_user_message_at, studio_read_at);
create index if not exists feedback_reports_user_idx
  on public.feedback_reports (user_id);
create index if not exists feedback_messages_report_idx
  on public.feedback_messages (report_id, created_at, id);
create index if not exists feedback_message_attachments_message_idx
  on public.feedback_message_attachments (message_id, position);

-- This function is intentionally SECURITY INVOKER. The service-role adapter
-- remains the only caller and the function never bypasses table privileges.
drop function if exists public.list_feedback_reports(text, public.feedback_intent, text, timestamptz, timestamptz, integer, integer);
create or replace function public.list_feedback_reports(
  p_search text default null,
  p_intent public.feedback_intent default null,
  p_status text default null,
  p_created_at_start timestamptz default null,
  p_created_at_end timestamptz default null,
  p_page integer default 1,
  p_items_per_page integer default 20
)
returns table (
  id uuid, content text, screenshot text, intent public.feedback_intent,
  user_id varchar, title varchar, status text, created_at timestamptz,
  last_activity_at timestamptz, last_user_message_at timestamptz,
  studio_read_at timestamptz, admin_message_count bigint, total_count bigint,
  is_unread boolean, author_name text, author_email text, author_slug text,
  preview text,
  avatar_name text, avatar_image text, summary_total bigint, summary_open bigint,
  summary_closed bigint, summary_unread bigint
)
language sql stable security invoker set search_path = public
as $$
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
$$;

create or replace function public.change_feedback_report_status(p_request jsonb)
returns jsonb
language plpgsql volatile security invoker set search_path = public
as $$
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
$$;

-- Reporting uses the public Supabase client without RLS or service_role.
-- API authorization remains enforced by the Server boundary.
grant select, insert, update on table
  public.feedback_reports,
  public.feedback_messages,
  public.feedback_message_attachments
to anon, authenticated;

grant execute on function public.list_feedback_reports(
  text, public.feedback_intent, text, timestamptz, timestamptz, integer, integer
) to anon, authenticated;
grant execute on function public.change_feedback_report_status(jsonb)
  to anon, authenticated;
