import { z } from 'zod'

import { passwordConfirmationSchema } from './passwordConfirmationSchema'
import { passwordSchema } from './passwordSchema'

import { VALIDATION_ERRORS } from '@/utils/constants'

export const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    password_confirmation: passwordConfirmationSchema,
  })
  .refine((fields) => fields.password === fields.password_confirmation, {
    path: ['password_confirmation'],
    message: VALIDATION_ERRORS.password_confirmation.equal,
  })
