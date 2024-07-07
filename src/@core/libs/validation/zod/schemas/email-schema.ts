import { VALIDATION_ERROR_MESSAGES } from '@/@core/libs/validation/constants'
import { z } from 'zod'

export const emailSchema = z
  .string()
  .nonempty(VALIDATION_ERROR_MESSAGES.nonempty)
  .email(VALIDATION_ERROR_MESSAGES.email.regex)
