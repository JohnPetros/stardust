import {
  GetFilteredChallengesParams,
  IChallengesController,
} from '../../interfaces/IChallengesController'
import type { Supabase } from '../types/supabase'

import type { Challenge } from '@/@types/challenge'
import { ChallengeSummary } from '@/@types/challengeSummary'
import type { Vote } from '@/@types/vote'

export const ChallengesController = (
  supabase: Supabase
): IChallengesController => {
  return {
    getChallengeBySlug: async (challengeSlug: string) => {
      const { data, error } = await supabase
        .from('challenges')
        .select(
          '*, votes:users_voted_challenges(vote), total_completitions:users_completed_challenges(count)'
        )
        .eq('slug', challengeSlug)
        .single<
          Challenge & { votes: { vote: Vote }[] } & {
            total_completitions: [{ count: number }]
          }
        >()

      if (error) {
        throw new Error(error.message)
      }

      const challenge: Challenge = {
        id: data.id,
        code: data.code,
        difficulty: data.difficulty,
        description: data.description,
        function_name: data.function_name,
        slug: data.slug,
        title: data.title,
        user_slug: data.user_slug,
        created_at: data.created_at,
        categories: data.categories,
        star_id: data.star_id,
        test_cases: data.test_cases,
        doc_id: data.doc_id,
        texts: data.texts,
        total_completitions: data.total_completitions[0].count,
        upvotes: data.votes.filter(({ vote }) => vote === 'upvote').length,
        downvotes: data.votes.filter(({ vote }) => vote === 'downvote').length,
      }

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
        .select(
          'id, difficulty, userCompletedChallengesIds:users_completed_challenges(challenge_id)'
        )
        .eq('users_completed_challenges.user_id', userId)
        .returns<ChallengeSummary[]>()

      if (error) {
        throw new Error(error.message)
      }

      const challengesSummary = data.map((challenge) => ({
        ...challenge,
        isCompleted:
          challenge.userCompletedChallengesIds &&
          challenge.userCompletedChallengesIds.length > 0,
      }))

      return challengesSummary
    },

    getFilteredChallenges: async ({
      userId,
      status,
      difficulty,
      categoriesIds,
      search,
    }: GetFilteredChallengesParams) => {
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

    getUserVote: async (userId: string, challengeId: string) => {
      const { data, error } = await supabase
        .from('users_voted_challenges')
        .select('vote')
        .eq('user_id', userId)
        .eq('challenge_id', challengeId)
        .single<{ vote: Vote }>()

      if (error) {
        throw new Error(error.message)
      }

      return data.vote
    },

    checkChallengeCompletition: async (challengeId: string, userId: string) => {
      const { data, error } = await supabase
        .from('users_completed_challenges')
        .select('challenge_id')
        .eq('challenge_id', challengeId)
        .eq('user_id', userId)
        .single()

      if (error) {
        return false
      }

      return Boolean(data.challenge_id)
    },

    addVotedChallenge: async (
      challengeId: string,
      userId: string,
      vote: Vote
    ) => {
      const { error } = await supabase
        .from('users_voted_challenges')
        .insert([
          { challenge_id: challengeId, user_id: userId, vote: String(vote) },
        ])

      if (error) {
        throw new Error(error.message)
      }
    },

    updateVotedChallenge: async (
      challengeId: string,
      userId: string,
      vote: Vote
    ) => {
      const { error } = await supabase
        .from('users_voted_challenges')
        .update({ vote: String(vote) })
        .eq('challenge_id', challengeId)
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }
    },

    removeVotedChallenge: async (
      challengeId: string,
      userId: string,
      vote: Vote
    ) => {
      const { error } = await supabase
        .from('users_voted_challenges')
        .delete()
        .eq('challenge_id', challengeId)
        .eq('user_id', userId)
        .eq('vote', String(vote))

      if (error) {
        throw new Error(error.message)
      }
    },

    addCompletedChallenge: async (challengeId: string, userId: string) => {
      const { error } = await supabase
        .from('users_completed_challenges')
        .insert({ challenge_id: challengeId, user_id: userId })

      if (error) {
        throw new Error(error.message)
      }
    },
  }
}
