import { z } from 'zod'

export const spaceCompletionStatusSchema = z
  .enum(['all', 'completed', 'not-completed'])
  .default('all')
