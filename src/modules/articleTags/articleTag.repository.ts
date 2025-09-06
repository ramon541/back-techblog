/**
 * ArticleTag Repository
 *
 * This file contains all database operations related to ArticleTag entity.
 * It serves as the data access layer, providing a clean interface between
 * the business logic and the database using Prisma ORM.
 *
 * Responsibilities:
 * - CRUD operations for ArticleTag entity (many-to-many relations)
 * - Query optimization and database interactions
 * - Data persistence and retrieval
 * - Batch operations for tag associations
 */
import prisma from '../../config/database.js';

export const articleTagRepository = {
    //= =================================================================================
    create: async (data: ICreateArticleTagDTO): Promise<IArticleTag> => {
        return prisma.articleTag.create({ data });
    },

    //= =================================================================================
    createMany: async (
        data: Array<ICreateArticleTagDTO>
    ): Promise<{ count: number }> => {
        return prisma.articleTag.createMany({
            data,
            skipDuplicates: true,
        });
    },

    //= =================================================================================
    findTagsByArticleId: async ({
        articleId,
    }: Pick<IArticleTag, 'articleId'>): Promise<Array<IArticleTag>> => {
        return prisma.articleTag.findMany({
            where: {
                articleId,
                deletedAt: null,
            },
            include: {
                tag: true,
            },
        });
    },

    //= =================================================================================
    findArticlesByTagId: async ({
        tagId,
    }: Pick<IArticleTag, 'tagId'>): Promise<Array<IArticleTag>> => {
        return prisma.articleTag.findMany({
            where: {
                tagId,
                deletedAt: null,
            },
            include: {
                article: true,
            },
        });
    },

    //= =================================================================================
    findByArticleAndTag: async (
        articleId: string,
        tagId: string
    ): Promise<IArticleTag | null> => {
        return prisma.articleTag.findUnique({
            where: {
                articleId_tagId: { articleId, tagId },
            },
        });
    },

    //= =================================================================================
    deleteByArticleId: async ({
        articleId,
    }: Pick<IArticleTag, 'articleId'>): Promise<{ count: number }> => {
        return prisma.articleTag.deleteMany({
            where: { articleId },
        });
    },

    //= =================================================================================
    deleteByTagId: async ({
        tagId,
    }: Pick<IArticleTag, 'tagId'>): Promise<{ count: number }> => {
        return prisma.articleTag.deleteMany({
            where: { tagId },
        });
    },

    //= =================================================================================
    deleteByArticleAndTag: async (
        articleId: string,
        tagId: string
    ): Promise<IArticleTag> => {
        return prisma.articleTag.delete({
            where: {
                articleId_tagId: { articleId, tagId },
            },
        });
    },

    //= =================================================================================
    softDeleteByArticleId: async (
        articleId: string
    ): Promise<{ count: number }> => {
        return prisma.articleTag.updateMany({
            where: { articleId },
            data: { deletedAt: new Date() },
        });
    },
};
