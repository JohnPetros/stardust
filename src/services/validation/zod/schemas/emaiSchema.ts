import { z } from 'zod'

import { VALIDATION_ERRORS } from '@/utils/constants'

export const emailSchema = z
  .string()
  .nonempty(VALIDATION_ERRORS.nonempty)
  .email(VALIDATION_ERRORS.email.regex)
