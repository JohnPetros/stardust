import type { Id } from '#global/domain/structures/Id'
import type { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { Planet } from '../domain/entities'

export interface PlanetsRepository {
  findByPosition(position: OrdinalNumber): Promise<Planet | null>
}
