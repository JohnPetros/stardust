import type { ChallengeDifficultyLevel } from '#challenging/types'

export type ChallengesListParams = {
  difficultyLevel: ChallengeDifficultyLevel | 'all'
  title: string
  categoriesIds: string[]
}
