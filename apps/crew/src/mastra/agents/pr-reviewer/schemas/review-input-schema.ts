import { z } from 'zod'

const SHA_PATTERN = /^[0-9a-f]{40}$/
const MAX_DIFF_BYTES = 180_000

export const findingLineSchema = z
  .object({
    path: z.string().min(1),
    line: z.number().int().positive(),
  })
  .strict()

export const reviewInputSchema = z
  .object({
    repository: z.string().regex(/^[\w.-]+\/[\w.-]+$/),
    pull_number: z.number().int().positive(),
    base_sha: z.string().regex(SHA_PATTERN),
    head_sha: z.string().regex(SHA_PATTERN),
    range_base_sha: z.string().regex(SHA_PATTERN),
    review_mode: z.enum(['full', 'incremental']),
    agents_md: z.string().min(1),
    review_md: z.string().min(1),
    changed_files: z.array(z.string().min(1)).min(1),
    changed_lines: z.array(findingLineSchema),
    diff: z
      .string()
      .min(1)
      .refine((diff) => Buffer.byteLength(diff, 'utf8') <= MAX_DIFF_BYTES, {
        message: `diff must not exceed ${MAX_DIFF_BYTES} bytes`,
      }),
    regression_facts: z
      .object({
        deleted_files: z.array(z.string()),
        changed_migrations: z.array(z.string()),
      })
      .strict(),
  })
  .strict()
