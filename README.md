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
DATABASE_URL="mysql://user:password@localhost:3306/lokal_lens"
```

4. Generate Prisma Client dan jalankan migrasi:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Jalankan server:
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## API Endpoints

- `GET /` - Welcome message
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Prisma Commands

- `npx prisma studio` - Buka Prisma Studio untuk manage database
- `npx prisma migrate dev` - Buat migrasi baru
- `npx prisma generate` - Generate Prisma Client
