import type { Request, Response, NextFunction } from 'express';
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
    const genericError = Result.error(
        ApplicationErrorEnum.InfrastructureError,
        `Erro interno do servidor: ${message}`
    );
    res.status(genericError.statusCode).json(genericError);
    return;
}

export default errorHandler;
