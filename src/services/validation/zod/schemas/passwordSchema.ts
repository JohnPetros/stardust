import { z } from 'zod'

import { VALIDATION_ERRORS } from '../../config/validationErrors'

import { REGEX } from '@/utils/constants'

export const passwordSchema = z
  .string()
  .nonempty(VALIDATION_ERRORS.nonempty)
  .regex(REGEX.password, VALIDATION_ERRORS.password.regex)
