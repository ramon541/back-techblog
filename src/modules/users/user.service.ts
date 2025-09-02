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

import { hashPassword } from '../../utils/password.js';
import { Result } from '../../utils/result.js';
import { userRepository } from './user.repository.js';

export const userService = {
    create: async ({
        password,
        ...rest
    }: ICreateUserDTO): Promise<Result<IUserResponseDTO, string>> => {
        try {
            const existingUser = await userRepository.findByEmail({
                email: rest.email,
            });
            if (existingUser)
                return Result.conflict('Usuário já cadastrado com esse email');

            const hashedPassword = await hashPassword(password);

            const user = await userRepository.create({
                ...rest,
                password: hashedPassword,
            });

            const { password: _, ...userResponse } = user;
            return Result.created(
                userResponse,
                'Usuário registrado com sucesso'
            );
        } catch {
            return Result.internal('Erro ao registrar usuário');
        }
    },

    //= =================================================================================
    get: async (id: Pick<IUser, 'id'>) => {
        try {
            const user = await userRepository.findById(id);
            if (!user) return Result.notFound('Usuário não encontrado');

            const { password: _, ...userResponse } = user;
            return Result.ok(userResponse, 'Usuário encontrado com sucesso');
        } catch {
            return Result.internal('Erro ao buscar usuário');
        }
    },

    //= =================================================================================
    getAll: async () => {
        try {
            const users = await userRepository.findAll();

            const usersResponse = users.map((user) => {
                const { password: _, ...userResponse } = user;
                return userResponse;
            });

            return Result.ok(usersResponse, 'Usuários buscados com sucesso');
        } catch {
            return Result.internal('Erro ao buscar usuários');
        }
    },

    //= =================================================================================
    update: async ({
        id,
        ...rest
    }: IUpdateUserDTO): Promise<Result<IUserResponseDTO, string>> => {
        try {
            const user = await userRepository.findById({ id });
            if (!user) return Result.notFound('Usuário não encontrado');

            const updatedUser = await userRepository.update({
                id,
                ...rest,
            });

            const { password: _, ...userResponse } = updatedUser;
            return Result.ok(userResponse, 'Usuário atualizado com sucesso');
        } catch {
            return Result.internal('Erro ao atualizar usuário');
        }
    },

    //= =================================================================================
    delete: async (
        id: Pick<IUser, 'id'>
    ): Promise<Result<IUserResponseDTO, string>> => {
        try {
            const user = await userRepository.findById(id);
            if (!user) return Result.notFound('Usuário não encontrado');

            if (user.deletedAt)
                return Result.conflict('Usuário já está desativado');

            const deactivatedUser = await userRepository.softDelete(id);

            const { password: _, ...userResponse } = deactivatedUser;
            return Result.ok(userResponse, 'Usuário desativado com sucesso');
        } catch {
            return Result.internal('Erro ao desativar usuário');
        }
    },
};

//= =================================================================================
export type UserService = typeof userService;
