import type { StarDto } from '@stardust/core/space/entities/dtos'
import { Star } from '@stardust/core/space/entities'

import type { SupabaseStar } from '../../types'

export class SupabaseStarMapper {
  static toEntity(supabaseStar: SupabaseStar): Star {
    return Star.create(SupabaseStarMapper.toDto(supabaseStar))
  }

  static toDto(supabaseStar: SupabaseStar): StarDto {
    const starDto: StarDto = {
      id: supabaseStar.id ?? '',
      name: supabaseStar.name ?? '',
      number: supabaseStar.number ?? 1,
      slug: supabaseStar.slug,
      isAvailable: supabaseStar.is_available ?? true,
      isChallenge: supabaseStar.is_challenge,
    }

    return starDto
  }

  static toSupabase(star: Star): SupabaseStar {
    const StarDto = star.dto

    const supabaseStar: SupabaseStar = {
      id: star.id.value,
      name: StarDto.name,
      number: StarDto.number,
      slug: StarDto.slug,
      is_available: StarDto.isAvailable,
      is_challenge: StarDto.isChallenge,
    }

    return supabaseStar
  }
}
