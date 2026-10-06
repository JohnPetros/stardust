import { RankingUser } from '@stardust/core/ranking/entities'
import type { RankingUserDto } from '@stardust/core/ranking/entities/dtos'
import type { DrizzleRankingUser } from '../../types/entities/ranking'

export class DrizzleRankerMapper {
  static toEntity(row: DrizzleRankingUser): RankingUser {
    return RankingUser.create(DrizzleRankerMapper.toDto(row))
  }
  static toDto(row: DrizzleRankingUser): RankingUserDto {
    return {
      id: row.id,
      ...DrizzleRankerMapper.profile(row),
      xp: row.xp,
      tierId: row.tierId,
      position: row.position,
    }
  }
  private static profile(
    row: DrizzleRankingUser,
  ): Pick<RankingUserDto, 'name' | 'slug' | 'avatar'> {
    return {
      name: row.user?.name ?? '',
      slug: row.user?.slug ?? '',
      avatar: DrizzleRankerMapper.avatar(row),
    }
  }
  private static avatar(row: DrizzleRankingUser): RankingUserDto['avatar'] {
    return { name: row.user?.avatar?.name ?? '', image: row.user?.avatar?.image ?? '' }
  }
}
