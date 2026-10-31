import type { z } from 'zod'

import type { evalCaseSchema } from '@/mastra/agents/pr-reviewer/schemas/eval-case-schema'

export type EvalCase = z.infer<typeof evalCaseSchema>
