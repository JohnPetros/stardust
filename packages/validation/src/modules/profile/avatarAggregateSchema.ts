import { z } from 'zod'
import { idSchema, stringSchema } from '../global/schemas'

export const avatarAggregateSchema = z.object({
  id: idSchema,
  entity: z
    .object({
      name: stringSchema,
      image: stringSchema,
    })
    .optional(),
})
