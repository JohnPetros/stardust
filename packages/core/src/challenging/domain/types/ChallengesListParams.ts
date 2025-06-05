import type { ChallengeDifficultyLevel } from '.'
import type {
  ListingOrder,
  ListParam,
  PaginationParams,
} from '../../../global/domain/types'

export type ChallengesListParams = {
  difficultyLevel: ListParam<ChallengeDifficultyLevel>
  title: string
  categoriesIds: string[]
  userId: string | null
  postOrder: ListParam<ListingOrder>
  upvotesCountOrder: ListParam<ListingOrder>
} & PaginationParams
