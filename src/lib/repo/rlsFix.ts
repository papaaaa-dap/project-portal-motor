// SQL idempoten untuk memperbaiki RLS semua tabel katalog + seed kategori.
// Jalankan di Supabase Dashboard → SQL Editor (project yang sama dengan app)
// jika /admin gagal simpan dengan error "violates row-level security policy".
export const ADMIN_RLS_FIX_SQL = `-- === public read (baca katalog tanpa login) ===
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

-- === admin write (tambah/edit/hapus via /admin, role='admin') ===
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

-- === seed kategori (biar dropdown kategori artikel terisi) ===
insert into categories (name, slug, type) values
('Oli','oli','perawatan'),('Mesin','mesin','perawatan'),('CVT','cvt','perawatan'),
('Rem','rem','perawatan'),('Ban','ban','perawatan'),('Aki','aki','perawatan'),
('Rantai','rantai','perawatan'),('Kelistrikan','kelistrikan','perawatan'),
('Tips','tips','edukasi'),('Pengetahuan','pengetahuan','edukasi'),('FAQ','faq','edukasi')
on conflict (slug) do nothing;`;
