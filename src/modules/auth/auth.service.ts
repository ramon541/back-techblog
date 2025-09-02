/**
 * Authentication Service Layer
 *
 * This file contains the business logic for authentication-related operations.
 * It acts as an intermediary between controllers and repositories,
 * handling authentication, authorization, and security operations.
 *
 * Responsibilities:
 * - User authentication (login/logout)
 * - Password verification and validation
 * - JWT token generation and validation
 * - Session management
 * - Security rule enforcement
 * - Authentication error handling
 * - Token refresh operations
 * - Password reset functionality
 */

import { comparePassword } from '../../utils/password.js';
import { Result } from '../../utils/result.js';
import { userRepository } from '../users/user.repository.js';

export const authService = {
    login: async ({
        email,
        password,
    }: ILoginCredentials): Promise<Result<IUserResponseDTO, string>> => {
        try {
            const user = await userRepository.findByEmail({ email });

            if (!user) return Result.unauthorized('Email ou Senha inválido');

            if (user.deletedAt) return Result.forbidden('Conta desativada');

            const isValidPassword = await comparePassword(
                password,
                user.password
            );

            if (!isValidPassword)
                return Result.unauthorized('Email ou Senha inválido');

            const { password: _, ...userResponse } = user;
            return Result.ok(userResponse, 'Login realizado com sucesso');
        } catch {
            return Result.internal('Erro ao realizar login');
        }
    },
};

//= =================================================================================
export type AuthService = typeof authService;
