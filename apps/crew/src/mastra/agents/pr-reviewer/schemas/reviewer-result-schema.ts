import { z } from 'zod'

import { reviewerFindingsSchema } from '@/mastra/agents/pr-reviewer/schemas/reviewer-findings-schema'

export const reviewerResultSchema = z.object({
  status: z.enum(['complete', 'blocked', 'failed']),
  blocked_reason: z.string().optional(),
  findings: reviewerFindingsSchema.shape.findings,
})
