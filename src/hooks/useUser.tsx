'use client'
import { api } from '@/services/api'
import useSWR from 'swr'

export function useUser(userId: string) {
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
