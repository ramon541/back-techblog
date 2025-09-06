/**
 * ArticleTag Service Layer
 *
 * This file contains helper functions for ArticleTag-related operations.
 * It provides utilities for managing many-to-many relationships between Articles and Tags.
 *
 * Responsibilities:
 * - Helper functions for tag association/disassociation
 * - Batch operations for tag management
 * - Data validation and transformation for tag relationships
 */
import { ApplicationErrorEnum, Result } from '../../utils/result.js';
import { tagRepository } from '../tags/tag.repository.js';
import { articleTagRepository } from './articleTag.repository.js';

export const articleTagService = {
    //= =================================================================================
    async syncArticleTags({
        articleId,
        tagIds,
    }: ISyncArticleTagsDTO): Promise<Result<void, string>> {
        try {
            for (const tagId of tagIds) {
                const tag = await tagRepository.findById({ id: tagId });
                if (!tag) {
                    return Result.error(
                        ApplicationErrorEnum.NotFound,
                        `Tag com ID ${tagId} não encontrada`
                    );
                }
            }

            await articleTagRepository.deleteByArticleId({ articleId });

            if (tagIds.length > 0)
                await articleTagRepository.createMany(
                    tagIds.map((tagId) => ({ articleId, tagId }))
                );

            return Result.ok(undefined, 'Tags sincronizadas com sucesso');
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao sincronizar tags do artigo'
            );
        }
    },

    //= =================================================================================
    async getTagsByArticle({
        articleId,
    }: Pick<IArticleTag, 'articleId'>): Promise<Result<Array<ITag>, string>> {
        try {
            const articleTags = await articleTagRepository.findTagsByArticleId({
                articleId,
            });
            const tags = articleTags
                .map((at) => at.tag)
                .filter(Boolean) as Array<ITag>;

            return Result.ok(tags, 'Tags do artigo encontradas com sucesso');
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao buscar tags do artigo'
            );
        }
    },

    //= =================================================================================
    async getArticlesByTag({
        tagId,
    }: Pick<IArticleTag, 'tagId'>): Promise<Result<Array<IArticle>, string>> {
        try {
            const articleTags = await articleTagRepository.findArticlesByTagId({
                tagId,
            });
            const articles = articleTags
                .map((at) => at.article)
                .filter(Boolean) as Array<IArticle>;

            return Result.ok(
                articles,
                'Artigos da tag encontrados com sucesso'
            );
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao buscar artigos da tag'
            );
        }
    },
};

//= =================================================================================
export type ArticleTagService = typeof articleTagService;
