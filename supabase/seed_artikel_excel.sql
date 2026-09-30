-- seed_artikel_excel.sql -- 32 artikel dari database_artikel_web_bengkel.xlsx
-- Jalankan di Supabase SQL Editor SETELAH schema.sql + seed.sql
-- Idempotent via ON CONFLICT (slug)

insert into categories (name, slug, type) values ('Pengetahuan','pengetahuan','edukasi'),('Mengenal Komponen','komponen','edukasi'),('Tips Merawat','tips-merawat','edukasi'),('Tips Berkendara','tips-berkendara','edukasi') on conflict (slug) do nothing;

insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='pengetahuan'), 'Cara Membaca Kode SAE pada Oli Mesin', 'cara-membaca-kode-sae-pada-oli-mesin', 'Memahami kode SAE membantu pengendara memilih tingkat kekentalan oli yang sesuai dengan kebutuhan mesin dan kondisi penggunaan.', 'Kode SAE pada oli menunjukkan tingkat kekentalan oli berdasarkan standar Society of Automotive Engineers. Contoh yang umum digunakan adalah SAE 10W-40, 10W-30, atau 20W-40.

Huruf W berarti winter dan angka sebelum W menggambarkan karakteristik kekentalan oli pada temperatur rendah. Angka setelah tanda hubung menunjukkan tingkat kekentalan oli pada temperatur kerja mesin yang lebih tinggi. Semakin besar angkanya, semakin tinggi viskositas oli pada kondisi tersebut.

Pemilihan oli sebaiknya mengikuti rekomendasi pabrikan kendaraan. Jangan hanya memilih berdasarkan angka yang terlihat lebih tinggi atau lebih rendah. Pertimbangkan juga jenis mesin, usia kendaraan, kondisi penggunaan, serta spesifikasi lain yang tercantum pada buku manual.

Dengan memahami kode SAE, pemilik motor dapat menghindari kesalahan saat membeli oli dan lebih mudah berdiskusi dengan mekanik mengenai kebutuhan pelumas kendaraan.', '/motor1.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='pengetahuan'), 'Apa Itu API pada Oli Mesin Motor?', 'apa-itu-api-pada-oli-mesin-motor', 'API merupakan salah satu standar yang dapat digunakan untuk mengetahui tingkat performa oli mesin berdasarkan persyaratan tertentu.', 'API adalah singkatan dari American Petroleum Institute. Pada kemasan oli mesin, API biasanya ditampilkan melalui kode tertentu yang menunjukkan kategori performa oli.

Kode API untuk mesin bensin menggunakan huruf S sebagai awalan, sedangkan mesin diesel menggunakan huruf C. Huruf berikutnya menunjukkan kategori performa. Namun, penggunaan kategori API harus tetap disesuaikan dengan rekomendasi pabrikan kendaraan.

API berbeda dengan SAE. SAE berkaitan dengan viskositas atau tingkat kekentalan oli, sedangkan API berkaitan dengan klasifikasi performa oli. Karena itu, sebuah oli dapat memiliki informasi SAE dan API sekaligus.

Saat membeli oli, periksa spesifikasi pada buku manual kendaraan dan bandingkan dengan informasi pada kemasan. Memahami kedua kode ini membantu pemilik motor memilih pelumas secara lebih tepat.', '/motor2.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='pengetahuan'), 'Perbedaan Oli Mineral, Semi Sintetik, dan Full Synthetic', 'perbedaan-oli-mineral-semi-sintetik-dan-full-synthetic', 'Oli mineral, semi sintetik, dan full synthetic memiliki karakteristik formulasi yang berbeda sehingga penggunaannya perlu disesuaikan dengan kebutuhan kendaraan.', 'Oli mineral berasal dari minyak dasar mineral yang telah melalui proses pengolahan. Jenis ini umumnya digunakan pada kendaraan dengan kebutuhan pelumasan yang tidak terlalu kompleks dan dapat menjadi pilihan ekonomis.

Oli semi sintetik merupakan campuran base oil mineral dan sintetik. Formulasinya dirancang untuk memberikan keseimbangan antara perlindungan, kestabilan, dan biaya.

Sementara itu, oli full synthetic menggunakan base oil sintetik yang dirancang melalui proses kimia tertentu. Karakteristiknya dapat memberikan kestabilan yang baik pada berbagai kondisi temperatur, tetapi harga produknya biasanya lebih tinggi.

Tidak berarti full synthetic selalu wajib digunakan pada semua motor. Pilihan oli harus mengacu pada spesifikasi yang ditentukan produsen kendaraan. Menggunakan oli dengan spesifikasi yang tepat lebih penting daripada sekadar memilih jenis oli berdasarkan harga atau klaim performa.', '/motor3.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='pengetahuan'), 'Mengapa Oli Mesin Harus Diganti Secara Berkala?', 'mengapa-oli-mesin-harus-diganti-secara-berkala', 'Oli mengalami penurunan kualitas selama digunakan sehingga penggantian berkala penting untuk menjaga sistem pelumasan mesin.', 'Oli mesin bekerja untuk membantu mengurangi gesekan antar-komponen, membawa panas, serta membantu menjaga kebersihan bagian dalam mesin. Selama kendaraan digunakan, oli mengalami perubahan akibat temperatur, gesekan, kontaminasi, dan proses kerja mesin.

Jika oli terlalu lama digunakan, kemampuan pelumasannya dapat menurun. Kondisi tersebut dapat membuat perlindungan terhadap komponen mesin tidak optimal. Karena itu, penggantian oli perlu dilakukan sesuai interval yang direkomendasikan pabrikan.

Interval penggantian tidak selalu sama untuk semua motor. Faktor seperti jenis oli, kondisi kendaraan, pola penggunaan, jarak tempuh, dan kondisi lalu lintas dapat memengaruhi kebutuhan perawatan.

Pemilik motor sebaiknya mencatat tanggal atau kilometer saat penggantian oli. Catatan sederhana tersebut membantu mencegah keterlambatan servis dan membuat riwayat perawatan kendaraan lebih mudah dipantau.', '/motor4.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='pengetahuan'), 'Apa Fungsi Sistem Pendinginan pada Motor?', 'apa-fungsi-sistem-pendinginan-pada-motor', 'Sistem pendinginan menjaga temperatur kerja mesin agar tetap berada pada rentang yang sesuai selama kendaraan digunakan.', 'Mesin menghasilkan panas ketika bahan bakar terbakar dan komponen bergerak. Jika panas tidak dikendalikan, temperatur mesin dapat meningkat secara berlebihan dan mengganggu kinerja komponen.

Pada motor, sistem pendinginan dapat menggunakan udara atau cairan pendingin, tergantung desain mesinnya. Motor dengan sistem pendingin cairan memiliki komponen seperti radiator, coolant, pompa air, thermostat, dan selang pendingin.

Pengendara perlu memperhatikan indikator temperatur serta kondisi komponen pendinginan. Kebocoran cairan, level coolant yang tidak sesuai, atau kerusakan komponen dapat menyebabkan sistem tidak bekerja sebagaimana mestinya.

Perawatan sistem pendinginan sebaiknya mengikuti jadwal pabrikan. Jangan membuka tutup radiator ketika mesin masih sangat panas karena cairan pendingin dapat berada pada tekanan tinggi dan menyebabkan cedera.', '/motor1.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='pengetahuan'), 'Apa Perbedaan Servis Ringan dan Servis Berkala Motor?', 'apa-perbedaan-servis-ringan-dan-servis-berkala-motor', 'Servis motor terdiri dari pemeriksaan dan pekerjaan yang berbeda sesuai interval perawatan serta kondisi kendaraan.', 'Servis berkala merupakan rangkaian pemeriksaan yang dilakukan berdasarkan interval tertentu. Pekerjaannya dapat mencakup pemeriksaan oli, rem, ban, rantai atau CVT, sistem kelistrikan, serta komponen lain sesuai jadwal kendaraan.

Servis ringan biasanya berfokus pada pemeriksaan dan penggantian komponen atau fluida yang memang sudah mencapai interval perawatan. Sementara itu, servis yang lebih menyeluruh dapat mencakup pemeriksaan komponen secara lebih detail.

Istilah servis ringan dapat berbeda antar-bengkel. Karena itu, pemilik motor sebaiknya menanyakan daftar pekerjaan yang akan dilakukan sebelum servis.

Dengan memahami jenis servis, pemilik kendaraan dapat mengetahui pekerjaan apa yang sedang dilakukan dan dapat menyimpan catatan perawatan secara lebih teratur.', '/motor2.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='pengetahuan'), 'Tanda Motor Mengalami Masalah pada Sistem Kelistrikan', 'tanda-motor-mengalami-masalah-pada-sistem-kelistrikan', 'Beberapa gejala sederhana dapat menjadi petunjuk awal adanya masalah pada aki, sistem pengisian, atau komponen kelistrikan motor.', 'Masalah kelistrikan dapat ditandai dengan starter elektrik yang terasa lemah, lampu redup, klakson melemah, atau motor sulit dihidupkan. Namun, gejala tersebut tidak selalu berasal dari aki karena sistem pengisian dan sambungan kabel juga perlu diperiksa.

Aki merupakan salah satu komponen penting dalam sistem kelistrikan. Selain menyimpan energi listrik, sistem pengisian kendaraan bertugas menjaga ketersediaan listrik ketika mesin bekerja.

Jika muncul gejala kelistrikan, jangan langsung mengganti aki tanpa pemeriksaan. Mekanik dapat memeriksa tegangan aki, sistem pengisian, kabel, konektor, sekring, dan komponen terkait.

Pemeriksaan yang tepat membantu menemukan sumber masalah sehingga penggantian komponen tidak dilakukan secara sembarangan.', '/motor3.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='pengetahuan'), 'Mengapa Tekanan Ban Berpengaruh pada Kenyamanan Berkendara?', 'mengapa-tekanan-ban-berpengaruh-pada-kenyamanan-berkendara', 'Tekanan ban memengaruhi kontak ban dengan jalan, kenyamanan, pengendalian, dan karakteristik keausan ban.', 'Ban merupakan satu-satunya bagian motor yang bersentuhan langsung dengan permukaan jalan. Karena itu, tekanan udara di dalam ban perlu dijaga sesuai rekomendasi kendaraan.

Tekanan yang terlalu rendah dapat membuat ban terasa lebih berat ketika dikendalikan dan meningkatkan risiko panas berlebih pada kondisi tertentu. Tekanan yang terlalu tinggi dapat membuat karakter ban terasa lebih keras dan mengurangi kenyamanan.

Tekanan ideal berbeda berdasarkan jenis motor, ukuran ban, beban, dan rekomendasi pabrikan. Informasi tekanan biasanya tersedia pada buku manual atau label kendaraan.

Periksa tekanan ban secara berkala menggunakan alat ukur yang sesuai. Pemeriksaan sebaiknya dilakukan ketika ban dalam kondisi yang sesuai dengan petunjuk pengukuran agar hasilnya lebih konsisten.', '/motor4.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='komponen'), 'Mengenal Fungsi Busi pada Motor', 'mengenal-fungsi-busi-pada-motor', 'Busi menghasilkan percikan listrik yang membantu proses pembakaran pada mesin bensin.', 'Busi merupakan komponen pada mesin bensin yang bertugas menghasilkan percikan api di ruang bakar. Percikan tersebut membantu menyalakan campuran udara dan bahan bakar pada waktu yang telah ditentukan sistem pengapian.

Kondisi busi dapat memengaruhi proses pembakaran. Busi yang kotor, aus, atau memiliki celah elektroda yang tidak sesuai dapat menyebabkan mesin sulit dihidupkan atau bekerja kurang optimal.

Pemeriksaan busi sebaiknya dilakukan sesuai jadwal perawatan kendaraan. Warna dan kondisi ujung busi juga dapat memberikan informasi awal mengenai kondisi pembakaran, tetapi diagnosis sebaiknya tidak hanya berdasarkan warna busi.

Gunakan tipe busi yang sesuai dengan spesifikasi motor. Hindari mengganti tipe busi hanya berdasarkan bentuk fisik tanpa memastikan spesifikasi teknisnya.', '/motor1.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='komponen'), 'Mengenal Fungsi Filter Udara Motor', 'mengenal-fungsi-filter-udara-motor', 'Filter udara membantu menyaring debu dan kotoran sebelum udara masuk ke sistem pemasukan mesin.', 'Mesin membutuhkan udara bersih untuk mendukung proses pembakaran. Filter udara bekerja menyaring partikel seperti debu agar tidak masuk ke bagian mesin melalui saluran udara.

Filter yang terlalu kotor dapat menghambat aliran udara. Akibatnya, performa mesin dan konsumsi bahan bakar dapat terpengaruh. Namun, cara perawatan filter berbeda-beda tergantung jenis filter yang digunakan.

Beberapa filter dapat dibersihkan sesuai petunjuk, sedangkan jenis tertentu harus diganti ketika sudah mencapai batas pemakaian. Jangan membersihkan filter dengan cara yang tidak sesuai materialnya.

Saat servis, mekanik dapat memeriksa kondisi filter dan menentukan apakah komponen masih layak digunakan atau perlu diganti.', '/motor2.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='komponen'), 'Mengenal Fungsi Kampas Rem Motor', 'mengenal-fungsi-kampas-rem-motor', 'Kampas rem bekerja bersama sistem pengereman untuk menghasilkan gaya gesek yang membantu memperlambat dan menghentikan motor.', 'Kampas rem merupakan bagian penting dari sistem pengereman. Pada rem cakram, kampas menekan permukaan cakram ketika tuas rem dioperasikan. Gesekan tersebut menghasilkan gaya pengereman.

Karena bekerja melalui gesekan, kampas rem akan mengalami keausan. Ketebalan kampas perlu diperiksa secara berkala agar sistem pengereman tetap bekerja dengan baik.

Gejala seperti bunyi tidak normal, jarak pengereman yang terasa berubah, atau getaran ketika mengerem perlu diperiksa. Jangan menunggu kampas benar-benar habis sebelum melakukan pemeriksaan.

Penggantian kampas sebaiknya menggunakan komponen yang sesuai spesifikasi motor. Setelah penggantian, ikuti prosedur mekanik untuk memastikan sistem rem bekerja dengan benar.', '/motor3.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='komponen'), 'Mengenal Fungsi Rantai dan Gear pada Motor', 'mengenal-fungsi-rantai-dan-gear-pada-motor', 'Rantai dan gear meneruskan tenaga mesin menuju roda belakang pada motor dengan sistem penggerak rantai.', 'Pada motor dengan penggerak rantai, sprocket depan, rantai, dan sprocket belakang bekerja sebagai satu sistem untuk meneruskan tenaga dari mesin ke roda belakang.

Rantai membutuhkan pelumasan dan penyetelan kekencangan secara berkala. Rantai yang terlalu kendor dapat menimbulkan suara dan hentakan, sedangkan rantai yang terlalu kencang dapat memberikan beban tambahan pada komponen penggerak.

Gear atau sprocket juga mengalami keausan. Jika gigi sprocket sudah berubah bentuk atau rantai mengalami keausan berlebihan, pemeriksaan menyeluruh perlu dilakukan.

Perawatan yang baik meliputi pembersihan, pelumasan dengan produk yang sesuai, serta pemeriksaan kekencangan berdasarkan spesifikasi pabrikan.', '/motor4.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='komponen'), 'Mengenal Fungsi Aki pada Motor', 'mengenal-fungsi-aki-pada-motor', 'Aki menyimpan energi listrik dan mendukung berbagai kebutuhan kelistrikan motor, termasuk sistem starter pada kendaraan tertentu.', 'Aki merupakan bagian penting dari sistem kelistrikan motor. Aki menyimpan energi listrik yang digunakan untuk berbagai komponen ketika diperlukan.

Pada motor yang menggunakan electric starter, aki membantu menyediakan daya untuk motor starter. Aki juga mendukung lampu, klakson, panel instrumen, dan sistem elektronik lainnya sesuai desain kendaraan.

Umur aki dipengaruhi oleh jenis aki, kondisi sistem pengisian, pola penggunaan, dan perawatan. Aki yang melemah dapat menunjukkan gejala seperti starter elektrik lambat atau kelistrikan tidak stabil.

Jika muncul masalah, pemeriksaan sebaiknya mencakup aki dan sistem pengisian. Mengganti aki tanpa mengetahui penyebabnya dapat membuat masalah berulang jika sumber gangguan berada pada sistem lainnya.', '/motor1.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='komponen'), 'Mengenal Fungsi CVT pada Motor Matic', 'mengenal-fungsi-cvt-pada-motor-matic', 'CVT mengatur penyaluran tenaga mesin ke roda belakang pada banyak motor matic secara otomatis.', 'CVT atau Continuously Variable Transmission merupakan sistem transmisi otomatis yang menggunakan beberapa komponen untuk mengatur rasio penyaluran tenaga.

Komponen CVT antara lain pulley depan, roller, belt atau v-belt, pulley belakang, dan kopling sentrifugal. Masing-masing memiliki fungsi dalam proses penyaluran tenaga dari mesin ke roda belakang.

Keausan komponen CVT dapat ditandai dengan gejala seperti getaran, suara tidak normal, respons akselerasi berubah, atau performa kendaraan terasa berbeda. Namun, diagnosis harus dilakukan melalui pemeriksaan langsung.

CVT perlu dibersihkan dan diperiksa sesuai jadwal perawatan. Penggantian komponen sebaiknya menggunakan ukuran dan spesifikasi yang sesuai dengan kendaraan.', '/motor2.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='komponen'), 'Mengenal Fungsi Radiator Motor', 'mengenal-fungsi-radiator-motor', 'Radiator membantu membuang panas dari cairan pendingin sebelum cairan tersebut kembali bersirkulasi ke mesin.', 'Pada motor dengan sistem pendingin cairan, radiator merupakan salah satu komponen utama pengendalian temperatur mesin. Cairan pendingin membawa panas dari mesin menuju radiator.

Di radiator, panas dilepaskan ke lingkungan melalui sirip-sirip pendingin dengan bantuan aliran udara dan, pada kondisi tertentu, kipas radiator.

Radiator perlu dijaga agar tidak tersumbat oleh kotoran atau mengalami kebocoran. Kondisi coolant juga perlu diperhatikan sesuai interval perawatan.

Jika indikator temperatur menunjukkan kondisi tidak normal, segera lakukan pemeriksaan. Jangan mengabaikan kenaikan temperatur karena mesin dapat mengalami masalah apabila bekerja dalam kondisi terlalu panas.', '/motor3.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='komponen'), 'Mengenal Fungsi Shockbreaker Motor', 'mengenal-fungsi-shockbreaker-motor', 'Shockbreaker membantu meredam gerakan suspensi dan menjaga kontak roda dengan permukaan jalan.', 'Shockbreaker atau peredam kejut merupakan bagian dari sistem suspensi. Komponen ini membantu mengendalikan gerakan naik-turun suspensi ketika motor melewati permukaan jalan yang tidak rata.

Suspensi yang bekerja dengan baik membantu menjaga stabilitas dan kenyamanan. Kebocoran oli pada shockbreaker, gerakan yang terlalu memantul, atau perubahan karakter suspensi dapat menjadi tanda perlunya pemeriksaan.

Perawatan suspensi tidak hanya berkaitan dengan shockbreaker. Kondisi bearing, bushing, swing arm, dan komponen lain juga dapat memengaruhi karakter kendaraan.

Jika terdapat kebocoran atau perubahan perilaku motor, pemeriksaan sebaiknya dilakukan di bengkel agar sumber masalah dapat diketahui dengan tepat.', '/motor4.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='tips-merawat'), 'Tips Merawat Motor Agar Tetap Prima', 'tips-merawat-motor-agar-tetap-prima', 'Perawatan rutin membantu menjaga kondisi motor, mencegah kerusakan yang dapat diprediksi, dan memperpanjang masa pakai komponen.', 'Merawat motor tidak harus selalu menunggu muncul masalah. Perawatan dasar dapat dilakukan melalui pemeriksaan rutin terhadap oli, ban, rem, lampu, rantai atau CVT, serta sistem kelistrikan.

Gunakan oli dan suku cadang sesuai rekomendasi pabrikan. Catat jadwal servis dan kilometer kendaraan agar interval perawatan tidak terlewat.

Kebersihan motor juga penting. Setelah melewati kondisi jalan yang berdebu atau terkena air hujan, bersihkan bagian yang mudah menimbun kotoran. Untuk rantai, lakukan pembersihan dan pelumasan menggunakan produk yang sesuai.

Jika muncul suara, getaran, bau, atau perilaku kendaraan yang berbeda dari biasanya, lakukan pemeriksaan lebih awal. Menangani gejala sejak awal dapat membantu mengurangi risiko kerusakan yang lebih besar.', '/motor1.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='tips-merawat'), 'Cara Merawat Rantai Motor dengan Benar', 'cara-merawat-rantai-motor-dengan-benar', 'Pembersihan dan pelumasan rantai secara berkala membantu menjaga sistem penggerak tetap bekerja dengan baik.', 'Rantai motor bekerja dalam kondisi yang menerima beban, gesekan, debu, dan air. Karena itu, rantai membutuhkan pemeriksaan dan perawatan berkala.

Pertama, periksa kekencangan rantai sesuai spesifikasi pabrikan. Selanjutnya bersihkan kotoran menggunakan metode dan cairan yang aman untuk rantai. Setelah rantai bersih dan kering sesuai kebutuhan, gunakan pelumas rantai yang sesuai.

Hindari memberikan pelumas secara berlebihan karena dapat menarik debu dan kotoran. Periksa juga kondisi sprocket depan dan belakang.

Jika rantai sudah mengalami keausan berat, memiliki mata rantai yang bermasalah, atau sprocket menunjukkan bentuk gigi yang tidak normal, lakukan pemeriksaan di bengkel dan pertimbangkan penggantian komponen.', '/motor2.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='tips-merawat'), 'Cara Merawat Motor Matic agar CVT Awet', 'cara-merawat-motor-matic-agar-cvt-awet', 'Perawatan berkala CVT membantu menjaga penyaluran tenaga dan mengurangi risiko keausan komponen yang tidak terdeteksi.', 'Motor matic menggunakan sistem CVT yang bekerja secara otomatis untuk mengatur penyaluran tenaga. CVT membutuhkan pemeriksaan berkala karena komponen di dalamnya mengalami gesekan dan keausan.

Saat servis CVT, mekanik dapat memeriksa kondisi v-belt, roller, pulley, kampas kopling, dan bagian terkait. Interval pemeriksaan mengikuti rekomendasi pabrikan serta kondisi penggunaan kendaraan.

Hindari memaksakan kendaraan dengan kebiasaan berkendara yang membuat komponen bekerja di luar kondisi normal. Jika muncul getaran, suara berdecit, atau akselerasi berubah, lakukan pemeriksaan.

Perawatan CVT yang konsisten membantu pemilik motor mengetahui kondisi komponen sebelum mengalami kerusakan yang lebih serius.', '/motor3.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='tips-merawat'), 'Tips Menjaga Kondisi Ban Motor', 'tips-menjaga-kondisi-ban-motor', 'Pemeriksaan tekanan, kondisi permukaan, dan usia pemakaian membantu menjaga ban tetap layak digunakan.', 'Periksa tekanan ban secara rutin menggunakan alat ukur. Tekanan harus mengikuti rekomendasi pabrikan kendaraan, bukan sekadar berdasarkan perkiraan visual.

Selain tekanan, perhatikan alur atau tread ban. Ban yang sudah mencapai indikator keausan perlu dipertimbangkan untuk diganti. Periksa juga adanya retak, benjolan, sobekan, atau benda asing yang menancap.

Hindari membawa beban melebihi kemampuan kendaraan. Beban dan kondisi jalan dapat memengaruhi kerja ban.

Jika ban mengalami kebocoran berulang, lakukan pemeriksaan pada ban, pentil, dan velg untuk menemukan sumber masalah. Jangan hanya menambah tekanan tanpa mencari penyebab kebocoran.', '/motor4.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='tips-merawat'), 'Tips Merawat Aki Motor agar Tidak Cepat Lemah', 'tips-merawat-aki-motor-agar-tidak-cepat-lemah', 'Perawatan aki perlu dilakukan bersama pemeriksaan sistem pengisian agar kelistrikan kendaraan tetap stabil.', 'Aki dapat mengalami penurunan daya seiring usia dan penggunaan. Untuk menjaga kondisinya, periksa terminal aki dan pastikan sambungan tidak kendor atau mengalami korosi berlebihan.

Penggunaan motor dengan sistem kelistrikan tambahan juga perlu diperhatikan. Perangkat tambahan yang dipasang tanpa perhitungan dapat memberikan beban tambahan pada sistem kelistrikan.

Jika electric starter mulai terasa lambat, lampu berubah redup, atau terdapat gejala kelistrikan lainnya, lakukan pemeriksaan aki dan sistem pengisian.

Pada aki yang memerlukan perawatan tertentu, ikuti petunjuk produsen. Jangan membuka atau menangani aki secara sembarangan.', '/motor1.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='tips-merawat'), 'Tips Mencuci Motor yang Aman', 'tips-mencuci-motor-yang-aman', 'Cara mencuci yang tepat membantu menjaga kebersihan motor tanpa meningkatkan risiko gangguan pada komponen tertentu.', 'Cuci motor menggunakan air dan bahan pembersih yang sesuai. Hindari mengarahkan tekanan air secara berlebihan ke area yang memiliki konektor listrik, bearing, seal, dan komponen sensitif lainnya.

Mulai dengan membilas kotoran, kemudian gunakan sabun khusus kendaraan dan spons atau kain yang bersih. Setelah selesai, bilas kembali dan keringkan motor untuk mengurangi sisa air.

Perhatikan area rantai. Setelah mencuci motor, rantai perlu diperiksa dan dilumasi kembali jika diperlukan.

Jangan mencuci motor ketika mesin atau komponen tertentu masih sangat panas. Perubahan temperatur mendadak dapat memengaruhi beberapa bagian dan membuat proses pencucian kurang aman.', '/motor2.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='tips-merawat'), 'Tips Menentukan Jadwal Servis Motor', 'tips-menentukan-jadwal-servis-motor', 'Jadwal servis sebaiknya dibuat berdasarkan rekomendasi pabrikan dan disesuaikan dengan kondisi serta pola penggunaan kendaraan.', 'Setiap motor memiliki jadwal perawatan yang berbeda. Gunakan buku manual sebagai acuan utama untuk mengetahui interval pemeriksaan dan penggantian komponen.

Buat catatan sederhana berisi tanggal servis, kilometer, jenis oli, dan komponen yang diganti. Catatan ini membantu pemilik mengetahui riwayat kendaraan dan mempersiapkan servis berikutnya.

Jika motor sering digunakan dalam kondisi berat seperti perjalanan jauh, lalu lintas padat, atau jalan berdebu, pemeriksaan komponen tertentu mungkin perlu dilakukan lebih sering berdasarkan rekomendasi mekanik dan pabrikan.

Jangan menunda servis ketika muncul gejala seperti suara tidak normal, rem berubah, mesin sulit hidup, atau temperatur meningkat. Servis berkala dan pemeriksaan berdasarkan gejala sebaiknya dilakukan secara bersamaan.', '/motor3.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='tips-merawat'), 'Cara Menyimpan Motor Jika Jarang Digunakan', 'cara-menyimpan-motor-jika-jarang-digunakan', 'Motor yang jarang digunakan tetap membutuhkan perhatian agar aki, ban, bahan bakar, dan komponen lainnya tidak mengalami masalah.', 'Jika motor akan lama tidak digunakan, simpan di tempat yang kering dan terlindung. Bersihkan kendaraan terlebih dahulu agar kotoran tidak menempel dalam waktu lama.

Periksa kondisi ban dan aki. Untuk prosedur penyimpanan jangka panjang, ikuti petunjuk pada manual kendaraan karena setiap motor dapat memiliki kebutuhan berbeda.

Jangan meninggalkan bahan bakar dalam kondisi yang tidak sesuai untuk waktu lama tanpa mengikuti rekomendasi produsen. Pastikan area penyimpanan memiliki ventilasi yang baik dan aman.

Ketika motor akan digunakan kembali, lakukan pemeriksaan awal terhadap rem, ban, aki, oli, lampu, dan kondisi kebocoran sebelum berkendara.', '/motor4.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='tips-berkendara'), 'Tips Berkendara Motor di Jalan Basah', 'tips-berkendara-motor-di-jalan-basah', 'Permukaan jalan basah dapat mengurangi traksi sehingga pengendara perlu meningkatkan kewaspadaan dan mengendalikan motor dengan lebih halus.', 'Saat jalan basah, kurangi kecepatan dan jaga jarak dengan kendaraan di depan. Hindari pengereman atau perubahan arah secara mendadak karena kondisi permukaan dapat mengurangi daya cengkeram ban.

Perhatikan genangan air, marka jalan, tutup saluran, dan permukaan yang terlihat licin. Hindari melewati genangan yang tidak dapat diperkirakan kedalamannya.

Gunakan perlengkapan berkendara yang sesuai agar tetap terlihat oleh pengguna jalan lain. Pastikan lampu kendaraan berfungsi.

Jika hujan sangat deras dan jarak pandang menurun, pertimbangkan berhenti di lokasi yang aman dan tidak mengganggu lalu lintas.', '/motor1.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='tips-berkendara'), 'Tips Berkendara Motor di Jalan Menanjak', 'tips-berkendara-motor-di-jalan-menanjak', 'Teknik pengaturan gas, posisi tubuh, dan kecepatan yang tepat membantu menjaga kontrol motor saat melewati tanjakan.', 'Saat menghadapi tanjakan, jaga kecepatan dan gunakan tenaga mesin secara terkontrol. Hindari membuka gas secara mendadak karena dapat membuat respons kendaraan berubah.

Pada motor manual, pilih gigi yang sesuai dengan kondisi tanjakan. Pada motor matic, kendalikan bukaan gas secara halus dan hindari kebiasaan menahan motor terlalu lama menggunakan gas pada kondisi berhenti.

Jika harus berhenti di tanjakan, gunakan rem dengan benar dan pastikan motor tidak mundur sebelum kembali bergerak.

Perhatikan kendaraan lain dan berikan ruang yang cukup. Jangan memaksakan menyalip ketika ruang pandang dan kondisi jalan tidak mendukung.', '/motor2.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='tips-berkendara'), 'Tips Berkendara Aman di Jalan Menurun', 'tips-berkendara-aman-di-jalan-menurun', 'Saat menuruni jalan, pengendara perlu mengatur kecepatan sejak awal dan tidak hanya mengandalkan rem secara terus-menerus.', 'Turunan membutuhkan kontrol kecepatan yang baik. Kurangi kecepatan sebelum memasuki turunan dan gunakan teknik pengereman yang sesuai.

Pada motor manual, manfaatkan gigi yang sesuai untuk membantu pengendalian kecepatan. Hindari menurunkan gigi secara mendadak karena dapat memengaruhi kestabilan kendaraan.

Jangan mengerem keras secara terus-menerus tanpa jeda karena sistem pengereman dapat mengalami peningkatan temperatur. Gunakan rem depan dan belakang secara proporsional sesuai kondisi.

Jaga jarak aman dengan kendaraan di depan dan jangan mengikuti kendaraan lain terlalu dekat. Fokus pada kondisi jalan dan antisipasi perubahan arah atau hambatan.', '/motor3.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='tips-berkendara'), 'Posisi Berkendara yang Nyaman untuk Perjalanan Jauh', 'posisi-berkendara-yang-nyaman-untuk-perjalanan-jauh', 'Posisi duduk dan cara memegang setang yang tepat membantu mengurangi kelelahan selama perjalanan panjang.', 'Untuk perjalanan jauh, duduk dengan posisi tubuh yang rileks dan tidak terlalu kaku. Pegang setang dengan mantap tetapi jangan menggenggam terlalu kuat.

Sesuaikan posisi kaki dengan desain motor dan pastikan tubuh tetap memiliki ruang untuk bergerak secara alami. Hindari posisi yang membuat punggung, bahu, atau pergelangan tangan menerima tekanan berlebihan.

Beristirahat secara berkala sangat penting. Jika mulai mengantuk atau kelelahan, berhenti di tempat yang aman dan jangan memaksakan perjalanan.

Selain posisi tubuh, periksa kondisi motor sebelum perjalanan seperti tekanan ban, rem, lampu, oli, dan bahan bakar.', '/motor4.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='tips-berkendara'), 'Tips Menjaga Jarak Aman Saat Berkendara', 'tips-menjaga-jarak-aman-saat-berkendara', 'Jarak aman memberi waktu tambahan bagi pengendara untuk bereaksi ketika kendaraan di depan melakukan pengereman atau perubahan arah.', 'Jangan menentukan jarak aman hanya berdasarkan jumlah meter karena kecepatan, cuaca, kondisi jalan, dan kepadatan lalu lintas dapat berubah.

Gunakan jarak waktu sebagai salah satu cara sederhana untuk memperkirakan ruang aman. Semakin tinggi kecepatan atau semakin buruk kondisi jalan, semakin besar ruang yang diperlukan.

Hindari mengikuti kendaraan lain terlalu dekat, terutama kendaraan besar yang dapat menghalangi pandangan ke depan. Perhatikan lampu rem dan perilaku kendaraan di depan.

Ketika hujan atau jalan licin, tingkatkan jarak agar tersedia waktu yang lebih panjang untuk bereaksi dan melakukan pengereman.', '/motor1.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='tips-berkendara'), 'Tips Berkendara Motor di Malam Hari', 'tips-berkendara-motor-di-malam-hari', 'Berkendara malam hari membutuhkan perhatian lebih terhadap pencahayaan, jarak pandang, dan visibilitas pengguna jalan.', 'Sebelum berkendara malam, pastikan lampu depan, lampu belakang, lampu rem, dan lampu sein berfungsi. Gunakan lampu sesuai aturan dan kondisi jalan agar tidak mengganggu pengguna jalan lain.

Kurangi kecepatan ketika jarak pandang terbatas. Perhatikan kendaraan yang datang dari arah berlawanan dan hindari menatap langsung sumber cahaya yang menyilaukan.

Gunakan perlengkapan yang membuat pengendara lebih mudah terlihat. Pastikan visor helm bersih dan tidak terlalu buram.

Jika merasa mengantuk, berhentilah di lokasi aman. Kondisi lelah dapat mengurangi kemampuan untuk berkonsentrasi dan bereaksi terhadap situasi jalan.', '/motor2.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='tips-berkendara'), 'Checklist Motor Sebelum Perjalanan Jauh', 'checklist-motor-sebelum-perjalanan-jauh', 'Pemeriksaan singkat sebelum perjalanan jauh membantu menemukan masalah kendaraan sebelum perjalanan dimulai.', 'Sebelum perjalanan jauh, periksa kondisi ban dan tekanannya. Pastikan tidak terdapat kerusakan yang terlihat atau benda asing yang menancap.

Periksa rem depan dan belakang, lampu utama, lampu rem, lampu sein, serta klakson. Periksa juga level oli dan kondisi rantai atau komponen penggerak sesuai jenis motor.

Pastikan bahan bakar cukup untuk mencapai tujuan atau lokasi pengisian berikutnya. Bawa perlengkapan dasar yang memang diperlukan untuk perjalanan.

Jika motor menunjukkan gejala seperti suara aneh, getaran, kebocoran, atau mesin sulit hidup, sebaiknya lakukan pemeriksaan di bengkel sebelum berangkat.', '/motor3.jpeg', true) on conflict (slug) do nothing;
insert into articles (category_id, title, slug, excerpt, content, cover_url, published) values ((select id from categories where slug='tips-berkendara'), 'Cara Berkendara Hemat Bahan Bakar', 'cara-berkendara-hemat-bahan-bakar', 'Gaya berkendara yang halus dan kondisi motor yang terawat dapat membantu penggunaan bahan bakar menjadi lebih efisien.', 'Hindari akselerasi dan pengereman yang terlalu agresif jika kondisi lalu lintas memungkinkan. Jaga kecepatan secara stabil dan gunakan putaran mesin yang sesuai dengan karakter kendaraan.

Tekanan ban yang sesuai juga penting karena kondisi ban dapat memengaruhi hambatan gulir. Selain itu, lakukan servis sesuai jadwal agar sistem mesin dan penggerak tetap dalam kondisi yang baik.

Jangan membawa beban yang tidak diperlukan. Beban tambahan dapat memengaruhi kerja kendaraan.

Efisiensi bahan bakar tidak hanya ditentukan oleh satu komponen. Kondisi kendaraan, pola perjalanan, lalu lintas, beban, dan gaya berkendara semuanya dapat berpengaruh.', '/motor4.jpeg', true) on conflict (slug) do nothing;

-- verifikasi:
select count(*) as artikel_excel_total from articles where slug in ('cara-membaca-kode-sae-pada-oli-mesin','apa-itu-api-pada-oli-mesin-motor','perbedaan-oli-mineral-semi-sintetik-dan-full-synthetic','mengapa-oli-mesin-harus-diganti-secara-berkala','apa-fungsi-sistem-pendinginan-pada-motor','apa-perbedaan-servis-ringan-dan-servis-berkala-motor','tanda-motor-mengalami-masalah-pada-sistem-kelistrikan','mengapa-tekanan-ban-berpengaruh-pada-kenyamanan-berkendara','mengenal-fungsi-busi-pada-motor','mengenal-fungsi-filter-udara-motor','mengenal-fungsi-kampas-rem-motor','mengenal-fungsi-rantai-dan-gear-pada-motor','mengenal-fungsi-aki-pada-motor','mengenal-fungsi-cvt-pada-motor-matic','mengenal-fungsi-radiator-motor','mengenal-fungsi-shockbreaker-motor','tips-merawat-motor-agar-tetap-prima','cara-merawat-rantai-motor-dengan-benar','cara-merawat-motor-matic-agar-cvt-awet','tips-menjaga-kondisi-ban-motor','tips-merawat-aki-motor-agar-tidak-cepat-lemah','tips-mencuci-motor-yang-aman','tips-menentukan-jadwal-servis-motor','cara-menyimpan-motor-jika-jarang-digunakan','tips-berkendara-motor-di-jalan-basah','tips-berkendara-motor-di-jalan-menanjak','tips-berkendara-aman-di-jalan-menurun','posisi-berkendara-yang-nyaman-untuk-perjalanan-jauh','tips-menjaga-jarak-aman-saat-berkendara','tips-berkendara-motor-di-malam-hari','checklist-motor-sebelum-perjalanan-jauh','cara-berkendara-hemat-bahan-bakar');