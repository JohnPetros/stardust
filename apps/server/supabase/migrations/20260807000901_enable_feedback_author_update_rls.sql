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
