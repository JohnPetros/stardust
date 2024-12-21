import type { ChallengeDto } from '#dtos'
import type { SupabaseChallenge } from '../types'
import type { Challenge } from '@/@core/domain/entities'

export const SupabaseChallengeMapper = () => {
  return {
    toDto(supabaseChallenge: SupabaseChallenge): ChallengeDto {
      const challengeDto: ChallengeDto = {
        id: supabaseChallenge.id ?? '',
        title: supabaseChallenge.title ?? '',
        code: supabaseChallenge.code ?? '',
        slug: supabaseChallenge.slug ?? '',
        difficulty: supabaseChallenge.difficulty ?? '',
      }

      return challengeDto
    },

    toSupabase(challenge: Challenge): SupabaseChallenge {
      const challengeDto = challenge.dto

      // @ts-ignore
      const supabaseChallenge: SupabaseChallenge = {
        id: challenge.id,
        title: challengeDto.title,
        code: challengeDto.code,
        slug: challengeDto.slug,
        difficulty: challengeDto.difficulty,
      }

      return supabaseChallenge
    },
  }
}
