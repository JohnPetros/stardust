import type { Id, IdsList } from '#global/domain/structures/index'
import type { ListingOrder } from '#global/domain/structures/ListingOrder'
import type { Text } from '#global/domain/structures/Text'
import type { ChallengeDifficulty, ChallengeCompletionStatus } from '../structures'
import type { PaginationParams } from '../../../global/domain/types'

export type ChallengesListParams = {
  userId: Id | null
  difficulty: ChallengeDifficulty
  title: Text
  categoriesIds: IdsList
  postingOrder: ListingOrder
  upvotesCountOrder: ListingOrder
  completionStatus: ChallengeCompletionStatus
} & PaginationParams
