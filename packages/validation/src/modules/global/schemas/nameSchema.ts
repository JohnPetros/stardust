import { stringSchema } from './stringSchema'

export const nameSchema = stringSchema
  .min(3, 'Nome deve conter pelo menos 3 caracteres')
  .max(100, 'Nome deve conter no máximo 100 caracteres')
