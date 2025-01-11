import z from 'zod'

export const challengeCompletionStatusSchema = z.enum([
  'completed',
  'not-completed',
  'all',
])
