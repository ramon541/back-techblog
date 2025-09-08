/**
 * Comment Service Layer
 *
 * This file contains the business logic for Comment-related operations.
 * It acts as an intermediary between controllers and repositories,
 * handling data transformation, validation, business rules, and comment management operations.
 *
 * Responsibilities:
 * - Business logic implementation for comments
 * - Data validation and transformation
 * - Error handling and business rule enforcement
 * - Coordination between multiple repositories if needed
 * - Data sanitization before sending to controllers
 * - Comment lifecycle management (create, update, soft delete)
 * - Flexible search and filtering logic
 */
import { ApplicationErrorEnum, Result } from '../../utils/result.js';
import { articleRepository } from '../articles/article.repository.js';
import { userRepository } from '../users/user.repository.js';
import { commentRepository } from './comment.repository.js';

export const commentService = {
    create: async ({
        articleId,
        content,
        userId,
        parentId,
    }: ICreateCommentDTO): Promise<Result<ICommentResponseDTO, string>> => {
        try {
            const user = await userRepository.findById({ id: userId });
            if (!user)
                return Result.error(
                    ApplicationErrorEnum.NotFound,
                    'Usuário não encontrado'
                );

            const article = await articleRepository.findById({ id: articleId });
            if (!article)
                return Result.error(
                    ApplicationErrorEnum.NotFound,
                    'Artigo não encontrado'
                );

            if (parentId) {
                const parentComment = await commentRepository.findById({
                    id: parentId,
                });
                if (!parentComment)
                    return Result.error(
                        ApplicationErrorEnum.NotFound,
                        'Comentário pai não encontrado'
                    );
            }

            const comment = await commentRepository.create({
                articleId,
                content,
                userId,
                parentId,
            });

            return Result.created(comment, 'Comentário registrado com sucesso');
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao registrar comentário'
            );
        }
    },

    //= =================================================================================
    get: async (id: Pick<IComment, 'id'>) => {
        try {
            const comment = await commentRepository.findById(id);
            if (!comment)
                return Result.error(
                    ApplicationErrorEnum.NotFound,
                    'Comentário não encontrado'
                );

            return Result.ok(comment, 'Comentário encontrado com sucesso');
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao buscar comentário'
            );
        }
    },

    //= =================================================================================
    getAll: async (data: ISearchWithPagination) => {
        try {
            const comments = await commentRepository.findAll(data);

            return Result.ok(comments, 'Comentários buscados com sucesso');
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao buscar comentários'
            );
        }
    },
    //= =================================================================================
    getReplies: async ({ id, limit, page }: IGetRepliesDTO) => {
        try {
            const replies = await commentRepository.findReplies(
                id,
                limit,
                page
            );
            return Result.ok(replies, 'Respostas buscadas com sucesso');
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao buscar respostas'
            );
        }
    },

    //= =================================================================================
    getByArticle: async ({
        articleId,
    }: Pick<IComment, 'articleId'>): Promise<
        Result<ICommentResponseDTO[], string>
    > => {
        try {
            const article = await articleRepository.findById({
                id: articleId,
            });
            if (!article)
                return Result.error(
                    ApplicationErrorEnum.NotFound,
                    'Artigo não encontrado'
                );

            const comments = await commentRepository.findByArticle({
                articleId,
            });

            return Result.ok(
                comments,
                'Comentários do artigo buscados com sucesso'
            );
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao buscar comentários do artigo'
            );
        }
    },

    //= =================================================================================
    update: async ({
        id,
        ...rest
    }: IUpdateCommentDTO): Promise<Result<ICommentResponseDTO, string>> => {
        try {
            const comment = await commentRepository.findById({ id });
            if (!comment)
                return Result.error(
                    ApplicationErrorEnum.NotFound,
                    'Comentário não encontrado'
                );

            const updatedComment = await commentRepository.update({
                id,
                ...rest,
            });

            return Result.ok(
                updatedComment,
                'Comentário atualizado com sucesso'
            );
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao atualizar comentário'
            );
        }
    },

    //= =================================================================================
    delete: async (
        id: Pick<IComment, 'id'>
    ): Promise<Result<ICommentResponseDTO, string>> => {
        try {
            const comment = await commentRepository.findById(id);
            if (!comment)
                return Result.error(
                    ApplicationErrorEnum.NotFound,
                    'Comentário não encontrado'
                );

            if (comment.deletedAt)
                return Result.error(
                    ApplicationErrorEnum.Conflict,
                    'Comentário já está desativado'
                );

            const deactivatedComment = await commentRepository.softDelete(id);

            return Result.ok(
                deactivatedComment,
                'Comentário desativado com sucesso'
            );
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao desativar comentário'
            );
        }
    },
};

//= =================================================================================
export type CommentService = typeof commentService;
