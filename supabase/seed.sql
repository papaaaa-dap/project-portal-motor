-- Seed minimal — mirrors src/lib/data/mocks.ts
-- Jalankan setelah schema.sql

insert into categories (name, slug, type) values
('Oli','oli','perawatan'),('Mesin','mesin','perawatan'),('CVT','cvt','perawatan'),
('Rem','rem','perawatan'),('Ban','ban','perawatan'),('Aki','aki','perawatan'),
('Rantai','rantai','perawatan'),('Kelistrikan','kelistrikan','perawatan'),
('Tips','tips','edukasi'),('Pengetahuan','pengetahuan','edukasi'),('FAQ','faq','edukasi');

insert into maintenance_rules (motor_type, category, interval_km, interval_days, title, description) values
('all','Oli',2000,60,'Ganti Oli Mesin','Wajib 2000km/2 bulan'),
('matic','CVT',8000,180,'Servis CVT','Bersihkan roller & kampas ganda'),
('all','Rem',5000,90,'Cek Kampas & Minyak Rem','Ganti jika tipis <2mm'),
('all','Ban',10000,180,'Cek Ban & Tekanan','Ganti jika kembang <1.6mm'),
('all','Aki',15000,365,'Cek Aki & Kelistrikan','Voltase 12.4V+'),
('manual','Rantai',3000,60,'Setel & Lumasi Rantai','Kencang 20-30mm'),
('all','Servis Berkala',4000,90,'Servis Berkala','Tune up + busi + filter');

insert into motor_problems (slug, title, gejala, penyebab, langkah, is_emergency, category) values
('sulit-dinyalakan','Motor Sulit Dinyalakan',array['Starter berputar tapi tidak hidup','Tidak ada suara starter'],array['Aki lemah','Busi kotor'],array['Cek bensin dan aki','Coba kick starter'],false,'Kelistrikan'),
('ban-bocor','Ban Bocor di Jalan',array['Ban kempes mendadak','Motor oleng'],array['Tusukan paku','Pentil bocor'],array['Menepi aman','Cari tambal ban terdekat'],true,'Ban'),
('rem-blong','Rem Blong / Tidak Pakem',array['Tuas dalam','Rem berdecit'],array['Kampas habis','Minyak kurang'],array['Kurangi kecepatan','Langsung ke bengkel'],true,'Rem'),
('overheat','Motor Overheat',array['Indikator suhu menyala'],array['Radiator habis','Oli kurang'],array['Menepi 15 menit','Cek coolant'],true,'Mesin');

-- workshops: 12 seeder (contoh)
insert into workshops (name, slug, address, kecamatan, lat, lng, jam_operasional, layanan, kontak, rating) values
('Bengkel AHASS Surya Agung','ahass-surya-agung','Jl. Ahmad Yani No.12','Wonokromo',-7.2975,112.738,'08:00-17:00',array['Bengkel','Servis Berkala'],'031-8281234',4.7),
('Tambal Ban 24 Jam Darmo','tambal-ban-darmo','Jl. Raya Darmo No.88','Wonokromo',-7.284,112.737,'24 Jam',array['Tambal Ban'],'081234567890',4.5),
('Cuci Motor Kinclong Gubeng','cuci-motor-gubeng','Jl. Gubeng Pojok No.5','Gubeng',-7.265,112.75,'07:00-21:00',array['Cuci Motor'],'081311112222',4.8);
-- lanjutkan 47 entry sesuai mocks.ts atau import CSV
