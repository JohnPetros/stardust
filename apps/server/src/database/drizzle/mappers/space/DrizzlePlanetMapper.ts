import { Planet } from '@stardust/core/space/entities'
import type { DrizzlePlanet, DrizzleInsertPlanet } from '../../types/entities/space'
import { DrizzleStarMapper } from './DrizzleStarMapper'

export class DrizzlePlanetMapper {
  static toEntity(row: DrizzlePlanet): Planet {
    return Planet.create({
      ...DrizzlePlanetMapper.catalog(row),
      ...DrizzlePlanetMapper.progress(row),
    })
  }
  static toPersistence(planet: Planet): DrizzleInsertPlanet {
    return {
      id: planet.id.value,
      ...DrizzlePlanetMapper.persistenceCatalog(planet),
      position: planet.position.value,
      isAvailable: planet.isAvailable.value,
    }
  }
  private static catalog(
    row: DrizzlePlanet,
  ): Pick<DrizzlePlanet, 'id' | 'name' | 'image' | 'icon' | 'position' | 'isAvailable'> {
    const { id, name, image, icon, position, isAvailable } = row
    return { id, name, image, icon, position, isAvailable }
  }
  private static progress(
    row: DrizzlePlanet,
  ): Pick<Planet['dto'], 'completionCount' | 'userCount' | 'stars'> {
    return {
      completionCount: row.completionCount,
      userCount: row.userCount,
      stars: row.stars.map((star) => DrizzleStarMapper.toEntity(star).dto),
    }
  }
  private static persistenceCatalog(
    planet: Planet,
  ): Pick<DrizzleInsertPlanet, 'name' | 'image' | 'icon'> {
    const { name, image, icon } = planet.dto
    return { name, image, icon }
  }
}
