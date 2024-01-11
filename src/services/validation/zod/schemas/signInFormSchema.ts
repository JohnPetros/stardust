import { z } from 'zod'

import { emailSchema } from './emaiSchema'
import { passwordSchema } from './passwordSchema'

export const signInFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})
