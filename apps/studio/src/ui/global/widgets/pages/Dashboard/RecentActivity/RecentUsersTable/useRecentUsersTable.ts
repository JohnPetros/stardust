import { useState } from 'react'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import { OrdinalNumber, Sorter, Text } from '@stardust/core/global/structures'
import { SpaceCompletionStatus } from '@stardust/core/profile/structures'

import { CACHE } from '@/constants'
import { useCache } from '@/ui/global/hooks/useCache'

export function useRecentUsersTable(profileService: ProfileService) {
  const [sorters, setSorters] = useState({
    level: Sorter.create('none'),
    weeklyXp: Sorter.create('none'),
    unlockedStarCount: Sorter.create('none'),
    unlockedAchievementCount: Sorter.create('none'),
    completedChallengeCount: Sorter.create('none'),
  })

  const { data, isLoading } = useCache({
    key: CACHE.recentUsersTable.key,
    dependencies: [sorters],
    fetcher: async () =>
      await profileService.fetchUsersList({
        search: Text.create(''),
        page: OrdinalNumber.create(1),
        itemsPerPage: OrdinalNumber.create(10),
        levelSorter: sorters.level,
        weeklyXpSorter: sorters.weeklyXp,
        unlockedStarCountSorter: sorters.unlockedStarCount,
        unlockedAchievementCountSorter: sorters.unlockedAchievementCount,
        completedChallengeCountSorter: sorters.completedChallengeCount,
        spaceCompletionStatus: SpaceCompletionStatus.create('all'),
        insigniaRoles: [],
      }),
  })

  function handleSort(column: string, sorter: Sorter) {
    setSorters((prev) => ({
      ...prev,
      [column]: sorter,
    }))
  }

  return {
    users: data?.items ?? [],
    isLoading,
    sorters,
    onSort: handleSort,
  }
}
