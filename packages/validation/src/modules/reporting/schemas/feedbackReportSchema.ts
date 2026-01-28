import z from 'zod'

import { idSchema } from '../../global/schemas'

export const feedbackReportSchema = z.object({
  id: idSchema.optional(),
  content: z.string().min(10).max(1000),
  intent: z.enum(['bug', 'idea', 'other']),
  screenshot: z.string().optional(),
})
