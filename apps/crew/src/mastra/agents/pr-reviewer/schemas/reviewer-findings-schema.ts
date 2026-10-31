import { z } from 'zod'
import { MAX_FINDINGS } from '@/mastra/agents/pr-reviewer/constants/max-findings'

export const severitySchema = z.enum(['P1', 'P2', 'P3'])

export const reviewerFindingsSchema = z
  .object({
    status: z.enum(['complete', 'blocked']),
    blocked_reason: z.string().min(1).optional(),
    findings: z
      .array(
        z.object({
          path: z.string().min(1),
          line: z.number().int().positive(),
          severity: severitySchema,
          title: z.string().min(1),
          body: z.string().min(1),
        }),
      )
      .max(MAX_FINDINGS),
  })
  .refine(
    (reviewerFindings) =>
      reviewerFindings.status !== 'blocked' || !!reviewerFindings.blocked_reason,
    {
      message: 'blocked_reason is required when status is blocked',
      path: ['blocked_reason'],
    },
  )
