import { z } from 'zod'

import { VALIDATION_ERROR_MESSAGES } from '@/@core/libs/validation/constants'

export const emailSchema = z
  .string()
  .nonempty(VALIDATION_ERROR_MESSAGES.nonempty)
  .email(VALIDATION_ERROR_MESSAGES.email.regex)
