import type { z } from 'zod'

import type { reviewerFindingsSchema } from '@/mastra/agents/pr-reviewer/schemas/reviewer-findings-schema'

export type ReviewerFindings = z.infer<typeof reviewerFindingsSchema>
