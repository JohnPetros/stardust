import z from 'zod'

export const challengeCompletitionStatusSchema = z.enum([
  'completed',
  'not-completed',
  'all',
])
