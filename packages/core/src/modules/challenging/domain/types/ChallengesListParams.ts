import type { ChallengeDifficultyLevel } from '#challenging/types'

export type ChallengesListParams = {
  difficulty: ChallengeDifficultyLevel | 'all'
  title: string
  categoriesIds: string[]
}
