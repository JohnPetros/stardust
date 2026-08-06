grant select, insert, update on table
  public.feedback_reports,
  public.feedback_messages,
  public.feedback_message_attachments
to anon, authenticated;

grant execute on function public.list_feedback_reports(
  text, public.feedback_intent, text, timestamptz, timestamptz, integer, integer
) to anon, authenticated;

do $$
begin
  if to_regprocedure('public.change_feedback_report_status(jsonb)') is not null then
    grant execute on function public.change_feedback_report_status(jsonb)
      to anon, authenticated;
  end if;
end
$$;
