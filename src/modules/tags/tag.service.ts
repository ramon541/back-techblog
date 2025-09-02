/**
 * Tag Service Layer
 *
 * This file contains the business logic for Tag-related operations.
 * It acts as an intermediary between controllers and repositories,
 * handling data transformation, validation, business rules, and tag management operations.
 *
 * Responsibilities:
 * - Business logic implementation for tag operations
 * - Tag name uniqueness validation
 * - Data validation and transformation
 * - Error handling and business rule enforcement
 * - Coordination between multiple repositories if needed
 * - Data sanitization before sending to controllers
 * - Tag lifecycle management (create, update, soft delete)
 * - Tag categorization and organization logic
 */
import { ApplicationErrorEnum, Result } from '../../utils/result.js';
import { tagRepository } from './tag.repository.js';

export const tagService = {
    create: async ({
        name,
    }: ICreateTagDTO): Promise<Result<ITagResponseDTO, string>> => {
        try {
            const existingTag = await tagRepository.findByName({
                name: name,
            });
            if (existingTag)
                return Result.error(
                    ApplicationErrorEnum.Conflict,
                    'Tag já cadastrada com esse nome'
                );

            const tag = await tagRepository.create({
                name,
            });

            return Result.created(tag, 'Tag registrada com sucesso');
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao registrar tag'
            );
        }
    },

    //= =================================================================================
    get: async (id: Pick<ITag, 'id'>) => {
        try {
            const tag = await tagRepository.findById(id);
            if (!tag)
                return Result.error(
                    ApplicationErrorEnum.NotFound,
                    'Tag não encontrada'
                );

            return Result.ok(tag, 'Tag encontrada com sucesso');
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao buscar tag'
            );
        }
    },

    //= =================================================================================
    getAll: async () => {
        try {
            const tags = await tagRepository.findAll();

            const tagsResponse = tags.map((tag) => {
                const { ...tagResponse } = tag;
                return tagResponse;
            });

            return Result.ok(tagsResponse, 'Tags buscadas com sucesso');
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao buscar tags'
            );
        }
    },

    //= =================================================================================
    update: async ({
        id,
        ...rest
    }: IUpdateTagDTO): Promise<Result<ITagResponseDTO, string>> => {
        try {
            const tag = await tagRepository.findById({ id });
            if (!tag)
                return Result.error(
                    ApplicationErrorEnum.NotFound,
                    'Tag não encontrada'
                );

            const updatedTag = await tagRepository.update({
                id,
                ...rest,
            });

            return Result.ok(updatedTag, 'Tag atualizada com sucesso');
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao atualizar tag'
            );
        }
    },

    //= =================================================================================
    delete: async (
        id: Pick<ITag, 'id'>
    ): Promise<Result<ITagResponseDTO, string>> => {
        try {
            const tag = await tagRepository.findById(id);
            if (!tag)
                return Result.error(
                    ApplicationErrorEnum.NotFound,
                    'Tag não encontrada'
                );

            if (tag.deletedAt)
                return Result.error(
                    ApplicationErrorEnum.Conflict,
                    'Tag já está desativada'
                );

            const deactivatedTag = await tagRepository.softDelete(id);

            return Result.ok(deactivatedTag, 'Tag desativada com sucesso');
        } catch {
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao desativar tag'
            );
        }
    },
};

//= =================================================================================
export type TagService = typeof tagService;
