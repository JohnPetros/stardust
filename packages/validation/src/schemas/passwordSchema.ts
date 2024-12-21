import { ERROR_MESSAGES, REGEX } from '../constants'
import { stringSchema } from './stringSchema'

export const passwordSchema = stringSchema
  .min(6, ERROR_MESSAGES.password.min)
  .regex(REGEX.password, ERROR_MESSAGES.password.regex)
