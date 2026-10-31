import type { z } from 'zod'

import type { reviewAreaSchema } from '@/mastra/agents/pr-reviewer/schemas/review-output-schema'

export type ReviewArea = z.infer<typeof reviewAreaSchema>
