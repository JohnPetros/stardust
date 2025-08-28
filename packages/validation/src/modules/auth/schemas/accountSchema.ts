import { z } from 'zod'
import { booleanSchema, emailSchema, idSchema, nameSchema } from '../../global/schemas'

export const accountSchema = z.object({
  id: idSchema.optional(),
  email: emailSchema,
  name: nameSchema,
  isAuthenticated: booleanSchema,
})
