import { z } from 'zod'

import { idSchema, stringSchema } from '../global/schemas'

export const commentSchema = z.object({
  id: idSchema.optional(),
  content: stringSchema,
  author: z.object({
    id: idSchema,
  }),
})
