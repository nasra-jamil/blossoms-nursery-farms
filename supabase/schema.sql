-- Blossoms Nursery Farm — catalogue schema
-- Run once in Supabase: SQL Editor → New query → paste → Run.
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT).

-- ── Categories ──────────────────────────────────────────────────────────────
create table if not exists public.categories (
  slug        text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name        text not null,
  description text not null default '',
  image       jsonb not null default '{"src":"","alt":""}'::jsonb,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Plants ──────────────────────────────────────────────────────────────────
create table if not exists public.plants (
  id             text primary key,
  slug           text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name           text not null,
  botanical_name text not null default '',
  -- Renaming a category's slug moves its plants; a category with plants can't be deleted.
  category       text not null references public.categories (slug) on update cascade on delete restrict,
  price          integer not null check (price >= 0),
  description    text not null,
  details        text not null,
  images         jsonb not null default '[]'::jsonb,
  availability   text not null check (availability in ('in-stock', 'low-stock', 'out-of-stock')),
  sunlight       text not null,
  watering       text not null,
  maintenance    text not null check (maintenance in ('Easy', 'Moderate', 'Expert')),
  size           text not null,
  placement      text[] not null default '{}',
  care           text[] not null default '{}',
  featured       boolean not null default false,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists plants_category_idx on public.plants (category);
create index if not exists plants_sort_idx on public.plants (sort_order);

-- Keep updated_at current.
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists plants_touch on public.plants;
create trigger plants_touch before update on public.plants
  for each row execute function public.touch_updated_at();

drop trigger if exists categories_touch on public.categories;
create trigger categories_touch before update on public.categories
  for each row execute function public.touch_updated_at();

-- ── Security ────────────────────────────────────────────────────────────────
-- Row Level Security ON with no policies = the public API keys can't read or
-- write these tables. Only the website's server (using the secret /
-- service_role key) can, so all edits go through the password-protected admin.
alter table public.categories enable row level security;
alter table public.plants enable row level security;

-- Newer Supabase projects don't expose SQL-created tables to the API
-- automatically, so grant access explicitly — to the server's secret-key
-- role only. The public anon/publishable roles get nothing.
grant usage on schema public to service_role;
grant select, insert, update, delete on table public.plants, public.categories to service_role;

-- ── Photo storage ───────────────────────────────────────────────────────────
-- Public bucket: anyone can VIEW images by URL; only the server can upload.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('plant-images', 'plant-images', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
