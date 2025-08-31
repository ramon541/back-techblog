import express from 'express';
import { logger } from '../utils/logger.js';

/**
 * Middleware for logging HTTP requests with response time
 */
export function requestLoggingMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.http(req.method, req.path, res.statusCode, duration);
    });

    next();
}
