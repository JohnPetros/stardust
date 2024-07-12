import { z } from 'zod'

import { VALIDATION_ERROR_MESSAGES } from '@/@core/lib/validation/constants'

import { REGEX } from '@/modules/global/constants'

export const passwordSchema = z
  .string()
  .nonempty(VALIDATION_ERROR_MESSAGES.nonempty)
  .min(6, VALIDATION_ERROR_MESSAGES.password.min)
  .regex(REGEX.password, VALIDATION_ERROR_MESSAGES.password.regex)
