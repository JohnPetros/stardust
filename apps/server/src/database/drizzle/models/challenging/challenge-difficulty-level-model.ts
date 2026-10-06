import { pgEnum } from 'drizzle-orm/pg-core'

export const challengeDifficultyLevelModel = pgEnum('challenge_difficulty_level', [
  'easy',
  'medium',
  'hard',
])
