/**
 * ArticleTag Domain Types
 *
 * This file contains all TypeScript interfaces and types related to ArticleTag entity.
 * It defines the data contracts used across the application layers (repository, service, controller).
 */

// Core entity
interface IArticleTag {
    articleId: string;
    tagId: string;
    deletedAt: Date | null;

    article?: IArticle;
    tag?: ITag;
}

// DTOs (Data Transfer Objects)
interface ICreateArticleTagDTO
    extends Omit<IArticleTag, 'deletedAt' | 'article' | 'tag'> {}

interface IUpdateArticleTagDTO
    extends Partial<Pick<IArticleTag, 'articleId' | 'tagId'>> {}

interface IArticleTagResponseDTO extends Omit<IArticleTag, 'deletedAt'> {}

interface ISyncArticleTagsDTO extends Pick<IArticleTag, 'articleId'> {
    tagIds: Array<string>;
}
