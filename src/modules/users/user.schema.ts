/**
 * User Validation Schemas
 *
 * This file contains Zod validation schemas for User-related operations.
 * These schemas are used for request validation in controllers and middleware,
 * ensuring data integrity and type safety at the API boundary.
 */

import { z } from 'zod';

//= =================================================================================
export const createUserSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    avatar: z.url('Avatar deve ser uma URL válida').optional(),
});
