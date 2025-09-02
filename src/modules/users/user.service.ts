/**
 * User Service Layer
 *
 * This file contains the business logic for User-related operations.
 * It acts as an intermediary between controllers and repositories,
 * handling data transformation, validation, business rules, and security operations.
 *
 * Responsibilities:
 * - Business logic implementation
 * - Data validation and transformation
 * - Password hashing and authentication
 * - Error handling and business rule enforcement
 * - Coordination between multiple repositories if needed
 * - Data sanitization before sending to controllers
 */

import { comparePassword, hashPassword } from '../../utils/password.js';
import { Result } from '../../utils/result.js';
import { userRepository } from './user.repository.js';

export const userService = {
    register: async ({
        password,
        ...rest
    }: CreateUserDTO): Promise<Result<UserResponseDTO, string>> => {
        try {
            const existingUser = await userRepository.findByEmail({
                email: rest.email,
            });
            if (existingUser)
                return Result.error('Usuário já cadastrado com esse email');

            const hashedPassword = await hashPassword(password);

            const user = await userRepository.create({
                ...rest,
                password: hashedPassword,
            });

            const { password: _, ...userResponse } = user;
            return Result.success(userResponse);
        } catch {
            return Result.error('Erro ao registrar usuário');
        }
    },

    //= =================================================================================
    login: async ({
        email,
        password,
    }: LoginCredentials): Promise<Result<UserResponseDTO, string>> => {
        try {
            const user = await userRepository.findByEmail({ email });

            if (!user) return Result.error('Email ou Senha inválido');

            if (user.deletedAt) return Result.error('Conta desativada');

            const isValidPassword = await comparePassword(
                password,
                user.password
            );

            if (!isValidPassword)
                return Result.error('Email ou Senha inválido');

            const { password: _, ...userResponse } = user;
            return Result.success(userResponse);
        } catch {
            return Result.error('Erro ao realizar login');
        }
    },

    //= =================================================================================
    deactivateUser: async (
        id: Pick<User, 'id'>
    ): Promise<Result<UserResponseDTO, string>> => {
        try {
            const user = await userRepository.findById(id);
            if (!user) return Result.error('Usuário não encontrado');

            if (user.deletedAt)
                return Result.error('Usuário já está desativado');

            const deactivatedUser = await userRepository.update(id, {
                deletedAt: new Date(),
            });

            const { password: _, ...userResponse } = deactivatedUser;
            return Result.success(userResponse);
        } catch {
            return Result.error('Erro ao desativar usuário');
        }
    },

    //= =================================================================================
    reactivateUser: async (
        id: Pick<User, 'id'>
    ): Promise<Result<UserResponseDTO, string>> => {
        try {
            const user = await userRepository.findById(id);
            if (!user) return Result.error('Usuário não encontrado');

            if (!user.deletedAt) return Result.error('Usuário já está ativo');

            const reactivatedUser = await userRepository.update(id, {
                deletedAt: null,
            });

            const { password: _, ...userResponse } = reactivatedUser;
            return Result.success(userResponse);
        } catch {
            return Result.error('Erro ao reativar usuário');
        }
    },
};

//= =================================================================================
export type UserService = typeof userService;
