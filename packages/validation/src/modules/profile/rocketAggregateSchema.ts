import { z } from 'zod'
import { idSchema, stringSchema } from '../global/schemas'

export const rocketAggregateSchema = z.object({
  id: idSchema,
  entity: z
    .object({
      name: stringSchema,
      description: stringSchema,
      image: stringSchema,
    })
    .optional(),
})
