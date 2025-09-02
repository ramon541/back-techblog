/**
 * Tag Repository
 *
 * This file contains all database operations related to Tag entity.
 * It serves as the data access layer, providing a clean interface between
 * the business logic and the database using Prisma ORM.
 *
 * Responsibilities:
 * - CRUD operations for Tag entity
 * - Query optimization and database interactions
 * - Data persistence and retrieval
 * - Soft delete implementation
 * - Tag name uniqueness validation
 * - Tag counting and filtering operations
 */
import prisma from '../../config/database.js';

export const tagRepository = {
    create: async (data: ICreateTagDTO): Promise<ITag> => {
        return prisma.tag.create({ data });
    },

    //= =================================================================================
    findByName: async (name: Pick<ITag, 'name'>): Promise<ITag | null> => {
        return prisma.tag.findUnique({
            where: name,
        });
    },

    //= =================================================================================
    findAll: async (): Promise<Array<ITag>> => {
        return prisma.tag.findMany();
    },

    //= =================================================================================
    findById: async (id: Pick<ITag, 'id'>): Promise<ITag | null> => {
        return prisma.tag.findUnique({
            where: id,
        });
    },

    //= =================================================================================
    update: async ({ id, ...data }: IUpdateTagDTO): Promise<ITag> => {
        return prisma.tag.update({
            where: { id },
            data,
        });
    },

    //= =================================================================================
    softDelete: async (id: Pick<ITag, 'id'>): Promise<ITag> => {
        return prisma.tag.update({
            where: id,
            data: { deletedAt: new Date() },
        });
    },

    //= =================================================================================
    count: async (): Promise<number> => {
        return prisma.tag.count();
    },
};

//= =================================================================================
export type TagRepository = typeof tagRepository;
