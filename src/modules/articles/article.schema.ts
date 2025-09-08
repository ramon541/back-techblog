/**
 * Article Validation Schemas
 *
 * This file contains Zod validation schemas for Article-related operations.
 * These schemas are used for request validation in controllers and middleware,
 * ensuring data integrity and type safety at the API boundary.
 */
import { z } from 'zod';
import { paginationSchema } from '../../common/schemas/pagination.schema.js';

const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 100;

const MIN_CONTENT_LENGTH = 10;
const MAX_CONTENT_LENGTH = 5000;

const MAX_TERM_LENGTH = 16;

const MIN_TAGS_PER_ARTICLE = 1;
const MAX_TAGS_PER_ARTICLE = 3;

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
    image: z
        .string()
        .nullable()
        .optional()
        .refine(
            (val) => {
                if (!val || val === null || val.trim() === '') {
                    return true;
                }
                return z.string().url().safeParse(val).success;
            },
            {
                message: 'URL da imagem deve ser válida',
            }
        ),
    authorId: z.uuid('ID do autor deve ser um UUID válido'),
    tagIds: z
        .array(z.uuid('ID da tag deve ser um UUID válido'))
        .min(
            MIN_TAGS_PER_ARTICLE,
            `Um artigo deve ter no mínimo ${MIN_TAGS_PER_ARTICLE} tags`
        )
        .max(
            MAX_TAGS_PER_ARTICLE,
            `Um artigo pode ter no máximo ${MAX_TAGS_PER_ARTICLE} tags`
        ),
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
    image: z.url('URL da imagem deve ser válida').optional(),
    tagIds: z
        .array(z.uuid('ID da tag deve ser um UUID válido'))
        .min(
            MIN_TAGS_PER_ARTICLE,
            `Um artigo deve ter no mínimo ${MIN_TAGS_PER_ARTICLE} tags`
        )
        .max(
            MAX_TAGS_PER_ARTICLE,
            `Um artigo pode ter no máximo ${MAX_TAGS_PER_ARTICLE} tags`
        )
        .optional(),
});

//= =================================================================================
export const searchArticleSchema = paginationSchema.extend({
    term: z
        .string('Termo de busca é obrigatório')
        .max(
            MAX_TERM_LENGTH,
            `A busca deve ter no máximo ${MAX_TERM_LENGTH} caracteres`
        ),
    tagId: z.string().optional(),
});
