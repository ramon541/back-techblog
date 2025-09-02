/**
 * User Domain Types
 *
 * This file contains all TypeScript interfaces and types related to User entity.
 * It defines the data contracts used across the application layers (repository, service, controller).
 */

// Core entity
interface User {
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
interface CreateUserDTO
    extends Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

interface UpdateUserDTO
    extends Partial<Pick<User, 'name' | 'avatar' | 'deletedAt'>> {}

interface UserResponseDTO extends Omit<User, 'password'> {}
