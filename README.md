# Lokal Lens Backend

Backend API untuk project Lokal Lens menggunakan ExpressJS, Prisma, dan MySQL.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy file `.env.example` ke `.env` dan sesuaikan konfigurasi database:
```bash
copy .env.example .env
```

3. Update DATABASE_URL di file `.env` dengan kredensial MySQL Anda:
```
DATABASE_URL="mysql://root:@localhost:3306/lokal-lens"
```

4. Generate Prisma Client dan jalankan migrasi:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Jalankan seeder untuk mengisi data awal:
```bash
npm run prisma:seed
```

6. Jalankan server:
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## Database Schema

Database ini memiliki tabel-tabel berikut:
- **users** - Data pengguna (admin, contributor, officer, user)
- **profiles** - Profil pengguna
- **articles** - Artikel budaya
- **article_comments** - Komentar artikel
- **cultures** - Data budaya lokal
- **culture_images** - Gambar budaya
- **badges** - Badge/lencana
- **challenges** - Tantangan untuk user
- **certificates** - Sertifikat penghargaan
- **user_badges** - Badge yang dimiliki user
- **user_complete_challenges** - Tantangan yang diselesaikan user
- **user_article_bookmarks** - Bookmark artikel
- **user_comment_votes** - Vote komentar

## Default Users

Setelah seeding, Anda bisa login dengan:
- Admin: `admin@gmail.com` / `password123`
- Contributor: `contributor@gmail.com` / `password123`
- Officer: `officer@gmail.com` / `password123`
- User: `user@gmail.com` / `password123`

## Prisma Commands

- `npm run prisma:studio` - Buka Prisma Studio untuk manage database
- `npm run prisma:migrate` - Buat migrasi baru
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:seed` - Jalankan seeder
