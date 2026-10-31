import { z } from 'zod'

import { reviewAreaSchema } from '@/mastra/agents/pr-reviewer/schemas/review-output-schema'

const SHA_PATTERN = /^[0-9a-f]{40}$/

export const evalCaseSchema = z
  .object({
    name: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    source_pr: z.string().regex(/^[\w.-]+\/[\w.-]+#\d+$/),
    description: z.string().min(1),
    base_sha: z.string().regex(SHA_PATTERN),
    head_sha: z.string().regex(SHA_PATTERN),
    excluded_path_prefixes: z.array(z.string().min(1)).optional(),
    expected: z.array(
      z
        .object({
          path: z.string().min(1),
          lines: z
            .tuple([z.number().int().positive(), z.number().int().positive()])
            .refine(
              ([from, to]) => from <= to,
              'lines must be [from, to] with from <= to',
            ),
          area: reviewAreaSchema,
        })
        .strict(),
    ),
  })
  .strict()
