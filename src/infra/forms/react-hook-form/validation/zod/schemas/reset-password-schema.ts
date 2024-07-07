import { z } from 'zod'

import { VALIDATION_ERROR_MESSAGES } from '@/@core/libs/validation/constants'

import { passwordConfirmationSchema } from './password-confirmation-schema'
import { passwordSchema } from './password-schema'

export const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    password_confirmation: passwordConfirmationSchema,
  })
  .refine((fields) => fields.password === fields.password_confirmation, {
    path: ['password_confirmation'],
    message: VALIDATION_ERROR_MESSAGES.password_confirmation.equal,
  })
