import type { RankingUserDTO } from '@/@core/dtos'
import type { SupabaseRankingUser } from '../types'

export const SupabaseRankingUserMapper = () => {
  return {
    toRankingUser(supabaseRankingUser: SupabaseRankingUser): RankingUserDTO {
      const rankingUserDTO: RankingUserDTO = {
        id: supabaseRankingUser.id,
        name: supabaseRankingUser.user?.name ?? '',
        slug: supabaseRankingUser.user?.slug ?? '',
        xp: supabaseRankingUser.xp,
        avatar: {
          image: supabaseRankingUser.user?.avatar?.image ?? '',
          name: supabaseRankingUser.user?.avatar?.name ?? '',
        },
        tierId: supabaseRankingUser.tier_id,
      }

      return rankingUserDTO
    },
  }
}
