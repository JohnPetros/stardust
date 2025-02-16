import z from 'zod'
import { nameSchema } from '../../global/schemas/nameSchema'
import { contentSchema } from '../../global/schemas/contentSchema'
import { idSchema } from '../../global/schemas/idSchema'
import { dataTypeNameSchema } from './dataTypeNameSchema'
import { booleanSchema } from '../../global/schemas/booleanSchema'
import { codeVariableNameSchema, titleSchema } from '../../global/schemas'

export const challengeSchema = z.object({
  title: titleSchema,
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
          z
            .object({
              value: z.unknown(),
            })
            .transform((input) => {
              if (Array.isArray(input?.value))
                return {
                  value: input.value.filter((item) => typeof item !== 'undefined'),
                }
              return input
            }),
        ),
        expectedOutput: z.object({
          dataTypeName: dataTypeNameSchema,
          value: z.unknown(),
        }),
        isLocked: booleanSchema,
      }),
    )
    .min(3, 'Deve haver pelo menos 3 testes casos'),
  categories: z
    .array(
      z.object({
        id: idSchema,
        name: nameSchema,
      }),
    )
    .min(1),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']),
  isPublic: booleanSchema,
})
