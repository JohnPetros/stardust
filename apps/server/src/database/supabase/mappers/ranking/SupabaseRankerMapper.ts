import type { RankingUserDto } from '@stardust/core/ranking/entities/dtos'
import { RankingUser } from '@stardust/core/ranking/entities'

import type { SupabaseRankingUser } from '../../types'

export class SupabaseRankerMapper {
  static toEntity(supabaseRanker: SupabaseRankingUser): RankingUser {
    return RankingUser.create(SupabaseRankerMapper.toDto(supabaseRanker))
  }

  static toDto(supabaseRanker: SupabaseRankingUser): RankingUserDto {
    const rankerDto: RankingUserDto = {
      id: supabaseRanker.id,
      name: supabaseRanker.user?.name ?? '',
      slug: supabaseRanker.user?.slug ?? '',
      xp: supabaseRanker.xp,
      avatar: {
        image: supabaseRanker.user?.avatar?.image ?? '',
        name: supabaseRanker.user?.avatar?.name ?? '',
      },
      tierId: supabaseRanker.tier_id,
      position: Number(supabaseRanker.position),
    }

    return rankerDto
  }
}
