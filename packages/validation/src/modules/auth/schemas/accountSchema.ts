import z from 'zod'

import { emailSchema } from '../../global/schemas'
import { nameSchema } from '../../global/schemas'

export const accountSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  isAuthenticated: z.boolean().default(false),
})
