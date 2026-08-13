-- Add the authenticated user's feedback history without introducing a second
-- conversation aggregate or changing the existing administrative contract.

alter table public.feedback_reports
  add column if not exists last_admin_message_at timestamptz,
  add column if not exists author_read_at timestamptz;

alter table public.feedback_reports enable row level security;
alter table public.feedback_messages enable row level security;
alter table public.feedback_message_attachments enable row level security;

drop policy if exists feedback_reports_author_select on public.feedback_reports;
create policy feedback_reports_author_select on public.feedback_reports
  for select to authenticated
  using (auth.uid()::text = user_id);

drop policy if exists feedback_reports_author_insert on public.feedback_reports;
create policy feedback_reports_author_insert on public.feedback_reports
  for insert to authenticated
  with check (auth.uid()::text = user_id);

drop policy if exists feedback_reports_author_update on public.feedback_reports;
create policy feedback_reports_author_update on public.feedback_reports
  for update to authenticated
  using (auth.uid()::text = user_id)
  with check (auth.uid()::text = user_id);

drop policy if exists feedback_messages_author_select on public.feedback_messages;
create policy feedback_messages_author_select on public.feedback_messages
  for select to authenticated
  using (exists (
    select 1 from public.feedback_reports r
    where r.id = report_id and auth.uid()::text = r.user_id
  ));

drop policy if exists feedback_messages_author_insert on public.feedback_messages;
create policy feedback_messages_author_insert on public.feedback_messages
  for insert to authenticated
  with check (author_role = 'user' and author_id = auth.uid()::text and exists (
    select 1 from public.feedback_reports r
    where r.id = report_id and auth.uid()::text = r.user_id
  ));

drop policy if exists feedback_messages_author_update on public.feedback_messages;
create policy feedback_messages_author_update on public.feedback_messages
  for update to authenticated
  using (author_role = 'user' and author_id = auth.uid()::text and exists (
    select 1 from public.feedback_reports r
    where r.id = report_id and auth.uid()::text = r.user_id
  ))
  with check (author_role = 'user' and author_id = auth.uid()::text and exists (
    select 1 from public.feedback_reports r
    where r.id = report_id and auth.uid()::text = r.user_id
  ));

drop policy if exists feedback_message_attachments_author_select on public.feedback_message_attachments;
create policy feedback_message_attachments_author_select on public.feedback_message_attachments
  for select to authenticated
  using (exists (
    select 1
    from public.feedback_messages m
    join public.feedback_reports r on r.id = m.report_id
    where m.id = message_id and auth.uid()::text = r.user_id
  ));

drop policy if exists feedback_message_attachments_author_insert on public.feedback_message_attachments;
create policy feedback_message_attachments_author_insert on public.feedback_message_attachments
  for insert to authenticated
  with check (exists (
    select 1
    from public.feedback_messages m
    join public.feedback_reports r on r.id = m.report_id
    where m.id = message_id
      and m.author_role = 'user'
      and m.author_id = auth.uid()::text
      and auth.uid()::text = r.user_id
  ));

drop policy if exists feedback_message_attachments_author_update on public.feedback_message_attachments;
create policy feedback_message_attachments_author_update on public.feedback_message_attachments
  for update to authenticated
  using (exists (
    select 1
    from public.feedback_messages m
    join public.feedback_reports r on r.id = m.report_id
    where m.id = message_id
      and m.author_role = 'user'
      and m.author_id = auth.uid()::text
      and auth.uid()::text = r.user_id
  ))
  with check (exists (
    select 1
    from public.feedback_messages m
    join public.feedback_reports r on r.id = m.report_id
    where m.id = message_id
      and m.author_role = 'user'
      and m.author_id = auth.uid()::text
      and auth.uid()::text = r.user_id
  ));

update public.feedback_reports r
set last_admin_message_at = latest.created_at
from (
  select report_id, max(created_at) as created_at
  from public.feedback_messages
  where author_role = 'admin'
  group by report_id
) latest
where r.id = latest.report_id
  and r.last_admin_message_at is null;

create index if not exists feedback_reports_author_history_idx
  on public.feedback_reports (user_id, last_activity_at desc, id desc);

create index if not exists feedback_reports_author_unread_idx
  on public.feedback_reports (user_id, last_admin_message_at desc)
  where last_admin_message_at is not null
    and (author_read_at is null or last_admin_message_at > author_read_at);

create or replace function public.list_user_feedback_reports(
  p_author_id varchar,
  p_status text default null,
  p_page integer default 1,
  p_items_per_page integer default 10
)
returns table (
  id uuid, content text, screenshot text, intent public.feedback_intent,
  user_id varchar, title varchar, status text, created_at timestamptz,
  last_activity_at timestamptz, last_user_message_at timestamptz,
  studio_read_at timestamptz, last_admin_message_at timestamptz,
  author_read_at timestamptz, admin_message_count bigint, is_unread boolean,
  preview text, total_count bigint
)
language sql stable security invoker set search_path = public
as $$
  with filtered as (
    select r.*,
      (select count(*) from public.feedback_messages m
        where m.report_id = r.id and m.author_role = 'admin') as admin_count,
      (r.last_admin_message_at is not null and
        (r.author_read_at is null or r.last_admin_message_at > r.author_read_at)) as unread,
      coalesce((select left(m.content, 160) from public.feedback_messages m
        where m.report_id = r.id
        order by m.created_at desc, m.id desc limit 1), left(r.content, 160)) as report_preview
    from public.feedback_reports r
    where r.user_id = p_author_id
      and (p_status is null or r.status = p_status)
  ), counted as (
    select filtered.*, count(*) over () as total
    from filtered
  )
  select id, content, screenshot, intent, user_id, title, status, created_at,
    last_activity_at, last_user_message_at, studio_read_at,
    last_admin_message_at, author_read_at, admin_count, unread, report_preview,
    total
  from counted
  order by unread desc, last_activity_at desc, id desc
  offset greatest(p_page - 1, 0) * least(greatest(p_items_per_page, 1), 10)
  limit least(greatest(p_items_per_page, 1), 10);
$$;

create or replace function public.count_unread_user_feedback_reports(
  p_author_id varchar
)
returns bigint
language sql stable security invoker set search_path = public
as $$
  select count(*)
  from public.feedback_reports r
  where r.user_id = p_author_id
    and r.last_admin_message_at is not null
    and (r.author_read_at is null or r.last_admin_message_at > r.author_read_at);
$$;

create or replace function public.mark_user_feedback_report_read(
  p_report_id uuid,
  p_author_id varchar,
  p_last_seen_admin_message_at timestamptz
)
returns void
language sql volatile security invoker set search_path = public
as $$
  update public.feedback_reports r
  set author_read_at = greatest(coalesce(r.author_read_at, '-infinity'::timestamptz), p_last_seen_admin_message_at)
  where r.id = p_report_id
    and r.user_id = p_author_id
    and r.last_admin_message_at is not null
    and p_last_seen_admin_message_at <= r.last_admin_message_at;
$$;

grant execute on function public.list_user_feedback_reports(varchar, text, integer, integer)
  to authenticated;
grant execute on function public.count_unread_user_feedback_reports(varchar)
  to authenticated;
grant execute on function public.mark_user_feedback_report_read(uuid, varchar, timestamptz)
  to authenticated;

revoke execute on function public.list_user_feedback_reports(varchar, text, integer, integer)
  from public, anon;
revoke execute on function public.count_unread_user_feedback_reports(varchar)
  from public, anon;
revoke execute on function public.mark_user_feedback_report_read(uuid, varchar, timestamptz)
  from public, anon;
