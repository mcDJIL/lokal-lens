const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.userCompleteChallenge.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.userCommentVote.deleteMany();
  await prisma.userArticleBookmark.deleteMany();
  await prisma.articleComment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.cultureImage.deleteMany();
  await prisma.culture.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@gmail.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Admin Lokal Lens',
        role: 'admin',
      },
    }),
    prisma.user.create({
      data: {
        email: 'contributor@gmail.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Budi Kontributor',
        role: 'contributor',
      },
    }),
    prisma.user.create({
      data: {
        email: 'officer@gmail.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Petugas Budaya',
        role: 'officer',
      },
    }),
    prisma.user.create({
      data: {
        email: 'user@gmail.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'User Biasa',
        role: 'user',
      },
    }),
  ]);

  console.log('✅ Created users');

  // Create Profiles
  await Promise.all([
    prisma.profile.create({
      data: {
        userId: users[0].id,
        bio: 'Administrator platform Lokal Lens',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
        provincesVisited: 34,
        badgesEarned: 8,
      },
    }),
    prisma.profile.create({
      data: {
        userId: users[1].id,
        bio: 'Kontributor aktif di platform Lokal Lens',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
        provincesVisited: 5,
        badgesEarned: 3,
      },
    }),
    prisma.profile.create({
      data: {
        userId: users[2].id,
        bio: 'Petugas pemeliharaan budaya',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
        provincesVisited: 10,
        badgesEarned: 5,
      },
    }),
    prisma.profile.create({
      data: {
        userId: users[3].id,
        bio: 'Pengguna biasa platform Lokal Lens',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        provincesVisited: 2,
        badgesEarned: 1,
      },
    }),
  ]);

  console.log('✅ Created profiles');

  // Create Badges
  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        name: 'Penjelajah Pemula',
        description: 'Scan 5 objek budaya pertama kamu',
        icon: '🔍',
        category: 'explorer',
        requirement: 'Scan 5 objek budaya',
        points: 50,
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Penjelajah Berpengalaman',
        description: 'Scan 25 objek budaya dari berbagai daerah',
        icon: '🗺️',
        category: 'explorer',
        requirement: 'Scan 25 objek budaya',
        points: 100,
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Master Penjelajah',
        description: 'Scan 100 objek budaya nusantara',
        icon: '🏆',
        category: 'explorer',
        requirement: 'Scan 100 objek budaya',
        points: 500,
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Kolektor Batik',
        description: 'Scan 10 jenis batik berbeda',
        icon: '👘',
        category: 'collector',
        requirement: 'Scan 10 jenis batik',
        points: 75,
      },
    }),
  ]);

  console.log('✅ Created badges');

  // Create Challenges
  const challenges = await Promise.all([
    prisma.challenge.create({
      data: {
        title: 'Petualangan Pertama',
        description: 'Scan objek budaya pertama kamu dan mulai petualanganmu!',
        category: 'scan',
        difficulty: 'easy',
        points: 25,
        requirements: 'Scan 1 objek budaya',
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Minggu Produktif',
        description: 'Scan 10 objek budaya dalam 7 hari',
        category: 'scan',
        difficulty: 'medium',
        points: 100,
        requirements: 'Scan 10 objek dalam 7 hari',
      },
    }),
  ]);

  console.log('✅ Created challenges');

  // Create Certificates
  await Promise.all([
    prisma.certificate.create({
      data: {
        userId: users[0].id,
        title: 'Duta Budaya Lokal Lens',
        description: 'Penghargaan untuk kontribusi luar biasa dalam melestarikan budaya nusantara',
        dateEarned: new Date('2024-01-15'),
        certificateUrl: 'https://example.com/certificates/duta-budaya.pdf',
      },
    }),
    prisma.certificate.create({
      data: {
        userId: users[0].id,
        title: 'Penjelajah Nusantara',
        description: 'Telah menjelajahi semua 34 provinsi di Indonesia',
        dateEarned: new Date('2024-02-20'),
        certificateUrl: 'https://example.com/certificates/penjelajah.pdf',
      },
    }),
  ]);

  console.log('✅ Created certificates');

  // Create Articles
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: 'Mengenal Wayang Kulit: Seni Pertunjukan Klasik Jawa',
        slug: 'mengenal-wayang-kulit-seni-pertunjukan-klasik-jawa',
        excerpt: 'Wayang kulit adalah seni pertunjukan tradisional Indonesia yang telah diakui UNESCO sebagai Warisan Kemanusiaan untuk Budaya Lisan dan Nonbendawi.',
        content: 'Wayang kulit adalah salah satu puncak seni budaya Indonesia yang berakar dari tradisi Jawa...',
        featuredImage: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80',
        authorId: users[0].id,
        category: 'Seni & Budaya',
        tags: '["wayang", "jawa", "tradisi", "seni pertunjukan", "UNESCO"]',
        province: 'Jawa Tengah',
        readTime: 8,
        views: 1522,
        isHighlight: true,
      },
    }),
    prisma.article.create({
      data: {
        title: 'Tari Kecak: Pesona Tari Api dari Bali',
        slug: 'tari-kecak-pesona-tari-api-dari-bali',
        excerpt: 'Tari Kecak adalah tarian tradisional Bali yang unik karena tidak menggunakan alat musik pengiring.',
        content: 'Tari Kecak adalah salah satu pertunjukan seni yang paling ikonik dari Bali...',
        featuredImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
        authorId: users[1].id,
        category: 'Seni & Budaya',
        tags: '["tari", "bali", "kecak", "ramayana", "tradisi"]',
        province: 'Bali',
        readTime: 6,
        views: 2340,
        isHighlight: true,
      },
    }),
  ]);

  console.log('✅ Created articles');

  // Create Article Comments
  await Promise.all([
    prisma.articleComment.create({
      data: {
        articleId: articles[0].id,
        userId: users[3].id,
        content: 'Artikel yang sangat informatif! Saya jadi lebih menghargai seni wayang kulit.',
        upvotes: 12,
      },
    }),
    prisma.articleComment.create({
      data: {
        articleId: articles[0].id,
        userId: users[1].id,
        content: 'Wayang kulit memang luar biasa!',
        upvotes: 8,
      },
    }),
  ]);

  console.log('✅ Created article comments');

  // Create Cultures
  const cultures = await Promise.all([
    prisma.culture.create({
      data: {
        name: 'Reog Ponorogo',
        slug: 'reog-ponorogo',
        subtitle: 'Tarian Mistis dari Gerbang Timur Jawa',
        description: 'Reog adalah salah satu kesenian budaya yang berasal dari Jawa Timur bagian barat-laut.',
        longDescription: 'Reog adalah salah satu budaya daerah di Indonesia yang masih sangat kental dengan hal-hal yang berbau mistis...',
        meaning: 'Tarian ini menggambarkan singa barong, raja hutan...',
        location: 'Ponorogo, Jawa Timur',
        province: 'Jawa Timur',
        city: 'Ponorogo',
        latitude: -7.8754,
        longitude: 111.4625,
        status: 'active',
        isEndangered: true,
        thumbnail: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
        category: 'tarian',
      },
    }),
    prisma.culture.create({
      data: {
        name: 'Tari Saman',
        slug: 'tari-saman',
        subtitle: 'Tarian Seribu Tangan dari Aceh',
        description: 'Tari Saman adalah tarian suku Gayo yang biasa ditampilkan untuk merayakan peristiwa-peristiwa penting.',
        longDescription: 'Dalam beberapa literatur menyebutkan, tari Saman diciptakan oleh Syekh Saman...',
        meaning: 'Tari Saman mengandung pendidikan keagamaan, sopan santun, kepahlawanan...',
        location: 'Gayo Lues, Aceh',
        province: 'Aceh',
        city: 'Gayo Lues',
        latitude: 4.323,
        longitude: 97.325,
        status: 'active',
        isEndangered: true,
        thumbnail: 'https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?w=800',
        category: 'tarian',
      },
    }),
    prisma.culture.create({
      data: {
        name: 'Batik Parang',
        slug: 'batik-parang',
        subtitle: 'Motif Keris Diagonal yang Megah',
        description: 'Batik Parang adalah salah satu motif batik tertua di Indonesia.',
        longDescription: 'Parang berasal dari kata "Pereng" yang berarti lereng...',
        meaning: 'Motif parang melambangkan keluhuran budi, kekuatan, dan keteguhan hati.',
        location: 'Yogyakarta, DI Yogyakarta',
        province: 'DI Yogyakarta',
        city: 'Yogyakarta',
        latitude: -7.7956,
        longitude: 110.3695,
        status: 'active',
        isEndangered: false,
        thumbnail: 'https://images.unsplash.com/photo-1610419312715-8e686a036c56?w=800',
        category: 'pakaian',
      },
    }),
  ]);

  console.log('✅ Created cultures');

  // Create Culture Images
  await Promise.all([
    prisma.cultureImage.create({
      data: {
        cultureId: cultures[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200',
        altText: 'Reog Ponorogo Main',
        isPrimary: true,
        displayOrder: 0,
      },
    }),
    prisma.cultureImage.create({
      data: {
        cultureId: cultures[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600',
        altText: 'Reog Ponorogo 2',
        isPrimary: false,
        displayOrder: 1,
      },
    }),
  ]);

  console.log('✅ Created culture images');

  // Create User Badges
  await Promise.all([
    prisma.userBadge.create({
      data: {
        userId: users[0].id,
        badgeId: badges[0].id,
      },
    }),
    prisma.userBadge.create({
      data: {
        userId: users[0].id,
        badgeId: badges[1].id,
      },
    }),
  ]);

  console.log('✅ Created user badges');

  // Create User Complete Challenges
  await Promise.all([
    prisma.userCompleteChallenge.create({
      data: {
        userId: users[0].id,
        challengeId: challenges[0].id,
      },
    }),
    prisma.userCompleteChallenge.create({
      data: {
        userId: users[0].id,
        challengeId: challenges[1].id,
      },
    }),
  ]);

  console.log('✅ Created user complete challenges');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
