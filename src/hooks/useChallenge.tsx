import { useMemo } from 'react'
import useSWR from 'swr'

import type { Challenge } from '@/@types/challenge'
import { useApi } from '@/services/api'

interface ChallengeParams {
  challengeId: string | null
  userId: string | null
}

export function useChallenge({ challengeId, userId }: ChallengeParams) {
  const api = useApi()

  async function addUserCompletedChallenge(
    challengeId: string,
    userId: string
  ) {
    api.addCompletedChallenge(challengeId, userId)
  }

  function getChallenges() {
    if (userId) {
      return api.getChallenges(userId)
    }
  }

  function getChallenge() {
    if (challengeId && userId) {
      return api.getChallengeBySlug(challengeId)
    }
  }

  async function getUserCompletedChallengesIds() {
    if (userId) {
      return await api.getUserCompletedChallengesIds(userId)
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

  const { data: userCompletedChallengesIds } = useSWR(
    () => `/user_completed_challenges_ids?user_id=${userId}`,
    getUserCompletedChallengesIds
  )

  // function addComplementaryData(challenge: Challenge) {
  //   if (!challenge.users_completed_challenges || !challenge.users)
  //     return challenge

  //   const isCompleted = challenge.users_completed_challenges.length > 0
  //   const createdBy = challenge.users[0].name

  //   delete challenge.users_completed_challenges
  //   delete challenge.users

  //   return { ...challenge, isCompleted, createdBy }
  // }

  if (challengesError) {
    console.error(challengesError)
    throw new Error(challengesError)
  }

  if (challengeError) {
    console.error(challengeError)
    throw new Error(challengeError)
  }

  const verifiedChallenges: Challenge[] = useMemo(() => {
    if (challenges && userCompletedChallengesIds) {
      return challenges
    }
    return []
  }, [challenges, userCompletedChallengesIds])

  return {
    challenges: verifiedChallenges,
    challenge,
    addUserCompletedChallenge,
  }
}
