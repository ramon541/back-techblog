/**
 * Comment Repository
 *
 * This file contains all database operations related to Comment entity.
 * It serves as the data access layer, providing a clean interface between
 * the business logic and the database using Prisma ORM.
 *
 * Responsibilities:
 * - CRUD operations for Comment entity
 * - Query optimization and database interactions
 * - Data persistence and retrieval
 * - Soft delete implementation
 */
import prisma from '../../config/database.js';

export const commentRepository = {
    create: async (data: ICreateCommentDTO): Promise<IComment> => {
        return prisma.comment.create({ data });
    },

    //= =================================================================================
    findAll: async ({
        page = 1,
        limit = 10,
    }: ISearchWithPagination): Promise<Array<IComment>> => {
        return prisma.comment.findMany({
            where: { parentId: null },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    },
    //= =================================================================================
    findReplies: async (
        commentId: string,
        page: number = 1,
        limit: number = 5
    ): Promise<IComment[]> => {
        return prisma.comment.findMany({
            where: { parentId: commentId },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'asc' },
        });
    },

    //= =================================================================================
    findById: async (id: Pick<IComment, 'id'>): Promise<IComment | null> => {
        return prisma.comment.findUnique({
            where: id,
        });
    },

    //= =================================================================================
    update: async ({ id, ...data }: IUpdateCommentDTO): Promise<IComment> => {
        return prisma.comment.update({
            where: { id },
            data,
        });
    },

    //= =================================================================================
    softDelete: async (id: Pick<IComment, 'id'>): Promise<IComment> => {
        return prisma.comment.update({
            where: id,
            data: { deletedAt: new Date() },
        });
    },

    //= =================================================================================
    count: async (): Promise<number> => {
        return prisma.comment.count();
    },

    //= =================================================================================
    findByArticle: async ({
        articleId,
    }: Pick<IComment, 'articleId'>): Promise<IComment[]> => {
        return prisma.comment.findMany({
            where: {
                articleId: articleId,
                deletedAt: null,
                parentId: null,
            },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                replies: {
                    where: {
                        deletedAt: null,
                    },
                    orderBy: { createdAt: 'asc' },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                                createdAt: true,
                            },
                        },
                    },
                },
            },
        });
    },
};

//= =================================================================================
export type CommentRepository = typeof commentRepository;
