import { stringSchema } from './stringSchema'

export const nameSchema = stringSchema.min(3, 'Seu nome deve conter pelo menos 3 letras')
