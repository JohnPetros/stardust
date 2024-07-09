import { z } from 'zod'

import { VALIDATION_ERROR_MESSAGES } from '@/@core/libs/validation/constants'

import { passwordConfirmationSchema } from './password-confirmation-schema'
import { passwordSchema } from './password-schema'

export const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    passwordConfirmation: passwordConfirmationSchema,
  })
  .refine((fields) => fields.password === fields.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: VALIDATION_ERROR_MESSAGES.passwordConfirmation.equal,
  })
