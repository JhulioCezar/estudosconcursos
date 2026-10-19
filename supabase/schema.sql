create table if not exists public.student_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{"history":[],"wrong":[],"checks":{}}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint progress_object check (jsonb_typeof(progress) = 'object'),
  constraint progress_size check (octet_length(progress::text) <= 2000000)
);
alter table public.student_progress enable row level security;
revoke all on public.student_progress from anon;
grant select, insert, update on public.student_progress to authenticated;
create policy "Students read own progress" on public.student_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Students insert own progress" on public.student_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Students update own progress" on public.student_progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
