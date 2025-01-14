import type { ChallengeDifficultyLevel } from '#challenging/types'
import type { ListingOrder, PaginationParams } from '#global/types'

export type ChallengesListParams = {
  difficultyLevel: ChallengeDifficultyLevel | 'all'
  title: string
  categoriesIds: string[]
  postOrder: ListingOrder | 'all'
  upvotesOrder: ListingOrder | 'all'
} & PaginationParams
