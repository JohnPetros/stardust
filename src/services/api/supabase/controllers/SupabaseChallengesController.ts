import {
  GetFilteredChallengesParams,
  IChallengesController,
} from '../../interfaces/IChallengesController'
import { SupabaseChallengeAdapter } from '../adapters/SupabaseChallengeAdapter'
import type { Supabase } from '../types/Supabase'
import { SupabaseChallenge } from '../types/SupabaseChallenge'

import { ChallengeDifficulty } from '@/@types/Challenge'
import type { ChallengeSummary } from '@/@types/ChallengeSummary'
import type { Vote } from '@/@types/Vote'

export const SupabaseChallengesController = (
  supabase: Supabase
): IChallengesController => {
  return {
    async getChallengeBySlug(challengeSlug: string) {
      const { data, error } = await supabase
        .from('challenges_view')
        .select('*')
        .eq('slug', challengeSlug)
        .single<
          SupabaseChallenge & {
            votes: { vote: Vote }[]
            total_completitions: [{ count: number }]
          }
        >()

      if (error) {
        throw new Error(error.message)
      }

      const challenge = SupabaseChallengeAdapter(data)

      return challenge
    },

    async getChallengesSummary(userId: string) {
      const { data, error } = await supabase
        .from('challenges')
        .select(
          'id, difficulty, userCompletedChallengesIds:users_completed_challenges(challenge_id)'
        )
        .eq('users_completed_challenges.user_id', userId)

      if (error) {
        throw new Error(error.message)
      }

      const challengesSummary: ChallengeSummary[] = data.map(
        (supabaseChallengeSummary) => ({
          id: supabaseChallengeSummary.id,
          difficulty:
            supabaseChallengeSummary.difficulty as ChallengeDifficulty,
          isCompleted:
            supabaseChallengeSummary.userCompletedChallengesIds &&
            supabaseChallengeSummary.userCompletedChallengesIds.length > 0,
        })
      )

      return challengesSummary
    },

    async getFilteredChallenges({
      userId,
      status,
      difficulty,
      categoriesIds,
      title,
    }: GetFilteredChallengesParams) {
      const { data, error } = await supabase
        .rpc('get_filtered_challenges', {
          _userid: userId,
          _difficulty: difficulty,
          _status: status,
          _categories_ids: categoriesIds,
          _search: title,
        })
        .select('*, categories(name)')

      if (error) {
        throw new Error(error.message)
      }

      const challenges = data.map(SupabaseChallengeAdapter)

      return challenges
    },

    async getChallengeSlugByStarId(starId: string) {
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

    async getUserCompletedChallengesIds(userId: string) {
      const { data, error } = await supabase
        .from('users_completed_challenges')
        .select('challenge_id')
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }

      return data.map((data) => data.challenge_id)
    },

    async getUserVote(userId: string, challengeId: string) {
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

    async addCompletedChallenge(challengeId: string, userId: string) {
      const { error } = await supabase
        .from('users_completed_challenges')
        .insert({ challenge_id: challengeId, user_id: userId })

      if (error) {
        throw new Error(error.message)
      }
    },

    async addVotedChallenge(challengeId: string, userId: string, vote: Vote) {
      const { error } = await supabase
        .from('users_voted_challenges')
        .insert([
          { challenge_id: challengeId, user_id: userId, vote: String(vote) },
        ])

      if (error) {
        throw new Error(error.message)
      }
    },

    async updateVotedChallenge(
      challengeId: string,
      userId: string,
      vote: Vote
    ) {
      const { error } = await supabase
        .from('users_voted_challenges')
        .update({ vote: String(vote) })
        .eq('challenge_id', challengeId)
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }
    },

    async removeVotedChallenge(
      challengeId: string,
      userId: string,
      vote: Vote
    ) {
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

    async checkChallengeCompletition(challengeId: string, userId: string) {
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
  }
}
