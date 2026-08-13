import { z } from 'zod'

import { idSchema, integerSchema, stringSchema } from '../../global/schemas'
import { feedbackReportIntentSchema } from './feedbackReportIntentSchema'

const imageSizeSchema = integerSchema
  .int('tamanho deve ser um número inteiro')
  .min(1, 'tamanho deve ser maior que zero')
  .max(10 * 1024 * 1024, 'tamanho deve ser no máximo 10 MB')

export const feedbackInitialAttachmentSchema = z
  .object({
    storageKey: stringSchema.regex(
      /^images\/feedback-reports\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(png|jpg|jpeg)$/i,
      'chave de storage deve apontar para uma imagem UUID em feedback-reports',
    ),
    originalName: stringSchema.min(1, 'nome original é obrigatório'),
    mimeType: z.enum(['image/png', 'image/jpeg']),
    size: imageSizeSchema,
  })
  .superRefine(({ storageKey, mimeType }, context) => {
    const isPng = storageKey.toLowerCase().endsWith('.png')
    const isJpeg =
      storageKey.toLowerCase().endsWith('.jpg') ||
      storageKey.toLowerCase().endsWith('.jpeg')

    if ((isPng && mimeType !== 'image/png') || (isJpeg && mimeType !== 'image/jpeg')) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['mimeType'],
        message: 'MIME type deve corresponder à extensão do arquivo',
      })
    }
  })

export const feedbackReportSchema = z.object({
  id: idSchema.optional(),
  content: z
    .string({ required_error: 'relato é obrigatório' })
    .min(10, 'relato deve conter entre 10 e 1.000 caracteres')
    .max(1000, 'relato deve conter entre 10 e 1.000 caracteres')
    .refine((value) => value.trim().length >= 10, {
      message: 'relato deve conter ao menos 10 caracteres não vazios',
    }),
  intent: feedbackReportIntentSchema,
  screenshot: z.string().optional(),
  initialAttachment: feedbackInitialAttachmentSchema.optional(),
})
