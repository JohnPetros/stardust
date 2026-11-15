import { stringSchema } from '../global/schemas/stringSchema'

export const galaxySlugSchema = stringSchema
  .min(1, 'O slug da galáxia é obrigatório')
  .max(64, 'O slug da galáxia deve conter no máximo 64 caracteres')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'O slug da galáxia deve estar em kebab-case, com letras minúsculas, números e hífens',
  )
  .refine((slug) => slug !== 'galaxies', {
    message: 'O slug da galáxia não pode ser "galaxies"',
  })
