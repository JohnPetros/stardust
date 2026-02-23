import { z } from 'zod'
import { contentSchema } from '../../global/schemas/contentSchema'
import { idSchema } from '../../global/schemas/idSchema'
import { titleSchema } from '../../global/schemas'
import { challengeCategoriesSchema } from './challengeCategoriesSchema'
import { challengeDifficultyLevelSchema } from './challengeDifficultyLevelSchema'

export const challengeDraftSchema = z
  .object({
    title: titleSchema,
    description: contentSchema,
    author: z.object({
      id: idSchema,
    }),
    code: contentSchema,
    testCases: z
      .array(
        z.object({
          inputs: z.string(),
          expectedOutput: z.string(),
          isLocked: z.boolean(),
          position: z.number().int(),
        }),
      )
      .min(3, 'Deve haver pelo menos 3 testes casos'),
    categories: challengeCategoriesSchema,
    difficultyLevel: challengeDifficultyLevelSchema,
    isPublic: z.boolean().optional().default(false),
  })
  .omit({ author: true })
