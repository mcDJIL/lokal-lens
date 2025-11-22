-- CreateTable
CREATE TABLE `scan_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `culture_id` INTEGER NULL,
    `object_name` VARCHAR(191) NOT NULL,
    `object_type` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `province` VARCHAR(191) NULL,
    `accuracy` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `image_data` LONGTEXT NULL,
    `scan_result` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `scan_history_user_id_idx`(`user_id`),
    INDEX `scan_history_culture_id_idx`(`culture_id`),
    INDEX `scan_history_object_type_idx`(`object_type`),
    INDEX `scan_history_province_idx`(`province`),
    INDEX `scan_history_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `scan_history` ADD CONSTRAINT `scan_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scan_history` ADD CONSTRAINT `scan_history_culture_id_fkey` FOREIGN KEY (`culture_id`) REFERENCES `cultures`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
