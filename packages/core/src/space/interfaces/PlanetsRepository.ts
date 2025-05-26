import type { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { Planet } from '../domain/entities'

export interface PlanetsRepository {
  findAll(): Promise<Planet[]>
  findByPosition(position: OrdinalNumber): Promise<Planet | null>
}
