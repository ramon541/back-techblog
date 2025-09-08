/**
 * Comment Validation Schemas
 *
 * This file contains Zod validation schemas for Comment-related operations.
 * These schemas are used for request validation in controllers and middleware,
 * ensuring data integrity and type safety at the API boundary.
 */
import { z } from 'zod';
import { paginationSchema } from '../../common/schemas/pagination.schema.js';

const MIN_CONTENT_LENGTH = 2;
const MAX_CONTENT_LENGTH = 2000;

//= =================================================================================
export const createCommentSchema = z.object({
    content: z
        .string('Conteúdo do comentário é obrigatório')
        .min(
            MIN_CONTENT_LENGTH,
            `Comentário deve ter no mínimo ${MIN_CONTENT_LENGTH} caracteres`
        )
        .max(
            MAX_CONTENT_LENGTH,
            `Comentário deve ter no máximo ${MAX_CONTENT_LENGTH} caracteres`
        ),
    articleId: z.uuid('ID do artigo deve ser um UUID válido'),
    userId: z.uuid('ID do usuário deve ser um UUID válido'),
    parentId: z
        .uuid('ID do comentário pai deve ser um UUID válido')
        .optional()
        .nullable(),
});

//= =================================================================================
export const getCommentSchema = z.object({
    id: z.uuid('ID do comentário deve ser um UUID válido'),
});

//= =================================================================================
export const updateCommentSchema = z.object({
    id: z.uuid('ID do comentário deve ser um UUID válido'),
    content: z
        .string('Conteúdo do comentário é obrigatório')
        .min(
            MIN_CONTENT_LENGTH,
            `Comentário deve ter no mínimo ${MIN_CONTENT_LENGTH} caracteres`
        )
        .max(
            MAX_CONTENT_LENGTH,
            `Comentário deve ter no máximo ${MAX_CONTENT_LENGTH} caracteres`
        ),
});

//= =================================================================================
export const getRepliesSchema = paginationSchema.extend({
    id: z.uuid('ID do comentário deve ser um UUID válido'),
});

//= =================================================================================
export const getCommentsByArticleSchema = z.object({
    articleId: z.uuid('ID do artigo deve ser um UUID válido'),
});
