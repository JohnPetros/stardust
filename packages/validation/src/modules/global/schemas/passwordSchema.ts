import { stringSchema } from './stringSchema'

export const passwordSchema = stringSchema
  .min(6, 'Sua senha precica conter pelo menos 6 caracteres')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\W\S]{6,}$/g,
    'Sua senha deve conter pelo menos uma letra minúscula, uma maiúscula, um número e um caractere especial',
  )
