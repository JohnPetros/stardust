import type { Period } from '#global/domain/structures/Period'
import type { InsigniaRole } from '#global/domain/structures/InsigniaRole'
import type { ListingOrder } from '#global/domain/structures/ListingOrder'
import type { FilteringParams } from '#global/domain/types/FilteringParams'
import type { Id } from '#global/domain/structures/Id'
import type { SpaceCompletionStatus } from '../structures'

export type UsersListingParams = {
  levelOrder: ListingOrder
  weeklyXpOrder: ListingOrder
  unlockedStarCountOrder: ListingOrder
  unlockedAchievementCountOrder: ListingOrder
  completedChallengeCountOrder: ListingOrder
  spaceCompletionStatus: SpaceCompletionStatus
  insigniaRoles: InsigniaRole[]
  lastUnlockedStarId?: Id
  creationPeriod?: Period
} & FilteringParams
