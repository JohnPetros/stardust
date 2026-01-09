import type { Sorter } from '#global/domain/structures/Sorter'
import type { FilteringParams } from '#global/domain/types/FilteringParams'

export type UsersListingParams = {
  levelSorter: Sorter
  weeklyXpSorter: Sorter
  unlockedStarCountSorter: Sorter
  unlockedAchievementCountSorter: Sorter
  completedChallengeCountSorter: Sorter
} & FilteringParams
