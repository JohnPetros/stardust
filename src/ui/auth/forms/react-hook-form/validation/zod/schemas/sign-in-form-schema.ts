import { z } from 'zod'

import { passwordSchema } from './password-schema'
import { emailSchema } from './email-schema'

export const signInFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})
