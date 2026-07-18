create table if not exists public.challenge_code_executions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  challenge_id uuid not null,
  code text not null,
  status text not null,
  test_results jsonb not null default '[]'::jsonb,
  outputs jsonb not null default '[]'::jsonb,
  error jsonb,
  created_at timestamp with time zone not null default now(),
  constraint challenge_code_executions_status_check check (
    status in (
      'accepted',
      'wrong_answer',
      'syntax_error',
      'runtime_error',
      'internal_error'
    )
  ),
  constraint challenge_code_executions_user_id_fkey
    foreign key (user_id)
    references public.users(id)
    on delete cascade,
  constraint challenge_code_executions_challenge_id_fkey
    foreign key (challenge_id)
    references public.challenges(id)
    on delete cascade
);

create index if not exists challenge_code_executions_user_challenge_created_at_idx
on public.challenge_code_executions (user_id, challenge_id, created_at desc);

create index if not exists challenge_code_executions_user_challenge_status_idx
on public.challenge_code_executions (user_id, challenge_id, status);

alter table public.challenge_code_executions enable row level security;

drop policy if exists "Users can select own challenge code executions"
on public.challenge_code_executions;

create policy "Users can select own challenge code executions"
on public.challenge_code_executions
as permissive
for select
to authenticated
using (auth.uid()::text = user_id);

drop policy if exists "Users can insert own challenge code executions"
on public.challenge_code_executions;

create policy "Users can insert own challenge code executions"
on public.challenge_code_executions
as permissive
for insert
to authenticated
with check (auth.uid()::text = user_id);

grant delete on table public.challenge_code_executions to authenticated;
grant insert on table public.challenge_code_executions to authenticated;
grant references on table public.challenge_code_executions to authenticated;
grant select on table public.challenge_code_executions to authenticated;
grant trigger on table public.challenge_code_executions to authenticated;
grant truncate on table public.challenge_code_executions to authenticated;
grant update on table public.challenge_code_executions to authenticated;

grant delete on table public.challenge_code_executions to service_role;
grant insert on table public.challenge_code_executions to service_role;
grant references on table public.challenge_code_executions to service_role;
grant select on table public.challenge_code_executions to service_role;
grant trigger on table public.challenge_code_executions to service_role;
grant truncate on table public.challenge_code_executions to service_role;
grant update on table public.challenge_code_executions to service_role;
