import { Tier } from '@stardust/core/ranking/entities'
import type { TierDto } from '@stardust/core/ranking/entities/dtos'

import type { SupabaseTier } from '../../types/SupabaseTier'

export class SupabaseTierMapper {
  static toEntity(supabaseTier: SupabaseTier): Tier {
    return Tier.create(SupabaseTierMapper.toDto(supabaseTier))
  }

  static toDto(supabaseTier: SupabaseTier): TierDto {
    const tierDto: TierDto = {
      id: supabaseTier.id,
      name: supabaseTier.name,
      image: supabaseTier.image,
      position: supabaseTier.position,
      reward: supabaseTier.reward,
    }

    return tierDto
  }

  static toSupabase(tier: Tier): SupabaseTier {
    const tierDto = tier.dto

    const supabaseTier: SupabaseTier = {
      id: tier.id.value,
      name: tierDto.name,
      image: tierDto.image,
      position: tierDto.position,
      reward: tierDto.reward,
    }

    return supabaseTier
  }
}
