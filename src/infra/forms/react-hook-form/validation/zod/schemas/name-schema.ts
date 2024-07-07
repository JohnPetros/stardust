import { z } from 'zod'

import { VALIDATION_ERROR_MESSAGES } from '@/@core/libs/validation/constants'

export const nameSchema = z
  .string()
  .nonempty(VALIDATION_ERROR_MESSAGES.nonempty)
  .min(3, VALIDATION_ERROR_MESSAGES.name.min)
