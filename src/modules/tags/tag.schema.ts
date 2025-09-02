/**
 * Tag Validation Schemas
 *
 * This file contains Zod validation schemas for Tag-related operations.
 * These schemas are used for request validation in controllers and middleware,
 * ensuring data integrity and type safety at the API boundary.
 */
import { z } from 'zod';

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 12;

//= =================================================================================
export const createTagSchema = z.object({
    name: z
        .string('O nome da tag é obrigatório')
        .min(
            MIN_NAME_LENGTH,
            `A tag deve ter no mínimo ${MIN_NAME_LENGTH} caracteres`
        )
        .max(
            MAX_NAME_LENGTH,
            `A tag deve ter no máximo ${MAX_NAME_LENGTH} caracteres`
        ),
});

//= =================================================================================
export const getTagSchema = z.object({
    id: z.uuid('ID deve ser um UUID válido'),
});

//= =================================================================================
export const updateTagSchema = z.object({
    id: z.uuid('ID deve ser um UUID válido'),
    name: z
        .string('O nome da tag é obrigatório')
        .min(
            MIN_NAME_LENGTH,
            `A tag deve ter no mínimo ${MIN_NAME_LENGTH} caracteres`
        )
        .max(
            MAX_NAME_LENGTH,
            `A tag deve ter no máximo ${MAX_NAME_LENGTH} caracteres`
        ),
});
