import { z } from 'zod'

import { severitySchema } from '@/mastra/agents/pr-reviewer/schemas/reviewer-findings-schema'

export const reviewerFindingsStructuringSchema = z.object({
  status: z.enum(['complete', 'blocked', 'unusable']),
  blocked_reason: z.string().nullable(),
  findings: z.array(
    z.object({
      path: z.string(),
      line: z.number(),
      severity: severitySchema,
      title: z.string(),
      body: z.string(),
    }),
  ),
})

export function toReviewerFindingsCandidate(output: unknown): unknown {
  const structured = reviewerFindingsStructuringSchema.safeParse(output)

  if (!structured.success) return output

  const { blocked_reason: blockedReason, ...findings } = structured.data
  const reason = findings.status === 'blocked' ? blockedReason?.trim() : undefined

  return reason ? { ...findings, blocked_reason: reason } : findings
}
