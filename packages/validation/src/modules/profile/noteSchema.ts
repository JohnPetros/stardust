import { z } from 'zod'

import { contentSchema, stringSchema } from '../global/schemas'

export const noteSchema = z.object({
  title: stringSchema
    .min(1, 'Titulo deve conter pelo menos 1 caractere')
    .max(100, 'Titulo deve conter no maximo 100 caracteres'),
  content: contentSchema,
})
