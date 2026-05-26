import { stringSchema } from './stringSchema'

export const searchSchema = stringSchema.max(100).default('')
