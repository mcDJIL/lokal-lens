-- CreateTable
CREATE TABLE `quizzes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `thumbnail` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `difficulty` ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'medium',
    `time_limit` INTEGER NULL,
    `total_questions` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `quizzes_slug_key`(`slug`),
    INDEX `quizzes_slug_idx`(`slug`),
    INDEX `quizzes_status_idx`(`status`),
    INDEX `quizzes_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quiz_id` INTEGER NOT NULL,
    `question` TEXT NOT NULL,
    `image_url` VARCHAR(191) NULL,
    `explanation` TEXT NULL,
    `order_number` INTEGER NOT NULL,
    `points` INTEGER NOT NULL DEFAULT 100,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `quiz_questions_quiz_id_idx`(`quiz_id`),
    INDEX `quiz_questions_order_number_idx`(`order_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_options` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question_id` INTEGER NOT NULL,
    `option_text` TEXT NOT NULL,
    `is_correct` BOOLEAN NOT NULL DEFAULT false,
    `order_number` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `quiz_options_question_id_idx`(`question_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_attempts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quiz_id` INTEGER NOT NULL,
    `user_id` INTEGER NULL,
    `score` INTEGER NOT NULL DEFAULT 0,
    `total_points` INTEGER NOT NULL DEFAULT 0,
    `correct_answers` INTEGER NOT NULL DEFAULT 0,
    `wrong_answers` INTEGER NOT NULL DEFAULT 0,
    `percentage` DOUBLE NOT NULL DEFAULT 0,
    `time_taken` INTEGER NULL,
    `completed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `quiz_attempts_quiz_id_idx`(`quiz_id`),
    INDEX `quiz_attempts_user_id_idx`(`user_id`),
    INDEX `quiz_attempts_completed_at_idx`(`completed_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_answers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `attempt_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `option_id` INTEGER NOT NULL,
    `is_correct` BOOLEAN NOT NULL DEFAULT false,
    `answered_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `quiz_answers_attempt_id_idx`(`attempt_id`),
    INDEX `quiz_answers_question_id_idx`(`question_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `long_description` TEXT NULL,
    `thumbnail` VARCHAR(191) NULL,
    `date_start` DATETIME(3) NOT NULL,
    `date_end` DATETIME(3) NOT NULL,
    `time_start` VARCHAR(191) NULL,
    `time_end` VARCHAR(191) NULL,
    `location_name` VARCHAR(191) NOT NULL,
    `location_city` VARCHAR(191) NOT NULL,
    `location_province` VARCHAR(191) NOT NULL,
    `location_address` TEXT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `map_embed_url` TEXT NULL,
    `price` INTEGER NULL,
    `status` ENUM('available', 'sold_out', 'free', 'cancelled', 'completed') NOT NULL DEFAULT 'available',
    `category` VARCHAR(191) NULL,
    `organizer` VARCHAR(191) NULL,
    `contact_email` VARCHAR(191) NULL,
    `contact_phone` VARCHAR(191) NULL,
    `website_url` VARCHAR(191) NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `events_slug_key`(`slug`),
    INDEX `events_slug_idx`(`slug`),
    INDEX `events_date_start_idx`(`date_start`),
    INDEX `events_status_idx`(`status`),
    INDEX `events_location_province_idx`(`location_province`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_performers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `event_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `image_url` VARCHAR(191) NULL,
    `order_number` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `event_performers_event_id_idx`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_galleries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `event_id` INTEGER NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `alt_text` VARCHAR(191) NOT NULL,
    `order_number` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `event_galleries_event_id_idx`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `endangered_reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `culture_name` VARCHAR(191) NOT NULL,
    `threat_type` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `image_url` VARCHAR(191) NULL,
    `reporter_name` VARCHAR(191) NULL,
    `reporter_email` VARCHAR(191) NULL,
    `is_anonymous` BOOLEAN NOT NULL DEFAULT false,
    `user_id` INTEGER NULL,
    `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    `admin_notes` TEXT NULL,
    `reviewed_at` DATETIME(3) NULL,
    `reviewed_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `endangered_reports_status_idx`(`status`),
    INDEX `endangered_reports_user_id_idx`(`user_id`),
    INDEX `endangered_reports_province_idx`(`province`),
    INDEX `endangered_reports_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quiz_questions` ADD CONSTRAINT `quiz_questions_quiz_id_fkey` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_options` ADD CONSTRAINT `quiz_options_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_attempts` ADD CONSTRAINT `quiz_attempts_quiz_id_fkey` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_attempts` ADD CONSTRAINT `quiz_attempts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_answers` ADD CONSTRAINT `quiz_answers_attempt_id_fkey` FOREIGN KEY (`attempt_id`) REFERENCES `quiz_attempts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_answers` ADD CONSTRAINT `quiz_answers_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_answers` ADD CONSTRAINT `quiz_answers_option_id_fkey` FOREIGN KEY (`option_id`) REFERENCES `quiz_options`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_performers` ADD CONSTRAINT `event_performers_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_galleries` ADD CONSTRAINT `event_galleries_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `endangered_reports` ADD CONSTRAINT `endangered_reports_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `endangered_reports` ADD CONSTRAINT `endangered_reports_reviewed_by_fkey` FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
