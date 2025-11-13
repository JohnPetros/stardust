import z from 'zod'
import { idSchema, nameSchema } from '../../global/schemas'

export const challengeCategoriesSchema = z
  .array(
    z.object({
      id: idSchema,
      name: nameSchema,
    }),
  )
  .min(1)
