/**
 * Authentication Validation Schemas
 *
 * This file contains Zod validation schemas for authentication-related operations.
 * These schemas are used for request validation in controllers and middleware,
 * ensuring data integrity and type safety at the API boundary.
 *
 * Schemas:
 * - loginSchema: Validates login credentials (email and password)
 * - Future schemas: token validation, password reset, etc.
 */

import z from 'zod';

//= =================================================================================
export const loginSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});
