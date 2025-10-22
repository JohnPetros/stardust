import type { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { Id } from '../../main'
import type { Planet } from '../domain/entities'

export interface PlanetsRepository {
  add(planet: Planet): Promise<void>
  findAll(): Promise<Planet[]>
  findById(id: Id): Promise<Planet | null>
  findByPosition(position: OrdinalNumber): Promise<Planet | null>
  findByStar(starId: Id): Promise<Planet | null>
  findLastPlanet(): Promise<Planet | null>
  replace(planet: Planet): Promise<void>
  replaceMany(planets: Planet[]): Promise<void>
  remove(planetId: Id): Promise<void>
}
