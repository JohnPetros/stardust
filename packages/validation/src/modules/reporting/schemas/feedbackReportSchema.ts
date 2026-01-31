import z from 'zod'

import { idSchema } from '../../global/schemas'
import { feedbackReportIntentSchema } from './feedbackReportIntentSchema'

export const feedbackReportSchema = z.object({
  id: idSchema.optional(),
  content: z.string().min(1).max(1000),
  intent: feedbackReportIntentSchema,
  screenshot: z.string().optional(),
})
