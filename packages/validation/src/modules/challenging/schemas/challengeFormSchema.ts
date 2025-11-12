import z from 'zod'

import { challengeSchema } from './challengeSchema'
import {
  booleanSchema,
  codeVariableNameSchema,
  contentSchema,
  idSchema,
  ordinalNumberSchema,
  titleSchema,
} from '../../global/schemas'
import { dataTypeNameSchema } from './dataTypeNameSchema'
import { challengeCategoriesSchema } from './challengeCategoriesSchema'
import { challengeDifficultyLevelSchema } from './challengeDifficultyLevelSchema'

export const challengeFormSchema = challengeSchema.extend({
  title: titleSchema,
  description: contentSchema,
  author: z.object({
    id: idSchema,
  }),
  code: contentSchema,
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
        position: ordinalNumberSchema,
      }),
    )
    .min(3, 'Deve haver pelo menos 3 testes casos'),
  categories: challengeCategoriesSchema,
  difficultyLevel: challengeDifficultyLevelSchema,
})
