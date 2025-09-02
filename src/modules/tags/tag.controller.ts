/**
 * Tag Controller Layer
 *
 * This file contains HTTP request handlers for Tag-related operations.
 * It serves as the interface between HTTP requests and the business logic layer,
 * handling request validation, response formatting, and error handling.
 *
 * Responsibilities:
 * - HTTP request/response handling
 * - Request data validation using Zod schemas
 * - Response formatting and status code management
 * - Error handling and HTTP error responses
 * - Coordination with tag service layer
 * - Tag operation logging and monitoring
 */
import type { RequestHandler } from 'express';
import { tagService } from './tag.service.js';
import {
    createTagSchema,
    getTagSchema,
    updateTagSchema,
} from './tag.schema.js';
import logger from '../../utils/logger.js';

const tagLogger = logger.createModuleLogger('TAG');

export type IApiTagController = IApiControllerBase<RequestHandler>;

export const tagController: IApiTagController = {
    create: async (req, res, next) => {
        try {
            tagLogger.info('Starting tag creation');

            const validatedData = createTagSchema.parse(req.body);

            const result = await tagService.create(validatedData);

            if (result.success)
                tagLogger.success('Tag created successfully', {
                    id: result.data.id,
                });
            else tagLogger.warn('Tag creation failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    get: async (req, res, next) => {
        try {
            tagLogger.info('Starting tag retrieval');
            const id = req.params.id;

            const validatedData = getTagSchema.parse({ id });

            const result = await tagService.get(validatedData);

            if (result.success)
                tagLogger.success('Tag retrieved successfully', {
                    id: result.data.id,
                });
            else tagLogger.warn('Tag retrieval failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    getAll: async (_req, res, next) => {
        try {
            tagLogger.info('Starting tags retrieval');
            const result = await tagService.getAll();

            if (result.success)
                tagLogger.success('Tags retrieved successfully', {
                    count: result.data.length,
                });
            else tagLogger.warn('Tags retrieval failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    update: async (req, res, next) => {
        try {
            tagLogger.info('Starting user update');
            const id = req.params.id;

            const validatedData = updateTagSchema.parse({ id, ...req.body });

            const result = await tagService.update(validatedData);

            if (result.success)
                tagLogger.success('Tag updated successfully', {
                    id: result.data.id,
                });
            else tagLogger.warn('Tag update failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    delete: async (req, res, next) => {
        try {
            tagLogger.info('Starting tag deletion');
            const id = req.params.id;

            const validatedData = getTagSchema.parse({ id });

            const result = await tagService.delete(validatedData);

            if (result.success)
                tagLogger.success('Tag deleted successfully', {
                    id: result.data.id,
                });
            else tagLogger.warn('Tag deletion failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },
};
