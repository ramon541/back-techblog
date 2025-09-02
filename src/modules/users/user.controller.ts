/**
 * User Controller Layer
 *
 * This file contains HTTP request handlers for User-related operations.
 * It serves as the interface between HTTP requests and the business logic layer,
 * handling request validation, response formatting, and error handling.
 *
 * Responsibilities:
 * - HTTP request/response handling
 * - Request data validation using Zod schemas
 * - Response formatting and status code management
 * - Error handling and HTTP error responses
 * - Coordination with user service layer
 * - Authentication and authorization checks
 */
import type { RequestHandler } from 'express';
import { userService } from './user.service.js';
import {
    createUserSchema,
    getUserSchema,
    updateUserSchema,
} from './user.schema.js';
import logger from '../../utils/logger.js';
import { Result } from '../../utils/result.js';

const userLogger = logger.createModuleLogger('USER');

export type IApiUserController = IApiControllerBase<RequestHandler>;

export const userController: IApiUserController = {
    create: async (req, res, next) => {
        try {
            userLogger.info('Starting user creation');

            const validatedData = createUserSchema.parse(req.body);

            const result = await userService.create(validatedData);

            if (result.success)
                userLogger.success('User created successfully', {
                    id: result.data.id,
                });
            else userLogger.warn('User creation failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },
    get: async (req, res, next) => {
        try {
            userLogger.info('Starting user retrieval');
            const id = req.params.id;

            const validatedData = getUserSchema.parse({ id });

            const result = await userService.get(validatedData);

            if (result.success)
                userLogger.success('User retrieved successfully', {
                    id: result.data.id,
                });
            else userLogger.warn('User retrieval failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },
    getAll: async (req, res, next) => {
        try {
            userLogger.info('Starting users retrieval');
            const result = await userService.getAll();

            if (result.success)
                userLogger.success('Users retrieved successfully', {
                    count: result.data.length,
                });
            else userLogger.warn('User retrieval failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            userLogger.info('Starting user update');
            const id = req.params.id;

            const validatedData = updateUserSchema.parse({ id, ...req.body });

            const result = await userService.update(validatedData);

            if (result.success)
                userLogger.success('User updated successfully', {
                    id: result.data.id,
                });
            else userLogger.warn('User update failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            userLogger.info('Starting user deletion');
            const id = req.params.id;

            const validatedData = getUserSchema.parse({ id });

            const result = await userService.delete(validatedData);

            if (result.success)
                userLogger.success('User deleted successfully', {
                    id: result.data.id,
                });
            else userLogger.warn('User deletion failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },
};
