import z from 'zod'
import { nameSchema } from '../../schemas/nameSchema'
import { contentSchema } from '../../schemas/contentSchema'
import { idSchema } from '../../schemas/idSchema'
import { dataTypeNameSchema } from './dataTypeNameSchema'
import { booleanSchema } from '../../schemas/booleanSchema'

export const challengeSchema = z.object({
  title: nameSchema,
  slug: z.string(),
  function: z.object({
    name: nameSchema,
    params: z
      .array(
        z.object({
          name: nameSchema,
          dataTypeName: dataTypeNameSchema,
        }),
      )
      .min(1),
  }),
  description: contentSchema,
  code: contentSchema,
  testCases: z
    .array(
      z.object({
        inputs: z.array(z.unknown()).min(1),
        expectedOutput: z.unknown(),
        isLocked: booleanSchema,
      }),
    )
    .min(1),
  categories: z.array(
    z.object({
      id: idSchema,
      name: nameSchema,
    }),
  ),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']),
})
