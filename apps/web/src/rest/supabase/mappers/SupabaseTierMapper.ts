import type { TierDto } from '@stardust/core/ranking/entities/dtos'
import type { SupabaseTier } from '../types/SupabaseTier'

export const SupabaseTierMapper = () => {
  return {
    toTier(supabaseTier: SupabaseTier): TierDto {
      const TierDto: TierDto = {
        id: supabaseTier.id,
        name: supabaseTier.name,
        image: supabaseTier.image,
        position: supabaseTier.position,
        reward: supabaseTier.reward,
      }

      return TierDto
    },
  }
}
