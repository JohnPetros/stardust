'use client'

import { IChallengeService } from './interfaces/IChallengeService'

import type { Challenge } from '@/@types/challenge'
import { useSupabase } from '@/hooks/useSupabase'

interface getFilteredChallengesProps {
  userId: string
  status: string
  difficulty: string
  categoriesIds: string[]
  search: string
  range: number
}

export const ChallengeService = (): IChallengeService => {
  const { supabase } = useSupabase()

  return {
    getChallenge: async (challengeId: string, userId: string) => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*, users_completed_challenges(count)')
        .eq('id', challengeId)
        .eq('users_completed_challenges.user_id', userId)
        .single<Challenge>()

      if (error) {
        throw new Error(error.message)
      }

      const challenge: Challenge = {
        ...data,
        isCompleted:
          !!data.users_completed_challenges &&
          data.users_completed_challenges[0].count > 0,
      }

      delete challenge.users_completed_challenges

      return challenge
    },

    getChallenges: async (userId: string) => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*, users_completed_challenges(count)')
        .eq('users_completed_challenges.user_id', userId)
        .returns<Challenge[]>()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },

    getFilteredChallenges: async ({
      userId,
      status,
      difficulty,
      categoriesIds,
      search,
    }: getFilteredChallengesProps) => {
      const { data, error } = await supabase
        .rpc('get_filtered_challenges', {
          userid: userId,
          _difficulty: difficulty,
          status,
          categories_ids: categoriesIds,
          search,
        })
        .returns<Challenge[]>()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },

    getChallengeId: async (starId: string) => {
      const { data, error } = await supabase
        .from('challenges')
        .select('id')
        .eq('star_id', starId)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data.id
    },

    getUserCompletedChallengesIds: async (userId: string) => {
      const { data, error } = await supabase
        .from('users_completed_challenges')
        .select('challenge_id')
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }

      return data.map((data) => data.challenge_id)
    },

    addCompletedChallenge: async (challengeId: string, userId: string) => {
      const { error } = await supabase
        .from('users_completed_challenges')
        .insert([{ challenge_id: challengeId, user_id: userId }])

      if (error) {
        throw new Error(error.message)
      }
    },
  }
}
