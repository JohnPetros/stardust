import type { ChallengeDifficultyLevel } from './ChallengeDifficultyLevel'

type DifficultyLevel = Exclude<ChallengeDifficultyLevel, 'any'>

export type CompletedChallengesCountByDifficultyLevel = {
  percentage: Record<DifficultyLevel, number>
  absolute: Record<DifficultyLevel, number>
  total: Record<DifficultyLevel, number>
}
