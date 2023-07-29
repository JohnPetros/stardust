'use client'
import { api } from '@/services/api'
import useSWR, { mutate } from 'swr'
import { useAuth } from './useAuth'

export function useChallenge(challengeId?: string) {
  const { user } = useAuth()

  // async function getUserCompletedChallengesIds() {
  //   if (user?.id) {
  //     return await api.getUserCompletedChallengesIds(user.id)
  //   }
  // }

  // async function getUserCompletedChallengesIds() {
  //   if (user?.id) {
  //     return await api.getUserCompletedChallengesIds(user.id)
  //   }
  // }

  async function getChallenges() {
    if (user?.id) {
      return await api.getChallenges(0, user.id, ['55'])
    }
  }

  const { data: challenges, error } = useSWR(
    !challengeId ? '/challenges' : null,
    getChallenges
  )

  console.log(error)
  
  console.log(challenges)

  return {
    challenges,
  }
}
