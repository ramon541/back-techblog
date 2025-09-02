/**
 * Result Pattern - Functional approach to error handling
 * Returns success or failure without throwing exceptions
 * Integrated with ApplicationException for better error handling
 */

export enum ApplicationErrorEnum {
    // Client Errors (4xx)
    RequiredField = 'REQUIRED_FIELD',
    InvalidField = 'INVALID_FIELD',
    NotFound = 'NOT_FOUND',
    Unauthorized = 'UNAUTHORIZED',
    Forbidden = 'FORBIDDEN',
    Conflict = 'CONFLICT',
    ValidationError = 'VALIDATION_ERROR',

    // Server Errors (5xx)
    InfrastructureError = 'INFRASTRUCTURE_ERROR',
    DatabaseError = 'DATABASE_ERROR',
    ExternalServiceError = 'EXTERNAL_SERVICE_ERROR',
}

//= =================================================================================
const ErrorStatusCodeMap: Record<ApplicationErrorEnum, number> = {
    [ApplicationErrorEnum.RequiredField]: 400,
    [ApplicationErrorEnum.InvalidField]: 400,
    [ApplicationErrorEnum.ValidationError]: 400,
    [ApplicationErrorEnum.NotFound]: 404,
    [ApplicationErrorEnum.Unauthorized]: 401,
    [ApplicationErrorEnum.Forbidden]: 403,
    [ApplicationErrorEnum.Conflict]: 409,
    [ApplicationErrorEnum.InfrastructureError]: 500,
    [ApplicationErrorEnum.DatabaseError]: 500,
    [ApplicationErrorEnum.ExternalServiceError]: 502,
};

//= =================================================================================
const DefaultErrorMessages: Record<ApplicationErrorEnum, string> = {
    [ApplicationErrorEnum.RequiredField]: 'Campo obrigatório',
    [ApplicationErrorEnum.InvalidField]: 'Campo inválido',
    [ApplicationErrorEnum.ValidationError]: 'Dados inválidos',
    [ApplicationErrorEnum.NotFound]: 'Recurso não encontrado',
    [ApplicationErrorEnum.Unauthorized]: 'Não autorizado',
    [ApplicationErrorEnum.Forbidden]: 'Acesso negado',
    [ApplicationErrorEnum.Conflict]: 'Conflito de dados',
    [ApplicationErrorEnum.InfrastructureError]: 'Erro interno do servidor',
    [ApplicationErrorEnum.DatabaseError]: 'Erro no banco de dados',
    [ApplicationErrorEnum.ExternalServiceError]: 'Erro em serviço externo',
};

//= =================================================================================
export class ApplicationException extends Error {
    public readonly genericTypeError: ApplicationErrorEnum;
    public readonly statusCode: number;
    public readonly messages: string[];

    constructor(
        message: string | string[],
        genericTypeError: ApplicationErrorEnum
    ) {
        const messageArray = Array.isArray(message) ? message : [message];
        super(messageArray.join(', '));

        this.name = 'ApplicationException';
        this.genericTypeError = genericTypeError;
        this.statusCode = ErrorStatusCodeMap[genericTypeError];
        this.messages = messageArray;

        Error.captureStackTrace(this, ApplicationException);
    }

    static with(
        message: string | string[],
        type: ApplicationErrorEnum
    ): ApplicationException {
        return new ApplicationException(message, type);
    }

    is(type: ApplicationErrorEnum): boolean {
        return this.genericTypeError === type;
    }

    getMessages(): string | string[] {
        return this.messages.length === 1
            ? this.messages[0] ?? ''
            : this.messages;
    }

    toJSON() {
        return {
            name: this.name,
            message: this.getMessages(),
            type: this.genericTypeError,
            statusCode: this.statusCode,
        };
    }
}

//= =================================================================================
export type Result<T, E = ApplicationException> =
    | {
          success: true;
          data: T;
          message: string;
          statusCode: number;
      }
    | {
          success: false;
          data: null;
          error: string | string[];
          statusCode: number;
      };

//= =================================================================================
export const Result = {
    success: <T>(
        data: T,
        message: string = 'Operação realizada com sucesso',
        statusCode: number = 200
    ): Result<T, never> => ({
        success: true,
        data,
        message,
        statusCode,
    }),

    error: <E = ApplicationException>(
        error: E | string | string[] | ApplicationErrorEnum,
        messageOrStatusCode?: string | string[] | number,
        statusCode?: number
    ): Result<never, E> => {
        if (
            typeof error === 'string' &&
            Object.values(ApplicationErrorEnum).includes(
                error as ApplicationErrorEnum
            )
        ) {
            const errorType = error as ApplicationErrorEnum;
            const message =
                typeof messageOrStatusCode === 'string' ||
                Array.isArray(messageOrStatusCode)
                    ? messageOrStatusCode
                    : DefaultErrorMessages[errorType];

            const exception = new ApplicationException(message, errorType);
            return {
                success: false,
                data: null,
                error: exception.getMessages(),
                statusCode: exception.statusCode,
            };
        }

        if (error instanceof ApplicationException) {
            return {
                success: false,
                data: null,
                error: error.getMessages(),
                statusCode: error.statusCode,
            };
        }

        // String ou array de strings
        if (typeof error === 'string' || Array.isArray(error)) {
            return {
                success: false,
                data: null,
                error: error,
                statusCode:
                    typeof messageOrStatusCode === 'number'
                        ? messageOrStatusCode
                        : statusCode || 500,
            };
        }

        return {
            success: false,
            data: null,
            error: 'Erro desconhecido',
            statusCode: statusCode || 500,
        };
    },

    ok: <T>(data: T, message?: string): Result<T, never> =>
        Result.success(data, message || 'Sucesso', 200),

    created: <T>(data: T, message?: string): Result<T, never> =>
        Result.success(data, message || 'Recurso criado com sucesso', 201),
};
