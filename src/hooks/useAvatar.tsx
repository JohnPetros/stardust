'use client'

import useSWR from 'swr'

import { useApi } from '@/services/api'

export function useAvatar(avatarId?: string) {
  const api = useApi()

  async function getAvatar() {
    if (avatarId) {
      return await api.getAvatar(avatarId)
    }
  }

  const { data: avatar } = useSWR(
    () => '/avatar?avatar_id=' + avatarId,
    getAvatar
  )

  return {
    avatar: avatar,
  }
}
