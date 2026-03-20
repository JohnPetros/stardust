import z from 'zod'

import { booleanSchema, contentSchema } from '../../global/schemas'

const TEXT_BLOCK_TYPES = ['default', 'user', 'alert', 'quote', 'code', 'image'] as const

const textBlockTypeSchema = z.enum(TEXT_BLOCK_TYPES)

export const textBlockSchema = z
  .object({
    type: textBlockTypeSchema,
    content: contentSchema,
    title: z.string().optional(),
    picture: z.string().optional(),
    isRunnable: booleanSchema.optional(),
  })
  .superRefine((textBlock, context) => {
    const canHavePicture = ['default', 'alert', 'quote', 'image'].includes(textBlock.type)

    if (textBlock.type === 'image' && !textBlock.picture) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['picture'],
        message: 'picture é obrigatória em blocos image',
      })
    }

    if (!canHavePicture && textBlock.picture !== undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['picture'],
        message: 'picture só pode ser usada em blocos default, alert, quote e image',
      })
    }

    if (textBlock.type !== 'code' && textBlock.isRunnable !== undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['isRunnable'],
        message: 'isRunnable só pode ser usado em blocos code',
      })
    }
  })
