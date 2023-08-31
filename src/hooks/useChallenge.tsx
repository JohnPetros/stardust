import { useMemo } from 'react'
import { useApi } from '@/services/api'
import useSWR from 'swr'

import type { Challenge } from '@/types/challenge'

interface ChallengeParams {
  challengeId?: string
  userId?: string
}

export function useChallenge({ challengeId, userId }: ChallengeParams) {
  const api = useApi()

  function getChallenges() {
    if (userId) {
      return api.getChallenges(userId)
    }
  }

  function getChallenge() {
    if (challengeId && userId) {
      return api.getChallenge(challengeId, userId)
    }
  }

  const { data: challenges, error: challengesError } = useSWR(
    challengeId ? '/challenges?user_id=' + userId : null,
    getChallenges
  )

  const { data: challenge, error: challengeError } = useSWR(
    challengeId && userId ? '/challenge?id=' + challengeId : null,
    getChallenge
  )

  function addComplementaryData(challenge: Challenge) {
    if (!challenge.users_completed_challenges || !challenge.users)
      return challenge

    const isCompleted = challenge.users_completed_challenges.length > 0
    const createdBy = challenge.users[0].name

    delete challenge.users_completed_challenges
    delete challenge.users

    return { ...challenge, isCompleted, createdBy }
  }

  if (challengesError) {
    console.error(challengesError)
    throw new Error(challengesError)
  }

  if (challengeError) {
    console.error(challengeError)
    throw new Error(challengeError)
  }

  const verifiedChallenges: Challenge[] = useMemo(() => {
    if (challenges?.length) {
      return challenges.map(addComplementaryData)
    }
    return []
  }, [challenges])


  return {
    challenges: verifiedChallenges,
    challenge,
  }
}
