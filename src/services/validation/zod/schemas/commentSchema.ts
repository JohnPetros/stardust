import { z } from 'zod'

import { VALIDATION_ERRORS } from '../../constants/validation-errors'

export const commentSchema = z
  .string()
  .nonempty(VALIDATION_ERRORS.nonempty)
  .min(3, VALIDATION_ERRORS.comment.min)
