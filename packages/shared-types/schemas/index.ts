import { z } from 'zod';

export const UpdateChatSchema = z.object({
  title: z
    .string()
    .min(1, 'Title must be at least 1 character')
    .max(50, 'Title must be less than 50 characters')
    .optional(),
  isPublic: z.boolean().optional(),
});
