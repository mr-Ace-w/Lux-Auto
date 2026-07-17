-- Lux Auto: execute this complete file once in Supabase Dashboard → SQL Editor.
-- It is safe to execute again: all objects use IF NOT EXISTS / CREATE OR REPLACE.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  brand text not null, model text not null,
  year integer not null check (year between 1900 and 2100),
  price integer not null check (price >= 0), mileage integer not null default 0 check (mileage >= 0),
  fuel text not null, engine text not null, transmission text not null,
  drive text, body_type text, short_description text, description text,
  features jsonb not null default '[]'::jsonb, details jsonb not null default '{}'::jsonb,
  is_top boolean not null default false, is_sold boolean not null default false,
  is_recommended boolean not null default false, is_hidden boolean not null default false,
  views bigint not null default 0 check (views >= 0),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists cars_catalog_sort on public.cars (is_hidden, is_top desc, created_at desc);

create table if not exists public.car_images (
  id uuid primary key default gen_random_uuid(), car_id uuid not null references public.cars(id) on delete cascade,
  url text not null, position integer not null check (position between 0 and 49), alt text,
  unique(car_id, position)
);
create index if not exists car_images_car_position on public.car_images(car_id, position);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists cars_set_updated_at on public.cars;
create trigger cars_set_updated_at before update on public.cars for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.profiles(id) values(new.id) on conflict (id) do nothing; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.profiles where id=auth.uid() and is_admin) $$;
create or replace function public.increment_car_views(car_id uuid) returns void language sql security definer set search_path=public as $$ update public.cars set views=views+1 where id=car_id and not is_hidden $$;
grant execute on function public.increment_car_views(uuid) to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.cars enable row level security;
alter table public.car_images enable row level security;
drop policy if exists "profile owner reads profile" on public.profiles;
drop policy if exists "public reads visible cars" on public.cars;
drop policy if exists "admins manage cars" on public.cars;
drop policy if exists "public reads car images" on public.car_images;
drop policy if exists "admins manage images" on public.car_images;
create policy "profile owner reads profile" on public.profiles for select using (id=auth.uid());
create policy "public reads visible cars" on public.cars for select using (not is_hidden or public.is_admin());
create policy "admins manage cars" on public.cars for all using (public.is_admin()) with check (public.is_admin());
create policy "public reads car images" on public.car_images for select using (true);
create policy "admins manage images" on public.car_images for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('car-images','car-images',true,10485760,array['image/webp']) on conflict (id) do update set public=true,file_size_limit=10485760,allowed_mime_types=array['image/webp'];
drop policy if exists "admins upload car photos" on storage.objects;
drop policy if exists "admins update car photos" on storage.objects;
drop policy if exists "admins delete car photos" on storage.objects;
create policy "admins upload car photos" on storage.objects for insert to authenticated with check (bucket_id='car-images' and public.is_admin());
create policy "admins update car photos" on storage.objects for update to authenticated using (bucket_id='car-images' and public.is_admin()) with check (bucket_id='car-images' and public.is_admin());
create policy "admins delete car photos" on storage.objects for delete to authenticated using (bucket_id='car-images' and public.is_admin());
