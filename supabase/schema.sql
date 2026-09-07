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

-- workshops
create table if not exists workshops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  address text,
  kecamatan text,
  lat double precision,
  lng double precision,
  jam_operasional text,
  layanan text[],
  kontak text,
  foto_url text,
  rating numeric default 4.5,
  created_at timestamptz default now()
);

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

-- bookmarks
create table if not exists bookmarks (
  user_id uuid references auth.users(id) on delete cascade,
  article_id uuid references articles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, article_id)
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

-- RLS
alter table profiles enable row level security;
alter table motorcycles enable row level security;
alter table maintenance_records enable row level security;
alter table bookmarks enable row level security;

-- public read for catalog
create policy "public read categories" on categories for select using (true);
create policy "public read articles" on articles for select using (true);
create policy "public read workshops" on workshops for select using (true);
create policy "public read problems" on motor_problems for select using (true);
create policy "public read rules" on maintenance_rules for select using (true);

-- private per user
create policy "own motorcycles" on motorcycles for all using (auth.uid() = user_id);
create policy "own bookmarks" on bookmarks for all using (auth.uid() = user_id);
-- maintenance_records via motorcycle ownership
create policy "own records" on maintenance_records for all using (
  exists (select 1 from motorcycles m where m.id = motorcycle_id and m.user_id = auth.uid())
);

-- trigger new user -> profile
create or replace function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, name, role) values (new.id, new.email, 'user');
  return new;
end; $$ language plpgsql security definer;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();
