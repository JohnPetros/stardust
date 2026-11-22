import { Star } from '@stardust/core/space/entities'
import type { Id } from '@stardust/core/global/structures'
import type { DrizzleStar, DrizzleInsertStar } from '../../types/entities/space'

export class DrizzleStarMapper {
  constructor(private readonly planetId: Id) {}
  static toEntity(row: DrizzleStar): Star {
    return Star.create({
      ...DrizzleStarMapper.identity(row),
      ...DrizzleStarMapper.activity(row),
    })
  }
  toPersistence(star: Star): DrizzleInsertStar {
    return {
      planetId: this.planetId.value,
      ...DrizzleStarMapper.persistenceIdentity(star),
      isAvailable: star.isAvailable.value,
      isChallenge: star.isChallenge.value,
    }
  }
  private static identity(
    row: DrizzleStar,
  ): Pick<DrizzleStar, 'id' | 'name' | 'number' | 'slug' | 'description'> {
    const { id, name, number, slug, description } = row
    return { id, name, number, slug, description }
  }
  private static activity(
    row: DrizzleStar,
  ): Pick<DrizzleStar, 'isAvailable' | 'isChallenge' | 'userCount' | 'unlockCount'> {
    const { isAvailable, isChallenge, userCount, unlockCount } = row
    return { isAvailable, isChallenge, userCount, unlockCount }
  }
  private static persistenceIdentity(
    star: Star,
  ): Pick<DrizzleInsertStar, 'id' | 'name' | 'number' | 'slug' | 'description'> {
    const { id, name, number, slug, description } = star.dto
    return { id, name, number, slug, description }
  }
}
