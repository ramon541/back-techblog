/**
 * Article Service Layer
 *
 * This file contains the business logic for Article-related operations.
 * It acts as an intermediary between controllers and repositories,
 * handling data transformation, validation, business rules, and article management operations.
 *
 * Responsibilities:
 * - Business logic implementation for articles
 * - Data validation and transformation
 * - Error handling and business rule enforcement
 * - Coordination between multiple repositories if needed
 * - Data sanitization before sending to controllers
 * - Article lifecycle management (create, update, soft delete)
 * - Flexible search and filtering logic
 */
import { ApplicationErrorEnum, Result } from '../../utils/result.js';
import { articleTagService } from '../articleTags/articleTag.service.js';
import { userRepository } from '../users/user.repository.js';
import { articleRepository } from './article.repository.js';

export const articleService = {
    create: async ({
        authorId,
        content,
        tagIds,
        title,
        image,
    }: ICreateArticleDTO): Promise<Result<IArticleResponseDTO, string>> => {
        try {
            const author = await userRepository.findById({ id: authorId });
            if (!author)
                return Result.error(
                    ApplicationErrorEnum.NotFound,
                    'Autor não encontrado'
                );

            if (tagIds && tagIds.length > 3) {
                return Result.error(
                    ApplicationErrorEnum.InvalidField,
                    'Um artigo pode ter no máximo 3 tags'
                );
            }

            const article = await articleRepository.create({
                authorId,
                content,
                title,
                image,
            });

            if (tagIds && tagIds.length > 0) {
                const syncResult = await articleTagService.syncArticleTags({
                    articleId: article.id,
                    tagIds,
                });
                if (!syncResult.success) {
                    await articleRepository.softDelete({ id: article.id });
                    return syncResult;
                }
            }

            return Result.created(article, 'Artigo criado com sucesso');
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao registrar artigo'
            );
        }
    },

    //= =================================================================================
    search: async (
        data: IArticleSearchDTO
    ): Promise<Result<IArticleResponseDTO[], string>> => {
        try {
            const articles = await articleRepository.findByTerm(data);
            return Result.ok(articles, 'Artigos encontrados com sucesso');
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao buscar artigos'
            );
        }
    },

    //= =================================================================================
    get: async (id: Pick<IArticle, 'id'>) => {
        try {
            const article = await articleRepository.findById(id);
            if (!article)
                return Result.error(
                    ApplicationErrorEnum.NotFound,
                    'Artigo não encontrado'
                );

            return Result.ok(article, 'Artigo encontrado com sucesso');
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao buscar artigo'
            );
        }
    },

    //= =================================================================================
    getAll: async (data: ISearchWithPagination) => {
        try {
            const articles = await articleRepository.findAll(data);

            return Result.ok(articles, 'Artigos buscados com sucesso');
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao buscar artigos'
            );
        }
    },

    //= =================================================================================
    update: async ({
        id,
        tagIds,
        ...rest
    }: IUpdateArticleDTO): Promise<Result<IArticleResponseDTO, string>> => {
        try {
            const article = await articleRepository.findById({ id });
            if (!article)
                return Result.error(
                    ApplicationErrorEnum.NotFound,
                    'Artigo não encontrado'
                );

            if (tagIds && tagIds.length > 3) {
                return Result.error(
                    ApplicationErrorEnum.InvalidField,
                    'Um artigo pode ter no máximo 3 tags'
                );
            }
            if (tagIds && tagIds.length > 3) {
                return Result.error(
                    ApplicationErrorEnum.InvalidField,
                    'Um artigo pode ter no máximo 3 tags'
                );
            }

            const updatedArticle = await articleRepository.update({
                id,
                ...rest,
            });

            if (tagIds) {
                const syncResult = await articleTagService.syncArticleTags({
                    articleId: id,
                    tagIds,
                });
                if (!syncResult.success) {
                    return syncResult;
                }
            }

            return Result.ok(updatedArticle, 'Artigo atualizado com sucesso');
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao atualizar artigo'
            );
        }
    },

    //= =================================================================================
    delete: async (
        id: Pick<IArticle, 'id'>
    ): Promise<Result<IArticleResponseDTO, string>> => {
        try {
            const article = await articleRepository.findById(id);
            if (!article)
                return Result.error(
                    ApplicationErrorEnum.NotFound,
                    'Artigo não encontrado'
                );

            if (article.deletedAt)
                return Result.error(
                    ApplicationErrorEnum.Conflict,
                    'Artigo já está desativado'
                );

            const deactivatedArticle = await articleRepository.softDelete(id);

            return Result.ok(
                deactivatedArticle,
                'Artigo desativado com sucesso'
            );
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao desativar artigo'
            );
        }
    },
};

//= =================================================================================
export type ArticleService = typeof articleService;
