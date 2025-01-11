import { ERROR_MESSAGES } from '../../constants'
import { stringSchema } from './stringSchema'

export const emailSchema = stringSchema.email(ERROR_MESSAGES.email.regex)
