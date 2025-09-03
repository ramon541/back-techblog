/**
 * Article Controller Layer
 *
 * This file contains HTTP request handlers for Article-related operations.
 * It serves as the interface between HTTP requests and the business logic layer,
 * handling request validation, response formatting, and error handling.
 *
 * Responsibilities:
 * - HTTP request/response handling
 * - Request data validation using Zod schemas
 * - Response formatting and status code management
 * - Error handling and HTTP error responses
 * - Coordination with article service layer
 * - Authentication and authorization checks
 */
import type { RequestHandler } from 'express';
import { articleService } from './article.service.js';
import {
    createArticleSchema,
    getArticleSchema,
    updateArticleSchema,
} from './article.schema.js';
import logger from '../../utils/logger.js';

const articleLogger = logger.createModuleLogger('ARTICLE');

export type IApiArticleController = IApiControllerBase<RequestHandler>;

export const articleController: IApiArticleController = {
    create: async (req, res, next) => {
        try {
            articleLogger.info('Starting article creation');

            const validatedData = createArticleSchema.parse(req.body);

            const result = await articleService.create(validatedData);

            if (result.success)
                articleLogger.success('Article created successfully', {
                    id: result.data.id,
                });
            else articleLogger.warn('Article creation failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    get: async (req, res, next) => {
        try {
            articleLogger.info('Starting article retrieval');
            const id = req.params.id;

            const validatedData = getArticleSchema.parse({ id });

            const result = await articleService.get(validatedData);

            if (result.success)
                articleLogger.success('Article retrieved successfully', {
                    id: result.data.id,
                });
            else articleLogger.warn('Article retrieval failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    getAll: async (req, res, next) => {
        try {
            articleLogger.info('Starting articles retrieval');

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await articleService.getAll({ page, limit });

            if (result.success)
                articleLogger.success('Articles retrieved successfully', {
                    count: result.data.length,
                });
            else articleLogger.warn('Articles retrieval failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    update: async (req, res, next) => {
        try {
            articleLogger.info('Starting article update');
            const id = req.params.id;

            const validatedData = updateArticleSchema.parse({
                id,
                ...req.body,
            });

            const result = await articleService.update(validatedData);

            if (result.success)
                articleLogger.success('Article updated successfully', {
                    id: result.data.id,
                });
            else articleLogger.warn('Article update failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    delete: async (req, res, next) => {
        try {
            articleLogger.info('Starting article deletion');
            const id = req.params.id;

            const validatedData = getArticleSchema.parse({ id });

            const result = await articleService.delete(validatedData);

            if (result.success)
                articleLogger.success('Article deleted successfully', {
                    id: result.data.id,
                });
            else articleLogger.warn('Article deletion failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },
};
