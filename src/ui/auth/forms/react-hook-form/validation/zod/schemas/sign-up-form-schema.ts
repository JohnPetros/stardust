import { z } from 'zod'

import { emailSchema } from './email-schema'
import { nameSchema } from './name-schema'
import { passwordConfirmationSchema } from './password-confirmation-schema'
import { passwordSchema } from './password-schema'

export const signUpFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
})
