import type { z } from 'zod'

import type { reviewerResultSchema } from '@/mastra/agents/pr-reviewer/schemas/reviewer-result-schema'

export type ReviewerResult = z.infer<typeof reviewerResultSchema>
