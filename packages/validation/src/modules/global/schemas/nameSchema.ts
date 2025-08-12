import { GLOBAL_ERROR_MESSAGES } from '../constants'
import { stringSchema } from './stringSchema'

export const nameSchema = stringSchema.min(3, GLOBAL_ERROR_MESSAGES.name.min)
