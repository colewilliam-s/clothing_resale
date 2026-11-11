-- listings_migration.sql (trimmed to what is actually missing)
-- The listings table already has: seller_id/image_url columns, status default 'active',
-- and RLS policies ("Sellers manage their own listings", "Signed-in users can view listings").
-- Run in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- Safe to re-run. Does not drop or recreate the table, so no data is lost.

-- ============================================================
-- 1. TABLE CHANGES
-- ============================================================
-- Optional fields the form asks for. Skip these two lines if you remove
-- brand/color from the form and from toRow() in the api file.
alter table public.listings add column if not exists brand text;
alter table public.listings add column if not exists color text;

create index if not exists listings_seller_id_idx on public.listings (seller_id);
create index if not exists listings_created_at_idx on public.listings (created_at desc);

-- ============================================================
-- 2. STORAGE BUCKET FOR LISTING PHOTOS
-- ============================================================
-- Only an "avatars" bucket exists today, so this adds a separate one.
-- The name must match BUCKET in the api file.
insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do nothing;

-- Files are stored at "<user id>/<timestamp>.jpg", so the first folder name
-- must equal the signed-in user's id.
drop policy if exists "Users can upload their own listing photos" on storage.objects;
create policy "Users can upload their own listing photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Users can delete their own listing photos" on storage.objects;
create policy "Users can delete their own listing photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );