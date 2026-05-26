import { z } from 'zod'

import { stringSchema } from '../global/schemas/stringSchema'
import { fileStorageFolderPathSchema } from './fileStorageFolderPathSchema'

export const signedUploadUrlSchema = z.object({
  folderPath: fileStorageFolderPathSchema,
  fileName: stringSchema
    .trim()
    .min(1, 'Campo obrigatório')
    .refine((value) => !['.', '..'].includes(value), {
      message: 'Nome de arquivo inválido',
    })
    .refine((value) => !/[\\/]/.test(value), {
      message: 'Nome de arquivo inválido',
    }),
})
