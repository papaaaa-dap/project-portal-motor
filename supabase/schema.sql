-- MotoKu Supabase Schema — MVP simplified from PRD 16
-- Run in Supabase SQL Editor

-- profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text check (role in ('user','admin')) default 'user',
  avatar_url text,
  created_at timestamptz default now()
);

-- categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  type text check (type in ('perawatan','edukasi')) not null,
  icon text,
  created_at timestamptz default now()
);

-- articles
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_url text,
  published boolean default true,
  created_at timestamptz default now()
);

-- workshops (maps_url preferred, lat/lng kept for map distance but optional)
create table if not exists workshops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  address text,
  kecamatan text,
  lat double precision,
  lng double precision,
  maps_url text,
  jam_operasional text,
  layanan text[],
  kontak text,
  foto_url text,
  rating numeric default 4.5,
  created_at timestamptz default now()
);
-- add maps_url if upgrading existing DB
alter table workshops add column if not exists maps_url text;

-- services
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

-- workshop_services
create table if not exists workshop_services (
  workshop_id uuid references workshops(id) on delete cascade,
  service_id uuid references services(id) on delete cascade,
  primary key (workshop_id, service_id)
);

-- motorcycles (N per user)
create table if not exists motorcycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  brand text not null,
  model text not null,
  year int,
  type text check (type in ('matic','manual','kopling')) not null,
  cc int,
  kilometer int default 0,
  last_service_date date,
  notes text,
  created_at timestamptz default now()
);

-- maintenance_rules (draft interval)
create table if not exists maintenance_rules (
  id uuid primary key default gen_random_uuid(),
  motor_type text check (motor_type in ('matic','manual','all')) not null,
  category text not null,
  interval_km int not null,
  interval_days int not null,
  title text not null,
  description text
);

-- maintenance_records
create table if not exists maintenance_records (
  id uuid primary key default gen_random_uuid(),
  motorcycle_id uuid references motorcycles(id) on delete cascade not null,
  service_type text,
  kilometer int,
  service_date date,
  cost int,
  notes text,
  next_service_km int,
  next_service_date date,
  created_at timestamptz default now()
);

-- bookmarks (artikel)
create table if not exists bookmarks (
  user_id uuid references auth.users(id) on delete cascade,
  article_id uuid references articles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, article_id)
);
-- bookmarks bengkel (workshop)
create table if not exists workshop_bookmarks (
  user_id uuid references auth.users(id) on delete cascade,
  workshop_id uuid references workshops(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, workshop_id)
);

-- motor_problems (merged emergency_guides)
create table if not exists motor_problems (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  gejala text[],
  penyebab text[],
  langkah text[],
  is_emergency boolean default false,
  category text,
  created_at timestamptz default now()
);

-- parts (oli & sparepart — mirrors src/lib/data/parts.ts)
create table if not exists parts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null check (category in ('oli-mesin','oli-gardan','oli-samping','cvt','ban','busi','filter-udara','rem','kampas-rem','aki','rantai','kelistrikan')),
  brand text not null,
  name text not null,
  harga_min int not null,
  harga_max int not null,
  satuan text,
  cover_url text,
  specs jsonb default '{}'::jsonb,
  keunggulan text[],
  cocok_motor text[],
  interval_km int,
  interval_bulan int,
  deskripsi text,
  bengkel_ids text[],
  created_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table categories enable row level security;
alter table articles enable row level security;
alter table workshops enable row level security;
alter table motor_problems enable row level security;
alter table maintenance_rules enable row level security;
alter table parts enable row level security;
alter table motorcycles enable row level security;
alter table maintenance_records enable row level security;
alter table bookmarks enable row level security;
alter table workshop_bookmarks enable row level security;

-- public read for catalog (idempotent)
drop policy if exists "public read categories" on categories;
drop policy if exists "public read articles" on articles;
drop policy if exists "public read workshops" on workshops;
drop policy if exists "public read problems" on motor_problems;
drop policy if exists "public read rules" on maintenance_rules;
drop policy if exists "public read parts" on parts;
create policy "public read categories" on categories for select using (true);
create policy "public read articles" on articles for select using (true);
create policy "public read workshops" on workshops for select using (true);
create policy "public read problems" on motor_problems for select using (true);
create policy "public read rules" on maintenance_rules for select using (true);
create policy "public read parts" on parts for select using (true);
-- admin write untuk katalog (via service_role bypass RLS; policy ini untuk admin via anon jika sudah login)
drop policy if exists "admin write parts" on parts;
create policy "admin write parts" on parts for all using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
) with check (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
drop policy if exists "admin write workshops" on workshops;
create policy "admin write workshops" on workshops for all using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
) with check (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
drop policy if exists "admin write articles" on articles;
create policy "admin write articles" on articles for all using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
) with check (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
drop policy if exists "admin write problems" on motor_problems;
create policy "admin write problems" on motor_problems for all using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
) with check (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
drop policy if exists "admin write categories" on categories;
create policy "admin write categories" on categories for all using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
) with check (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
drop policy if exists "admin write rules" on maintenance_rules;
create policy "admin write rules" on maintenance_rules for all using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
) with check (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- private per user (idempotent)
drop policy if exists "own motorcycles" on motorcycles;
drop policy if exists "own bookmarks" on bookmarks;
drop policy if exists "own workshop bookmarks" on workshop_bookmarks;
drop policy if exists "own records" on maintenance_records;
drop policy if exists "own profile" on profiles;
create policy "own motorcycles" on motorcycles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own bookmarks" on bookmarks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own workshop bookmarks" on workshop_bookmarks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own profile" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
-- maintenance_records via motorcycle ownership
create policy "own records" on maintenance_records for all using (
  exists (select 1 from motorcycles m where m.id = motorcycle_id and m.user_id = auth.uid())
) with check (
  exists (select 1 from motorcycles m where m.id = motorcycle_id and m.user_id = auth.uid())
);

-- storage bucket untuk cover/foto + policies (jalankan sekali di SQL Editor)
-- bucket public `covers` untuk foto part / bengkel / artikel
insert into storage.buckets (id, name, public) values ('covers','covers', true) on conflict (id) do nothing;
-- baca bebas (cover tampil publik tanpa login)
drop policy if exists "public read covers" on storage.objects;
create policy "public read covers" on storage.objects for select using (bucket_id = 'covers');
-- upload/update/hapus untuk user login (admin atur lewat role di app)
drop policy if exists "login write covers" on storage.objects;
create policy "login write covers" on storage.objects for insert with check (bucket_id = 'covers' and auth.uid() is not null);
drop policy if exists "login update covers" on storage.objects;
create policy "login update covers" on storage.objects for update using (bucket_id = 'covers' and auth.uid() is not null) with check (bucket_id = 'covers' and auth.uid() is not null);
drop policy if exists "login delete covers" on storage.objects;
create policy "login delete covers" on storage.objects for delete using (bucket_id = 'covers' and auth.uid() is not null);

-- trigger new user -> profile
create or replace function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, name, role) values (new.id, coalesce(new.raw_user_meta_data->>'name', new.email), 'user')
  on conflict (id) do nothing;
  return new;
end; $$ language plpgsql security definer;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();
