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
        tagId,
        page = 1,
        limit = 10,
    }: IArticleSearchDTO): Promise<Array<IArticleSearchResponseDTO>> => {
        const orConditions = [];
        const andConditions = [];

        if (term && term.trim() !== '') {
            orConditions.push({ title: { contains: term } });
        }

        if (tagId && tagId.trim() !== '') {
            andConditions.push({
                tags: {
                    some: {
                        tagId: tagId,
                    },
                },
            });
        }

        return prisma.article.findMany({
            where: {
                deletedAt: null,
                ...(orConditions.length > 0 && { OR: orConditions }),
                ...(andConditions.length > 0 && { AND: andConditions }),
            },
            include: {
                tags: {
                    select: {
                        tagId: true,
                        tag: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });
    },

    //= =================================================================================
    countByTerm: async ({
        term,
        tagId,
    }: Omit<IArticleSearchDTO, 'page' | 'limit'>): Promise<number> => {
        const orConditions = [];

        if (term && term.trim() !== '') {
            orConditions.push({ title: { contains: term } });
            orConditions.push({ author: { name: { contains: term } } });
        }

        if (tagId && tagId.trim() !== '') {
            orConditions.push({
                tags: {
                    some: {
                        tagId: tagId,
                    },
                },
            });
        }

        return prisma.article.count({
            where: {
                deletedAt: null,
                ...(orConditions.length > 0 && { OR: orConditions }),
            },
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
            include: {
                author: {
                    select: {
                        name: true,
                    },
                },
                tags: {
                    select: {
                        tagId: true,
                        tag: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
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
