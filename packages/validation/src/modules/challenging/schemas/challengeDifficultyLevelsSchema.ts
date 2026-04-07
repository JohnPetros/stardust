import { z } from 'zod'

export const challengeDifficultyLevelsSchema = z
  .array(z.enum(['easy', 'medium', 'hard']))
  .default([])
