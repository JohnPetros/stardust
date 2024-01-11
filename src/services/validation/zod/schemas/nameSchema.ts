import { z } from 'zod'

import { VALIDATION_ERRORS } from '../../config/validationErrors'

export const nameSchema = z
  .string()
  .nonempty(VALIDATION_ERRORS.nonempty)
  .min(3, VALIDATION_ERRORS.name.min)
