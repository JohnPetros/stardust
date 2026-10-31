import { useState } from 'react'

import { Integer } from '@stardust/core/global/structures'
import type { ProfileService } from '@stardust/core/profile/interfaces'

import { CACHE } from '@/constants'
import { useFetch } from '@/ui/global/hooks/useFetch'

const DEFAULT_DAYS = Integer.create(30)

export function useDailyActiveUsersChart(profileService: ProfileService) {
  const [days, setDays] = useState<Integer>(DEFAULT_DAYS)

  function handleDaysSelectChange(value: number) {
    if (!value) {
      setDays(DEFAULT_DAYS)
      return
    }
    setDays(Integer.create(value))
  }

  const { data, isLoading } = useFetch({
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
