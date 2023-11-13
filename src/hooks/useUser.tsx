'use client'
import useSWR from 'swr'

import { useApi } from '@/services/api'

export function useUser(userId: string) {
  const api = useApi()

  async function getUser() {
    if (userId) {
      return await api.getUser(userId)
    }
  }

  const { data: user, error } = useSWR(
    userId ? ['/user?id=' + userId, userId] : null,
    getUser
  )

  if (error) {
    throw new Error(error)
  }

  return {
    user,
  }
}
