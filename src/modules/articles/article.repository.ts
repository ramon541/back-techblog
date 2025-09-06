/**
 * Article Repository
 *
 * This file contains all database operations related to Article entity.
 * It serves as the data access layer, providing a clean interface between
 * the business logic and the database using Prisma ORM.
 *
 * Responsibilities:
 * - CRUD operations for Article entity
 * - Query optimization and database interactions
 * - Data persistence and retrieval
 * - Soft delete implementation
 */
import prisma from '../../config/database.js';

export const articleRepository = {
    create: async (
        data: Omit<ICreateArticleDTO, 'tagIds'>
    ): Promise<IArticle> => {
        return prisma.article.create({ data });
    },

    //= =================================================================================
    findByTerm: async ({
        term,
        page = 1,
        limit = 10,
    }: IArticleSearchDTO): Promise<Array<IArticle>> => {
        return prisma.article.findMany({
            where: {
                deletedAt: null,
                OR: [
                    { title: { contains: term } },
                    { author: { name: { contains: term } } },
                ],
            },
            include: {
                author: true,
            },
            skip: (page - 1) * limit,
            take: limit,
        });
    },

    //= =================================================================================
    findAll: async ({
        page = 1,
        limit = 10,
    }: ISearchWithPagination): Promise<Array<IArticle>> => {
        return prisma.article.findMany({
            skip: (page - 1) * limit,
            take: limit,
        });
    },

    //= =================================================================================
    findById: async (id: Pick<IArticle, 'id'>): Promise<IArticle | null> => {
        return prisma.article.findUnique({
            where: id,
        });
    },

    //= =================================================================================
    update: async ({ id, ...data }: IUpdateArticleDTO): Promise<IArticle> => {
        return prisma.article.update({
            where: { id },
            data,
        });
    },

    //= =================================================================================
    softDelete: async (id: Pick<IArticle, 'id'>): Promise<IArticle> => {
        return prisma.article.update({
            where: id,
            data: { deletedAt: new Date() },
        });
    },

    //= =================================================================================
    count: async (): Promise<number> => {
        return prisma.article.count();
    },
};

//= =================================================================================
export type ArticleRepository = typeof articleRepository;
