import { z } from 'zod'

export const guideCategorySchema = z.enum(['lsp', 'mdx'])

export const guideSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  content: z.string().min(1),
  position: z.number().int().min(0),
  category: guideCategorySchema,
})
