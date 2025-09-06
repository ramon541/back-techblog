/**
 * Comment Controller Layer
 *
 * This file contains HTTP request handlers for Comment-related operations.
 * It serves as the interface between HTTP requests and the business logic layer,
 * handling request validation, response formatting, and error handling.
 *
 * Responsibilities:
 * - HTTP request/response handling
 * - Request data validation using Zod schemas
 * - Response formatting and status code management
 * - Error handling and HTTP error responses
 * - Coordination with comment service layer
 * - Authentication and authorization checks
 */
import type { RequestHandler } from 'express';
import { commentService } from './comment.service.js';
import {
    createCommentSchema,
    getCommentSchema,
    getRepliesSchema,
    updateCommentSchema,
} from './comment.schema.js';
import logger from '../../utils/logger.js';
import { paginationSchema } from '../../common/schemas/pagination.schema.js';

const commentLogger = logger.createModuleLogger('COMMENT');

export type IApiCommentController = IApiControllerBase<RequestHandler> & {
    getReplies: RequestHandler;
};

export const commentController: IApiCommentController = {
    create: async (req, res, next) => {
        try {
            commentLogger.info('Starting comment creation');

            const validatedData = createCommentSchema.parse(req.body);

            const result = await commentService.create(validatedData);

            if (result.success)
                commentLogger.success('Comment created successfully', {
                    id: result.data.id,
                });
            else commentLogger.warn('Comment creation failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    get: async (req, res, next) => {
        try {
            commentLogger.info('Starting comment retrieval');
            const id = req.params.id;

            const validatedData = getCommentSchema.parse({ id });

            const result = await commentService.get(validatedData);

            if (result.success)
                commentLogger.success('Comment retrieved successfully', {
                    id: result.data.id,
                });
            else commentLogger.warn('Comment retrieval failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    getAll: async (req, res, next) => {
        try {
            commentLogger.info('Starting comments retrieval');

            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 10;

            const validatedData = paginationSchema.parse({ page, limit });

            const result = await commentService.getAll(validatedData);

            if (result.success)
                commentLogger.success('Comments retrieved successfully', {
                    count: result.data.length,
                });
            else commentLogger.warn('Comments retrieval failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    getReplies: async (req, res, next) => {
        try {
            commentLogger.info('Starting comment replies retrieval');

            const id = req.params.id;
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 10;

            const validatedData = getRepliesSchema.parse({
                id,
                page,
                limit,
            });

            const result = await commentService.getReplies({
                id: validatedData.id,
                page: validatedData.page,
                limit: validatedData.limit,
            });

            if (result.success)
                commentLogger.success(
                    'Comment replies retrieved successfully',
                    {
                        count: result.data.length,
                    }
                );
            else commentLogger.warn('Comment replies retrieval failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    update: async (req, res, next) => {
        try {
            commentLogger.info('Starting comment update');
            const id = req.params.id;

            const validatedData = updateCommentSchema.parse({
                id,
                ...req.body,
            });

            const result = await commentService.update(validatedData);

            if (result.success)
                commentLogger.success('Comment updated successfully', {
                    id: result.data.id,
                });
            else commentLogger.warn('Comment update failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    delete: async (req, res, next) => {
        try {
            commentLogger.info('Starting comment deletion');
            const id = req.params.id;

            const validatedData = getCommentSchema.parse({ id });

            const result = await commentService.delete(validatedData);

            if (result.success)
                commentLogger.success('Comment deleted successfully', {
                    id: result.data.id,
                });
            else commentLogger.warn('Comment deletion failed', result);

            res.status(result.statusCode).json(result);
            return;
        } catch (error) {
            next(error);
        }
    },
};
