import type { ChallengeDifficultyLevel } from './ChallengeDifficultyLevel'

export type CompletedChallengesCountByDifficultyLevel = {
  percentage: Record<ChallengeDifficultyLevel, number>
  absolute: Record<ChallengeDifficultyLevel, number>
  total: Record<ChallengeDifficultyLevel, number>
}
