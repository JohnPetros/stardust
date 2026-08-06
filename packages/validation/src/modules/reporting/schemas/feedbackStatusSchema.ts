import { z } from 'zod'

export const feedbackReportStatusSchema = z.enum(['open', 'closed'])

export const feedbackStatusSchema = z.object({
  status: feedbackReportStatusSchema,
  expectedStatus: feedbackReportStatusSchema,
})
