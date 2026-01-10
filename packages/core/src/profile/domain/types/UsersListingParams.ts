import type { Period } from '#global/domain/structures/Period'
import type { InsigniaRole } from '#global/domain/structures/InsigniaRole'
import type { Sorter } from '#global/domain/structures/Sorter'
import type { FilteringParams } from '#global/domain/types/FilteringParams'
import type { SpaceCompletionStatus } from '../structures'

export type UsersListingParams = {
  levelSorter: Sorter
  weeklyXpSorter: Sorter
  unlockedStarCountSorter: Sorter
  unlockedAchievementCountSorter: Sorter
  completedChallengeCountSorter: Sorter
  spaceCompletionStatus: SpaceCompletionStatus
  insigniaRoles: InsigniaRole[]
  creationPeriod?: Period
} & FilteringParams
