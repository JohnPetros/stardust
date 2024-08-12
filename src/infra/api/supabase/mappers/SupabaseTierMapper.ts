import type { TierDTO } from '@/@core/dtos'
import type { SupabaseTier } from '../types/SupabaseTier'

export const SupabaseTierMapper = () => {
  return {
    toTier(supabaseTier: SupabaseTier): TierDTO {
      const TierDTO: TierDTO = {
        id: supabaseTier.id,
        name: supabaseTier.name,
        image: supabaseTier.image,
        position: supabaseTier.position,
        reward: supabaseTier.reward,
      }

      return TierDTO
    },
  }
}
