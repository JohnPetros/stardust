import z from 'zod'
import { stringSchema } from '../../global/schemas'

export const chatMessageSchema = z.object({
  content: stringSchema,
  sender: z.enum(['user', 'assistant']),
  sentAt: stringSchema.optional(),
})
