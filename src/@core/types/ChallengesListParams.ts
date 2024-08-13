import type { ChallengeDifficultyLevel } from '../domain/types'

export type ChallengesListParams = {
  difficulty: ChallengeDifficultyLevel | 'all'
  title: string
  categoriesIds: string[]
}
