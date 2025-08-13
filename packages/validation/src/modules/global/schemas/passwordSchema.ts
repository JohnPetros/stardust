import { GLOBAL_ERROR_MESSAGES } from '../constants'
import { stringSchema } from './stringSchema'

export const passwordSchema = stringSchema.min(6, GLOBAL_ERROR_MESSAGES.password.min)
