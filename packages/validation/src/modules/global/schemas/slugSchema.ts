import { stringSchema } from './stringSchema'

export const slugSchema = stringSchema
  .min(2, 'Slug deve conter pelo menos 2 caracteres')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug deve conter apenas letras minúsculas, números e hífens entre palavras',
  )
