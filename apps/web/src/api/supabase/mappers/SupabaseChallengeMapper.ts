import type { Challenge } from '@stardust/core/challenging/entities'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'
import type { SupabaseChallenge } from '../types'

export const SupabaseChallengeMapper = () => {
  return {
    toDto(supabaseChallenge: SupabaseChallenge): ChallengeDto {
      const challengeDto: ChallengeDto = {
        id: supabaseChallenge.id ?? '',
        title: supabaseChallenge.title ?? '',
        code: supabaseChallenge.code ?? '',
        slug: supabaseChallenge.slug ?? '',
        difficulty: supabaseChallenge.difficulty ?? '',
        docId: supabaseChallenge.doc_id,
        functionName: supabaseChallenge.function_name,
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
