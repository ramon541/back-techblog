/**
 * User Repository
 *
 * This file contains all database operations related to User entity.
 * It serves as the data access layer, providing a clean interface between
 * the business logic and the database using Prisma ORM.
 *
 * Responsibilities:
 * - CRUD operations for User entity
 * - Query optimization and database interactions
 * - Data persistence and retrieval
 * - Soft delete implementation
 */

import prisma from '../../config/database.js';

export const userRepository = {
    create: async (data: CreateUserDTO): Promise<User> => {
        return prisma.user.create({ data });
    },

    //= =================================================================================
    findByEmail: async (email: Pick<User, 'email'>): Promise<User | null> => {
        return prisma.user.findUnique({
            where: email,
        });
    },

    //= =================================================================================
    findAll: async (): Promise<Array<User>> => {
        return prisma.user.findMany({
            where: { deletedAt: null },
        });
    },

    //= =================================================================================
    findById: async (id: Pick<User, 'id'>): Promise<User | null> => {
        return prisma.user.findUnique({
            where: id,
        });
    },

    //= =================================================================================
    update: async (
        id: Pick<User, 'id'>,
        data: UpdateUserDTO
    ): Promise<User> => {
        return prisma.user.update({
            where: id,
            data,
        });
    },

    //= =================================================================================
    softDelete: async (id: Pick<User, 'id'>): Promise<User> => {
        return prisma.user.update({
            where: id,
            data: { deletedAt: new Date() },
        });
    },

    //= =================================================================================
    count: async (): Promise<number> => {
        return prisma.user.count({
            where: { deletedAt: null },
        });
    },

    //= =================================================================================
    // TODO: Adjust pagination
    findManyWithPagination: async (
        page: number = 1,
        limit: number = 10
    ): Promise<{ users: Array<User>; total: number }> => {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where: { deletedAt: null },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({
                where: { deletedAt: null },
            }),
        ]);

        return { users, total };
    },
};

//= =================================================================================
export type UserRepository = typeof userRepository;
