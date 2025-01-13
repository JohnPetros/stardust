import z from 'zod'
import { nameSchema } from '../../global/schemas/nameSchema'
import { contentSchema } from '../../global/schemas/contentSchema'
import { idSchema } from '../../global/schemas/idSchema'
import { dataTypeNameSchema } from './dataTypeNameSchema'
import { booleanSchema } from '../../global/schemas/booleanSchema'
import { codeVariableNameSchema, titleSchema } from '../../global/schemas'

export const challengeSchema = z.object({
  title: titleSchema,
  slug: z.string(),
  function: z.object({
    name: codeVariableNameSchema,
    params: z
      .array(
        z.object({
          name: codeVariableNameSchema,
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
        inputs: z.array(
          z.object({
            value: z.unknown(),
          }),
        ),
        expectedOutput: z.unknown(),
        isLocked: booleanSchema.default(true),
      }),
    )
    .min(1),
  categories: z.array(
    z.object({
      id: idSchema,
      name: nameSchema,
    }),
  ),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']).default('easy'),
})
