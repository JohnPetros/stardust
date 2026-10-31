import type { z } from 'zod'

import type { reviewOutputSchema } from '@/mastra/agents/pr-reviewer/schemas/review-output-schema'

export type ReviewOutput = z.infer<typeof reviewOutputSchema>
