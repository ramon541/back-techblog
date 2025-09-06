import { z } from 'zod';

export const paginationSchema = z.object({
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().optional(),
});
