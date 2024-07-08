'use client'

import { CACHE } from '@/global/constants/cache'
import { useApi } from '@/services/api'
import { useCache } from '@/services/cache'

export function useUserAvatar(avatarId?: string) {
  const api = useApi()

  async function getAvatar() {
    if (avatarId) {
      try {
        const avatar = await api.getAvatar(avatarId)
        return avatar
      } catch (error) {
        console.error(error)
      }
    }
  }

  const { data: avatar } = useCache({
    key: CACHE.keys.avatar,
    fetcher: getAvatar,
    dependencies: [avatarId],
  })

  return avatar
}
