import type { ChallengeDifficultyLevel } from '#challenging/types'
import type { PaginationParams } from '#global/types'

export type ChallengesListParams = {
  difficultyLevel: ChallengeDifficultyLevel | 'all'
  title: string
  categoriesIds: string[]
} & PaginationParams
