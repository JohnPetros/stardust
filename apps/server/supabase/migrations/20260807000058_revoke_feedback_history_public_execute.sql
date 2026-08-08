revoke execute on function public.list_user_feedback_reports(varchar, text, integer, integer)
  from public, anon;

revoke execute on function public.count_unread_user_feedback_reports(varchar)
  from public, anon;

revoke execute on function public.mark_user_feedback_report_read(uuid, varchar, timestamptz)
  from public, anon;
