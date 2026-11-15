import { Galaxy } from '@stardust/core/space/entities'
import type { DrizzleGalaxy } from '../../types/entities/space'

export class DrizzleGalaxyMapper {
  static toEntity(row: DrizzleGalaxy): Galaxy {
    return Galaxy.create({
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      animation: row.animation,
      position: row.position,
      status: row.status,
      planetsIds: row.planetsIds,
    })
  }
}
