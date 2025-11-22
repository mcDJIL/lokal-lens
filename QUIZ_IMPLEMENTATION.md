# 📝 Dokumentasi Sistem Kuis Dinamis - Lokal Lens

## 🎯 Overview
Sistem kuis interaktif dengan database dinamis untuk menguji pengetahuan pengguna tentang budaya Indonesia.

## 📋 Database Schema

### Tables Created:
1. **quizzes** - Menyimpan data kuis
2. **quiz_questions** - Menyimpan pertanyaan kuis
3. **quiz_options** - Menyimpan pilihan jawaban
4. **quiz_attempts** - Menyimpan percobaan quiz user
5. **quiz_answers** - Menyimpan jawaban user per pertanyaan

### Enums:
- `QuizStatus`: draft, published, archived
- `QuizDifficulty`: easy, medium, hard

## 🚀 Setup & Migration

### 1. Generate Prisma Client
```bash
npx prisma generate
```

### 2. Push Schema ke Database
```bash
npx prisma db push
```

### 3. Seed Data (Opsional - Manual via MySQL)
Jalankan file `prisma/seed_quiz.sql` di MySQL Workbench atau command line:
```bash
mysql -u your_username -p your_database < prisma/seed_quiz.sql
```

## 📡 API Endpoints

### 1. GET /api/quizzes
Mendapatkan semua kuis yang published

**Query Parameters:**
- `category` (optional): Filter by category
- `difficulty` (optional): easy|medium|hard

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Jelajah Candi Nusantara",
      "slug": "jelajah-candi-nusantara",
      "description": "...",
      "thumbnail": "...",
      "category": "Candi",
      "difficulty": "medium",
      "time_limit": 5,
      "total_questions": 10,
      "total_attempts": 150
    }
  ]
}
```

### 2. GET /api/quizzes/[slug]
Mendapatkan detail kuis

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Jelajah Candi Nusantara",
    "slug": "jelajah-candi-nusantara",
    ...
  }
}
```

### 3. POST /api/quizzes/[slug]/start
Memulai kuis baru (membuat attempt)

**Body:**
```json
{
  "userId": 1  // optional, null for guest
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "attemptId": 123,
    "questions": [
      {
        "id": 1,
        "question": "...",
        "image_url": "...",
        "order_number": 1,
        "points": 100,
        "options": [
          {
            "id": 1,
            "option_text": "...",
            "order_number": 1
          }
        ]
      }
    ],
    "totalPoints": 1000
  }
}
```

### 4. POST /api/quizzes/attempts/[id]/answer
Submit jawaban untuk satu pertanyaan

**Body:**
```json
{
  "questionId": 1,
  "optionId": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isCorrect": true,
    "correctOptionId": 2,
    "correctOptionText": "Candi Prambanan",
    "explanation": "...",
    "pointsEarned": 100,
    "currentScore": 300
  }
}
```

### 5. POST /api/quizzes/attempts/[id]/complete
Menyelesaikan kuis

**Body:**
```json
{
  "timeTaken": 180  // in seconds
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "attemptId": 123,
    "score": 800,
    "totalPoints": 1000,
    "correctAnswers": 8,
    "wrongAnswers": 2,
    "percentage": 80,
    "timeTaken": 180,
    "quizTitle": "...",
    "quizSlug": "...",
    "totalQuestions": 10
  }
}
```

### 6. GET /api/quizzes/attempts/[id]/complete
Mendapatkan hasil dan pembahasan kuis

**Response:**
```json
{
  "success": true,
  "data": {
    "attemptId": 123,
    "quizTitle": "...",
    "score": 800,
    "percentage": 80,
    "answers": [
      {
        "questionNumber": 1,
        "question": "...",
        "imageUrl": "...",
        "isCorrect": true,
        "userAnswer": "Candi Prambanan",
        "correctAnswer": "Candi Prambanan",
        "explanation": "..."
      }
    ]
  }
}
```

## 📁 File Structure

```
app/
├── api/
│   └── quizzes/
│       ├── route.ts                         # GET all quizzes
│       ├── [slug]/
│       │   ├── route.ts                    # GET quiz detail
│       │   └── start/
│       │       └── route.ts                # POST start quiz
│       └── attempts/
│           └── [id]/
│               ├── answer/
│               │   └── route.ts            # POST submit answer
│               └── complete/
│                   └── route.ts            # POST/GET complete quiz
└── kuis/
    ├── page.tsx                            # List all quizzes (UPDATED)
    ├── [id]/
    │   ├── detail/
    │   │   ├── page.tsx                    # Quiz detail (TODO)
    │   │   └── page2.tsx                   # New implementation
    │   ├── mulai/
    │   │   └── page.tsx                    # Quiz play (TODO)
    │   ├── skor/
    │   │   └── page.tsx                    # Quiz result (TODO)
    │   ├── pembahasan/
    │   │   └── page.tsx                    # Quiz review (TODO)
    │   └── bagikan/
    │       └── page.tsx                    # Share achievement

components/
└── sections/
    └── ListKuis/
        ├── QuizGridSection.tsx             # Original
        ├── QuizGridSection2.tsx            # NEW - Dynamic version
        └── QuizCard.tsx                    # UPDATED with slug

prisma/
├── schema.prisma                           # UPDATED with quiz models
└── seed_quiz.sql                           # NEW - Sample data
```

## 🔄 Pages Status

### ✅ Completed:
- [x] List Kuis (`/kuis`) - Dinamis dengan filter
- [x] API Endpoints (semua 6 endpoints)
- [x] Database Schema & Migrations
- [x] Seed Data SQL

### 🚧 TODO - Perlu Update:
1. **Detail Kuis** (`/kuis/[id]/detail`)
   - Update HeroSection untuk terima dynamic props
   - Fetch quiz detail dari API
   - Tombol "Mulai Kuis" ke `/kuis/[slug]/mulai`

2. **Mulai Kuis** (`/kuis/[id]/mulai`)
   - Call API `/api/quizzes/[slug]/start` saat page load
   - Simpan attemptId ke state
   - Loop through questions
   - Call API `/api/quizzes/attempts/[id]/answer` setiap submit
   - Tracking score real-time
   - Redirect ke `/skor` setelah selesai

3. **Halaman Skor** (`/kuis/[id]/skor`)
   - Call API `/api/quizzes/attempts/[id]/complete` (POST)
   - Tampilkan hasil (score, percentage, correct/wrong count)
   - Tombol "Lihat Pembahasan" dan "Bagikan"

4. **Halaman Pembahasan** (`/kuis/[id]/pembahasan`)
   - Call API `/api/quizzes/attempts/[id]/complete` (GET)
   - Loop semua questions dengan jawaban user
   - Show correct answer + explanation
   - Highlight benar/salah

5. **Halaman Bagikan** (`/kuis/[id]/bagikan`)
   - Update URL dengan attemptId
   - Dynamic quiz title & score

## 🎨 Components yang Perlu Update

### 1. QuizCard.tsx ✅
- Sudah diupdate untuk gunakan `quiz.slug`

### 2. HeroSection (Detail Kuis)
Perlu tambah props:
```tsx
interface HeroSectionProps {
  quiz: {
    title: string;
    description: string;
    thumbnail: string;
    category: string;
    difficulty: string;
    time_limit: number;
    total_questions: number;
  };
  onStartQuiz: () => void;
}
```

### 3. QuizHeader (Mulai Kuis)
Sudah OK, tapi perlu dynamic title

### 4. QuestionCard (Mulai Kuis)
Sudah OK dengan props dynamic

### 5. AnswerOptions (Mulai Kuis)
Sudah OK dengan props dynamic

## 💾 Data Flow

### Starting Quiz:
1. User klik "Mulai Kuis" di detail page
2. POST `/api/quizzes/[slug]/start` → get attemptId & questions
3. Navigate ke `/kuis/[slug]/mulai?attemptId=123`

### Answering Questions:
1. User pilih jawaban
2. POST `/api/quizzes/attempts/[attemptId]/answer`
3. Get feedback (correct/wrong) + explanation
4. Update local score
5. Show next question atau finish

### Completing Quiz:
1. Setelah jawab semua questions
2. POST `/api/quizzes/attempts/[attemptId]/complete` with timeTaken
3. Navigate ke `/kuis/[slug]/skor?attemptId=123`

### Viewing Results:
1. GET `/api/quizzes/attempts/[attemptId]/complete`
2. Show score, percentage, review answers

## 🔐 Security Notes

- Guest users dapat main kuis (userId null)
- Logged in users tracked dengan userId
- Validation di server-side untuk semua submissions
- Tidak expose correct answers di start endpoint
- Validate attemptId belongs to user (future: add middleware)

## 📊 Future Enhancements

1. **Leaderboard** - Top scores per quiz
2. **Timer** - Countdown untuk time_limit quizzes
3. **Hints** - Point deduction untuk hints
4. **Bookmarks** - Save quizzes for later
5. **Categories Page** - Browse by category
6. **Search** - Search quizzes by title/description
7. **User Progress** - Track completion & scores
8. **Badges** - Achievements untuk quiz completion
9. **Retry Limit** - Limit attempts per quiz
10. **Analytics** - Admin dashboard untuk quiz stats

## 🐛 Testing Checklist

- [ ] Create quiz via MySQL
- [ ] List quizzes with filters
- [ ] View quiz detail
- [ ] Start quiz as guest
- [ ] Start quiz as logged-in user
- [ ] Answer questions (correct & wrong)
- [ ] Complete quiz
- [ ] View score page
- [ ] View pembahasan
- [ ] Share achievement
- [ ] Retry quiz (new attempt)

## 📞 Support

Untuk pertanyaan atau issues, hubungi tim development.
