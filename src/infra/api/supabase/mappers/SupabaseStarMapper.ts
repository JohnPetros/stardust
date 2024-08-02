import type { Star } from '@/@core/domain/entities'

import type { StarDTO } from '@/@core/dtos'
import type { SupabaseStar } from '../types'

export const SupabaseStarMapper = () => {
  return {
    toDTO(supabaseStar: SupabaseStar): StarDTO {
      const StarDTO: StarDTO = {
        id: supabaseStar.id ?? '',
        name: supabaseStar.name ?? '',
        number: supabaseStar.number ?? 1,
        isChallenge: supabaseStar.is_challenge,
        slug: supabaseStar.slug,
        planetId: supabaseStar.planet_id,
      }

      return StarDTO
    },

    toSupabase(star: Star): SupabaseStar {
      const StarDTO = star.dto

      const supabaseStar: SupabaseStar = {
        id: star.id,
        name: StarDTO.name,
        number: StarDTO.number,
        slug: StarDTO.slug,
        is_challenge: StarDTO.isChallenge,
        planet_id: StarDTO.planetId,
      }

      return supabaseStar
    },
  }
}
