import type { IChallengesService } from '@/@core/interfaces/services'
import { ServiceResponse } from '@/@core/responses'
import { ChallengeNotFoundError } from '@/@core/errors/challenges'

import type { Supabase } from '../types/Supabase'
import { SupabasePostgrestError } from '../errors'
import { SupabaseChallengeMapper } from '../mappers'

export const SupabaseChallengesService = (supabase: Supabase): IChallengesService => {
  const supabaseChallengeMapper = SupabaseChallengeMapper()

  return {
    async fetchChallengeBySlug(challengeSlug: string) {
      const { data, error } = await supabase
        .from('challenges_view')
        .select('*')
        .eq('slug', challengeSlug)
        .single()

      if (error) {
        return SupabasePostgrestError(error, ChallengeNotFoundError)
      }

      const challengeDto = supabaseChallengeMapper.toDto(data)

      return new ServiceResponse(challengeDto)
    },

    async fetchChallengeSlugByStarId(starId) {
      const { data, error } = await supabase
        .from('challenges')
        .select('slug')
        .eq('star_id', starId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, ChallengeNotFoundError)
      }

      return new ServiceResponse(data.slug)
    },

    async fetchChallengesWithOnlyDifficulty() {
      const { data, error } = await supabase.from('challenges').select('id, difficulty')

      if (error) {
        return SupabasePostgrestError(error, ChallengeNotFoundError)
      }

      return new ServiceResponse(
        data.filter(({ id, difficulty }) => {
          return {
            id,
            difficulty: difficulty,
          }
        }),
      )
    },
  }
}
