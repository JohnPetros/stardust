import { z } from 'zod'
import { idSchema, integerSchema, stringSchema } from '../global/schemas'

export const tierAggregateSchema = z.object({
  id: idSchema,
  entity: z
    .object({
      name: stringSchema,
      image: stringSchema,
      position: integerSchema,
      reward: integerSchema,
    })
    .optional(),
})
