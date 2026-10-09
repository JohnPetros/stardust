import { Tier } from '@stardust/core/ranking/entities'
import type { DrizzleTier, DrizzleInsertTier } from '../../types/entities/ranking'

export class DrizzleTierMapper {
  static toEntity(row: DrizzleTier): Tier {
    return Tier.create({
      id: row.id,
      ...DrizzleTierMapper.catalog(row),
      position: row.position,
      reward: row.reward,
    })
  }
  static toPersistence(tier: Tier): DrizzleInsertTier {
    return tier.dto
  }
  private static catalog(row: DrizzleTier): Pick<DrizzleTier, 'name' | 'image'> {
    const { name, image } = row
    return { name, image }
  }
}
