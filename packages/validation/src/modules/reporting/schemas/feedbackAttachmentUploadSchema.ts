import { z } from 'zod'
import { integerSchema } from '../../global/schemas'

const uuidFileNameSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(png|jpg|jpeg)$/i,
    'nome deve ser um UUID com extensão .png, .jpg ou .jpeg',
  )

const imageSizeSchema = integerSchema
  .int('tamanho deve ser um número inteiro')
  .min(1, 'tamanho deve ser maior que zero')
  .max(10 * 1024 * 1024, 'tamanho deve ser no máximo 10 MB')

export const feedbackAttachmentUploadSchema = z
  .object({
    fileName: uuidFileNameSchema,
    mimeType: z.enum(['image/png', 'image/jpeg']),
    size: imageSizeSchema,
  })
  .superRefine(({ fileName, mimeType }, context) => {
    const isPng = fileName.toLowerCase().endsWith('.png')
    const isJpeg =
      fileName.toLowerCase().endsWith('.jpg') || fileName.toLowerCase().endsWith('.jpeg')

    if ((isPng && mimeType !== 'image/png') || (isJpeg && mimeType !== 'image/jpeg')) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['mimeType'],
        message: 'MIME type deve corresponder à extensão do arquivo',
      })
    }
  })

export const feedbackAttachmentUploadRequestSchema = feedbackAttachmentUploadSchema
