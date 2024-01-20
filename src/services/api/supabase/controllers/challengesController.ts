import {
  ChallengeSummary,
  IChallengesController,
} from '../../interfaces/IChallengesController'
import type { Supabase } from '../types/supabase'

import type { Challenge } from '@/@types/challenge'

interface getFilteredChallengesProps {
  userId: string
  status: string
  difficulty: string
  categoriesIds: string[]
  search: string
  range: number
}

export const ChallengesController = (
  supabase: Supabase
): IChallengesController => {
  return {
    getChallengeBySlug: async (challengeSlug: string) => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('slug', challengeSlug)
        .single<Challenge>()

      if (error) {
        throw new Error(error.message)
      }

      return data
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

    getChallengeSlugByStarId: async (starId: string) => {
      const { data, error } = await supabase
        .from('challenges')
        .select('slug')
        .eq('star_id', starId)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data.slug
    },

    checkChallengeCompletition: async (challengeId: string, userId: string) => {
      const { data, error } = await supabase
        .from('users_completed_challenges')
        .select('challenge_id')
        .eq('challenge_id', challengeId)
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }

      return !data
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
