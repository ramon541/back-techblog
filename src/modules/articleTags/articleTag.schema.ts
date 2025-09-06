/**
 * ArticleTag Validation Schemas
 *
 * This file contains Zod validation schemas for ArticleTag-related operations.
 * These schemas are used for request validation in controllers and middleware,
 * ensuring data integrity and type safety at the API boundary.
 */
import { z } from 'zod';

//= =================================================================================
export const createArticleTagSchema = z.object({
    articleId: z.uuid('ID do artigo deve ser um UUID válido'),
    tagId: z.uuid('ID da tag deve ser um UUID válido'),
});

//= =================================================================================
export const deleteArticleTagSchema = z.object({
    articleId: z.uuid('ID do artigo deve ser um UUID válido'),
    tagId: z.uuid('ID da tag deve ser um UUID válido'),
});

//= =================================================================================
export const getTagsByArticleSchema = z.object({
    articleId: z.uuid('ID do artigo deve ser um UUID válido'),
});

//= =================================================================================
export const getArticlesByTagSchema = z.object({
    tagId: z.uuid('ID da tag deve ser um UUID válido'),
});
