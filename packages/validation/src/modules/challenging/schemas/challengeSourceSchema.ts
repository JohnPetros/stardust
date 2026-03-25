import { z } from 'zod'

import { idSchema, urlSchema } from '../../global/schemas'

export const challengeSourceSchema = z.object({
  url: urlSchema,
  challengeId: idSchema.optional().nullable(),
  additionalInstructions: z.string().optional().nullable(),
})
