import type { StarDto } from '@stardust/core/space/entities/dtos'
import { Star } from '@stardust/core/space/entities'

import type { SupabaseStar } from '../../types'

export class SupabaseStarMapper {
  static toEntity(supabaseStar: SupabaseStar): Star {
    return Star.create(SupabaseStarMapper.toDto(supabaseStar))
  }

  static toDto(supabaseStar: SupabaseStar): StarDto {
    const StarDto: StarDto = {
      id: supabaseStar.id ?? '',
      name: supabaseStar.name ?? '',
      number: supabaseStar.number ?? 1,
      slug: supabaseStar.slug,
    }

    return StarDto
  }

  static toSupabase(star: Star): SupabaseStar {
    const StarDto = star.dto

    const supabaseStar: SupabaseStar = {
      id: star.id.value,
      name: StarDto.name,
      number: StarDto.number,
      slug: StarDto.slug,
    }

    return supabaseStar
  }
}
