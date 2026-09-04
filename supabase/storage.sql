-- LinkUp Supabase setup: `avatars` storage bucket + access policies.
-- Run once in the Supabase SQL editor (or `psql $DIRECT_URL -f supabase/storage.sql`).
-- Safe to re-run: bucket insert is a no-op on conflict and policies are recreated.
--
-- NOTE on auth model: the app signs its own JWTs and talks to storage with the
-- anon key (it does not use Supabase Auth), so `auth.uid()` is NULL here and
-- per-user RLS scoping is not enforceable at the storage layer. Writes are
-- therefore limited to image files on this bucket only. A production-hardened
-- setup would proxy uploads through the API (service_role key) and verify the
-- object path (`<userId>/avatar.<ext>`) against the request's JWT.

-- 1. Bucket (public so getPublicUrl() links resolve without a signed URL)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 2. Public read (avatars render in chat bubbles, profiles, DM lists)
drop policy if exists "avatars public read" on storage.objects;
create policy "avatars public read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'avatars');

-- 3. Image-only uploads (client uploads `<userId>/avatar.<ext>` with upsert)
drop policy if exists "avatars upload images" on storage.objects;
create policy "avatars upload images"
on storage.objects for insert
to anon, authenticated
with check (
  bucket_id = 'avatars'
  and storage.extension(name) in ('jpg', 'jpeg', 'png', 'gif', 'webp')
);

-- 4. Overwrite on re-upload (upsert: same path, e.g. png -> jpg leaves the
--    old object orphaned; harmless, or clean up with a scheduled job)
drop policy if exists "avatars overwrite images" on storage.objects;
create policy "avatars overwrite images"
on storage.objects for update
to anon, authenticated
using (
  bucket_id = 'avatars'
  and storage.extension(name) in ('jpg', 'jpeg', 'png', 'gif', 'webp')
)
with check (
  bucket_id = 'avatars'
  and storage.extension(name) in ('jpg', 'jpeg', 'png', 'gif', 'webp')
);
