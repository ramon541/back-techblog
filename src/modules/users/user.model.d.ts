/**
 * User Domain Types
 *
 * This file contains all TypeScript interfaces and types related to User entity.
 * It defines the data contracts used across the application layers (repository, service, controller).
 */

// Core entity
interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar?: string | null;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

// DTOs (Data Transfer Objects)
interface ICreateUserDTO
    extends Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

interface IUpdateUserDTO
    extends Pick<IUser, 'id'>,
        Partial<Pick<IUser, 'name' | 'email' | 'avatar'>> {}

interface IUserResponseDTO extends Omit<IUser, 'password'> {}
