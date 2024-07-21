'use client'

import type { AchievementDTO } from '@/@core/dtos'
import { useApi } from '@/infra/api'
import { useCache } from '@/infra/cache'
import { useToastContext } from '../contexts/ToastContext'
import { CACHE } from '../constants'

export function useUserAchievements(userId?: string) {
  const api = useApi()
  const toast = useToastContext()

  async function fetchAchievements() {
    const response = await api.fetchAchievements()

    if (response.isSuccess) {
      return response.data
    }

    toast.show(response.errorMessage)

    return []
  }

  const { data } = useCache<AchievementDTO[]>({
    key: CACHE.keys.userAchievements,
    fetcher: fetchAchievements,
    dependencies: [userId],
  })

  return { userAchievements: data }
}
