-- Seed data for events table
INSERT INTO `events` 
  (`title`, `slug`, `description`, `long_description`, `thumbnail`, `date_start`, `date_end`, `time_start`, `time_end`, `location_name`, `location_city`, `location_province`, `location_address`, `latitude`, `longitude`, `price`, `status`, `category`, `organizer`, `views`) 
VALUES
  (
    'Gelar Seni & Pesta Rakyat 2024',
    'gelar-seni-pesta-rakyat-2024',
    'Sebuah perayaan akbar kekayaan budaya nusantara melalui musik, tari, dan kuliner tradisional.',
    'Gelar Seni & Pesta Rakyat 2024 adalah sebuah inisiatif untuk merayakan dan melestarikan warisan budaya Indonesia yang kaya dan beragam. Acara ini akan menjadi panggung bagi para seniman dari berbagai daerah untuk menampilkan keahlian mereka, mulai dari tarian tradisional yang memesona, musik etnik yang menggugah jiwa, hingga pertunjukan wayang yang sarat makna.\n\nPengunjung akan diajak dalam sebuah perjalanan budaya, mencicipi aneka kuliner otentik dari seluruh nusantara, berpartisipasi dalam lokakarya kerajinan tangan, dan menikmati suasana pesta rakyat yang hangat dan meriah. Acara ini bertujuan untuk menginspirasi generasi muda agar lebih mencintai dan bangga akan budayanya sendiri.',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&auto=format&fit=crop&q=80',
    '2024-08-17 10:00:00',
    '2024-08-17 22:00:00',
    '10:00',
    '22:00',
    'Plaza Tenggara, Gelora Bung Karno',
    'Jakarta Pusat',
    'DKI Jakarta',
    'Jl. Pintu Satu Senayan, Jakarta Pusat 10270',
    -6.2088,
    106.8019,
    50000,
    'available',
    'Festival',
    'Kementerian Pendidikan dan Kebudayaan',
    1250
  ),
  (
    'Festival Jazz Internasional',
    'festival-jazz-internasional',
    'Nikmati alunan jazz dari musisi internasional dan lokal terbaik dalam festival musik tahunan yang memukau.',
    'Festival Jazz Internasional Jakarta kembali hadir dengan lineup artis internasional dan lokal yang luar biasa. Acara ini menampilkan berbagai genre jazz dari traditional, contemporary, hingga fusion. Pengunjung akan dimanjakan dengan pertunjukan dari musisi jazz ternama dunia serta talenta lokal yang tidak kalah memukau.',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&auto=format&fit=crop&q=60',
    '2024-08-15 16:00:00',
    '2024-08-17 23:00:00',
    '16:00',
    '23:00',
    'JIExpo Kemayoran',
    'Jakarta Pusat',
    'DKI Jakarta',
    'Jl. Boulevard Barat Raya No.1, Jakarta Pusat',
    -6.1477,
    106.8464,
    250000,
    'available',
    'Festival',
    'Java Festival Production',
    3420
  ),
  (
    'Pekan Kesenian Bali',
    'pekan-kesenian-bali',
    'Pesta seni dan budaya terbesar di Bali yang menampilkan tarian, musik, dan pertunjukan tradisional.',
    'Pekan Kesenian Bali (PKB) adalah festival seni dan budaya terbesar di Bali yang diselenggarakan setiap tahun. Acara ini menampilkan berbagai pertunjukan seni tradisional Bali seperti tari Barong, Kecak, Legong, gamelan, dan masih banyak lagi. PKB juga menjadi ajang kompetisi seni bagi sanggar-sanggar di Bali.',
    'https://images.unsplash.com/photo-1555400082-8a2583bf4a1f?w=800&auto=format&fit=crop&q=60',
    '2024-09-20 09:00:00',
    '2024-09-20 21:00:00',
    '09:00',
    '21:00',
    'Taman Budaya Art Centre',
    'Denpasar',
    'Bali',
    'Jl. Nusa Indah, Denpasar, Bali',
    -8.6705,
    115.2126,
    NULL,
    'free',
    'Festival',
    'Pemerintah Provinsi Bali',
    2150
  ),
  (
    'Pagelaran Wayang Kulit Semalam Suntuk',
    'pagelaran-wayang-kulit-semalam-suntuk',
    'Saksikan pertunjukan wayang kulit klasik dengan dalang terkenal dalam acara semalam suntuk yang memukau.',
    'Pagelaran wayang kulit semalam suntuk ini menampilkan dalang kondang Ki Manteb Soedharsono yang akan mementaskan lakon Ramayana. Pertunjukan ini dilengkapi dengan gamelan lengkap dan sinden-sinden pilihan. Pengunjung akan diajak menyelami filosofi dan nilai-nilai kehidupan yang terkandung dalam setiap adegan.',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60',
    '2024-10-05 20:00:00',
    '2024-10-06 05:00:00',
    '20:00',
    '05:00',
    'Pendopo Taman Siswa',
    'Yogyakarta',
    'DI Yogyakarta',
    'Jl. Taman Siswa No.25, Yogyakarta',
    -7.8014,
    110.3691,
    NULL,
    'sold_out',
    'Pertunjukan',
    'Yayasan Taman Siswa',
    4580
  ),
  (
    'Pameran Batik Nusantara',
    'pameran-batik-nusantara',
    'Jelajahi keindahan dan keragaman batik dari seluruh Indonesia dalam pameran batik terbesar tahun ini.',
    'Pameran Batik Nusantara menghadirkan koleksi batik dari 34 provinsi di Indonesia. Pengunjung dapat melihat proses pembuatan batik, mengikuti workshop membatik, dan membeli batik langsung dari pengrajin. Pameran ini juga menampilkan fashion show batik modern dan talk show dengan desainer ternama.',
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=60',
    '2024-11-10 10:00:00',
    '2024-11-20 18:00:00',
    '10:00',
    '18:00',
    'Solo Grand Mall',
    'Surakarta',
    'Jawa Tengah',
    'Jl. Slamet Riyadi No.451, Surakarta',
    -7.5568,
    110.8192,
    50000,
    'available',
    'Pameran',
    'Dinas Perindustrian dan Perdagangan Kota Solo',
    890
  ),
  (
    'Festival Kesenian Yogyakarta',
    'festival-kesenian-yogyakarta',
    'Festival seni tahunan yang menampilkan pertunjukan kontemporer dan tradisional dari seniman dalam dan luar negeri.',
    'Festival Kesenian Yogyakarta (FKY) adalah festival seni multidisiplin yang menampilkan pertunjukan teater, tari, musik, film, dan seni rupa. Festival ini menghadirkan seniman dari berbagai negara untuk berkolaborasi dengan seniman lokal, menciptakan karya-karya inovatif yang memadukan tradisi dan modernitas.',
    'https://images.unsplash.com/photo-1547153760-18fc9498a7e6?w=800&auto=format&fit=crop&q=60',
    '2024-09-01 10:00:00',
    '2024-09-30 22:00:00',
    '10:00',
    '22:00',
    'Taman Budaya Yogyakarta',
    'Yogyakarta',
    'DI Yogyakarta',
    'Jl. Sriwedani No.1, Yogyakarta',
    -7.7956,
    110.3695,
    NULL,
    'free',
    'Festival',
    'Dinas Kebudayaan DIY',
    5240
  ),
  (
    'Karnaval Budaya Jakarta',
    'karnaval-budaya-jakarta',
    'Pawai budaya spektakuler yang menampilkan kostum dan tarian dari berbagai suku di Indonesia.',
    'Karnaval Budaya Jakarta adalah pawai tahunan yang menampilkan keberagaman budaya Indonesia. Ribuan peserta dari berbagai komunitas seni dan budaya akan memeriahkan jalanan Jakarta dengan kostum-kostum mewah, tarian energik, dan musik tradisional. Acara ini menjadi simbol persatuan dalam keberagaman.',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=60',
    '2024-08-24 08:00:00',
    '2024-08-24 16:00:00',
    '08:00',
    '16:00',
    'Bundaran HI - Monas',
    'Jakarta Pusat',
    'DKI Jakarta',
    'Dari Bundaran HI hingga Monas',
    -6.1951,
    106.8229,
    NULL,
    'free',
    'Karnaval',
    'Pemerintah Provinsi DKI Jakarta',
    8900
  ),
  (
    'Pekan Raya Sumatera Utara',
    'pekan-raya-sumatera-utara',
    'Pesta rakyat dengan berbagai pertunjukan seni, kuliner khas, dan stan produk UMKM Sumatera Utara.',
    'Pekan Raya Sumatera Utara menampilkan kekayaan budaya dan produk lokal dari seluruh penjuru Sumut. Pengunjung dapat menikmati kuliner khas seperti saksang, arsik, dan bika ambon, menonton pertunjukan tortor dan gondang, serta berbelanja produk UMKM berkualitas.',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=60',
    '2024-07-20 10:00:00',
    '2024-08-05 22:00:00',
    '10:00',
    '22:00',
    'Lapangan Merdeka',
    'Medan',
    'Sumatera Utara',
    'Jl. Balai Kota, Medan',
    3.5952,
    98.6722,
    20000,
    'available',
    'Pameran',
    'Pemerintah Provinsi Sumatera Utara',
    2340
  );

-- Seed data for event_performers
INSERT INTO `event_performers` 
  (`event_id`, `name`, `title`, `description`, `image_url`, `order_number`) 
VALUES
  -- Performers for Gelar Seni & Pesta Rakyat 2024
  (
    1,
    'Eko Supriyanto',
    'Maestro Tari Kontemporer',
    'Dikenal dengan karya-karyanya yang mendunia, Eko Supriyanto akan membawakan tarian yang menggabungkan gerak tradisional Jawa dengan sentuhan modern.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    1
  ),
  (
    1,
    'I Wayan Sadra',
    'Komponis Gamelan Modern',
    'Seorang pionir dalam musik gamelan, I Wayan Sadra akan memimpin orkestra yang menyajikan komposisi inovatif dan memukau.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    2
  ),
  (
    1,
    'Sanggar Tari Ayodya Pala',
    'Kolektif Tari Tradisional',
    'Grup tari ternama ini akan menampilkan ragam tarian klasik dari berbagai daerah di Indonesia dengan keanggunan dan presisi yang luar biasa.',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
    3
  ),
  (
    1,
    'Didi Kempot Legacy',
    'Tribute Campursari',
    'Sebuah persembahan khusus untuk mengenang sang maestro, membawakan lagu-lagu campursari yang tak lekang oleh waktu.',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    4
  ),
  -- Performers for Festival Jazz Internasional
  (
    2,
    'Tompi',
    'Jazz Vocalist',
    'Penyanyi jazz Indonesia yang akan membawakan hits-nya dengan aransemen jazz yang segar.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    1
  ),
  (
    2,
    'Joey Alexander',
    'Piano Jazz Prodigy',
    'Pianis muda berbakat Indonesia yang telah malang melintang di kancah jazz internasional.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    2
  ),
  -- Performers for Pekan Kesenian Bali
  (
    3,
    'Sanggar Seni Cudamani',
    'Gamelan & Tari Bali',
    'Sanggar seni ternama dari Bali yang akan menampilkan gamelan gong kebyar dan tari legong.',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
    1
  ),
  (
    3,
    'I Made Sidia',
    'Dalang Wayang Bali',
    'Dalang muda berbakat yang akan mementaskan wayang kulit khas Bali.',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    2
  );

-- Seed data for event_galleries
INSERT INTO `event_galleries` 
  (`event_id`, `image_url`, `alt_text`, `order_number`) 
VALUES
  -- Gallery for Gelar Seni & Pesta Rakyat 2024
  (1, 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&auto=format&fit=crop&q=80', 'Suasana panggung utama Gelar Seni.', 1),
  (1, 'https://images.unsplash.com/photo-1555400082-8a2583bf4a1f?w=500&auto=format&fit=crop&q=80', 'Penampilan Sanggar Tari Ayodya Pala.', 2),
  (1, 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&auto=format&fit=crop&q=80', 'I Wayan Sadra bersama gamelannya.', 3),
  (1, 'https://images.unsplash.com/photo-1547153760-18fc9498a7e6?w=500&auto=format&fit=crop&q=80', 'Eko Supriyanto saat menari.', 4),
  (1, 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=500&auto=format&fit=crop&q=80', 'Atribut panggung Didi Kempot Legacy.', 5),
  (1, 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&auto=format&fit=crop&q=80', 'Penonton menikmati pertunjukan.', 6),
  (1, 'https://images.unsplash.com/photo-1555400082-8a2583bf4a1f?w=500&auto=format&fit=crop&q=80', 'Stan kuliner tradisional.', 7),
  (1, 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&auto=format&fit=crop&q=80', 'Workshop kerajinan tangan.', 8),
  (1, 'https://images.unsplash.com/photo-1547153760-18fc9498a7e6?w=500&auto=format&fit=crop&q=80', 'Dekorasi panggung tradisional.', 9),
  (1, 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=500&auto=format&fit=crop&q=80', 'Suasana malam hari yang meriah.', 10),
  (1, 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&auto=format&fit=crop&q=80', 'Pertunjukan wayang golek.', 11),
  (1, 'https://images.unsplash.com/photo-1555400082-8a2583bf4a1f?w=500&auto=format&fit=crop&q=80', 'Pameran batik nusantara.', 12),
  (1, 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&auto=format&fit=crop&q=80', 'Kolaborasi musik tradisional dan modern.', 13),
  (1, 'https://images.unsplash.com/photo-1547153760-18fc9498a7e6?w=500&auto=format&fit=crop&q=80', 'Peserta berpakaian adat.', 14),
  
  -- Gallery for Festival Jazz Internasional
  (2, 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&auto=format&fit=crop&q=80', 'Panggung utama Festival Jazz.', 1),
  (2, 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=500&auto=format&fit=crop&q=80', 'Joey Alexander tampil memukau.', 2),
  (2, 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&auto=format&fit=crop&q=80', 'Suasana penonton yang antusias.', 3),
  (2, 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=500&auto=format&fit=crop&q=80', 'Tompi saat perform di panggung.', 4),
  
  -- Gallery for Pekan Kesenian Bali
  (3, 'https://images.unsplash.com/photo-1555400082-8a2583bf4a1f?w=500&auto=format&fit=crop&q=80', 'Tari Legong yang memukau.', 1),
  (3, 'https://images.unsplash.com/photo-1547153760-18fc9498a7e6?w=500&auto=format&fit=crop&q=80', 'Gamelan Gong Kebyar.', 2),
  (3, 'https://images.unsplash.com/photo-1555400082-8a2583bf4a1f?w=500&auto=format&fit=crop&q=80', 'Wayang kulit khas Bali.', 3);
