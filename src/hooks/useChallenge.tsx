import { useMemo } from 'react'
import useSWR from 'swr'

import { useApi } from '@/services/api'
import type { Challenge } from '@/types/challenge'

export function useChallenge(
  challengeId?: string | null,
  userId?: string | null
) {
  const api = useApi()

  function getChallenges() {
    if (userId) {
      return api.getChallenges(userId)
    }
  }

  const { data: challenges, error } = useSWR(
    userId ? '/challenges?user_id=' + userId : null,
    getChallenges
  )

  function checkCompletition(challenge: Challenge) {
    const isCompleted = challenge.users_completed_challenges.length > 0

    return { ...challenge, isCompleted }
  }

  if (error) {
    throw new Error(error)
  }

  const verifiedChallenges: Challenge[] = useMemo(() => {
    if (challenges?.length) {
      return challenges.map(checkCompletition)
    }
    return []
  }, [challenges])


  return {
    challenges: verifiedChallenges,
  }
}
