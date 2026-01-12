import { useState } from 'react'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import { OrdinalNumber, ListingOrder, Text } from '@stardust/core/global/structures'
import { SpaceCompletionStatus } from '@stardust/core/profile/structures'

import { CACHE } from '@/constants'
import { useCache } from '@/ui/global/hooks/useCache'

export function useRecentUsersTable(profileService: ProfileService) {
  const [orders, setOrders] = useState({
    level: ListingOrder.create('any'),
    weeklyXp: ListingOrder.create('any'),
    unlockedStarCount: ListingOrder.create('any'),
    unlockedAchievementCount: ListingOrder.create('any'),
    completedChallengeCount: ListingOrder.create('any'),
  })

  const { data, isLoading } = useCache({
    key: CACHE.recentUsersTable.key,
    dependencies: [orders],
    fetcher: async () =>
      await profileService.fetchUsersList({
        search: Text.create(''),
        page: OrdinalNumber.create(1),
        itemsPerPage: OrdinalNumber.create(10),
        levelOrder: orders.level,
        weeklyXpOrder: orders.weeklyXp,
        unlockedStarCountOrder: orders.unlockedStarCount,
        unlockedAchievementCountOrder: orders.unlockedAchievementCount,
        completedChallengeCountOrder: orders.completedChallengeCount,
        spaceCompletionStatus: SpaceCompletionStatus.create('all'),
        insigniaRoles: [],
      }),
  })

  function handleOrderChange(column: string, order: ListingOrder) {
    setOrders((prev) => ({
      ...prev,
      [column]: order,
    }))
  }

  return {
    users: data?.items ?? [],
    isLoading,
    orders,
    onOrderChange: handleOrderChange,
  }
}
