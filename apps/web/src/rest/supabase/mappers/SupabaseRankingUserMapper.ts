import type { RankingUserDto } from '@stardust/core/ranking/entities/dtos'
import type { SupabaseRankingUser } from '../types'

export const SupabaseRankingUserMapper = () => {
  return {
    toRankingUser(supabaseRankingUser: SupabaseRankingUser): RankingUserDto {
      const rankingUserDto: RankingUserDto = {
        id: supabaseRankingUser.id,
        name: supabaseRankingUser.user?.name ?? '',
        slug: supabaseRankingUser.user?.slug ?? '',
        xp: supabaseRankingUser.xp,
        avatar: {
          image: supabaseRankingUser.user?.avatar?.image ?? '',
          name: supabaseRankingUser.user?.avatar?.name ?? '',
        },
        tierId: supabaseRankingUser.tier_id,
        position: Number(supabaseRankingUser.position),
      }

      return rankingUserDto
    },
  }
}
