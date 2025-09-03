/**
 * Article Domain Types
 *
 * This file contains all TypeScript interfaces and types related to Article entity.
 * It defines the data contracts used across the application layers (repository, service, controller).
 */

// Core entity
interface IArticle {
    id: string;
    title: string;
    content: string;
    authorId: string;
    tagId: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

// DTOs (Data Transfer Objects)
interface ICreateArticleDTO
    extends Omit<
        IArticle,
        'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'comments'
    > {}

interface IUpdateArticleDTO
    extends Pick<IArticle, 'id'>,
        Partial<Pick<IArticle, 'title' | 'content' | 'authorId' | 'tagId'>> {}

interface IArticleResponseDTO extends Omit<IArticle, 'deletedAt'> {}

interface IArticleSearchDTO extends ISearchWithPagination {
    term: string;
}
