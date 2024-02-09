import { z } from 'zod'

import { VALIDATION_ERRORS } from '../../constants/validation-errors'

export const emailSchema = z
  .string()
  .nonempty(VALIDATION_ERRORS.nonempty)
  .email(VALIDATION_ERRORS.email.regex)
