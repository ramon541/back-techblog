/**
 * User Validation Schemas
 *
 * This file contains Zod validation schemas for User-related operations.
 * These schemas are used for request validation in controllers and middleware,
 * ensuring data integrity and type safety at the API boundary.
 */
import { z } from 'zod';

const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 50;

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 16;

//= =================================================================================
export const createUserSchema = z.object({
    name: z
        .string()
        .min(
            MIN_NAME_LENGTH,
            `Nome deve ter no mínimo ${MIN_NAME_LENGTH} caracteres`
        )
        .max(
            MAX_NAME_LENGTH,
            `Nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres`
        ),
    email: z.email('Email inválido'),
    password: z
        .string()
        .min(
            MIN_PASSWORD_LENGTH,
            `Senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres`
        )
        .max(
            MAX_PASSWORD_LENGTH,
            `Senha deve ter no máximo ${MAX_PASSWORD_LENGTH} caracteres`
        ),
    avatar: z
        .union([z.url('Avatar deve ser uma URL válida'), z.null()])
        .optional()
        .default(null),
});

//= =================================================================================
export const getUserSchema = z.object({
    id: z.uuid('ID deve ser um UUID válido'),
});

//= =================================================================================
export const updateUserSchema = z.object({
    id: z.uuid('ID deve ser um UUID válido'),
    name: z
        .string()
        .min(
            MIN_NAME_LENGTH,
            `Nome deve ter no mínimo ${MIN_NAME_LENGTH} caracteres`
        )
        .max(
            MAX_NAME_LENGTH,
            `Nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres`
        )
        .optional(),
    email: z.email('Email inválido').optional(),
    avatar: z
        .union([z.url('Avatar deve ser uma URL válida'), z.null()])
        .optional()
        .default(null),
});
