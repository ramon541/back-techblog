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
import { articleRepository } from './article.repository.js';

export const articleService = {
    create: async (
        data: ICreateArticleDTO
    ): Promise<Result<IArticleResponseDTO, string>> => {
        try {
            const article = await articleRepository.create(data);

            return Result.created(article, 'Artigo registrado com sucesso');
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao registrar artigo'
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
        ...rest
    }: IUpdateUserDTO): Promise<Result<IArticleResponseDTO, string>> => {
        try {
            const article = await articleRepository.findById({ id });
            if (!article)
                return Result.error(
                    ApplicationErrorEnum.NotFound,
                    'Artigo não encontrado'
                );

            const updatedArticle = await articleRepository.update({
                id,
                ...rest,
            });

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
