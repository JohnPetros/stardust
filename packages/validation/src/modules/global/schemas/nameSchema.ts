import { stringSchema } from './stringSchema'
import { ERROR_MESSAGES } from '../../constants'

export const nameSchema = stringSchema.min(3, ERROR_MESSAGES.name.min)
