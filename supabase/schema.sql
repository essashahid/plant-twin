-- PlantTwin database schema
-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
-- It creates all tables, indexes, and a permissive policy set suitable for the
-- current demo (anonymous demo user). Tighten RLS before any real launch.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. plants
-- ---------------------------------------------------------------------------
create table if not exists plants (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 text not null,
  name                    text,
  type                    text not null default 'Chilli Plant',
  location_type           text,
  city                    text,
  estimated_age_weeks      integer,
  planted_date            date,
  pot_size                text,
  drainage_holes          boolean,
  soil_type               text,
  soil_condition          text,
  compost_added_recently  boolean,
  sunlight_hours          numeric,
  wind_exposure           text,
  shade_risk              text,
  temperature_feel        text,
  humidity                text,
  watering_frequency      text,
  last_watered            date,
  last_fertilizer_date    date,
  fertilizer_type         text,
  last_pesticide_date     date,
  notes                   text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists plants_user_id_idx on plants (user_id);

-- ---------------------------------------------------------------------------
-- 3. progress_updates  (created before plant_photos for the FK reference)
-- ---------------------------------------------------------------------------
create table if not exists progress_updates (
  id                      uuid primary key default gen_random_uuid(),
  plant_id                uuid not null references plants (id) on delete cascade,
  date                    date not null,
  notes                   text,
  soil_condition          text,
  watered_today           boolean not null default false,
  fertilized_today        boolean not null default false,
  compost_added_today     boolean not null default false,
  pesticide_applied_today boolean not null default false,
  visible_issue           text,
  overall_condition       text,
  health_score            integer,
  created_at              timestamptz not null default now()
);

create index if not exists progress_updates_plant_id_idx
  on progress_updates (plant_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 2. plant_photos
-- ---------------------------------------------------------------------------
create table if not exists plant_photos (
  id                  uuid primary key default gen_random_uuid(),
  plant_id            uuid not null references plants (id) on delete cascade,
  progress_update_id  uuid references progress_updates (id) on delete cascade,
  photo_type          text not null,        -- full_plant | leaf_closeup | soil | pot | growing_area
  image_url           text,                 -- Supabase Storage URL or data URL
  local_preview_url   text,
  created_at          timestamptz not null default now()
);

create index if not exists plant_photos_plant_id_idx on plant_photos (plant_id);
create index if not exists plant_photos_progress_idx on plant_photos (progress_update_id);

-- ---------------------------------------------------------------------------
-- 4. care_logs
-- ---------------------------------------------------------------------------
create table if not exists care_logs (
  id                  uuid primary key default gen_random_uuid(),
  plant_id            uuid not null references plants (id) on delete cascade,
  progress_update_id  uuid references progress_updates (id) on delete cascade,
  action_type         text not null,        -- watered | fertilized | compost_added | pesticide_applied | photo_uploaded | issue_reported | soil_checked
  action_date         date not null,
  notes               text,
  created_at          timestamptz not null default now()
);

create index if not exists care_logs_plant_id_idx on care_logs (plant_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 5. reminders
-- ---------------------------------------------------------------------------
create table if not exists reminders (
  id           uuid primary key default gen_random_uuid(),
  plant_id     uuid not null references plants (id) on delete cascade,
  title        text not null,
  description  text,
  due_date     date,
  status       text not null default 'pending',  -- pending | completed | dismissed
  source       text not null default 'rule_engine', -- setup | rule_engine | progress_update | manual
  priority     text not null default 'medium',    -- high | medium | low
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists reminders_plant_id_idx on reminders (plant_id, status);

-- ---------------------------------------------------------------------------
-- 6. generated_insights
-- ---------------------------------------------------------------------------
create table if not exists generated_insights (
  id                  uuid primary key default gen_random_uuid(),
  plant_id            uuid not null references plants (id) on delete cascade,
  progress_update_id  uuid references progress_updates (id) on delete cascade,
  health_score        integer,
  status              text,
  growth_stage        text,
  ideal_stage         text,
  confidence          text,
  main_issues         jsonb default '[]'::jsonb,
  recommended_actions jsonb default '[]'::jsonb,
  risk_levels         jsonb default '[]'::jsonb,
  actual_vs_ideal     jsonb default '[]'::jsonb,
  coach_message       text,
  created_at          timestamptz not null default now()
);

create index if not exists generated_insights_plant_id_idx
  on generated_insights (plant_id, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists plants_set_updated_at on plants;
create trigger plants_set_updated_at
  before update on plants
  for each row execute function set_updated_at();

drop trigger if exists reminders_set_updated_at on reminders;
create trigger reminders_set_updated_at
  before update on reminders
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Demo-friendly: anon key may read/write. The app scopes rows by user_id.
-- Replace these with auth.uid()-based policies once real auth is added.
-- ---------------------------------------------------------------------------
alter table plants              enable row level security;
alter table plant_photos        enable row level security;
alter table progress_updates    enable row level security;
alter table care_logs           enable row level security;
alter table reminders           enable row level security;
alter table generated_insights  enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'plants','plant_photos','progress_updates','care_logs','reminders','generated_insights'
  ]
  loop
    execute format('drop policy if exists demo_all on %I;', t);
    execute format(
      'create policy demo_all on %I for all to anon, authenticated using (true) with check (true);',
      t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Storage bucket for plant photos
-- Public bucket so uploaded images render via public URLs. The policies below
-- let the demo (anon key) read and upload. Tighten before a real launch.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('plant-photos', 'plant-photos', true)
on conflict (id) do nothing;

drop policy if exists plant_photos_read on storage.objects;
create policy plant_photos_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'plant-photos');

drop policy if exists plant_photos_insert on storage.objects;
create policy plant_photos_insert on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'plant-photos');

drop policy if exists plant_photos_update on storage.objects;
create policy plant_photos_update on storage.objects
  for update to anon, authenticated
  using (bucket_id = 'plant-photos');

drop policy if exists plant_photos_delete on storage.objects;
create policy plant_photos_delete on storage.objects
  for delete to anon, authenticated
  using (bucket_id = 'plant-photos');
