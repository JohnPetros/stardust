import { z } from 'zod'

import { VALIDATION_ERRORS } from '../../config/validationErrors'

import { passwordConfirmationSchema } from './passwordConfirmationSchema'
import { passwordSchema } from './passwordSchema'

export const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    password_confirmation: passwordConfirmationSchema,
  })
  .refine((fields) => fields.password === fields.password_confirmation, {
    path: ['password_confirmation'],
    message: VALIDATION_ERRORS.password_confirmation.equal,
  })
