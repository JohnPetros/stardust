import { z } from 'zod'

import { severitySchema } from './reviewer-findings-schema'
import { MAX_FINDINGS } from '@/mastra/agents/pr-reviewer/constants/max-findings'

export const reviewAreaSchema = z.enum([
  'security',
  'requirements',
  'architecture',
  'regression',
  'performance',
])

export const reviewOutputSchema = z.object({
  scope: z.literal('repository'),
  head_sha: z.string().min(1),
  review_status: z.enum(['complete', 'partial', 'blocked']),
  summary: z.string().min(1),
  findings: z
    .array(
      z.object({
        path: z.string().min(1),
        line: z.number().int().positive(),
        severity: severitySchema,
        area: reviewAreaSchema,
        title: z.string().min(1),
        body: z.string().min(1),
      }),
    )
    .max(MAX_FINDINGS),
})
