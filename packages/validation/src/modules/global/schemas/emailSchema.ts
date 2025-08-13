import { GLOBAL_ERROR_MESSAGES } from '../constants'
import { stringSchema } from './stringSchema'

export const emailSchema = stringSchema.email(GLOBAL_ERROR_MESSAGES.email.regex)
