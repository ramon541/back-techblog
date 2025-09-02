/*
  Warnings:

  - The primary key for the `article_tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `articleId` on the `article_tags` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `article_tags` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `article_tags` table. All the data in the column will be lost.
  - The primary key for the `articles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorId` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `articles` table. All the data in the column will be lost.
  - The primary key for the `comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `articleId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `comments` table. All the data in the column will be lost.
  - The primary key for the `tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `tags` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `tags` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - Added the required column `article_id` to the `article_tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag_id` to the `article_tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `articles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `articles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `article_id` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `article_tags` DROP FOREIGN KEY `article_tags_articleId_fkey`;

-- DropForeignKey
ALTER TABLE `article_tags` DROP FOREIGN KEY `article_tags_tagId_fkey`;

-- DropForeignKey
ALTER TABLE `articles` DROP FOREIGN KEY `articles_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_articleId_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_userId_fkey`;

-- DropIndex
DROP INDEX `article_tags_tagId_fkey` ON `article_tags`;

-- DropIndex
DROP INDEX `articles_authorId_fkey` ON `articles`;

-- DropIndex
DROP INDEX `comments_articleId_fkey` ON `comments`;

-- DropIndex
DROP INDEX `comments_parentId_fkey` ON `comments`;

-- DropIndex
DROP INDEX `comments_userId_fkey` ON `comments`;

-- AlterTable
ALTER TABLE `article_tags` DROP PRIMARY KEY,
    DROP COLUMN `articleId`,
    DROP COLUMN `isDeleted`,
    DROP COLUMN `tagId`,
    ADD COLUMN `article_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `tag_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`article_id`, `tag_id`);

-- AlterTable
ALTER TABLE `articles` DROP PRIMARY KEY,
    DROP COLUMN `authorId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `isDeleted`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `author_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `comments` DROP PRIMARY KEY,
    DROP COLUMN `articleId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `isDeleted`,
    DROP COLUMN `parentId`,
    DROP COLUMN `userId`,
    ADD COLUMN `article_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `parent_id` VARCHAR(191) NULL,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `tags` DROP PRIMARY KEY,
    DROP COLUMN `createdAt`,
    DROP COLUMN `isDeleted`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    DROP COLUMN `createdAt`,
    DROP COLUMN `isDeleted`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_tags` ADD CONSTRAINT `article_tags_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_tags` ADD CONSTRAINT `article_tags_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `comments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
