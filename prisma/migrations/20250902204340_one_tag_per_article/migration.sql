/*
  Warnings:

  - You are about to drop the `article_tags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tag_id` to the `articles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `article_tags` DROP FOREIGN KEY `article_tags_article_id_fkey`;

-- DropForeignKey
ALTER TABLE `article_tags` DROP FOREIGN KEY `article_tags_tag_id_fkey`;

-- AlterTable
ALTER TABLE `articles` ADD COLUMN `tag_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `article_tags`;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
