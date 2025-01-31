import { ERROR_MESSAGES } from '../constants'
import { stringSchema } from './stringSchema'

export const nameSchema = stringSchema.min(3, ERROR_MESSAGES.name.min)
