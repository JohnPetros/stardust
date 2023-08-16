'use client'
import { useApi } from '@/services/api'
import { User } from '@/types/user'
import useSWR from 'swr'

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
    user
  }
}
