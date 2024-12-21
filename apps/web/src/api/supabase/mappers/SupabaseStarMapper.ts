import type { Star } from '@stardust/core/space/entities'
import type { StarDto } from '@stardust/core/space/dtos'
import type { SupabaseStar } from '../types'

export const SupabaseStarMapper = () => {
  return {
    toDto(supabaseStar: SupabaseStar): StarDto {
      const StarDto: StarDto = {
        id: supabaseStar.id ?? '',
        name: supabaseStar.name ?? '',
        number: supabaseStar.number ?? 1,
        isChallenge: supabaseStar.is_challenge,
        slug: supabaseStar.slug,
        planetId: supabaseStar.planet_id,
      }

      return StarDto
    },

    toSupabase(star: Star): SupabaseStar {
      const StarDto = star.dto

      const supabaseStar: SupabaseStar = {
        id: star.id,
        name: StarDto.name,
        number: StarDto.number,
        slug: StarDto.slug,
        is_challenge: StarDto.isChallenge,
        planet_id: StarDto.planetId,
      }

      return supabaseStar
    },
  }
}
