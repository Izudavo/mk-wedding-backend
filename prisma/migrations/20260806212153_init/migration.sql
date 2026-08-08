-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccessCode` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `status` ENUM('UNUSED', 'USED') NOT NULL DEFAULT 'UNUSED',
    `used_at` DATETIME(3) NULL,
    `rsvp_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AccessCode_code_key`(`code`),
    UNIQUE INDEX `AccessCode_rsvp_id_key`(`rsvp_id`),
    INDEX `AccessCode_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RSVP` (
    `id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `has_plus_one` BOOLEAN NOT NULL DEFAULT false,
    `plus_one_name` VARCHAR(191) NULL,
    `source` ENUM('ONLINE', 'MANUAL') NOT NULL,
    `qr_token` VARCHAR(191) NOT NULL,
    `check_in_status` ENUM('PENDING', 'CHECKED_IN') NOT NULL DEFAULT 'PENDING',
    `checked_in_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RSVP_qr_token_key`(`qr_token`),
    INDEX `RSVP_full_name_idx`(`full_name`),
    INDEX `RSVP_phone_number_idx`(`phone_number`),
    INDEX `RSVP_check_in_status_idx`(`check_in_status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AccessCode` ADD CONSTRAINT `AccessCode_rsvp_id_fkey` FOREIGN KEY (`rsvp_id`) REFERENCES `RSVP`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
