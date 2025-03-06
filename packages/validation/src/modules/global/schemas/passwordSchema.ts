import { stringSchema } from './stringSchema'

export const passwordSchema = stringSchema
  .min(6, 'Sua senha precica conter pelo menos 6 caracteres')
