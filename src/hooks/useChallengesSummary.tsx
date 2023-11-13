import useSWR from 'swr'

import { useApi } from '@/services/api'

export function useChallengesSummary(userId: string) {
  const api = useApi()

  function getChallengesSummary() {
    if (userId) {
      return api.getChallengesSummary(userId)
    }
  }

  const { data, error } = useSWR(
    () => '/challenges_summary?user_id=' + userId,
    getChallengesSummary
  )

  if (error) {
    console.error(error)
    throw new Error(error)
  }

  return {
    challenges: data,
  }
}
