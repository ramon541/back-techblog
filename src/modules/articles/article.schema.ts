/**
 * User Validation Schemas
 *
 * This file contains Zod validation schemas for User-related operations.
 * These schemas are used for request validation in controllers and middleware,
 * ensuring data integrity and type safety at the API boundary.
 */
import { z } from 'zod';

const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 100;

const MIN_CONTENT_LENGTH = 10;
const MAX_CONTENT_LENGTH = 5000;

//= =================================================================================
export const createArticleSchema = z.object({
    title: z
        .string('Título do artigo é obrigatório')
        .min(
            MIN_TITLE_LENGTH,
            `Título deve ter no mínimo ${MIN_TITLE_LENGTH} caracteres`
        )
        .max(
            MAX_TITLE_LENGTH,
            `Título deve ter no máximo ${MAX_TITLE_LENGTH} caracteres`
        ),
    content: z
        .string('Conteúdo do artigo é obrigatório')
        .min(
            MIN_CONTENT_LENGTH,
            `Conteúdo deve ter no mínimo ${MIN_CONTENT_LENGTH} caracteres`
        )
        .max(
            MAX_CONTENT_LENGTH,
            `Conteúdo deve ter no máximo ${MAX_CONTENT_LENGTH} caracteres`
        ),
    authorId: z.uuid('ID do autor deve ser um UUID válido'),
    tagId: z.uuid('ID da tag deve ser um UUID válido'),
});

//= =================================================================================
export const getArticleSchema = z.object({
    id: z.uuid('ID do artigo deve ser um UUID válido'),
});

//= =================================================================================
export const updateArticleSchema = z.object({
    id: z.uuid('ID do artigo deve ser um UUID válido'),
    title: z
        .string('Título do artigo é obrigatório')
        .min(
            MIN_TITLE_LENGTH,
            `Título deve ter no mínimo ${MIN_TITLE_LENGTH} caracteres`
        )
        .max(
            MAX_TITLE_LENGTH,
            `Título deve ter no máximo ${MAX_TITLE_LENGTH} caracteres`
        )
        .optional(),
    content: z
        .string('Conteúdo do artigo é obrigatório')
        .min(
            MIN_CONTENT_LENGTH,
            `Conteúdo deve ter no mínimo ${MIN_CONTENT_LENGTH} caracteres`
        )
        .max(
            MAX_CONTENT_LENGTH,
            `Conteúdo deve ter no máximo ${MAX_CONTENT_LENGTH} caracteres`
        )
        .optional(),
    tagId: z.uuid('ID da tag deve ser um UUID válido').optional(),
});
