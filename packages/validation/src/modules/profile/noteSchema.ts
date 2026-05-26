import { z } from 'zod'

import { stringSchema } from '../global/schemas'

export const noteSchema = z.object({
  title: stringSchema
    .min(1, 'Titulo deve conter pelo menos 1 caractere')
    .max(100, 'Titulo deve conter no maximo 100 caracteres'),
  content: stringSchema.max(5000, 'Conteudo deve conter no maximo 5000 caracteres'),
})
