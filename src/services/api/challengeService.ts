import {
  ChallengeSummary,
  IChallengeService,
} from './interfaces/IChallengeService'

import type { Challenge } from '@/@types/challenge'
import { Supabase } from '@/@types/supabase'

interface getFilteredChallengesProps {
  userId: string
  status: string
  difficulty: string
  categoriesIds: string[]
  search: string
  range: number
}

export const ChallengeService = (supabase: Supabase): IChallengeService => {
  return {
    getChallenge: async (challengeId: string, userId: string) => {
      const { data, error } = await supabase
        .from('challenges')
        .select(
          '*, users_completed_challenges(user_id), users(name):created_by'
        )
        .eq('id', challengeId)
        .eq('users_completed_challenges.user_id', userId)
        .eq('users.id', userId)
        .single<Challenge & { users_completed_challenges: [] }>()

      if (error) {
        throw new Error(error.message)
      }

      const challenge: Challenge = {
        ...data,
        isCompleted:
          !!data.users_completed_challenges &&
          data.users_completed_challenges.length > 0,
      }

      delete challenge.users_completed_challenges

      return challenge
    },

    getChallenges: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .returns<Challenge[]>()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },

    getChallengesSummary: async (userId: string) => {
      const { data, error } = await supabase
        .from('challenges')
        .select('id, difficulty, users_completed_challenges(user_id)')
        .eq('users_completed_challenges.user_id', userId)
        .returns<ChallengeSummary[]>()

      if (error) {
        throw new Error(error.message)
      }

      const challengesSummary = data.map((challenge) => ({
        ...challenge,
        isCompleted:
          challenge.users_completed_challenges &&
          challenge.users_completed_challenges.length > 0,
      }))

      return challengesSummary
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
