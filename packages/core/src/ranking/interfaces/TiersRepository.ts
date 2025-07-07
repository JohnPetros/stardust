import type { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { Id } from '#global/domain/structures/Id'
import type { Tier } from '../domain/entities'

export interface TiersRepository {
  findAll(): Promise<Tier[]>
  findById(id: Id): Promise<Tier | null>
  findByPosition(position: OrdinalNumber): Promise<Tier | null>
}
