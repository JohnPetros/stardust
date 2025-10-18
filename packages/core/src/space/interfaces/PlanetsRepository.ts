import type { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { Id } from '../../main'
import type { Planet } from '../domain/entities'

export interface PlanetsRepository {
  findById(id: Id): Promise<Planet | null>
  findAll(): Promise<Planet[]>
  findByPosition(position: OrdinalNumber): Promise<Planet | null>
  findByStar(starId: Id): Promise<Planet | null>
}
