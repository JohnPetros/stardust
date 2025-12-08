import { useState } from 'react'

import { Integer } from '@stardust/core/global/structures'
import type { ProfileService } from '@stardust/core/profile/interfaces'

import { CACHE } from '@/constants'
import { useCache } from '@/ui/global/hooks/useCache'

export function useDailyActiveUsersChart(profileService: ProfileService) {
  const [days, setDays] = useState<Integer>(Integer.create(30))

  function handleDaysSelectChange(value: number) {
    setDays(Integer.create(value))
  }

const { data, isLoading } = useCache({
    key: CACHE.dailyActiveUsersChart.key,
    fetcher: async () => await profileService.fetchDailyActiveUsersReport(days),
    dependencies: [days.value],
  })

  return {
    dailyActiveUsers: data ?? [],
    days: days.value,
    isLoading,
    handleDaysSelectChange,
  }
}
