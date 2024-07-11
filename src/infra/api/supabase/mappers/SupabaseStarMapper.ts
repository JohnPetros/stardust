import { Star } from '@/@core/domain/entities'

import type { StarDTO } from '@/@core/dtos'
import type { SupabaseStar } from '../types'

export const SupabaseStarMapper = () => {
  return {
    toStar(supabaseStar: SupabaseStar): Star {
      const StarDTO: StarDTO = {
        id: supabaseStar.id ?? '',
        name: supabaseStar.name ?? '',
        number: supabaseStar.number ?? 1,
        isChallenge: supabaseStar.is_challenge,
        planetId: supabaseStar.planet_id,
        slug: supabaseStar.slug,
        // texts: supabaseStar.texts,
      }

      return Star.create(StarDTO)
    },

    toSupabase(star: Star): SupabaseStar {
      const StarDTO = star.dto

      const supabaseStar: SupabaseStar = {
        id: star.id,
        name: StarDTO.name,
        number: StarDTO.number,
        slug: StarDTO.slug,
        planet_id: StarDTO.planetId,
        texts: [],
        questions: [],
        is_challenge: StarDTO.isChallenge,
      }

      return supabaseStar
    },
  }
}
