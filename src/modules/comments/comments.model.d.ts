/**
 * Comment Domain Types
 *
 * This file contains all TypeScript interfaces and types related to Comment entity.
 * It defines the data contracts used across the application layers (repository, service, controller).
 */

// Core entity
interface IComment {
    id: string;
    content: string;
    articleId: string;
    userId: string;
    parentId?: string | null;
    deletedAt: Date | null;
    createdAt: Date;
}

// DTOs (Data Transfer Objects)
interface ICreateCommentDTO
    extends Omit<IComment, 'id' | 'createdAt' | 'deletedAt' | 'article'> {}

interface IUpdateCommentDTO extends Pick<IComment, 'id' | 'content'> {}

interface ICommentResponseDTO extends Omit<IComment, 'deletedAt'> {}

interface IGetRepliesDTO extends Pick<IComment, 'id'>, ISearchWithPagination {}
