-- ============================================
-- SEED DATA UNTUK QUIZ SYSTEM
-- ============================================

-- Insert Sample Quizzes
INSERT INTO `quizzes` (`title`, `slug`, `description`, `thumbnail`, `category`, `difficulty`, `time_limit`, `total_questions`, `status`, `created_at`, `updated_at`) VALUES
('Jelajah Candi Nusantara', 'jelajah-candi-nusantara', 'Seberapa jauh pengetahuanmu tentang candi-candi megah yang tersebar di seluruh Indonesia?', 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80', 'Candi', 'medium', 5, 10, 'published', NOW(), NOW()),
('Ragam Tarian Indonesia', 'ragam-tarian-indonesia', 'Kenali berbagai tarian tradisional dari Sabang sampai Merauke dalam kuis yang seru ini.', 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800&q=80', 'Tarian', 'easy', 3, 10, 'published', NOW(), NOW()),
('Cita Rasa Kuliner Khas', 'cita-rasa-kuliner-khas', 'Tebak nama dan asal masakan tradisional Indonesia. Awas, bikin lapar!', 'https://images.unsplash.com/photo-1604429278231-e5d2d3e2e00c?w=800&q=80', 'Kuliner', 'medium', 7, 10, 'published', NOW(), NOW());

-- Insert Questions for "Jelajah Candi Nusantara" (Quiz ID 1)
INSERT INTO `quiz_questions` (`quiz_id`, `question`, `image_url`, `explanation`, `order_number`, `points`, `created_at`, `updated_at`) VALUES
(1, 'Candi manakah yang reliefnya menceritakan kisah Ramayana dan Krishnayana?', 'https://images.unsplash.com/photo-1591178825729-928ea0a0fe95?w=800&q=80', 'Jawaban yang tepat. Relief Ramayana di Candi Prambanan terpahat pada dinding pagar langkan Candi Siwa dan Candi Brahma, memberikan narasi visual yang luar biasa.', 1, 100, NOW(), NOW()),
(1, 'Candi Buddha terbesar di dunia yang terletak di Magelang adalah...', 'https://images.unsplash.com/photo-1555400082-6e33d2fc4a21?w=800&q=80', 'Candi Borobudur adalah monumen Buddha Mahayana abad ke-9 di Magelang, Jawa Tengah, Indonesia. Monumen ini terdiri atas sembilan teras berundak, enam berbentuk bujur sangkar dan tiga berbentuk bundar, dengan sebuah stupa induk di puncaknya.', 2, 100, NOW(), NOW()),
(1, 'Siapakah arsitek yang merancang pembangunan Candi Borobudur?', 'https://images.unsplash.com/photo-1555400082-6e33d2fc4a21?w=800&q=80', 'Gunadharma adalah arsitek legendaris yang dipercaya merancang Candi Borobudur pada masa Dinasti Syailendra.', 3, 100, NOW(), NOW()),
(1, 'Candi Prambanan dibangun pada abad ke...', NULL, 'Candi Prambanan dibangun pada abad ke-9 Masehi oleh Rakai Pikatan dari dinasti Sanjaya atau Balitung Maha Sambu.', 4, 100, NOW(), NOW()),
(1, 'Berapa jumlah stupa di Candi Borobudur?', NULL, 'Candi Borobudur memiliki 504 arca Buddha dan 72 stupa berlubang yang mengelilingi stupa induk di puncaknya.', 5, 100, NOW(), NOW()),
(1, 'Candi yang terletak di Jawa Timur dan merupakan peninggalan Kerajaan Singhasari adalah...', 'https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=800&q=80', 'Candi Singosari terletak di Kabupaten Malang, Jawa Timur, dan merupakan peninggalan Kerajaan Singhasari yang didirikan sekitar tahun 1304 M.', 6, 100, NOW(), NOW()),
(1, 'Apa fungsi utama Candi Borobudur pada masa dibangun?', NULL, 'Candi Borobudur dibangun sebagai tempat ibadah umat Buddha dan tempat ziarah menuju kesempurnaan spiritual.', 7, 100, NOW(), NOW()),
(1, 'Candi yang memiliki relief cerita Ramayana paling lengkap adalah...', NULL, 'Candi Prambanan memiliki relief cerita Ramayana yang sangat lengkap, terpahat di dinding Candi Siwa.', 8, 100, NOW(), NOW()),
(1, 'Pada tahun berapa Candi Borobudur ditetapkan sebagai Situs Warisan Dunia UNESCO?', NULL, 'Candi Borobudur ditetapkan sebagai Situs Warisan Dunia UNESCO pada tahun 1991.', 9, 100, NOW(), NOW()),
(1, 'Apa nama kompleks candi yang berada di sekitar Candi Prambanan?', NULL, 'Di sekitar Candi Prambanan terdapat kompleks candi lain seperti Candi Sewu, Candi Lumbung, Candi Bubrah, dan Candi Plaosan.', 10, 100, NOW(), NOW());

-- Insert Options for Question 1 (Candi manakah yang reliefnya menceritakan kisah Ramayana)
INSERT INTO `quiz_options` (`question_id`, `option_text`, `is_correct`, `order_number`, `created_at`) VALUES
(1, 'Candi Borobudur', 0, 1, NOW()),
(1, 'Candi Prambanan', 1, 2, NOW()),
(1, 'Candi Sewu', 0, 3, NOW()),
(1, 'Candi Plaosan', 0, 4, NOW());

-- Insert Options for Question 2 (Candi Buddha terbesar)
INSERT INTO `quiz_options` (`question_id`, `option_text`, `is_correct`, `order_number`, `created_at`) VALUES
(2, 'Candi Borobudur', 1, 1, NOW()),
(2, 'Candi Mendut', 0, 2, NOW()),
(2, 'Candi Pawon', 0, 3, NOW()),
(2, 'Candi Kalasan', 0, 4, NOW());

-- Insert Options for Question 3 (Arsitek Borobudur)
INSERT INTO `quiz_options` (`question_id`, `option_text`, `is_correct`, `order_number`, `created_at`) VALUES
(3, 'Gunadharma', 1, 1, NOW()),
(3, 'Empu Sindok', 0, 2, NOW()),
(3, 'Mpu Prapanca', 0, 3, NOW()),
(3, 'Rakai Panangkaran', 0, 4, NOW());

-- Insert Options for Question 4 (Candi Prambanan abad ke)
INSERT INTO `quiz_options` (`question_id`, `option_text`, `is_correct`, `order_number`, `created_at`) VALUES
(4, 'Abad ke-7', 0, 1, NOW()),
(4, 'Abad ke-8', 0, 2, NOW()),
(4, 'Abad ke-9', 1, 3, NOW()),
(4, 'Abad ke-10', 0, 4, NOW());

-- Insert Options for Question 5 (Jumlah stupa Borobudur)
INSERT INTO `quiz_options` (`question_id`, `option_text`, `is_correct`, `order_number`, `created_at`) VALUES
(5, '504 stupa', 0, 1, NOW()),
(5, '72 stupa', 1, 2, NOW()),
(5, '108 stupa', 0, 3, NOW()),
(5, '360 stupa', 0, 4, NOW());

-- Insert Options for Question 6 (Candi Jawa Timur)
INSERT INTO `quiz_options` (`question_id`, `option_text`, `is_correct`, `order_number`, `created_at`) VALUES
(6, 'Candi Penataran', 0, 1, NOW()),
(6, 'Candi Singosari', 1, 2, NOW()),
(6, 'Candi Jago', 0, 3, NOW()),
(6, 'Candi Kidal', 0, 4, NOW());

-- Insert Options for Question 7 (Fungsi Borobudur)
INSERT INTO `quiz_options` (`question_id`, `option_text`, `is_correct`, `order_number`, `created_at`) VALUES
(7, 'Istana Raja', 0, 1, NOW()),
(7, 'Tempat ibadah dan ziarah', 1, 2, NOW()),
(7, 'Makam kerajaan', 0, 3, NOW()),
(7, 'Benteng pertahanan', 0, 4, NOW());

-- Insert Options for Question 8 (Relief Ramayana lengkap)
INSERT INTO `quiz_options` (`question_id`, `option_text`, `is_correct`, `order_number`, `created_at`) VALUES
(8, 'Candi Borobudur', 0, 1, NOW()),
(8, 'Candi Prambanan', 1, 2, NOW()),
(8, 'Candi Sewu', 0, 3, NOW()),
(8, 'Candi Mendut', 0, 4, NOW());

-- Insert Options for Question 9 (UNESCO tahun)
INSERT INTO `quiz_options` (`question_id`, `option_text`, `is_correct`, `order_number`, `created_at`) VALUES
(9, '1982', 0, 1, NOW()),
(9, '1991', 1, 2, NOW()),
(9, '2000', 0, 3, NOW()),
(9, '2010', 0, 4, NOW());

-- Insert Options for Question 10 (Kompleks candi sekitar Prambanan)
INSERT INTO `quiz_options` (`question_id`, `option_text`, `is_correct`, `order_number`, `created_at`) VALUES
(10, 'Candi Borobudur dan Mendut', 0, 1, NOW()),
(10, 'Candi Sewu dan Plaosan', 1, 2, NOW()),
(10, 'Candi Singosari dan Penataran', 0, 3, NOW()),
(10, 'Candi Kalasan dan Sari', 0, 4, NOW());

-- Verify data
SELECT 'Quizzes created:' as Info, COUNT(*) as Count FROM quizzes;
SELECT 'Questions created:' as Info, COUNT(*) as Count FROM quiz_questions;
SELECT 'Options created:' as Info, COUNT(*) as Count FROM quiz_options;
