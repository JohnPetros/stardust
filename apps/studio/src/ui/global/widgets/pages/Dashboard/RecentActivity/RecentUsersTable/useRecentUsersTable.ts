import type { ProfileService } from '@stardust/core/profile/interfaces'

import { CACHE } from '@/constants'
import { useCache } from '@/ui/global/hooks/useCache'

export function useRecentUsersTable(profileService: ProfileService) {
  const { data, isLoading } = useCache({
    key: CACHE.recentUsersTable.key,
    fetcher: async () =>
      await profileService.fetchUsersList({
        search: '',
        page: 1,
        itemsPerPage: 10,
      }),
  })

  return {
    users: data?.items ?? [],
    isLoading,
  }
}
