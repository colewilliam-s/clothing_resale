-- Profile details: major, class year, profile photo, and optional first/last name

alter table public.profiles
  add column major text check (char_length(major) <= 60),
  add column class_year smallint check (class_year between 1950 and 2100),
  add column avatar_url text,
  add constraint display_name_length check (char_length(display_name) <= 40);
-- First and last name live in their own table so the database can keep them private.
-- Row level security works per row, not per column, so if these were on profiles
-- anyone signed in could read them, even when the owner chose not to share.
create table public.profile_names (
  id uuid primary key references public.profiles(id) on delete cascade,
  first_name text check (char_length(first_name) <= 40),
  last_name text check (char_length(last_name) <= 40),
  show_full_name boolean not null default false
);
alter table public.profile_names enable row level security;
-- the owner can always see their own names, everyone else only if the owner shares them
create policy "Names are visible to the owner, or to everyone when shared"
  on public.profile_names for select to authenticated
  using (auth.uid() = id or show_full_name);
create policy "Users can add their own names"
  on public.profile_names for insert to authenticated
  with check (auth.uid() = id);
create policy "Users can update their own names"
  on public.profile_names for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);
-- Profile photos. Each user's photo is stored at avatars/<their user id>/avatar
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;
create policy "Signed-in users can view avatars"
  on storage.objects for select to authenticated
  using (bucket_id = 'avatars');
create policy "Users can upload their own avatar"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users can replace their own avatar"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users can delete their own avatar"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
