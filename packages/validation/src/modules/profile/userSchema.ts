import { z } from 'zod'

import { emailSchema, integerSchema, nameSchema, stringSchema } from '../global/schemas'
import { textsListSchema } from './textsListSchema'

export const userSchema = z.object({
  slug: stringSchema,
  email: emailSchema,
  name: nameSchema,
  level: integerSchema,
  coins: integerSchema,
  xp: integerSchema,
  weeklyXp: integerSchema,
  streak: integerSchema,
  weekStatus: textsListSchema,
})
