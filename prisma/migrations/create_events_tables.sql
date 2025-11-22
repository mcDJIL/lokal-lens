-- Create events table
CREATE TABLE IF NOT EXISTS `events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT NOT NULL,
  `long_description` TEXT NULL,
  `thumbnail` VARCHAR(500) NULL,
  `date_start` DATETIME NOT NULL,
  `date_end` DATETIME NOT NULL,
  `time_start` VARCHAR(10) NULL,
  `time_end` VARCHAR(10) NULL,
  `location_name` VARCHAR(255) NOT NULL,
  `location_city` VARCHAR(100) NOT NULL,
  `location_province` VARCHAR(100) NOT NULL,
  `location_address` TEXT NULL,
  `latitude` DOUBLE NULL,
  `longitude` DOUBLE NULL,
  `map_embed_url` TEXT NULL,
  `price` INT NULL,
  `status` ENUM('available', 'sold_out', 'free', 'cancelled', 'completed') NOT NULL DEFAULT 'available',
  `category` VARCHAR(100) NULL,
  `organizer` VARCHAR(255) NULL,
  `contact_email` VARCHAR(255) NULL,
  `contact_phone` VARCHAR(50) NULL,
  `website_url` VARCHAR(500) NULL,
  `views` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_slug` (`slug`),
  INDEX `idx_date_start` (`date_start`),
  INDEX `idx_status` (`status`),
  INDEX `idx_location_province` (`location_province`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create event_performers table
CREATE TABLE IF NOT EXISTS `event_performers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `event_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `image_url` VARCHAR(500) NULL,
  `order_number` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_event_id` (`event_id`),
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create event_galleries table
CREATE TABLE IF NOT EXISTS `event_galleries` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `event_id` INT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `alt_text` VARCHAR(255) NOT NULL,
  `order_number` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_event_id` (`event_id`),
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
