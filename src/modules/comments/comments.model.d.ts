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
    parentId?: string;
    deletedAt: Date | null;
    createdAt: Date;

    // Relations
    article?: IArticle;
    user?: IUser;
    parent?: IComment;
    replies?: IComment[];
}

// DTOs (Data Transfer Objects)
interface ICreateCommentDTO
    extends Omit<
        IComment,
        | 'id'
        | 'createdAt'
        | 'deletedAt'
        | 'article'
        | 'user'
        | 'parent'
        | 'replies'
    > {}

interface IUpdateCommentDTO
    extends Pick<IComment, 'id'>,
        Partial<Pick<IComment, 'content' | 'parentId'>> {}

interface ICommentResponseDTO extends Omit<IComment, 'deletedAt'> {}
