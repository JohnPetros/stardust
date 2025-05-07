import type { Star } from '@stardust/core/space/entities'
import type { StarDto } from '@stardust/core/space/entities/dtos'
import type { SupabaseStar } from '../types'

export const SupabaseStarMapper = () => {
  return {
    toDto(supabaseStar: SupabaseStar): StarDto {
      const StarDto: StarDto = {
        id: supabaseStar.id ?? '',
        name: supabaseStar.name ?? '',
        number: supabaseStar.number ?? 1,
        slug: supabaseStar.slug,
      }

      return StarDto
    },

    toSupabase(star: Star): SupabaseStar {
      const StarDto = star.dto

      const supabaseStar: SupabaseStar = {
        id: star.id.value,
        name: StarDto.name,
        number: StarDto.number,
        slug: StarDto.slug,
      }

      return supabaseStar
    },
  }
}
