import type { z } from 'zod'

import type { reviewInputSchema } from '@/mastra/agents/pr-reviewer/schemas/review-input-schema'

export type ReviewInput = z.infer<typeof reviewInputSchema>
