/**
 * Result Pattern - Functional approach to error handling
 * Returns success or failure without throwing exceptions
 */

export type Result<T, E = string> =
    | { success: true; data: T }
    | { success: false; error: E };

export const Result = {
    success: <T>(data: T): Result<T, never> => ({
        success: true,
        data,
    }),

    error: <E>(error: E): Result<never, E> => ({
        success: false,
        error,
    }),
};
