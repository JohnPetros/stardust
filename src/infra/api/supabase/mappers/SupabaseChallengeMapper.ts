import type { ChallengeDTO } from '@/@core/dtos'
import type { SupabaseChallenge } from '../types'

export const SupabaseChallengeMapper = () => {
  return {
    toDTO(supabaseChallenge: SupabaseChallenge): ChallengeDTO {
      const challengeDTO: ChallengeDTO = {
        id: supabaseChallenge.id ?? '',
        title: supabaseChallenge.title ?? '',
        code: supabaseChallenge.code ?? '',
        slug: supabaseChallenge.slug ?? '',
      }

      return challengeDTO
    },

    toSupabase(challengeDTO: ChallengeDTO): SupabaseChallenge {
      const supabaseChallenge: SupabaseChallenge = {
        id: challengeDTO.id,
        title: challengeDTO.title,
        code: challengeDTO.code,
        slug: challengeDTO.slug,
      }

      return supabaseChallenge
    },
  }
}
