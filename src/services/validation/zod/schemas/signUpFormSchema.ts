import { z } from 'zod'

import { emailSchema } from './emaiSchema'
import { nameSchema } from './nameSchema'
import { passwordConfirmationSchema } from './passwordConfirmationSchema'
import { passwordSchema } from './passwordSchema'

import { VALIDATION_ERRORS } from '@/utils/constants'

export const signUpFormSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    password_confirmation: passwordConfirmationSchema,
  })
  .refine((fields) => fields.password === fields.password_confirmation, {
    path: ['password_confirmation'],
    message: VALIDATION_ERRORS.password_confirmation.equal,
  })
