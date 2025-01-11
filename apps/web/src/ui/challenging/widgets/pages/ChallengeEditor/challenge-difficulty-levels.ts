import type { ChallengeDifficultyLevel } from '@stardust/core/challenging/types'

type ChallengeDifficultyLevels = Array<{
  value: ChallengeDifficultyLevel
  label: string
}>

export const CHALLENGE_DIFFICULTY_LEVELS: ChallengeDifficultyLevels = [
  {
    value: 'easy',
    label: 'fácil',
  },
  {
    value: 'medium',
    label: 'médio',
  },
  {
    value: 'hard',
    label: 'difícil',
  },
] as const
