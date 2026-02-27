import type { Id, IdsList, Logical } from '#global/domain/structures/index'
import type { ListingOrder } from '#global/domain/structures/ListingOrder'
import type { Text } from '#global/domain/structures/Text'
import type {
  ChallengeDifficulty,
  ChallengeCompletionStatus,
  ChallengeIsNewStatus,
} from '../structures'
import type { PaginationParams } from '../../../global/domain/types'

export type ChallengesListParams = {
  userId: Id | null
  difficulty: ChallengeDifficulty
  title: Text
  categoriesIds: IdsList
  postingOrder: ListingOrder
  upvotesCountOrder: ListingOrder
  downvoteCountOrder: ListingOrder
  completionCountOrder: ListingOrder
  completionStatus: ChallengeCompletionStatus
  isNewStatus: ChallengeIsNewStatus
  shouldIncludeStarChallenges: Logical
  shouldIncludeOnlyAuthorChallenges: Logical
  shouldIncludePrivateChallenges: Logical
} & PaginationParams
