/**
 * Tag Domain Types
 *
 * This file contains all TypeScript interfaces and types related to Tag entity.
 * It defines the data contracts used across the application layers (repository, service, controller).
 *
 * Tags are used to categorize and organize articles, enabling better content discovery
 * and filtering capabilities throughout the blog platform.
 */

// Core entity
interface ITag {
    id: string;
    name: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

// DTOs (Data Transfer Objects)
interface ICreateTagDTO
    extends Omit<ITag, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

interface IUpdateTagDTO extends Pick<ITag, 'id' | 'name'> {}

interface ITagResponseDTO extends ITag {}
