-- Optional infrastructure only. Anonymous analysis never writes to this table.
create table if not exists public.saved_reports (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 redacted_report jsonb not null,
 created_at timestamptz not null default now(),
 expires_at timestamptz not null default (now() + interval '30 days')
);
alter table public.saved_reports enable row level security;
revoke all on public.saved_reports from anon;
grant select, insert, delete on public.saved_reports to authenticated;
create policy "Read own unexpired reports" on public.saved_reports for select to authenticated using (auth.uid() = user_id and expires_at > now());
create policy "Save own report" on public.saved_reports for insert to authenticated with check (auth.uid() = user_id and expires_at <= now() + interval '30 days');
create policy "Delete own reports" on public.saved_reports for delete to authenticated using (auth.uid() = user_id);
-- Schedule DELETE WHERE expires_at < now() before enabling account features.
