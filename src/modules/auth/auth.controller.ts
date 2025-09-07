/**
 * Auth Controller Layer
 *
 * This file contains HTTP request handlers for Auth-related operations.
 * It serves as the interface between HTTP requests and the business logic layer,
 * handling request validation, response formatting, and error handling.
 *
 * Responsibilities:
 * - HTTP request/response handling
 * - Request data validation using Zod schemas
 * - Response formatting and status code management
 * - Error handling and HTTP error responses
 * - Coordination with auth service layer
 * - Authentication and authorization checks
 */
import type { RequestHandler } from 'express';
import { loginSchema } from './auth.schema.js';
import logger from '../../utils/logger.js';
import { authService } from './auth.service.js';

const authLogger = logger.createModuleLogger('AUTH');

export type IApiAuthController = IApiAuthControllerBase<RequestHandler>;

export const authController: IApiAuthController = {
    login: async (req, res, next) => {
        try {
            authLogger.info('Starting login process');
            const validatedData = loginSchema.parse(req.body);

            const result = await authService.login(validatedData);

            if (result.success) authLogger.info('Login successful');
            else authLogger.error('Login failed', { error: result.error });

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },
};
