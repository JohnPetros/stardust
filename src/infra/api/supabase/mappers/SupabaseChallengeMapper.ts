import type { ChallengeDTO } from '@/@core/dtos'
import type { SupabaseChallenge } from '../types'
import type { Challenge } from '@/@core/domain/entities'

export const SupabaseChallengeMapper = () => {
  return {
    toDTO(supabaseChallenge: SupabaseChallenge): ChallengeDTO {
      const challengeDTO: ChallengeDTO = {
        id: supabaseChallenge.id ?? '',
        title: supabaseChallenge.title ?? '',
        code: supabaseChallenge.code ?? '',
        slug: supabaseChallenge.slug ?? '',
        difficulty: supabaseChallenge.difficulty ?? '',
        docId: supabaseChallenge.doc_id,
        functionName: supabaseChallenge.function_name,
      }

      return challengeDTO
    },

    toSupabase(challenge: Challenge): SupabaseChallenge {
      const challengeDTO = challenge.dto

      // @ts-ignore
      const supabaseChallenge: SupabaseChallenge = {
        id: challenge.id,
        title: challengeDTO.title,
        code: challengeDTO.code,
        slug: challengeDTO.slug,
        difficulty: challengeDTO.difficulty,
      }

      return supabaseChallenge
    },
  }
}
