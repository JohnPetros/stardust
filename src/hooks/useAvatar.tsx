'use client'

import useSWR from 'swr'

import { useAuth } from '@/contexts/AuthContext'
import { useApi } from '@/services/api'

export function useAvatar(avatarId?: string) {
  const api = useApi()
  const { user } = useAuth()

  async function getAvatar() {
    if (avatarId) {
      return await api.getAvatar(avatarId)
    }
  }

  const { data: avatar } = useSWR(
    avatarId ? '/avatar?user_id=' + user?.id : null,
    getAvatar
  )

  return {
    avatar: avatar,
  }
}
