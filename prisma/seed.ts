import { PrismaClient, $Enums } from '@prisma/client';
import { hashPassword } from '../lib/auth/utils';
import { seedEndangeredReports } from './seeds/endangered_reports';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ============= SEED CATEGORIES FIRST =============
  console.log('📁 Seeding categories...');
  await prisma.category.deleteMany({});

  const categories = await prisma.category.createMany({
    data: [
      // Culture categories (from CultureCategory enum)
      { name: 'Tarian', slug: 'tarian', description: 'Tarian tradisional', icon: '💃', type: 'culture' },
      { name: 'Musik', slug: 'musik', description: 'Musik & alat musik tradisional', icon: '🎵', type: 'culture' },
      { name: 'Pakaian', slug: 'pakaian', description: 'Pakaian adat', icon: '👘', type: 'culture' },
      { name: 'Arsitektur', slug: 'arsitektur', description: 'Rumah adat & bangunan', icon: '🏛️', type: 'culture' },
      { name: 'Kuliner', slug: 'kuliner', description: 'Makanan & minuman tradisional', icon: '🍜', type: 'culture' },
      { name: 'Upacara', slug: 'upacara', description: 'Upacara adat', icon: '🎎', type: 'culture' },
      { name: 'Kerajinan', slug: 'kerajinan', description: 'Kerajinan tangan', icon: '🎨', type: 'culture' },
      { name: 'Senjata', slug: 'senjata', description: 'Senjata tradisional', icon: '⚔️', type: 'culture' },
      { name: 'Permainan', slug: 'permainan', description: 'Permainan tradisional', icon: '🎲', type: 'culture' },
      { name: 'Bahasa', slug: 'bahasa', description: 'Bahasa & aksara daerah', icon: '📜', type: 'culture' },
      
      // Article categories
      { name: 'Cerita Budaya', slug: 'cerita-budaya', description: 'Artikel tentang cerita dan budaya', icon: '', type: 'article' },
      { name: 'Tokoh Inspiratif', slug: 'tokoh-inspiratif', description: 'Artikel tentang tokoh inspiratif', icon: '', type: 'article' },
      { name: 'Event Nasional', slug: 'event-nasional', description: 'Artikel tentang event nasional', icon: '', type: 'article' },
      { name: 'Upaya UNESCO', slug: 'upaya-unesco', description: 'Artikel tentang upaya UNESCO', icon: '', type: 'article' },

      // Event categories
      { name: 'Festival', slug: 'festival', description: 'Festival budaya', icon: '🎪', type: 'event' },
      { name: 'Pertunjukan', slug: 'pertunjukan', description: 'Pertunjukan seni', icon: '🎭', type: 'event' },
      { name: 'Pameran', slug: 'pameran', description: 'Pameran budaya', icon: '🖼️', type: 'event' },
    ],
  });

  console.log(`✅ ${categories.count} categories seeded`);

  // Fetch categories for reference in seeds
  const categoryTarian = await prisma.category.findUnique({ where: { slug: 'tarian' } });
  const categoryMusik = await prisma.category.findUnique({ where: { slug: 'musik' } });
  const categoryPakaian = await prisma.category.findUnique({ where: { slug: 'pakaian' } });
  const categoryArsitektur = await prisma.category.findUnique({ where: { slug: 'arsitektur' } });
  const categoryKuliner = await prisma.category.findUnique({ where: { slug: 'kuliner' } });
  const categoryUpacara = await prisma.category.findUnique({ where: { slug: 'upacara' } });
  const categorySenjata = await prisma.category.findUnique({ where: { slug: 'senjata' } });
  const categorySeniBudaya = await prisma.category.findUnique({ where: { slug: 'seni-budaya' } });
  const categoryCandi = await prisma.category.findUnique({ where: { slug: 'candi' } });
  const categoryFestival = await prisma.category.findUnique({ where: { slug: 'festival' } });
  const categoryPertunjukan = await prisma.category.findUnique({ where: { slug: 'pertunjukan' } });
  const categoryPameran = await prisma.category.findUnique({ where: { slug: 'pameran' } });

  // ============= SEED USERS =============

  // Create admin user
  const adminPassword = await hashPassword('password');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      password: adminPassword,
      full_name: 'Admin Lokal Lens',
      role: $Enums.Role.admin,
      profile: {
        create: {
          bio: 'Administrator platform Lokal Lens',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
          provinces_visited: 34,
          badges_earned: 8,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // Create contributor user
  const contributorPassword = await hashPassword('password');
  const contributor = await prisma.user.upsert({
    where: { email: 'contributor@gmail.com' },
    update: {},
    create: {
      email: 'contributor@gmail.com',
      password: contributorPassword,
      full_name: 'Budi Kontributor',
      role: $Enums.Role.contributor,
      profile: {
        create: {
          bio: 'Kontributor aktif di platform Lokal Lens',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
          provinces_visited: 5,
          badges_earned: 3,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log(`✅ Contributor user created: ${contributor.email}`);

  // Create officer user
  const officerPassword = await hashPassword('password');
  const officer = await prisma.user.upsert({
    where: { email: 'officer@gmail.com' },
    update: {},
    create: {
      email: 'officer@gmail.com',
      password: officerPassword,
      full_name: 'Petugas Budaya',
      role: $Enums.Role.petugas,
      profile: {
        create: {
          bio: 'Petugas pemeliharaan budaya',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
          provinces_visited: 10,
          badges_earned: 5,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log(`✅ Officer user created: ${officer.email}`);

  // Create regular user
  const userPassword = await hashPassword('password');
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {},
    create: {
      email: 'user@gmail.com',
      password: userPassword,
      full_name: 'User Biasa',
      role: $Enums.Role.user,
      profile: {
        create: {
          bio: 'Pengguna biasa platform Lokal Lens',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
          provinces_visited: 2,
          badges_earned: 1,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log(`✅ Regular user created: ${regularUser.email}`);

  // Create sample certificates for admin
  await prisma.certificate.createMany({
    data: [
      {
        user_id: admin.id,
        title: 'Duta Budaya Lokal Lens',
        description: 'Penghargaan untuk kontribusi luar biasa dalam melestarikan budaya nusantara',
        date_earned: new Date('2024-01-15'),
        certificate_url: 'https://example.com/certificates/duta-budaya.pdf',
      },
      {
        user_id: admin.id,
        title: 'Penjelajah Nusantara',
        description: 'Telah menjelajahi semua 34 provinsi di Indonesia',
        date_earned: new Date('2024-02-20'),
        certificate_url: 'https://example.com/certificates/penjelajah.pdf',
      },
    ],
  });

  console.log(`✅ Certificates created for admin`);

  // Create sample certificates for contributor
  await prisma.certificate.createMany({
    data: [
      {
        user_id: contributor.id,
        title: 'Kontributor Aktif',
        description: 'Apresiasi untuk kontribusi aktif dalam platform',
        date_earned: new Date('2024-03-10'),
        certificate_url: 'https://example.com/certificates/contributor-aktif.pdf',
      },
    ],
  });

  console.log(`✅ Certificates created for contributor`);

  // Create badges
  const badges = await prisma.badge.createMany({
    data: [
      // Explorer badges
      {
        name: 'Penjelajah Pemula',
        description: 'Scan 5 objek budaya pertama kamu',
        icon: '🔍',
        category: 'explorer',
        requirement: 'Scan 5 objek budaya',
        points: 50,
      },
      {
        name: 'Penjelajah Berpengalaman',
        description: 'Scan 25 objek budaya dari berbagai daerah',
        icon: '🗺️',
        category: 'explorer',
        requirement: 'Scan 25 objek budaya',
        points: 100,
      },
      {
        name: 'Master Penjelajah',
        description: 'Scan 100 objek budaya nusantara',
        icon: '🏆',
        category: 'explorer',
        requirement: 'Scan 100 objek budaya',
        points: 500,
      },
      // Collector badges
      {
        name: 'Kolektor Batik',
        description: 'Scan 10 jenis batik berbeda',
        icon: '👘',
        category: 'collector',
        requirement: 'Scan 10 jenis batik',
        points: 75,
      },
      {
        name: 'Kolektor Wayang',
        description: 'Scan 10 karakter wayang berbeda',
        icon: '🎭',
        category: 'collector',
        requirement: 'Scan 10 karakter wayang',
        points: 75,
      },
      {
        name: 'Kolektor Keris',
        description: 'Scan 5 jenis keris berbeda',
        icon: '🗡️',
        category: 'collector',
        requirement: 'Scan 5 jenis keris',
        points: 100,
      },
      // Master badges
      {
        name: 'Ahli Budaya Jawa',
        description: 'Lengkapi semua koleksi budaya Jawa',
        icon: '🎌',
        category: 'master',
        requirement: 'Scan semua budaya Jawa',
        points: 200,
      },
      {
        name: 'Ahli Budaya Bali',
        description: 'Lengkapi semua koleksi budaya Bali',
        icon: '🏯',
        category: 'master',
        requirement: 'Scan semua budaya Bali',
        points: 200,
      },
      {
        name: 'Guru Budaya Nusantara',
        description: 'Lengkapi koleksi dari 10 provinsi berbeda',
        icon: '📚',
        category: 'master',
        requirement: 'Scan budaya dari 10 provinsi',
        points: 300,
      },
      // Social badges
      {
        name: 'Storyteller',
        description: 'Bagikan 5 hasil scan ke media sosial',
        icon: '📱',
        category: 'social',
        requirement: 'Bagikan 5 hasil scan',
        points: 50,
      },
      {
        name: 'Kontributor Emas',
        description: 'Kontribusi 50+ artikel budaya',
        icon: '✨',
        category: 'special',
        requirement: 'Tulis 50 artikel',
        points: 500,
      },
    ],
  });

  console.log(`✅ ${badges.count} badges created`);

  // Create challenges
  const challenges = await prisma.challenge.createMany({
    data: [
      // Scan challenges
      {
        title: 'Petualangan Pertama',
        description: 'Scan objek budaya pertama kamu dan mulai petualanganmu!',
        category: 'scan',
        difficulty: 'easy',
        points: 25,
        requirements: 'Scan 1 objek budaya',
      },
      {
        title: 'Minggu Produktif',
        description: 'Scan 10 objek budaya dalam 7 hari',
        category: 'scan',
        difficulty: 'medium',
        points: 100,
        requirements: 'Scan 10 objek dalam 7 hari',
      },
      {
        title: 'Marathon Budaya',
        description: 'Scan 50 objek budaya dalam sebulan',
        category: 'scan',
        difficulty: 'hard',
        points: 500,
        requirements: 'Scan 50 objek dalam 30 hari',
      },
      // Quiz challenges
      {
        title: 'Kuis Master',
        description: 'Selesaikan 5 kuis budaya dengan sempurna',
        category: 'quiz',
        difficulty: 'medium',
        points: 150,
        requirements: 'Perfect score di 5 kuis',
      },
      {
        title: 'Jenius Budaya',
        description: 'Jawab benar 100 pertanyaan kuis',
        category: 'quiz',
        difficulty: 'hard',
        points: 300,
        requirements: 'Jawab 100 pertanyaan dengan benar',
      },
      // Article challenges
      {
        title: 'Pembaca Setia',
        description: 'Baca 10 artikel budaya',
        category: 'article',
        difficulty: 'easy',
        points: 50,
        requirements: 'Baca 10 artikel',
      },
      {
        title: 'Penulis Pemula',
        description: 'Tulis artikel budaya pertama kamu',
        category: 'article',
        difficulty: 'medium',
        points: 100,
        requirements: 'Publikasikan 1 artikel',
      },
      // Exploration challenges
      {
        title: 'Penjelajah Regional',
        description: 'Kunjungi dan scan budaya dari 3 provinsi berbeda',
        category: 'exploration',
        difficulty: 'medium',
        points: 200,
        requirements: 'Scan dari 3 provinsi',
      },
      {
        title: 'Wisatawan Nusantara',
        description: 'Kunjungi dan scan budaya dari 10 provinsi',
        category: 'exploration',
        difficulty: 'hard',
        points: 750,
        requirements: 'Scan dari 10 provinsi',
      },
      // Social challenges
      {
        title: 'Influencer Budaya',
        description: 'Share 10 hasil scan ke media sosial',
        category: 'social',
        difficulty: 'easy',
        points: 75,
        requirements: 'Share 10 kali',
      },
      {
        title: 'Community Builder',
        description: 'Ajak 5 teman bergabung di LokalLens',
        category: 'social',
        difficulty: 'medium',
        points: 250,
        requirements: 'Referral 5 user',
      },
    ],
  });

  console.log(`✅ ${challenges.count} challenges created`);

  // Award some badges to users for demo
  const allBadges = await prisma.badge.findMany({ take: 5 });
  
  // Use upsert to avoid duplicate key errors
  for (const badgeData of [
    { user_id: admin.id, badge_id: allBadges[0].id },
    { user_id: admin.id, badge_id: allBadges[1].id },
    { user_id: admin.id, badge_id: allBadges[2].id },
    { user_id: regularUser.id, badge_id: allBadges[0].id },
  ]) {
    await prisma.userBadge.upsert({
      where: {
        user_id_badge_id: {
          user_id: badgeData.user_id,
          badge_id: badgeData.badge_id,
        },
      },
      update: {},
      create: badgeData,
    });
  }

  console.log(`✅ User badges awarded`);

  // Complete some challenges for users
  const allChallenges = await prisma.challenge.findMany({ take: 3 });
  
  // Use upsert to avoid duplicate key errors
  for (const challengeData of [
    { user_id: admin.id, challenge_id: allChallenges[0].id },
    { user_id: admin.id, challenge_id: allChallenges[1].id },
    { user_id: regularUser.id, challenge_id: allChallenges[0].id },
  ]) {
    await prisma.userCompleteChallenge.upsert({
      where: {
        user_id_challenge_id: {
          user_id: challengeData.user_id,
          challenge_id: challengeData.challenge_id,
        },
      },
      update: {},
      create: challengeData,
    });
  }

  console.log(`✅ User challenges completed`);

  // Seed Articles
  console.log('\n🌱 Seeding articles...');

  // Delete existing articles to avoid duplicate slug errors
  await prisma.article.deleteMany({});

  const articles = await prisma.article.createMany({
    data: [
      {
        title: 'Mengenal Wayang Kulit: Seni Pertunjukan Klasik Jawa',
        slug: 'mengenal-wayang-kulit-seni-pertunjukan-klasik-jawa',
        excerpt: 'Wayang kulit adalah seni pertunjukan tradisional Indonesia yang telah diakui UNESCO sebagai Warisan Kemanusiaan untuk Budaya Lisan dan Nonbendawi.',
        content: `Wayang kulit adalah salah satu puncak seni budaya Indonesia yang berakar dari tradisi Jawa. Pertunjukan wayang kulit menggabungkan berbagai elemen seni seperti sastra, musik, tutur, rupa, dan pertunjukan yang sangat kompleks.\n\nWayang kulit telah ada sejak abad ke-10 Masehi di Jawa. Pertunjukan ini menggunakan boneka kulit yang diproyeksikan pada layar putih dengan lampu minyak kelapa. Dalang atau pemain wayang akan menggerakkan boneka sambil menceritakan kisah dari epos Mahabharata atau Ramayana.`,
        featured_image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80',
        author_id: admin.id,
        category_id: categorySeniBudaya?.id,
        tags: '["wayang", "jawa", "tradisi", "seni pertunjukan", "UNESCO"]',
        province: 'Jawa Tengah',
        read_time: 8,
        views: 1520,
        is_highlight: true,
      },
      {
        title: 'Tari Kecak: Pesona Tari Api dari Bali',
        slug: 'tari-kecak-pesona-tari-api-dari-bali',
        excerpt: 'Tari Kecak adalah tarian tradisional Bali yang unik karena tidak menggunakan alat musik pengiring, melainkan suara "cak" dari puluhan penari pria.',
        content: `Tari Kecak adalah salah satu pertunjukan seni yang paling ikonik dari Bali. Tarian ini diciptakan pada tahun 1930-an dan telah menjadi salah satu daya tarik wisata budaya utama di Indonesia.\n\nTari Kecak diciptakan oleh seniman Bali I Wayan Limbak dan pelukis Jerman Walter Spies pada tahun 1930-an. Yang membuat Tari Kecak berbeda adalah penggunaan suara "cak-cak-cak" yang dilantunkan oleh puluhan penari pria yang duduk melingkar.`,
        featured_image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
        author_id: contributor.id,
        category_id: categorySeniBudaya?.id,
        tags: '["tari", "bali", "kecak", "ramayana", "tradisi"]',
        province: 'Bali',
        read_time: 6,
        views: 2340,
        is_highlight: true,
      },
      {
        title: 'Batik: Warisan Budaya Dunia dari Indonesia',
        slug: 'batik-warisan-budaya-dunia-dari-indonesia',
        excerpt: 'Batik Indonesia telah diakui UNESCO sebagai Warisan Kemanusiaan untuk Budaya Lisan dan Nonbendawi sejak 2 Oktober 2009.',
        content: `Batik adalah kain bergambar yang pembuatannya secara khusus dengan menuliskan atau menerakan malam pada kain, kemudian pengolahannya diproses dengan cara tertentu.\n\nBatik telah ada di Indonesia sejak zaman Majapahit. Awalnya, batik hanya digunakan oleh kalangan keraton dan bangsawan. Seiring waktu, batik menyebar ke masyarakat luas dan menjadi identitas budaya Indonesia.`,
        featured_image: 'https://images.unsplash.com/photo-1610419312715-8e686a036c56?w=1200&q=80',
        author_id: admin.id,
        category_id: categorySeniBudaya?.id,
        tags: '["batik", "unesco", "tradisi", "tekstil", "warisan budaya"]',
        province: 'Jawa Tengah',
        read_time: 7,
        views: 3120,
        is_highlight: true,
      },
      {
        title: 'Rendang: Makanan Terenak di Dunia dari Minangkabau',
        slug: 'rendang-makanan-terenak-di-dunia-dari-minangkabau',
        excerpt: 'Rendang adalah masakan daging dengan bumbu rempah-rempah khas Minangkabau yang telah dinobatkan sebagai makanan terenak di dunia oleh CNN.',
        content: `Rendang adalah masakan tradisional Indonesia yang berasal dari Sumatera Barat. Pada tahun 2011, CNN International menobatkan Rendang sebagai makanan paling enak di dunia.\n\nRendang berasal dari tradisi masyarakat Minangkabau di Sumatera Barat. Masakan ini telah ada sejak abad ke-16 dan awalnya dibuat sebagai bekal perjalanan karena dapat bertahan lama tanpa pendingin.`,
        featured_image: 'https://images.unsplash.com/photo-1596040033229-a0b3b7f487a0?w=1200&q=80',
        author_id: contributor.id,
        category_id: categoryKuliner?.id,
        tags: '["rendang", "minangkabau", "kuliner", "sumatera barat"]',
        province: 'Sumatera Barat',
        read_time: 6,
        views: 4520,
        is_highlight: false,
      },
      {
        title: 'Rumah Gadang: Arsitektur Tradisional Minangkabau',
        slug: 'rumah-gadang-arsitektur-tradisional-minangkabau',
        excerpt: 'Rumah Gadang adalah rumah adat tradisional Minangkabau yang memiliki atap berbentuk tanduk kerbau.',
        content: `Rumah Gadang atau Rumah Bagonjong adalah rumah adat tradisional masyarakat Minangkabau di Sumatera Barat. Rumah ini memiliki ciri khas atap yang melengkung seperti tanduk kerbau.\n\nBentuk atap Rumah Gadang yang menyerupai tanduk kerbau memiliki makna filosofis yang dalam. Ini mengingat legenda kemenangan kerbau Minangkabau melawan kerbau Jawa.`,
        featured_image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&q=80',
        author_id: admin.id,
        category_id: categoryArsitektur?.id,
        tags: '["rumah gadang", "minangkabau", "arsitektur"]',
        province: 'Sumatera Barat',
        read_time: 5,
        views: 1850,
        is_highlight: false,
      },
      {
        title: 'Angklung: Alat Musik Bambu Warisan UNESCO',
        slug: 'angklung-alat-musik-bambu-warisan-unesco',
        excerpt: 'Angklung adalah alat musik multitonal tradisional Indonesia yang terbuat dari bambu.',
        content: `Angklung adalah alat musik yang terbuat dari bambu dan dimainkan dengan cara digoyangkan. Alat musik ini berasal dari Jawa Barat dan telah diakui UNESCO sebagai Masterpiece of Oral and Intangible Heritage of Humanity.\n\nAngklung telah ada sejak abad ke-7 Masehi di wilayah Sunda, Jawa Barat. Awalnya angklung digunakan untuk upacara padi, kemudian berkembang menjadi alat musik hiburan dan pendidikan.`,
        featured_image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&q=80',
        author_id: contributor.id,
        category_id: categoryMusik?.id,
        tags: '["angklung", "musik", "bambu", "jawa barat", "unesco"]',
        province: 'Jawa Barat',
        read_time: 5,
        views: 980,
        is_highlight: false,
      },
    ],
  });

  console.log(`✅ ${articles.count} articles seeded`);

  // Seed comments
  const article1 = await prisma.article.findFirst({
    where: { slug: 'mengenal-wayang-kulit-seni-pertunjukan-klasik-jawa' },
  });

  if (article1) {
    await prisma.articleComment.createMany({
      data: [
        {
          article_id: article1.id,
          user_id: regularUser.id,
          content: 'Artikel yang sangat informatif! Saya jadi lebih menghargai seni wayang kulit.',
          upvotes: 12,
        },
        {
          article_id: article1.id,
          user_id: contributor.id,
          content: 'Wayang kulit memang luar biasa!',
          upvotes: 8,
        },
      ],
    });
    console.log('✅ Comments seeded');
  }

  // Seed Cultures
  console.log('\n🌱 Seeding cultures...');

  // Delete existing cultures to avoid duplicate slug errors
  await prisma.culture.deleteMany({});

  const cultures = await prisma.culture.createMany({
    data: [
      {
        name: 'Reog Ponorogo',
        slug: 'reog-ponorogo',
        subtitle: 'Tarian Mistis dari Gerbang Timur Jawa',
        description: 'Reog adalah salah satu kesenian budaya yang berasal dari Jawa Timur bagian barat-laut dan Ponorogo dianggap sebagai kota asal Reog yang sebenarnya. Gerbang kota Ponorogo dihiasi oleh sosok warok dan gemblak, dua sosok yang ikut tampil pada saat Reog dipertunjukkan.',
        long_description: 'Reog adalah salah satu budaya daerah di Indonesia yang masih sangat kental dengan hal-hal yang berbau mistis dan ilmu kebatinan yang kuat. Sejarahnya dimulai pada zaman Kerajaan Majapahit, di mana Ki Ageng Kutu, seorang abdi kerajaan, menciptakan tarian ini sebagai sindiran kepada Raja Kertabhumi.',
        meaning: 'Tarian ini menggambarkan singa barong, raja hutan, yang menjadi simbol bagi Kertabhumi, dan di atasnya bertengger bulu merak hingga menyerupai kipas raksasa yang menyimbolkan pengaruh kuat para rekannya dari kerajaan Tiongkok. Kesenian ini merupakan wujud kritik terhadap penguasa yang tunduk pada kehendak asing.',
        category_id: categoryTarian?.id,
        location: 'Ponorogo, Jawa Timur',
        province: 'Jawa Timur',
        city: 'Ponorogo',
        latitude: -7.8754,
        longitude: 111.4625,
        status: 'published',
        is_endangered: true,
        thumbnail: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
        map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126142.77835087282!2d111.38!3d-7.87!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e79a1c3c3c3c3c3%3A0x1234567890abcdef!2sPonorogo!5e0!3m2!1sen!2sid!4v1234567890123',
      },
      {
        name: 'Tari Saman',
        slug: 'tari-saman',
        subtitle: 'Tarian Seribu Tangan dari Aceh',
        description: 'Tari Saman adalah tarian suku Gayo yang biasa ditampilkan untuk merayakan peristiwa-peristiwa penting dalam adat. Tarian ini juga digunakan untuk merayakan kelahiran Nabi Muhammad SAW.',
        long_description: 'Dalam beberapa literatur menyebutkan, tari Saman diciptakan oleh Syekh Saman, seorang ulama yang berasal dari Gayo, Aceh Tenggara. Tarian ini diciptakan untuk mendakwahkan ajaran Islam.',
        meaning: 'Tari Saman mengandung pendidikan keagamaan, sopan santun, kepahlawanan, kekompakan, dan kebersamaan. Semua penari harus bersatu dalam gerakan dan suara.',
        category_id: categoryTarian?.id,
        location: 'Gayo Lues, Aceh',
        province: 'Aceh',
        city: 'Gayo Lues',
        latitude: 4.3230,
        longitude: 97.3250,
        status: 'published',
        is_endangered: false,
        thumbnail: 'https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?w=800',
        map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255841.77835087282!2d97.325!3d4.323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303fb8c3c3c3c3c3%3A0x1234567890abcdef!2sGayo%20Lues!5e0!3m2!1sen!2sid!4v1234567890123',
      },
      {
        name: 'Batik Parang',
        slug: 'batik-parang',
        subtitle: 'Motif Keris Diagonal yang Megah',
        description: 'Batik Parang adalah salah satu motif batik tertua di Indonesia. Motif ini menggambarkan sebuah garis miring yang teratur membentuk huruf S.',
        long_description: 'Parang berasal dari kata "Pereng" yang berarti lereng. Motif ini menggambarkan lereng gunung yang digunakan oleh para raja dan keluarga kerajaan sebagai simbol kekuatan.',
        meaning: 'Motif parang melambangkan keluhuran budi, kekuatan, dan keteguhan hati. Dahulu, motif ini hanya boleh dikenakan oleh keluarga kerajaan Yogyakarta.',
        category_id: categoryPakaian?.id,
        location: 'Yogyakarta, DI Yogyakarta',
        province: 'DI Yogyakarta',
        city: 'Yogyakarta',
        latitude: -7.7956,
        longitude: 110.3695,
        status: 'published',
        is_endangered: false,
        thumbnail: 'https://images.unsplash.com/photo-1610419312715-8e686a036c56?w=800',
        map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126142.77835087282!2d110.369!3d-7.795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5787bd5b6b45%3A0x21723fd4d3b2d63!2sYogyakarta!5e0!3m2!1sen!2sid!4v1234567890123',
      },
      {
        name: 'Rumah Gadang',
        slug: 'rumah-gadang',
        subtitle: 'Arsitektur Megah Minangkabau',
        description: 'Rumah Gadang adalah nama untuk rumah adat Minangkabau yang merupakan rumah tradisional dan banyak jumpai di provinsi Sumatera Barat, Indonesia.',
        long_description: 'Rumah ini dikenal karena atapnya yang runcing dan melengkung menyerupai tanduk kerbau. Arsitekturnya mencerminkan sistem matrilineal masyarakat Minangkabau.',
        meaning: 'Rumah Gadang adalah simbol dari sistem kekerabatan matrilineal, di mana garis keturunan berasal dari pihak ibu. Rumah ini adalah milik kaum perempuan dan diwariskan secara turun temurun.',
        category_id: categoryArsitektur?.id,
        location: 'Bukittinggi, Sumatera Barat',
        province: 'Sumatera Barat',
        city: 'Bukittinggi',
        latitude: -0.3097,
        longitude: 100.3693,
        status: 'published',
        is_endangered: false,
        thumbnail: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800',
        map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255841.77835087282!2d100.369!3d-0.309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b8c3c3c3c3c3%3A0x1234567890abcdef!2sBukittinggi!5e0!3m2!1sen!2sid!4v1234567890123',
      },
      {
        name: 'Angklung',
        slug: 'angklung',
        subtitle: 'Alat Musik Bambu Warisan Dunia',
        description: 'Angklung adalah alat musik multitonal tradisional yang terbuat dari bambu, dimainkan dengan cara digoyangkan.',
        long_description: 'Angklung berasal dari Jawa Barat dan telah diakui UNESCO sebagai Masterpiece of Oral and Intangible Heritage of Humanity pada tahun 2010.',
        meaning: 'Angklung melambangkan kebersamaan dan kerja sama, karena untuk menghasilkan melodi yang indah diperlukan koordinasi antara banyak pemain.',
        category_id: categoryMusik?.id,
        location: 'Bandung, Jawa Barat',
        province: 'Jawa Barat',
        city: 'Bandung',
        latitude: -6.9175,
        longitude: 107.6191,
        status: 'published',
        is_endangered: false,
        thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
        map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.56347862248!2d107.57311744335938!3d-6.903444400000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung!5e0!3m2!1sen!2sid!4v1234567890123',
      },
      {
        name: 'Rendang',
        slug: 'rendang',
        subtitle: 'Makanan Terenak di Dunia',
        description: 'Rendang adalah masakan daging bercita rasa pedas yang menggunakan campuran berbagai bumbu dan rempah-rempah khas Minangkabau.',
        long_description: 'Rendang telah dinobatkan sebagai hidangan paling enak di dunia versi CNN International pada tahun 2011. Proses memasak rendang memakan waktu berjam-jam.',
        meaning: 'Rendang melambangkan kearifan dan kesabaran masyarakat Minangkabau dalam mengolah makanan dengan sempurna melalui proses yang panjang.',
        category_id: categoryKuliner?.id,
        location: 'Padang, Sumatera Barat',
        province: 'Sumatera Barat',
        city: 'Padang',
        latitude: -0.9471,
        longitude: 100.4172,
        status: 'published',
        is_endangered: false,
        thumbnail: 'https://images.unsplash.com/photo-1596040033229-a0b3b7f487a0?w=800',
        map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127748.4334826047!2d100.3507805!3d-0.9470832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b944f0a0a1b1%3A0xf0db0d7a3f6b6b6!2sPadang!5e0!3m2!1sen!2sid!4v1234567890123',
      },
      {
        name: 'Keris',
        slug: 'keris',
        subtitle: 'Senjata Pusaka Penuh Makna',
        description: 'Keris adalah senjata tikam khas Indonesia yang memiliki corak dan bentuk yang unik dengan banyak variasi pamor.',
        long_description: 'Keris bukan hanya senjata, tetapi juga merupakan benda pusaka yang dipercaya memiliki kekuatan spiritual. Telah diakui UNESCO sebagai warisan budaya tak benda.',
        meaning: 'Keris melambangkan kekuatan, kejantanan, dan status sosial pemiliknya. Setiap pamor dan lekukan memiliki makna filosofis tersendiri.',
        category_id: categorySenjata?.id,
        location: 'Surakarta, Jawa Tengah',
        province: 'Jawa Tengah',
        city: 'Surakarta',
        latitude: -7.5755,
        longitude: 110.8243,
        status: 'published',
        is_endangered: false,
        thumbnail: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800',
        map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126406.82523866256!2d110.7500415!3d-7.5755495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a16627a8930d1%3A0x16c4283d6a20d80!2sSurakarta!5e0!3m2!1sen!2sid!4v1234567890123',
      },
      {
        name: 'Wayang Kulit',
        slug: 'wayang-kulit',
        subtitle: 'Pertunjukan Bayangan Penuh Filosofi',
        description: 'Wayang kulit adalah seni pertunjukan asli Indonesia yang melibatkan boneka kulit yang diproyeksikan pada layar.',
        long_description: 'Wayang kulit telah diakui UNESCO sebagai Masterpiece of Oral and Intangible Heritage of Humanity. Pertunjukan ini biasanya menceritakan kisah dari epos Ramayana dan Mahabharata.',
        meaning: 'Wayang kulit mengandung filosofi kehidupan yang mendalam, mengajarkan tentang kebaikan, kejahatan, dan karma dalam kehidupan manusia.',
        category_id: categoryUpacara?.id,
        location: 'Yogyakarta, DI Yogyakarta',
        province: 'DI Yogyakarta',
        city: 'Yogyakarta',
        latitude: -7.7956,
        longitude: 110.3695,
        status: 'published',
        is_endangered: false,
        thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126142.77835087282!2d110.369!3d-7.795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5787bd5b6b45%3A0x21723fd4d3b2d63!2sYogyakarta!5e0!3m2!1sen!2sid!4v1234567890123',
      },
    ],
  });

  console.log(`✅ ${cultures.count} cultures seeded`);

  // Seed culture images
  const reogCulture = await prisma.culture.findUnique({ where: { slug: 'reog-ponorogo' } });
  const samanCulture = await prisma.culture.findUnique({ where: { slug: 'tari-saman' } });
  const batikCulture = await prisma.culture.findUnique({ where: { slug: 'batik-parang' } });
  const rumahCulture = await prisma.culture.findUnique({ where: { slug: 'rumah-gadang' } });

  if (reogCulture) {
    await prisma.cultureImage.createMany({
      data: [
        { culture_id: reogCulture.id, image_url: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200', alt_text: 'Reog Ponorogo Main', is_primary: true, display_order: 0 },
        { culture_id: reogCulture.id, image_url: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600', alt_text: 'Reog Ponorogo 2', is_primary: false, display_order: 1 },
        { culture_id: reogCulture.id, image_url: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600', alt_text: 'Reog Ponorogo 3', is_primary: false, display_order: 2 },
      ],
    });
  }

  if (samanCulture) {
    await prisma.cultureImage.createMany({
      data: [
        { culture_id: samanCulture.id, image_url: 'https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?w=1200', alt_text: 'Tari Saman Main', is_primary: true, display_order: 0 },
        { culture_id: samanCulture.id, image_url: 'https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?w=600', alt_text: 'Tari Saman 2', is_primary: false, display_order: 1 },
      ],
    });
  }

  if (batikCulture) {
    await prisma.cultureImage.createMany({
      data: [
        { culture_id: batikCulture.id, image_url: 'https://images.unsplash.com/photo-1610419312715-8e686a036c56?w=1200', alt_text: 'Batik Parang Main', is_primary: true, display_order: 0 },
        { culture_id: batikCulture.id, image_url: 'https://images.unsplash.com/photo-1610419312715-8e686a036c56?w=600', alt_text: 'Batik Parang 2', is_primary: false, display_order: 1 },
      ],
    });
  }

  if (rumahCulture) {
    await prisma.cultureImage.createMany({
      data: [
        { culture_id: rumahCulture.id, image_url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200', alt_text: 'Rumah Gadang Main', is_primary: true, display_order: 0 },
        { culture_id: rumahCulture.id, image_url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600', alt_text: 'Rumah Gadang 2', is_primary: false, display_order: 1 },
      ],
    });
  }

  console.log('✅ Culture images seeded');

  // Seed Quizzes
  console.log('\n🌱 Seeding quizzes...');

  // Delete existing quizzes to avoid duplicate slug errors
  await prisma.quizOption.deleteMany({});
  await prisma.quizQuestion.deleteMany({});
  await prisma.quiz.deleteMany({});

  // Create Quiz 1: Jelajah Candi Nusantara
  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'Jelajah Candi Nusantara',
      slug: 'jelajah-candi-nusantara',
      description: 'Seberapa jauh pengetahuanmu tentang candi-candi megah yang tersebar di seluruh Indonesia?',
      thumbnail: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80',
      category_id: categoryCandi?.id,
      difficulty: 'medium',
      time_limit: 5,
      total_questions: 10,
      status: 'published',
    },
  });

  // Create Quiz 2: Ragam Tarian Indonesia
  const quiz2 = await prisma.quiz.create({
    data: {
      title: 'Ragam Tarian Indonesia',
      slug: 'ragam-tarian-indonesia',
      description: 'Kenali berbagai tarian tradisional dari Sabang sampai Merauke dalam kuis yang seru ini.',
      thumbnail: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800&q=80',
      category_id: categoryTarian?.id,
      difficulty: 'easy',
      time_limit: 3,
      total_questions: 10,
      status: 'published',
    },
  });

  // Create Quiz 3: Cita Rasa Kuliner Khas
  const quiz3 = await prisma.quiz.create({
    data: {
      title: 'Cita Rasa Kuliner Khas',
      slug: 'cita-rasa-kuliner-khas',
      description: 'Tebak nama dan asal masakan tradisional Indonesia. Awas, bikin lapar!',
      thumbnail: 'https://images.unsplash.com/photo-1604429278231-e5d2d3e2e00c?w=800&q=80',
      category_id: categoryKuliner?.id,
      difficulty: 'medium',
      time_limit: 7,
      total_questions: 10,
      status: 'published',
    },
  });

  console.log(`✅ ${3} quizzes created`);

  // Create Questions for Quiz 1: Jelajah Candi Nusantara
  const q1 = await prisma.quizQuestion.create({
    data: {
      quiz_id: quiz1.id,
      question: 'Candi manakah yang reliefnya menceritakan kisah Ramayana dan Krishnayana?',
      image_url: 'https://images.unsplash.com/photo-1591178825729-928ea0a0fe95?w=800&q=80',
      explanation: 'Jawaban yang tepat. Relief Ramayana di Candi Prambanan terpahat pada dinding pagar langkan Candi Siwa dan Candi Brahma, memberikan narasi visual yang luar biasa.',
      order_number: 1,
      points: 100,
    },
  });

  await prisma.quizOption.createMany({
    data: [
      { question_id: q1.id, option_text: 'Candi Borobudur', is_correct: false, order_number: 1 },
      { question_id: q1.id, option_text: 'Candi Prambanan', is_correct: true, order_number: 2 },
      { question_id: q1.id, option_text: 'Candi Sewu', is_correct: false, order_number: 3 },
      { question_id: q1.id, option_text: 'Candi Plaosan', is_correct: false, order_number: 4 },
    ],
  });

  const q2 = await prisma.quizQuestion.create({
    data: {
      quiz_id: quiz1.id,
      question: 'Candi Buddha terbesar di dunia yang terletak di Magelang adalah...',
      image_url: 'https://images.unsplash.com/photo-1555400082-6e33d2fc4a21?w=800&q=80',
      explanation: 'Candi Borobudur adalah monumen Buddha Mahayana abad ke-9 di Magelang, Jawa Tengah, Indonesia. Monumen ini terdiri atas sembilan teras berundak, enam berbentuk bujur sangkar dan tiga berbentuk bundar, dengan sebuah stupa induk di puncaknya.',
      order_number: 2,
      points: 100,
    },
  });

  await prisma.quizOption.createMany({
    data: [
      { question_id: q2.id, option_text: 'Candi Borobudur', is_correct: true, order_number: 1 },
      { question_id: q2.id, option_text: 'Candi Mendut', is_correct: false, order_number: 2 },
      { question_id: q2.id, option_text: 'Candi Pawon', is_correct: false, order_number: 3 },
      { question_id: q2.id, option_text: 'Candi Kalasan', is_correct: false, order_number: 4 },
    ],
  });

  const q3 = await prisma.quizQuestion.create({
    data: {
      quiz_id: quiz1.id,
      question: 'Siapakah arsitek yang merancang pembangunan Candi Borobudur?',
      image_url: 'https://images.unsplash.com/photo-1555400082-6e33d2fc4a21?w=800&q=80',
      explanation: 'Gunadharma adalah arsitek legendaris yang dipercaya merancang Candi Borobudur pada masa Dinasti Syailendra.',
      order_number: 3,
      points: 100,
    },
  });

  await prisma.quizOption.createMany({
    data: [
      { question_id: q3.id, option_text: 'Gunadharma', is_correct: true, order_number: 1 },
      { question_id: q3.id, option_text: 'Empu Sindok', is_correct: false, order_number: 2 },
      { question_id: q3.id, option_text: 'Mpu Prapanca', is_correct: false, order_number: 3 },
      { question_id: q3.id, option_text: 'Rakai Panangkaran', is_correct: false, order_number: 4 },
    ],
  });

  const q4 = await prisma.quizQuestion.create({
    data: {
      quiz_id: quiz1.id,
      question: 'Candi Prambanan dibangun pada abad ke...',
      explanation: 'Candi Prambanan dibangun pada abad ke-9 Masehi oleh Rakai Pikatan dari dinasti Sanjaya atau Balitung Maha Sambu.',
      order_number: 4,
      points: 100,
    },
  });

  await prisma.quizOption.createMany({
    data: [
      { question_id: q4.id, option_text: 'Abad ke-7', is_correct: false, order_number: 1 },
      { question_id: q4.id, option_text: 'Abad ke-8', is_correct: false, order_number: 2 },
      { question_id: q4.id, option_text: 'Abad ke-9', is_correct: true, order_number: 3 },
      { question_id: q4.id, option_text: 'Abad ke-10', is_correct: false, order_number: 4 },
    ],
  });

  const q5 = await prisma.quizQuestion.create({
    data: {
      quiz_id: quiz1.id,
      question: 'Berapa jumlah stupa di Candi Borobudur?',
      explanation: 'Candi Borobudur memiliki 504 arca Buddha dan 72 stupa berlubang yang mengelilingi stupa induk di puncaknya.',
      order_number: 5,
      points: 100,
    },
  });

  await prisma.quizOption.createMany({
    data: [
      { question_id: q5.id, option_text: '504 stupa', is_correct: false, order_number: 1 },
      { question_id: q5.id, option_text: '72 stupa', is_correct: true, order_number: 2 },
      { question_id: q5.id, option_text: '108 stupa', is_correct: false, order_number: 3 },
      { question_id: q5.id, option_text: '360 stupa', is_correct: false, order_number: 4 },
    ],
  });

  const q6 = await prisma.quizQuestion.create({
    data: {
      quiz_id: quiz1.id,
      question: 'Candi yang terletak di Jawa Timur dan merupakan peninggalan Kerajaan Singhasari adalah...',
      image_url: 'https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=800&q=80',
      explanation: 'Candi Singosari terletak di Kabupaten Malang, Jawa Timur, dan merupakan peninggalan Kerajaan Singhasari yang didirikan sekitar tahun 1304 M.',
      order_number: 6,
      points: 100,
    },
  });

  await prisma.quizOption.createMany({
    data: [
      { question_id: q6.id, option_text: 'Candi Penataran', is_correct: false, order_number: 1 },
      { question_id: q6.id, option_text: 'Candi Singosari', is_correct: true, order_number: 2 },
      { question_id: q6.id, option_text: 'Candi Jago', is_correct: false, order_number: 3 },
      { question_id: q6.id, option_text: 'Candi Kidal', is_correct: false, order_number: 4 },
    ],
  });

  const q7 = await prisma.quizQuestion.create({
    data: {
      quiz_id: quiz1.id,
      question: 'Apa fungsi utama Candi Borobudur pada masa dibangun?',
      explanation: 'Candi Borobudur dibangun sebagai tempat ibadah umat Buddha dan tempat ziarah menuju kesempurnaan spiritual.',
      order_number: 7,
      points: 100,
    },
  });

  await prisma.quizOption.createMany({
    data: [
      { question_id: q7.id, option_text: 'Istana Raja', is_correct: false, order_number: 1 },
      { question_id: q7.id, option_text: 'Tempat ibadah dan ziarah', is_correct: true, order_number: 2 },
      { question_id: q7.id, option_text: 'Makam kerajaan', is_correct: false, order_number: 3 },
      { question_id: q7.id, option_text: 'Benteng pertahanan', is_correct: false, order_number: 4 },
    ],
  });

  const q8 = await prisma.quizQuestion.create({
    data: {
      quiz_id: quiz1.id,
      question: 'Candi yang memiliki relief cerita Ramayana paling lengkap adalah...',
      explanation: 'Candi Prambanan memiliki relief cerita Ramayana yang sangat lengkap, terpahat di dinding Candi Siwa.',
      order_number: 8,
      points: 100,
    },
  });

  await prisma.quizOption.createMany({
    data: [
      { question_id: q8.id, option_text: 'Candi Borobudur', is_correct: false, order_number: 1 },
      { question_id: q8.id, option_text: 'Candi Prambanan', is_correct: true, order_number: 2 },
      { question_id: q8.id, option_text: 'Candi Sewu', is_correct: false, order_number: 3 },
      { question_id: q8.id, option_text: 'Candi Mendut', is_correct: false, order_number: 4 },
    ],
  });

  const q9 = await prisma.quizQuestion.create({
    data: {
      quiz_id: quiz1.id,
      question: 'Pada tahun berapa Candi Borobudur ditetapkan sebagai Situs Warisan Dunia UNESCO?',
      explanation: 'Candi Borobudur ditetapkan sebagai Situs Warisan Dunia UNESCO pada tahun 1991.',
      order_number: 9,
      points: 100,
    },
  });

  await prisma.quizOption.createMany({
    data: [
      { question_id: q9.id, option_text: '1982', is_correct: false, order_number: 1 },
      { question_id: q9.id, option_text: '1991', is_correct: true, order_number: 2 },
      { question_id: q9.id, option_text: '2000', is_correct: false, order_number: 3 },
      { question_id: q9.id, option_text: '2010', is_correct: false, order_number: 4 },
    ],
  });

  const q10 = await prisma.quizQuestion.create({
    data: {
      quiz_id: quiz1.id,
      question: 'Apa nama kompleks candi yang berada di sekitar Candi Prambanan?',
      explanation: 'Di sekitar Candi Prambanan terdapat kompleks candi lain seperti Candi Sewu, Candi Lumbung, Candi Bubrah, dan Candi Plaosan.',
      order_number: 10,
      points: 100,
    },
  });

  await prisma.quizOption.createMany({
    data: [
      { question_id: q10.id, option_text: 'Candi Borobudur dan Mendut', is_correct: false, order_number: 1 },
      { question_id: q10.id, option_text: 'Candi Sewu dan Plaosan', is_correct: true, order_number: 2 },
      { question_id: q10.id, option_text: 'Candi Singosari dan Penataran', is_correct: false, order_number: 3 },
      { question_id: q10.id, option_text: 'Candi Kalasan dan Sari', is_correct: false, order_number: 4 },
    ],
  });

  console.log(`✅ 10 questions and 40 options created for quiz: ${quiz1.title}`);

  console.log('✅ Quiz seeding completed');

  // Seed Events
  console.log('\n🌱 Seeding events...');

  // Delete existing events to avoid duplicate slug errors
  await prisma.event.deleteMany({});

  const event1 = await prisma.event.create({
    data: {
      title: 'Gelar Seni & Pesta Rakyat 2024',
      slug: 'gelar-seni-pesta-rakyat-2024',
      description: 'Sebuah perayaan akbar kekayaan budaya nusantara melalui musik, tari, dan kuliner tradisional.',
      long_description: 'Gelar Seni & Pesta Rakyat 2024 adalah sebuah inisiatif untuk merayakan dan melestarikan warisan budaya Indonesia yang kaya dan beragam. Acara ini akan menjadi panggung bagi para seniman dari berbagai daerah untuk menampilkan keahlian mereka, mulai dari tarian tradisional yang memesona, musik etnik yang menggugah jiwa, hingga pertunjukan wayang yang sarat makna.\n\nPengunjung akan diajak dalam sebuah perjalanan budaya, mencicipi aneka kuliner otentik dari seluruh nusantara, berpartisipasi dalam lokakarya kerajinan tangan, dan menikmati suasana pesta rakyat yang hangat dan meriah. Acara ini bertujuan untuk menginspirasi generasi muda agar lebih mencintai dan bangga akan budayanya sendiri.',
      thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&auto=format&fit=crop&q=80',
      date_start: new Date('2024-08-17T10:00:00'),
      date_end: new Date('2024-08-17T22:00:00'),
      time_start: '10:00',
      time_end: '22:00',
      location_name: 'Plaza Tenggara, Gelora Bung Karno',
      location_city: 'Jakarta Pusat',
      location_province: 'DKI Jakarta',
      location_address: 'Jl. Pintu Satu Senayan, Jakarta Pusat 10270',
      latitude: -6.2088,
      longitude: 106.8019,
      price: 50000,
      status: 'available',
      category_id: categoryFestival?.id,
      organizer: 'Kementerian Pendidikan dan Kebudayaan',
      views: 1250,
      performers: {
        create: [
          {
            name: 'Eko Supriyanto',
            title: 'Maestro Tari Kontemporer',
            description: 'Dikenal dengan karya-karyanya yang mendunia, Eko Supriyanto akan membawakan tarian yang menggabungkan gerak tradisional Jawa dengan sentuhan modern.',
            image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
            order_number: 1,
          },
          {
            name: 'I Wayan Sadra',
            title: 'Komponis Gamelan Modern',
            description: 'Seorang pionir dalam musik gamelan, I Wayan Sadra akan memimpin orkestra yang menyajikan komposisi inovatif dan memukau.',
            image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
            order_number: 2,
          },
          {
            name: 'Sanggar Tari Ayodya Pala',
            title: 'Kolektif Tari Tradisional',
            description: 'Grup tari ternama ini akan menampilkan ragam tarian klasik dari berbagai daerah di Indonesia dengan keanggunan dan presisi yang luar biasa.',
            image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
            order_number: 3,
          },
          {
            name: 'Didi Kempot Legacy',
            title: 'Tribute Campursari',
            description: 'Sebuah persembahan khusus untuk mengenang sang maestro, membawakan lagu-lagu campursari yang tak lekang oleh waktu.',
            image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
            order_number: 4,
          },
        ],
      },
      galleries: {
        create: [
          {
            image_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&auto=format&fit=crop&q=80',
            alt_text: 'Suasana panggung utama Gelar Seni.',
            order_number: 1,
          },
          {
            image_url: 'https://images.unsplash.com/photo-1555400082-8a2583bf4a1f?w=500&auto=format&fit=crop&q=80',
            alt_text: 'Penampilan Sanggar Tari Ayodya Pala.',
            order_number: 2,
          },
          {
            image_url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&auto=format&fit=crop&q=80',
            alt_text: 'I Wayan Sadra bersama gamelannya.',
            order_number: 3,
          },
          {
            image_url: 'https://images.unsplash.com/photo-1547153760-18fc9498a7e6?w=500&auto=format&fit=crop&q=80',
            alt_text: 'Eko Supriyanto saat menari.',
            order_number: 4,
          },
          {
            image_url: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=500&auto=format&fit=crop&q=80',
            alt_text: 'Atribut panggung Didi Kempot Legacy.',
            order_number: 5,
          },
        ],
      },
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Festival Jazz Internasional',
      slug: 'festival-jazz-internasional',
      description: 'Nikmati alunan jazz dari musisi internasional dan lokal terbaik dalam festival musik tahunan yang memukau.',
      long_description: 'Festival Jazz Internasional Jakarta kembali hadir dengan lineup artis internasional dan lokal yang luar biasa. Acara ini menampilkan berbagai genre jazz dari traditional, contemporary, hingga fusion. Pengunjung akan dimanjakan dengan pertunjukan dari musisi jazz ternama dunia serta talenta lokal yang tidak kalah memukau.',
      thumbnail: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&auto=format&fit=crop&q=60',
      date_start: new Date('2024-08-15T16:00:00'),
      date_end: new Date('2024-08-17T23:00:00'),
      time_start: '16:00',
      time_end: '23:00',
      location_name: 'JIExpo Kemayoran',
      location_city: 'Jakarta Pusat',
      location_province: 'DKI Jakarta',
      location_address: 'Jl. Boulevard Barat Raya No.1, Jakarta Pusat',
      latitude: -6.1477,
      longitude: 106.8464,
      price: 250000,
      status: 'available',
      category_id: categoryFestival?.id,
      organizer: 'Java Festival Production',
      views: 3420,
      performers: {
        create: [
          {
            name: 'Tompi',
            title: 'Jazz Vocalist',
            description: 'Penyanyi jazz Indonesia yang akan membawakan hits-nya dengan aransemen jazz yang segar.',
            image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
            order_number: 1,
          },
          {
            name: 'Joey Alexander',
            title: 'Piano Jazz Prodigy',
            description: 'Pianis muda berbakat Indonesia yang telah malang melintang di kancah jazz internasional.',
            image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
            order_number: 2,
          },
        ],
      },
      galleries: {
        create: [
          {
            image_url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&auto=format&fit=crop&q=80',
            alt_text: 'Panggung utama Festival Jazz.',
            order_number: 1,
          },
          {
            image_url: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=500&auto=format&fit=crop&q=80',
            alt_text: 'Joey Alexander tampil memukau.',
            order_number: 2,
          },
        ],
      },
    },
  });

  const event3 = await prisma.event.create({
    data: {
      title: 'Pekan Kesenian Bali',
      slug: 'pekan-kesenian-bali',
      description: 'Pesta seni dan budaya terbesar di Bali yang menampilkan tarian, musik, dan pertunjukan tradisional.',
      long_description: 'Pekan Kesenian Bali (PKB) adalah festival seni dan budaya terbesar di Bali yang diselenggarakan setiap tahun. Acara ini menampilkan berbagai pertunjukan seni tradisional Bali seperti tari Barong, Kecak, Legong, gamelan, dan masih banyak lagi. PKB juga menjadi ajang kompetisi seni bagi sanggar-sanggar di Bali.',
      thumbnail: 'https://images.unsplash.com/photo-1555400082-8a2583bf4a1f?w=800&auto=format&fit=crop&q=60',
      date_start: new Date('2024-09-20T09:00:00'),
      date_end: new Date('2024-09-20T21:00:00'),
      time_start: '09:00',
      time_end: '21:00',
      location_name: 'Taman Budaya Art Centre',
      location_city: 'Denpasar',
      location_province: 'Bali',
      location_address: 'Jl. Nusa Indah, Denpasar, Bali',
      latitude: -8.6705,
      longitude: 115.2126,
      price: null,
      status: 'free',
      category_id: categoryFestival?.id,
      organizer: 'Pemerintah Provinsi Bali',
      views: 2150,
      performers: {
        create: [
          {
            name: 'Sanggar Seni Cudamani',
            title: 'Gamelan & Tari Bali',
            description: 'Sanggar seni ternama dari Bali yang akan menampilkan gamelan gong kebyar dan tari legong.',
            image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
            order_number: 1,
          },
          {
            name: 'I Made Sidia',
            title: 'Dalang Wayang Bali',
            description: 'Dalang muda berbakat yang akan mementaskan wayang kulit khas Bali.',
            image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
            order_number: 2,
          },
        ],
      },
      galleries: {
        create: [
          {
            image_url: 'https://images.unsplash.com/photo-1555400082-8a2583bf4a1f?w=500&auto=format&fit=crop&q=80',
            alt_text: 'Tari Legong yang memukau.',
            order_number: 1,
          },
          {
            image_url: 'https://images.unsplash.com/photo-1547153760-18fc9498a7e6?w=500&auto=format&fit=crop&q=80',
            alt_text: 'Gamelan Gong Kebyar.',
            order_number: 2,
          },
        ],
      },
    },
  });

  await prisma.event.createMany({
    data: [
      {
        title: 'Pagelaran Wayang Kulit Semalam Suntuk',
        slug: 'pagelaran-wayang-kulit-semalam-suntuk',
        description: 'Saksikan pertunjukan wayang kulit klasik dengan dalang terkenal dalam acara semalam suntuk yang memukau.',
        long_description: 'Pagelaran wayang kulit semalam suntuk ini menampilkan dalang kondang Ki Manteb Soedharsono yang akan mementaskan lakon Ramayana. Pertunjukan ini dilengkapi dengan gamelan lengkap dan sinden-sinden pilihan. Pengunjung akan diajak menyelami filosofi dan nilai-nilai kehidupan yang terkandung dalam setiap adegan.',
        thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60',
        date_start: new Date('2024-10-05T20:00:00'),
        date_end: new Date('2024-10-06T05:00:00'),
        time_start: '20:00',
        time_end: '05:00',
        location_name: 'Pendopo Taman Siswa',
        location_city: 'Yogyakarta',
        location_province: 'DI Yogyakarta',
        location_address: 'Jl. Taman Siswa No.25, Yogyakarta',
        latitude: -7.8014,
        longitude: 110.3691,
        price: null,
        status: 'sold_out',
        category_id: categoryPertunjukan?.id,
        organizer: 'Yayasan Taman Siswa',
        views: 4580,
      },
      {
        title: 'Pameran Batik Nusantara',
        slug: 'pameran-batik-nusantara',
        description: 'Jelajahi keindahan dan keragaman batik dari seluruh Indonesia dalam pameran batik terbesar tahun ini.',
        long_description: 'Pameran Batik Nusantara menghadirkan koleksi batik dari 34 provinsi di Indonesia. Pengunjung dapat melihat proses pembuatan batik, mengikuti workshop membatik, dan membeli batik langsung dari pengrajin. Pameran ini juga menampilkan fashion show batik modern dan talk show dengan desainer ternama.',
        thumbnail: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=60',
        date_start: new Date('2024-11-10T10:00:00'),
        date_end: new Date('2024-11-20T18:00:00'),
        time_start: '10:00',
        time_end: '18:00',
        location_name: 'Solo Grand Mall',
        location_city: 'Surakarta',
        location_province: 'Jawa Tengah',
        location_address: 'Jl. Slamet Riyadi No.451, Surakarta',
        latitude: -7.5568,
        longitude: 110.8192,
        price: 50000,
        status: 'available',
        category_id: categoryPameran?.id,
        organizer: 'Dinas Perindustrian dan Perdagangan Kota Solo',
        views: 890,
      },
      {
        title: 'Festival Kesenian Yogyakarta',
        slug: 'festival-kesenian-yogyakarta',
        description: 'Festival seni tahunan yang menampilkan pertunjukan kontemporer dan tradisional dari seniman dalam dan luar negeri.',
        long_description: 'Festival Kesenian Yogyakarta (FKY) adalah festival seni multidisiplin yang menampilkan pertunjukan teater, tari, musik, film, dan seni rupa. Festival ini menghadirkan seniman dari berbagai negara untuk berkolaborasi dengan seniman lokal, menciptakan karya-karya inovatif yang memadukan tradisi dan modernitas.',
        thumbnail: 'https://images.unsplash.com/photo-1547153760-18fc9498a7e6?w=800&auto=format&fit=crop&q=60',
        date_start: new Date('2024-09-01T10:00:00'),
        date_end: new Date('2024-09-30T22:00:00'),
        time_start: '10:00',
        time_end: '22:00',
        location_name: 'Taman Budaya Yogyakarta',
        location_city: 'Yogyakarta',
        location_province: 'DI Yogyakarta',
        location_address: 'Jl. Sriwedani No.1, Yogyakarta',
        latitude: -7.7956,
        longitude: 110.3695,
        price: null,
        status: 'free',
        category_id: categoryFestival?.id,
        organizer: 'Dinas Kebudayaan DIY',
        views: 5240,
      },
      {
        title: 'Karnaval Budaya Jakarta',
        slug: 'karnaval-budaya-jakarta',
        description: 'Pawai budaya spektakuler yang menampilkan kostum dan tarian dari berbagai suku di Indonesia.',
        long_description: 'Karnaval Budaya Jakarta adalah pawai tahunan yang menampilkan keberagaman budaya Indonesia. Ribuan peserta dari berbagai komunitas seni dan budaya akan memeriahkan jalanan Jakarta dengan kostum-kostum mewah, tarian energik, dan musik tradisional. Acara ini menjadi simbol persatuan dalam keberagaman.',
        thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=60',
        date_start: new Date('2024-08-24T08:00:00'),
        date_end: new Date('2024-08-24T16:00:00'),
        time_start: '08:00',
        time_end: '16:00',
        location_name: 'Bundaran HI - Monas',
        location_city: 'Jakarta Pusat',
        location_province: 'DKI Jakarta',
        location_address: 'Dari Bundaran HI hingga Monas',
        latitude: -6.1951,
        longitude: 106.8229,
        price: null,
        status: 'free',
        category_id: 12,
        organizer: 'Pemerintah Provinsi DKI Jakarta',
        views: 8900,
      },
      {
        title: 'Pekan Raya Sumatera Utara',
        slug: 'pekan-raya-sumatera-utara',
        description: 'Pesta rakyat dengan berbagai pertunjukan seni, kuliner khas, dan stan produk UMKM Sumatera Utara.',
        long_description: 'Pekan Raya Sumatera Utara menampilkan kekayaan budaya dan produk lokal dari seluruh penjuru Sumut. Pengunjung dapat menikmati kuliner khas seperti saksang, arsik, dan bika ambon, menonton pertunjukan tortor dan gondang, serta berbelanja produk UMKM berkualitas.',
        thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=60',
        date_start: new Date('2024-07-20T10:00:00'),
        date_end: new Date('2024-08-05T22:00:00'),
        time_start: '10:00',
        time_end: '22:00',
        location_name: 'Lapangan Merdeka',
        location_city: 'Medan',
        location_province: 'Sumatera Utara',
        location_address: 'Jl. Balai Kota, Medan',
        latitude: 3.5952,
        longitude: 98.6722,
        price: 20000,
        status: 'available',
        category_id: 15,
        organizer: 'Pemerintah Provinsi Sumatera Utara',
        views: 2340,
      },
    ],
  });

  console.log(`✅ Events seeded: ${event1.title}, ${event2.title}, ${event3.title} + 5 more`);

  // Seed endangered reports
  await seedEndangeredReports();

  console.log('🎉 Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
