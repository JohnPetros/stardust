import type { ChallengeDifficultyLevel } from '.'
import type { ListOrder, ListParam, PaginationParams } from '../../../global/domain/types'

export type ChallengesListParams = {
  difficultyLevel: ListParam<ChallengeDifficultyLevel>
  title: string
  categoriesIds: string[]
  userId: string | null
  postOrder: ListParam<ListOrder>
  upvotesCountOrder: ListParam<ListOrder>
} & PaginationParams
