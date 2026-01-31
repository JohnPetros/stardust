import { z } from 'zod'

export const feedbackReportIntentSchema = z.enum(['bug', 'idea', 'other'])
