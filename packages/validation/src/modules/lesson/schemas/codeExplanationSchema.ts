import z from 'zod'

import { contentSchema, integerSchema } from '../../global/schemas'

export const explainCodeRequestSchema = z.object({
  code: contentSchema,
})

export const remainingCodeExplanationUsesSchema = z.object({
  remainingUses: integerSchema.min(0).max(10),
})

export const codeExplanationResponseSchema = z.object({
  explanation: contentSchema,
})
