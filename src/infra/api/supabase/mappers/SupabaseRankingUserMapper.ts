import type { RankingUserDTO } from '@/@core/dtos'

import type { SupabaseRankingUser } from '../types'

export const SupabaseRankingUserMapper = () => {
  return {
    toDTO(supabaseRankingUser: SupabaseRankingUser): RankingUserDTO {
      const rankedUserDTO: RankingUserDTO = {
        id: supabaseRankingUser.id ?? '',
        name: supabaseRankingUser.name ?? '',
        slug: supabaseRankingUser.slug ?? '',
        weeklyXp: supabaseRankingUser.weekly_xp,
        avatarImage: supabaseRankingUser.avatars?.image ?? '',
      }

      return rankedUserDTO
    },
  }
}
