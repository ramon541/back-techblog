import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { ApplicationErrorEnum, Result } from '../utils/result.js';
import logger from '../utils/logger.js';

const errorLogger = logger.createModuleLogger('ERROR');

async function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    errorLogger.error('Error processing request', { error: err });

    if (err instanceof ZodError) {
        const fieldErrors = err.issues.map((error) => error.message);

        const validationError = Result.error(
            ApplicationErrorEnum.ValidationError,
            fieldErrors
        );

        res.status(validationError.statusCode).json(validationError);
        return;
    }

    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: `Erro interno do servidor: ${message}`,
        data: null,
    });
    return;
}

export default errorHandler;
