import z from 'zod'
import { contentSchema } from '../../global/schemas/contentSchema'
import { idSchema } from '../../global/schemas/idSchema'
import { booleanSchema } from '../../global/schemas/booleanSchema'
import { ordinalNumberSchema, titleSchema } from '../../global/schemas'
import { challengeCategoriesSchema } from './challengeCategoriesSchema'
import { challengeDifficultyLevelSchema } from './challengeDifficultyLevelSchema'

type ChallengeData = string | number | boolean | null | ChallengeData[]

const data: z.ZodType<ChallengeData> = z.lazy(() =>
  z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(data)]),
)

export const challengeSchema = z.object({
  title: titleSchema,
  description: contentSchema,
  author: z.object({
    id: idSchema,
  }),
  code: contentSchema,
  testCases: z
    .array(
      z.object({
        inputs: z.array(data),
        expectedOutput: data,
        isLocked: booleanSchema,
        position: ordinalNumberSchema,
      }),
    )
    .min(3, 'Deve haver pelo menos 3 testes casos'),
  categories: challengeCategoriesSchema,
  difficultyLevel: challengeDifficultyLevelSchema,
  isPublic: z.boolean().optional().default(false),
})
