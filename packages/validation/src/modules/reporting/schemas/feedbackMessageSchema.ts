import { z } from 'zod'
import { idSchema, integerSchema, stringSchema } from '../../global/schemas'
import { feedbackReportStatusSchema } from './feedbackStatusSchema'

const attachmentSchema = z
  .object({
    id: idSchema,
    storageKey: stringSchema.min(1),
    originalName: stringSchema.min(1),
    mimeType: z.enum(['image/png', 'image/jpeg']),
    size: integerSchema
      .int('tamanho deve ser um número inteiro')
      .min(1, 'tamanho deve ser maior que zero')
      .max(10 * 1024 * 1024, 'tamanho deve ser no máximo 10 MB'),
  })
  .superRefine(({ storageKey, mimeType }, context) => {
    const normalizedKey = storageKey.toLowerCase()
    const isPng = normalizedKey.endsWith('.png')
    const isJpeg = normalizedKey.endsWith('.jpg') || normalizedKey.endsWith('.jpeg')

    if ((isPng && mimeType !== 'image/png') || (isJpeg && mimeType !== 'image/jpeg')) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['mimeType'],
        message: 'MIME type deve corresponder à extensão do arquivo',
      })
    }
  })

export const feedbackMessageSchema = z.object({
  messageId: idSchema,
  content: stringSchema
    .transform((value) => value.trim())
    .pipe(
      z
        .string()
        .min(1, 'mensagem não pode ser vazia')
        .max(2000, 'mensagem excede 2.000 caracteres'),
    ),
  attachments: z
    .array(attachmentSchema)
    .max(3, 'uma mensagem aceita no máximo três anexos'),
  targetStatus: feedbackReportStatusSchema.optional(),
})

export const feedbackMessageAttachmentSchema = attachmentSchema
